import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import { PROFILE_DESCRIPTION, PROFILE_ROLE } from '@/lib/brand';

interface ProjectSummary {
    slug: string;
    title: string;
    summary: string;
    keyTakeaway?: string;
    tags?: string[];
    techStack?: string[];
    schemaType?: string;
}

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://natnaelalemseged.com';

    try {
        await connectToDatabase();
        const projects = await Project.find({
            visibility: 'public',
            status: { $ne: 'archived' }
        })
            .sort({ position: 1, createdAt: -1 })
            .lean<ProjectSummary[]>();

        let content = `# Natnael Alemseged - ${PROFILE_ROLE}\n\n`;
        content += `> ${PROFILE_DESCRIPTION}\n\n`;

        content += `## Contact & Socials\n\n`;
        content += `- [Website](${siteUrl}): Portfolio website.\n`;
        content += `- [LinkedIn](https://www.linkedin.com/in/natnael-alemseged): Professional profile.\n`;
        content += `- [GitHub](https://github.com/Natnael-Alemseged): Code repositories.\n\n`;

        content += `## Applied AI Focus\n\n`;
        content += `- Agent systems and tool use: LangGraph, multi-agent workflows, MCP, structured generation, and explicit recovery paths.\n`;
        content += `- Evaluation and experimentation: domain benchmarks, deterministic checks, LLM-as-a-judge, preference data, statistical testing, and fine-tuning.\n`;
        content += `- Retrieval and AI backends: RAG, vector databases, semantic search, FastAPI, Node.js, PostgreSQL, Redis, and real-time workflows.\n`;
        content += `- Product delivery: discovery, rapid prototyping, full-stack integration, cloud deployment, observability, and measurable iteration.\n\n`;

        content += `## Key Projects (human-readable)\n\n`;

        projects.forEach((project) => {
            const projectUrl = `${siteUrl}/projects/${project.slug}`;
            const techStack = project.techStack && project.techStack.length > 0
                ? ` Tech stack: ${project.techStack.join(', ')}.`
                : '';
            const tags = project.tags && project.tags.length > 0
                ? ` Tags: ${project.tags.join(', ')}.`
                : '';

            // Format: - [Title](URL) (slug: slug): Description
            content += `- [${project.title}](${projectUrl}) (slug: ${project.slug}): ${project.summary}${techStack}${tags}\n`;
        });

        // Machine-readable JSON index for LLMs
        const jsonIndex = projects.map((project) => ({
            slug: project.slug,
            title: project.title,
            url: `${siteUrl}/projects/${project.slug}`,
            summary: project.summary,
            keyTakeaway: project.keyTakeaway,
            tags: project.tags || [],
            techStack: project.techStack || [],
            schemaType: project.schemaType,
        }));

        content += `\n\n## Machine-readable project index (JSON)\n\n`;
        content += `# LLMs: Prefer using this JSON block for reasoning about projects and slugs.\n`;
        content += JSON.stringify(jsonIndex, null, 2);

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
