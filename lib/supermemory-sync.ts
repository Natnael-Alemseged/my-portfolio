// lib/supermemory-sync.ts
import Supermemory from 'supermemory';
import Project from '@/lib/db/project.model';
import ProjectIntegration from '@/lib/db/project-integration.model';

const supermemory = new Supermemory({
    // apiKey: process.env.SUPERMEMORY_API_KEY!,
    apiKey: "sm_NaPQdUhPrSbRguzdhAYU1H_tKfNQQHXJkRxeFlZDSNGXrsxztutwYWJNRQhcvyqhSDBXlgHGmklGBXpuLGlqFKJ",
});

const CONTAINER_TAG = 'natnael-portfolio-chatbot';
const INDEX_CUSTOM_ID = 'projects_index'; // Fixed ID so it always upserts the same memory

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
 * Formats the master index of all public/unlisted projects
 */
function formatProjectIndex(projects: any[]) {
    const today = new Date().toISOString().split('T')[0];

    const visibleProjects = projects
        .filter(p => p.visibility === 'public' || p.visibility === 'unlisted')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const listItems = visibleProjects
        .map(p => `- ${p.title} (slug: ${p.slug}) — ${p.summary || 'No summary'}`)
        .join('\n');

    const featured = visibleProjects.filter(p => p.featured);

    return `
Natnael's Complete Project List (as of ${today}):

${listItems || 'No public projects available yet.'}

Total visible projects: ${visibleProjects.length}
${featured.length ? `Featured projects: ${featured.map(p => p.title).join(', ')}` : ''}
    `.trim();
}

/**
 * Main function: Sync the projects index memory
 * Call this after any create / update / delete of a project
 */
export async function syncAllProjectsIndex() {
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 });
        const content = formatProjectIndex(projects);

        await supermemory.memories.add({
            content,
            customId: INDEX_CUSTOM_ID,
            containerTag: CONTAINER_TAG,
            metadata: {
                type: 'project_index',
                updatedAt: new Date().toISOString(),
                totalProjects: projects.length,
            },
        });

        console.log('✅ Projects index memory successfully updated');
    } catch (error) {
        console.error('❌ Failed to update projects index in Supermemory:', error);
    }
}

/**
 * Sync (or update) a single project memory
 * Also handles skipping/deleting private projects
 */
export async function syncProjectToSupermemory(project: any) {
    // Don't sync private projects
    if (project.visibility === 'private') {
        await deleteProjectFromSupermemory(project._id.toString());
        return;
    }

    const content = formatProjectMemory(project);
    const customId = `project_${project._id.toString()}`;

    try {
        const added = await supermemory.memories.add({
            content,
            customId,
            // containerTag: CONTAINER_TAG,
            containerTags: [CONTAINER_TAG],
            metadata: {
                type: 'project',
                projectId: project._id.toString(),
                slug: project.slug,
                visibility: project.visibility,
            },
        });

        // Upsert the integration record
        await ProjectIntegration.findOneAndUpdate(
            { projectId: project._id, service: 'supermemory' },
            {
                projectId: project._id,
                service: 'supermemory',
                externalId: added.id,
                syncedAt: new Date(),
            },
            { upsert: true }
        );

        console.log(`✅ Synced project "${project.title}" to Supermemory`);
    } catch (error) {
        console.error(`❌ Failed to sync project ${project._id} to Supermemory:`, error);
    }
}

/**
 * Delete a project memory from Supermemory (used on delete or when turning private)
 */
export async function deleteProjectFromSupermemory(projectId: string) {
    const integration = await ProjectIntegration.findOne({
        projectId: projectId,
        service: 'supermemory',
    });

    if (integration?.externalId) {
        try {
            await supermemory.memories.delete(integration.externalId);
            await ProjectIntegration.deleteOne({ _id: integration._id });
            console.log(`🗑️ Deleted Supermemory entry for project ${projectId}`);
        } catch (error) {
            console.error(`❌ Failed to delete Supermemory entry for project ${projectId}:`, error);
        }
    }
}