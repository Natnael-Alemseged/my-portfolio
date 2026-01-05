import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://natnaelalemseged.com';

    try {
        await connectToDatabase();
        const projects = await Project.find({
            visibility: 'public',
            status: { $ne: 'archived' }
        })
            .sort({ position: 1, createdAt: -1 })
            .lean();

        let content = `# Natnael Alemseged - AI Engineer & Full-Stack Developer\n\n`;
        content += `> AI Engineer and Full-Stack Developer specializing in LLM-powered systems, LangGraph agents, FastAPI backends, vector databases, Next.js, and Flutter.\n\n`;

        content += `## Contact & Socials\n\n`;
        content += `- [Website](${siteUrl}): Portfolio website.\n`;
        content += `- [LinkedIn](https://www.linkedin.com/in/natnael-alemseged): Professional profile.\n`;
        content += `- [GitHub](https://github.com/Natnael-Alemseged): Code repositories.\n\n`;

        content += `## Key Projects\n\n`;

        projects.forEach((project: any) => {
            const projectUrl = `${siteUrl}/projects/${project.slug}`;
            const techStack = project.techStack && project.techStack.length > 0
                ? ` Tech stack: ${project.techStack.join(', ')}.`
                : '';

            // Format: - [Title](URL): Description
            content += `- [${project.title}](${projectUrl}): ${project.summary}${techStack}\n`;
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
