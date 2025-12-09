import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import ProjectIntegration from '@/lib/db/project-integration.model';
import Supermemory from 'supermemory';

const supermemory = new Supermemory({
    apiKey: process.env.SUPERMEMORY_API_KEY,
});

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        
        // Check if admin (show all projects including private)
        const adminPassword = req.headers.get('x-admin-password');
        const cookie = req.cookies.get('admin_session');
        const isAdmin = adminPassword === process.env.ADMIN_PASSWORD || cookie?.value === process.env.ADMIN_PASSWORD;
        
        // Filter by visibility for non-admin users
        const query = isAdmin ? {} : { visibility: { $in: ['public', 'unlisted'] } };
        const projects = await Project.find(query).sort({ createdAt: -1 });

        console.log(`projects are: ${JSON.stringify(projects,null,2)}`);


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
        console.log(`project body is:${JSON.stringify(req.body,null,2)}`);

        await connectToDatabase();
        const body = await req.json();
        const project = await Project.create(body);

        // Add to Supermemory
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
                // Store integration in separate collection
                await ProjectIntegration.create({
                    projectId: project._id,
                    service: 'supermemory',
                    externalId: addedMemory.id,
                    syncedAt: new Date(),
                });
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
