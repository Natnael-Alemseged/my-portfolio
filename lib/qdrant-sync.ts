import { QdrantClient } from '@qdrant/js-client-rest';
import { pipeline, env } from '@xenova/transformers';
import Project from '@/lib/db/project.model';
import ProjectIntegration from '@/lib/db/project-integration.model';

// Configure Xenova transformers
env.allowRemoteModels = true;
env.remoteHost = 'https://huggingface.co';
env.remotePathTemplate = '{model}/resolve/main/';
env.allowLocalModels = false;

const QDRANT_URL = process.env.QDRANT_URL || "https://243611bd-d88f-4f57-b555-961de2837783.eu-central-1-0.aws.cloud.qdrant.io:6333";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.WduVcd0VT32PEgrUQ75I-MsLfkShppEyKIxv77Pn-2g";
const COLLECTION_NAME = "chat_memories";

const client = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
});

/**
 * Converts a 24-char MongoDB ObjectId hex string into a valid 36-char UUID string.
 * This is required because Qdrant only accepts UUIDs or unsigned integers as point IDs.
 */
function mongoIdToUuid(mongoId: string): string {
    const hex = mongoId.padEnd(32, '0');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

let embedder: any = null;

async function getEmbedder() {
    if (!embedder) {
        console.log('Loading embedding model...');
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('Embedding model loaded successfully');
    }
    return embedder;
}

export async function generateEmbedding(text: string) {
    const generate = await getEmbedder();
    const output = await generate(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data) as number[];
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
    const collections = await client.getCollections();
    const exists = collections.collections.some((c: any) => c.name === COLLECTION_NAME);

    if (!exists) {
        await client.createCollection(COLLECTION_NAME, {
            vectors: {
                size: 384,
                distance: 'Cosine',
            },
        });
    }

    // Indices are idempotent in newer Qdrant or we can ignore errors
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
}

/**
 * Sync (or update) a single project memory to Qdrant
 */
export async function syncProjectToQdrant(project: any) {
    // Don't sync private projects
    if (project.visibility === 'private') {
        await deleteProjectFromQdrant(project._id.toString());
        return;
    }

    try {
        await initQdrant();
        const content = formatProjectMemory(project);
        const user_id = 'natnael_owner'; // Default for portfolio content

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
                        projectId: project._id.toString(),
                        slug: project.slug,
                        visibility: project.visibility,
                        containerTag: CONTAINER_TAG,
                        timestamp: new Date().toISOString(),
                    },
                },
            ],
        });

        // Update integration record
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
export async function searchMemories(query: string, limit: number = 5) {
    try {
        await initQdrant();
        const embedding = await generateEmbedding(query);

        const results = await client.search(COLLECTION_NAME, {
            vector: embedding,
            limit,
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

        return results.map((r: any) => r.payload?.content as string).filter(Boolean);
    } catch (error) {
        console.error('❌ Qdrant search error:', error);
        return [];
    }
}
