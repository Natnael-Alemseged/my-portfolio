import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import ProjectIntegration from '@/lib/db/project-integration.model';
import Supermemory from 'supermemory';

const supermemory = new Supermemory({
    apiKey: process.env.SUPERMEMORY_API_KEY,
});

// Helper for Admin Auth
function isAdmin(req: NextRequest) {
    const adminPassword = req.headers.get('x-admin-password');
    if (adminPassword === process.env.ADMIN_PASSWORD) return true;
    const cookie = req.cookies.get('admin_session');
    return cookie?.value === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();
        const project = await Project.findByIdAndUpdate(id, body, { new: true });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Update Supermemory (Delete old, Add new)
        const integration = await ProjectIntegration.findOne({ projectId: id, service: 'supermemory' });
        if (integration) {
            try {
                await supermemory.memories.delete(integration.externalId);
            } catch (e) {
                console.error('Failed to delete old memory:', e);
            }
        }

        try {
            const contentParts = [
                `Project: ${project.title}`,
                `Summary: ${project.summary}`,
                project.role ? `Role: ${project.role}` : '',
                project.keyTakeaway ? `Key Takeaway: ${project.keyTakeaway}` : '',
                project.problem ? `Problem: ${project.problem}` : '',
                project.solution ? `Solution: ${project.solution}` : '',
                project.architecture ? `Architecture: ${project.architecture}` : '',
                project.features?.length ? `Features: ${project.features.join(', ')}` : '',
                `Tech Stack: ${project.techStack?.join(', ') || 'N/A'}`,
                project.tags?.length ? `Tags: ${project.tags.join(', ')}` : '',
                `Type: ${project.schemaType || 'SoftwareApplication'}`,
                `Links: ${JSON.stringify(project.links)}`,
            ].filter(Boolean);

            const addedMemory = await supermemory.memories.add({
                content: contentParts.join('\n'),
                containerTag: 'natnael-portfolio-chatbot',
                metadata: {
                    type: 'project',
                    projectId: project._id.toString(),
                    slug: project.slug,
                },
            });
            if (addedMemory && addedMemory.id) {
                // Update or create integration
                await ProjectIntegration.findOneAndUpdate(
                    { projectId: id, service: 'supermemory' },
                    { externalId: addedMemory.id, syncedAt: new Date() },
                    { upsert: true }
                );
            }
        } catch (e) {
            console.error('Failed to add new memory:', e);
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const { id } = await params;
        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Remove from Supermemory
        const integration = await ProjectIntegration.findOne({ projectId: id, service: 'supermemory' });
        if (integration) {
            try {
                await supermemory.memories.delete(integration.externalId);
                await ProjectIntegration.deleteOne({ _id: integration._id });
            } catch (e) {
                console.error('Failed to delete memory:', e);
            }
        }

        return NextResponse.json({ message: 'Project deleted' });
    } catch {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
