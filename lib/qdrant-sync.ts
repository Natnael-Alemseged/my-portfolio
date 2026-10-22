import { QdrantClient } from '@qdrant/js-client-rest';
import Project from '@/lib/db/project.model';
import ProjectIntegration from '@/lib/db/project-integration.model';

export interface MemoryResult {
    content: string;
    title: string;
    slug: string;
    score: number;
    chunkType: string;
    sourceType: string;
}

// Lazy initialization of Qdrant client
let client: QdrantClient | null = null;
let collectionReady = false;

function getQdrantClient() {
    if (client) return client;

    const QDRANT_URL = process.env.QDRANT_URL;
    const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

    if (!QDRANT_URL || !QDRANT_API_KEY) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Missing Qdrant credentials in environment variables');
        } else {
            console.warn('⚠️ Qdrant credentials missing in environment variables');
        }
    }

    client = new QdrantClient({
        url: QDRANT_URL || '',
        apiKey: QDRANT_API_KEY || '',
        checkCompatibility: false,
    });

    return client;
}

// gemini-embedding-001 @ 1024 dims (v2 was bge-large-en-v1.5 via Hugging Face, v1 bge-small @ 384)
export const COLLECTION_NAME = "chat_memories_v3";
const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIMENSIONS = 1024;
// Calibrated on scripts/rag-eval-set.json: gemini-embedding-001 scores unrelated
// chunks around 0.58 and relevant ones around 0.70, so an absolute cutoff alone
// is too coarse. Keep chunks above the floor and close to the best match.
const MIN_RELEVANCE_SCORE = 0.6;
const MAX_SCORE_GAP = 0.08;

/**
 * Converts a 24-char MongoDB ObjectId hex string into a valid 36-char UUID string.
 */
function mongoIdToUuid(mongoId: string): string {
    const hex = mongoId.padEnd(32, '0');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Generates an embedding using Gemini's embedding API (free tier).
 * Gemini optimizes documents and queries separately, so indexing must pass
 * RETRIEVAL_DOCUMENT and search must pass RETRIEVAL_QUERY.
 */
export async function generateEmbedding(
    text: string,
    taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' = 'RETRIEVAL_QUERY'
) {
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent`;
    // Indexing can afford to wait out a free-tier rate limit; a chat request
    // should fail fast and use the keyword fallback instead.
    const maxAttempts = taskType === 'RETRIEVAL_DOCUMENT' ? 4 : 1;

    try {
        if (!apiKey) throw new Error('Missing GEMINI_API_KEY');

        for (let attempt = 1; ; attempt++) {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey,
                },
                body: JSON.stringify({
                    content: { parts: [{ text }] },
                    taskType,
                    outputDimensionality: EMBEDDING_DIMENSIONS,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                return result.embedding.values as number[];
            }

            const errorText = await response.text();
            const retryable = response.status === 429 || response.status >= 500;
            if (!retryable || attempt >= maxAttempts) {
                throw new Error(`Gemini embedding API error ${response.status}: ${errorText.slice(0, 300)}`);
            }
            console.warn(`⏳ Gemini embedding returned ${response.status}, retrying in ${attempt * 5}s... (attempt ${attempt}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, attempt * 5000));
        }
    } catch (error) {
        console.error("❌ Cloud embedding failed:", error);
        throw error;
    }
}

const CONTAINER_TAG = 'natnael-portfolio-chatbot';

/**
 * Formats a single project into a rich, well-structured memory chunk
 */
