import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';

async function getProjects() {
    await connectToDatabase();
    // Plain object serialization for Client Components
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(projects));
}

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== process.env.ADMIN_PASSWORD) {
        redirect('/admin/login');
    }

    const projects = await getProjects();

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#00ff99]">Admin Dashboard</h1>
                    <Link href="/admin/add" className="bg-[#00ff99] text-black px-4 py-2 rounded font-bold hover:bg-[#00e68a]">
                        Add New Project
                    </Link>
                </div>

                <div className="grid gap-6">
                    {projects.map((project: { _id: string; title: string; summary?: string }) => (
                        <div key={project._id} className="bg-gray-900 p-6 rounded-lg flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">{project.title}</h2>
                                <p className="text-gray-400 text-sm">
                                    {(project.summary || '').substring(0, 100) || 'No summary yet'}...
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Link href={`/admin/edit/${project._id}`} className="text-blue-400 hover:text-blue-300">
                                    Edit
                                </Link>
                                {/* Delete button would need to be a client component or form action, keeping it simple for now */}
                                <Link href={`/admin/edit/${project._id}`} className="text-red-400 hover:text-red-300">
                                    Delete (in Edit)
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
