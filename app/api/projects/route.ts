// app/api/projects/route.ts (or wherever your file is)

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import {
    syncProjectToQdrant,
} from '@/lib/qdrant-sync';

export async function GET(req: NextRequest) {
    // Your existing GET logic is fine — keep it as-is
    try {
        await connectToDatabase();

        const adminPassword = req.headers.get('x-admin-password');
        const cookie = req.cookies.get('admin_session');
        const isAdmin =
            adminPassword === process.env.ADMIN_PASSWORD ||
            cookie?.value === process.env.ADMIN_PASSWORD;

        const query = isAdmin ? {} : { visibility: { $in: ['public', 'unlisted'] } };
        const projects = await Project.find(query).sort({ createdAt: -1 });

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // === Admin Authentication ===
        const adminPassword = req.headers.get('x-admin-password');
        const cookie = req.cookies.get('admin_session');
        const isAuthenticated =
            adminPassword === process.env.ADMIN_PASSWORD ||
            cookie?.value === process.env.ADMIN_PASSWORD;

        if (!isAuthenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const body = await req.json();

        // === Create the project ===
        const project = await Project.create(body);

        // === Sync to Qdrant ===
        await syncProjectToQdrant(project);

        // === Return the created project ===
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}