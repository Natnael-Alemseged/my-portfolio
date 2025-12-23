import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import AdminProjectList from '@/components/AdminProjectList';

async function getProjects() {
    await connectToDatabase();

    // Get all projects
    const projects = await Project.find({}).sort({ position: 1, createdAt: -1 }).lean();

    // Check if any projects are missing position field
    const needsPositionUpdate = projects.some(p => p.position === undefined || p.position === null);

    if (needsPositionUpdate) {
        console.log('Initializing missing position fields...');
        // Update projects without position field
        const updatePromises = projects.map((project, index) => {
            if (project.position === undefined || project.position === null) {
                return Project.findByIdAndUpdate(
                    project._id,
                    { position: index },
                    { new: true }
                );
            }
            return null;
        }).filter(Boolean);

        await Promise.all(updatePromises);

        // Refetch with updated positions
        const updatedProjects = await Project.find({}).sort({ position: 1, createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(updatedProjects));
    }

    return JSON.parse(JSON.stringify(projects));
}

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== process.env.ADMIN_PASSWORD) {
        redirect('/admin/login');
    }

    const projects = await getProjects();

    return <AdminProjectList initialProjects={projects} />;
}
