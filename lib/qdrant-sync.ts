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

const COLLECTION_NAME = "chat_memories_v2"; // bge-large-en-v1.5 @ 1024 dims (upgraded from v1 bge-small @ 384)

/**
 * Converts a 24-char MongoDB ObjectId hex string into a valid 36-char UUID string.
 */
function mongoIdToUuid(mongoId: string): string {
    const hex = mongoId.padEnd(32, '0');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Generates an embedding using Hugging Face's free Inference API.
 * This avoids the libonnxruntime issue in serverless environments (Vercel).
 */
export async function generateEmbedding(text: string) {
    const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
    const modelId = "BAAI/bge-large-en-v1.5";
    const apiUrl = `https://router.huggingface.co/hf-inference/models/${modelId}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                ...(HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {}),
            },
            method: "POST",
            body: JSON.stringify({
                inputs: text
            }),
        });

        // First check if response is ok before trying to parse JSON
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = errorText;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || JSON.stringify(errorJson);
            } catch (e) {
                // Not JSON
            }

            if (errorMessage.includes("currently loading")) {
                const maxRetries = 3;
                const backoffDelays = [5000, 10000, 20000];
                for (let attempt = 0; attempt < maxRetries; attempt++) {
                    console.warn(`⏳ Hugging Face model is loading, retrying in ${backoffDelays[attempt] / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, backoffDelays[attempt]));
                    const retryResponse = await fetch(apiUrl, {
                        headers: {
                            "Content-Type": "application/json",
                            ...(HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {}),
                        },
                        method: "POST",
                        body: JSON.stringify({ inputs: text }),
                    });
                    if (retryResponse.ok) {
                        const retryResult = await retryResponse.json();
                        return (Array.isArray(retryResult[0]) ? retryResult[0] : retryResult) as number[];
                    }
                    const retryErrorText = await retryResponse.text();
                    let retryErrorMessage = retryErrorText;
                    try {
                        const retryErrorJson = JSON.parse(retryErrorText);
                        retryErrorMessage = retryErrorJson.error || JSON.stringify(retryErrorJson);
                    } catch (e) { }
                    if (!retryErrorMessage.includes("currently loading")) {
                        throw new Error(`Hugging Face API Error: ${retryErrorMessage}`);
                    }
                }
                throw new Error(`Hugging Face model still loading after ${maxRetries} retries`);
            }
            throw new Error(`Hugging Face API Error: ${errorMessage}`);
        }

        const result = await response.json();

        // Pipeline format usually returns number[] directly or [number[]]
        return (Array.isArray(result[0]) ? result[0] : result) as number[];
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
                size: 1024, // bge-large-en-v1.5
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
        const embedding = await generateEmbedding(content);

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

/**
 * Search relevant memories in Qdrant
 */
export async function searchMemories(query: string, limit: number = 5): Promise<MemoryResult[]> {
    try {
        if (!collectionReady) {
            await initQdrant();
        }
        const client = getQdrantClient();
        const embedding = await generateEmbedding(query);

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
            .map((r: any) => ({
                content: r.payload?.content as string,
                title: r.payload?.title ?? r.payload?.slug ?? 'Unknown',
                slug: r.payload?.slug ?? '',
                score: r.score,
                chunkType: r.payload?.chunkType ?? 'overview',
                sourceType: r.payload?.sourceType ?? 'project',
            }));

        const scoreFiltered = mapped.filter(r => r.score >= 0.55);

        // Cap profile chunks at 2 so project-specific chunks are not crowded out.
        // Profile chunks score broadly high against most queries; without this cap they
        // can fill all 5 slots even when concrete project data is available.
        // Then slice to `limit` so the LLM context stays bounded.
        let profileCount = 0;
        const filtered = scoreFiltered
            .filter(r => {
                if (r.sourceType === 'profile') {
                    if (profileCount >= 2) return false;
                    profileCount++;
                }
                return true;
            })
            .slice(0, limit);

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
