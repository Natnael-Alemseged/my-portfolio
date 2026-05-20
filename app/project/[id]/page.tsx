import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import { notFound, redirect } from 'next/navigation';

async function getProjectSlug(id: string): Promise<string | null> {
    try {
        await connectToDatabase();
        // Query only the slug to minimize database latency
        const project = await Project.findOne({
            _id: id,
            visibility: 'public',
            status: { $ne: 'archived' }
        })
            .select('slug')
            .lean() as { slug: string } | null;
        return project ? project.slug : null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const slug = await getProjectSlug(id);
    if (!slug) return { title: 'Project Not Found' };
    
    return {
        title: 'Redirecting...',
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const slug = await getProjectSlug(id);

    if (!slug) {
        notFound();
    }

    redirect(`/projects/${slug}`);
}