function formatProjectMemory(project: any) {
    const parts = [
        `Project Title: ${project.title}`,
        `Slug: ${project.slug}`,
        `Summary: ${project.summary}`,
        project.role && `Role: ${project.role}`,
        project.problem && `Problem: ${project.problem}`,
        project.solution && `Solution: ${project.solution}`,
        project.keyTakeaway && `Key Takeaway: ${project.keyTakeaway}`,
        project.architecture && `Architecture: ${project.architecture}`,
        project.features?.length && `Features:\n- ${project.features.join('\n- ')}`,
        project.techStack?.length && `Tech Stack: ${project.techStack.join(', ')}`,
        project.tags?.length && `Tags: ${project.tags.join(', ')}`,
        project.metrics && `Metrics:
  Duration: ${project.metrics.duration || 'N/A'}
  Team Size: ${project.metrics.teamSize || 'N/A'}
  Impact: ${project.metrics.impact || 'N/A'}`,
        project.status && `Status: ${project.status}`,
        `Visibility: ${project.visibility}`,
        `Schema Type: ${project.schemaType || 'SoftwareApplication'}`,
        `Created: ${project.createdAt?.toISOString().split('T')[0]}`,
        project.publishedAt && `Published: ${project.publishedAt?.toISOString().split('T')[0]}`,
        project.links?.length && `Links:\n${project.links.map((l: any) => `- ${l.type || 'Link'}: ${l.url} (${l.label || 'View'})`).join('\n')}`,
        project.content && `Detailed Description:\n${project.content}`,
    ].filter(Boolean);

    return parts.join('\n\n');
}

/**
 * Ensures the Qdrant collection exists and is configured correctly
 */
export async function initQdrant() {
    const client = getQdrantClient();
    const collections = await client.getCollections();
    const exists = collections.collections.some((c: any) => c.name === COLLECTION_NAME);

    if (!exists) {
        await client.createCollection(COLLECTION_NAME, {
            vectors: {
                size: EMBEDDING_DIMENSIONS,
                distance: 'Cosine',
            },
        });
    }

    try {
        await client.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'user_id',
            field_schema: 'keyword',
        });
    } catch (e) { }

    try {
        await client.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'containerTag',
            field_schema: 'keyword',
        });
    } catch (e) { }

    collectionReady = true;
}

/**
 * Sync (or update) a single project memory to Qdrant
 */
export async function syncProjectToQdrant(project: any) {
    if (project.visibility === 'private' || project.status === 'archived') {
        await deleteProjectFromQdrant(project._id.toString());
        return;
    }

    try {
        if (!collectionReady) await initQdrant();
        const client = getQdrantClient();
        const content = formatProjectMemory(project);
        const user_id = 'natnael_owner';
        const pointId = mongoIdToUuid(project._id.toString());
        const embedding = await generateEmbedding(content, 'RETRIEVAL_DOCUMENT');

        await client.upsert(COLLECTION_NAME, {
            wait: true,
            points: [
                {
                    id: pointId,
                    vector: embedding,
                    payload: {
                        user_id,
                        content,
                        title: project.title,
                        sourceType: 'project',
                        projectId: project._id.toString(),
                        slug: project.slug,
                        visibility: project.visibility,
                        containerTag: CONTAINER_TAG,
                        timestamp: new Date().toISOString(),
                    },
                },
            ],
        });

        await ProjectIntegration.findOneAndUpdate(
            { projectId: project._id, service: 'qdrant' },
            {
                projectId: project._id,
                service: 'qdrant',
                externalId: pointId,
                syncedAt: new Date(),
            },
            { upsert: true }
        );

        console.log(`✅ Synced project "${project.title}" to Qdrant`);
    } catch (error) {
        console.error(`❌ Failed to sync project ${project._id} to Qdrant:`, error);
    }
}

/**
 * Delete a project memory from Qdrant
 */
export async function deleteProjectFromQdrant(projectId: string) {
    try {
        const pointId = mongoIdToUuid(projectId);
        const client = getQdrantClient();
        await client.delete(COLLECTION_NAME, {
            points: [pointId],
        });
        await ProjectIntegration.deleteOne({ projectId, service: 'qdrant' });
        console.log(`🗑️ Deleted Qdrant entry for project ${projectId}`);
    } catch (error) {
        console.error(`❌ Failed to delete Qdrant entry for project ${projectId}:`, error);
    }
}

function toMemoryResult(point: { payload?: Record<string, unknown> | null }, score: number): MemoryResult {
    return {
        content: point.payload?.content as string,
        title: (point.payload?.title ?? point.payload?.slug ?? 'Unknown') as string,
        slug: (point.payload?.slug ?? '') as string,
        score,
        chunkType: (point.payload?.chunkType ?? 'overview') as string,
        sourceType: (point.payload?.sourceType ?? 'project') as string,
    };
}

