import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://natnaelalemseged.com';

    try {
        await connectToDatabase();
        const projects = await Project.find({ visibility: 'public' })
            .sort({ position: 1, createdAt: -1 })
            .lean();

        let content = `# Natnael Alemseged - AI Engineer & Full-Stack Developer\n\n`;
        content += `> AI Engineer and Full-Stack Developer specializing in LLM-powered systems, LangGraph agents, FastAPI backends, vector databases, Next.js, and Flutter.\n\n`;

        content += `## Contact & Socials\n`;
        content += `- Website: ${siteUrl}\n`;
        content += `- LinkedIn: https://www.linkedin.com/in/natnael-alemseged\n`;
        content += `- GitHub: https://github.com/Natnael-Alemseged\n\n`;

        content += `## Key Projects\n\n`;

        projects.forEach((project: any) => {
            content += `### ${project.title}\n`;
            content += `${project.summary}\n`;
            content += `- URL: ${siteUrl}/projects/${project.slug}\n`;
            if (project.techStack && project.techStack.length > 0) {
                content += `- Tech Stack: ${project.techStack.join(', ')}\n`;
            }
            content += `\n`;
        });

        return new NextResponse(content, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });
    } catch (error) {
        console.error('Failed to generate llms.txt:', error);
        return new NextResponse('Error generating llms.txt', { status: 500 });
    }
}
