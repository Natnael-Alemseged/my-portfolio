import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import Supermemory from 'supermemory';

const supermemory = new Supermemory({
    apiKey: process.env.SUPERMEMORY_API_KEY,
});

export async function GET() {
    try {
        await connectToDatabase();
        const projects = await Project.find({}).sort({ createdAt: -1 });
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // Simple Admin Auth Check
        const adminPassword = req.headers.get('x-admin-password');
        if (adminPassword !== process.env.ADMIN_PASSWORD) {
            // Fallback to cookie check if header is missing (for browser usage)
            const cookie = req.cookies.get('admin_session');
            if (cookie?.value !== process.env.ADMIN_PASSWORD) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        await connectToDatabase();
        const body = await req.json();
        const project = await Project.create(body);

        // Add to Supermemory
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
        } catch (smError) {
            console.error('Failed to add to Supermemory:', smError);
            // Don't fail the request if Supermemory fails, just log it
        }

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
