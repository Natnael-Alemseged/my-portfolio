import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';

export async function GET(request: Request) {
    await connectToDatabase();
    const projects = await Project.find({});
    return new Response(JSON.stringify(projects), { status: 200 });
}
