import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
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
        if (project.supermemoryId) {
            try {
                await supermemory.memories.delete(project.supermemoryId);
            } catch (e) {
                console.error('Failed to delete old memory:', e);
            }
        }

        try {
            const addedMemory = await supermemory.memories.add({
                content: `Project: ${project.title}\nDescription: ${project.description}\nTech Stack: ${project.techStack.join(', ')}\nLinks: ${JSON.stringify(project.links)}`,
                containerTag: 'natnael-portfolio-chatbot',
                metadata: {
                    type: 'project',
                    projectId: project._id.toString(),
                },
            });
            if (addedMemory && addedMemory.id) {
                project.supermemoryId = addedMemory.id;
                await project.save();
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
        if (project.supermemoryId) {
            try {
                await supermemory.memories.delete(project.supermemoryId);
            } catch (e) {
                console.error('Failed to delete memory:', e);
            }
        }

        return NextResponse.json({ message: 'Project deleted' });
    } catch {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
