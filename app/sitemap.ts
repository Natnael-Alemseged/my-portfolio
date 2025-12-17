import type { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://natnaelalemseged.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ];

    try {
        await connectToDatabase();
        const projects = await Project.find({ visibility: 'public' })
            .select('slug updatedAt createdAt')
            .lean();

        const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
            url: `${BASE_URL}/projects/${project.slug}`,
            lastModified: project.updatedAt || project.createdAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

        return [...staticRoutes, ...projectRoutes];
    } catch (error) {
        console.error('Failed to generate sitemap:', error);
        return staticRoutes;
    }
}
