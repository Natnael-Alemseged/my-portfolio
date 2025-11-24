import ProjectForm from '@/components/admin/ProjectForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import DeleteProjectButton from '@/components/admin/DeleteProjectButton';

async function getProject(id: string) {
    await connectToDatabase();
    const project = await Project.findById(id).lean();
    if (!project) return null;
    return JSON.parse(JSON.stringify(project));
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== process.env.ADMIN_PASSWORD) {
        redirect('/admin/login');
    }

    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        return <div className="text-white text-center mt-20">Project not found</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-2xl mx-auto flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#00ff99]">Edit Project</h1>
                <DeleteProjectButton id={id} />
            </div>
            <ProjectForm initialData={project} isEdit={true} />
        </div>
    );
}
