// app/api/projects/[id]/route.ts  (or wherever this file lives)

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import {
    syncProjectToQdrant,
    deleteProjectFromQdrant,
} from '@/lib/qdrant-sync';

// Helper for Admin Auth (shared across methods)
function isAdmin(req: NextRequest): boolean {
    const adminPassword = req.headers.get('x-admin-password');
    if (adminPassword === process.env.ADMIN_PASSWORD) return true;
    const cookie = req.cookies.get('admin_session');
    return cookie?.value === process.env.ADMIN_PASSWORD;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();

        const updatedProject = await Project.findByIdAndUpdate(id, body, { new: true });

        if (!updatedProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // === Sync to Qdrant ===
        await syncProjectToQdrant(updatedProject);

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        // === Clean removal from Qdrant ===
        await deleteProjectFromQdrant(id);

        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}