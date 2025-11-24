import ProjectForm from '@/components/admin/ProjectForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AddProjectPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== process.env.ADMIN_PASSWORD) {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-bold text-[#00ff99] mb-8 text-center">Add New Project</h1>
            <ProjectForm />
        </div>
    );
}