/**
 * Cap profile chunks at 2 so project-specific chunks are not crowded out.
 * Profile chunks score broadly high against most queries; without this cap they
 * can fill all slots even when concrete project data is available.
 * Then slice to `limit` so the LLM context stays bounded.
 */
function capProfileChunks(results: MemoryResult[], limit: number) {
    let profileCount = 0;
    return results
        .filter(r => {
            if (r.sourceType === 'profile') {
                if (profileCount >= 2) return false;
                profileCount++;
            }
            return true;
        })
        .slice(0, limit);
}

// Keyword fallback used when the embedding provider is unavailable (outage,
// exhausted credits). The collection is small, so all chunks are held in memory.
const LEXICAL_CORPUS_TTL_MS = 5 * 60 * 1000;
let lexicalCorpus: { docs: MemoryResult[]; loadedAt: number } | null = null;

const STOPWORDS = new Set([
    'a', 'an', 'and', 'are', 'about', 'any', 'can', 'did', 'do', 'does', 'for', 'from',
    'has', 'have', 'he', 'his', 'how', 'in', 'is', 'it', 'me', 'of', 'on', 'or', 'tell',
    'that', 'the', 'this', 'to', 'was', 'what', 'which', 'who', 'with', 'you', 'your',
    'natnael', 'alemseged', 'context',
    // Question verbs that appear in most chunks and would outrank the specific term.
    'use', 'used', 'uses', 'using', 'work', 'worked', 'working', 'build', 'built',
    'building', 'make', 'made', 'know', 'knows', 'ever', 'some', 'there',
]);

const PROFILE_INTENTS: [RegExp, string][] = [
    [/\b(work(ed|ing)?|job|jobs|employ\w*|compan(y|ies)|career|experience|roles? (at|before))\b/i, 'experience'],
    [/\b(skills?|stack|technolog\w*|languages?|frameworks?|expertise)\b/i, 'skills'],
    [/\b(contact|reach|email|e-mail|phone|linkedin|github)\b/i, 'contact'],
    [/\b(availab\w*|hire|hiring|open to|freelance|contract|rates?|services?|engagement)\b/i, 'availability'],
    [/\b(testimonials?|reviews?|recommendations?|clients? say)\b/i, 'testimonials'],
];

function tokenize(text: string) {
    return text
        .toLowerCase()
        .split(/[^a-z0-9+#]+/)
        .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

async function loadLexicalCorpus() {
    if (lexicalCorpus && Date.now() - lexicalCorpus.loadedAt < LEXICAL_CORPUS_TTL_MS) {
        return lexicalCorpus.docs;
    }

    const client = getQdrantClient();
    const docs: MemoryResult[] = [];
    let offset: string | number | undefined;
    do {
        const page = await client.scroll(COLLECTION_NAME, {
            limit: 256,
            offset,
            with_payload: true,
            with_vector: false,
            filter: { must: [{ key: 'containerTag', match: { value: CONTAINER_TAG } }] },
        });
        docs.push(...page.points.filter(p => p.payload?.content).map(p => toMemoryResult(p, 0)));
        offset = page.next_page_offset as string | number | undefined;
    } while (offset != null);

    lexicalCorpus = { docs, loadedAt: Date.now() };
    return docs;
}

/**
 * BM25 ranking over title + content. Scores are normalized to 0..1.
 */
async function searchMemoriesLexically(query: string, limit: number): Promise<MemoryResult[]> {
    const docs = await loadLexicalCorpus();
    const queryTerms = [...new Set(tokenize(query))];

    // Titles are repeated so a project named in the query outranks passing mentions.
    const docTerms = docs.map(d => tokenize(`${d.title} ${d.title} ${d.content}`));
    const avgLength = docTerms.reduce((sum, terms) => sum + terms.length, 0) / Math.max(docTerms.length, 1);
    const k1 = 1.2;
    const b = 0.75;

    const idf = new Map(queryTerms.map(term => {
        const df = docTerms.filter(terms => terms.includes(term)).length;
        return [term, Math.log(1 + (docs.length - df + 0.5) / (df + 0.5))];
    }));

    const scored = docs.map((doc, i) => {
        const terms = docTerms[i];
        const score = queryTerms.reduce((sum, term) => {
            const tf = terms.filter(t => t === term).length;
            if (!tf) return sum;
            return sum + idf.get(term)! * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * terms.length / avgLength));
        }, 0);
        return { ...doc, score };
    });

    const maxScore = Math.max(0, ...scored.map(r => r.score));
    const keywordRanked = scored
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(r => ({ ...r, score: r.score / maxScore }));

    // Questions about the profile sections rarely share vocabulary with them
    // ("where did he work?" vs. "Work Experience"), so pin those chunks by intent.
    const pinnedTypes = new Set(
        PROFILE_INTENTS.filter(([pattern]) => pattern.test(query)).map(([, chunkType]) => chunkType)
    );
    const pinned = docs
        .filter(d => d.sourceType === 'profile' && pinnedTypes.has(d.chunkType))
        .map(d => ({ ...d, score: 1 }));
    const ranked = [
        ...pinned,
        ...keywordRanked.filter(r => !pinned.some(p => p.title === r.title)),
    ];

    // Generic questions ("who is he?", "where has he worked?") share no keywords
    // with any chunk; the profile chunks are the best answer source for those, and
    // with no project matches there is nothing for the profile cap to protect.
    const filtered = ranked.length > 0
        ? capProfileChunks(ranked, limit)
        : docs.filter(d => d.sourceType === 'profile').slice(0, limit);
    const truncatedQuery = query.length > 80 ? query.slice(0, 80) + '...' : query;
    console.log(
        `🔍 RAG retrieval (keyword fallback): query="${truncatedQuery}" candidates=${docs.length} filtered=${filtered.length}\n` +
        filtered.map(r => `   - "${r.title}" (score: ${r.score.toFixed(2)}, type: ${r.chunkType})`).join('\n')
    );
    return filtered;
}

/**
 * Search relevant memories in Qdrant
 */
export async function searchMemories(query: string, limit: number = 5): Promise<MemoryResult[]> {
    try {
        if (!collectionReady) {
            await initQdrant();
        }
        const client = getQdrantClient();

        let embedding: number[];
        try {
            embedding = await generateEmbedding(query);
        } catch {
            console.warn('⚠️ Embedding unavailable, falling back to keyword retrieval');
            return await searchMemoriesLexically(query, limit);
        }

        // Fetch a wider pool so profile chunks (which score broadly high) don't
        // crowd out project chunks before the diversity cap is applied.
        const fetchLimit = Math.max(limit * 3, 20);

        const searchStart = Date.now();
        const results = await client.search(COLLECTION_NAME, {
            vector: embedding,
            limit: fetchLimit,
            filter: {
                must: [
                    {
                        key: 'containerTag',
                        match: {
                            value: CONTAINER_TAG,
                        },
                    },
                ],
            },
        });
        const latency = Date.now() - searchStart;

        const mapped: MemoryResult[] = results
            .filter((r: any) => r.payload?.content)
            .map((r) => toMemoryResult(r, r.score));

        const topScore = mapped[0]?.score ?? 0;
        const scoreFiltered = mapped.filter(
            r => r.score >= MIN_RELEVANCE_SCORE && r.score >= topScore - MAX_SCORE_GAP
        );
        const filtered = capProfileChunks(scoreFiltered, limit);

        const truncatedQuery = query.length > 80 ? query.slice(0, 80) + '...' : query;
        console.log(
            `🔍 RAG retrieval: query="${truncatedQuery}" candidates=${mapped.length} filtered=${filtered.length} latency=${latency}ms\n` +
            filtered.map(r => `   - "${r.title}" (score: ${r.score.toFixed(2)}, type: ${r.chunkType})`).join('\n')
        );

        return filtered;

    } catch (error) {
        console.error('❌ Qdrant search error:', error);
        return [];
    }
}
