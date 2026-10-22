import { tool, type InferUITools, type UIDataTypes, type UIMessage } from 'ai';
import { z } from 'zod';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import { getOptimizedProjectImageUrl } from '@/lib/project-image';
import { RESUME_LINKS, type ResumeId } from '@/lib/brand';

const MAX_PROJECT_CARDS = 4;

interface ProjectImage {
    url: string;
    alt: string;
    order?: number;
}

interface ProjectDoc {
    slug: string;
    title: string;
    summary: string;
    techStack?: string[];
    images?: ProjectImage[];
    logo_image?: ProjectImage;
}

export interface ProjectCardData {
    slug: string;
    title: string;
    summary: string;
    techStack: string[];
    image: { url: string; alt: string } | null;
}

function getPrimaryImage(images?: ProjectImage[]) {
    if (!images?.length) return undefined;
    return images.reduce((primary, image) =>
        (image.order ?? 0) < (primary.order ?? 0) ? image : primary
    );
}

// Tool outputs come from the database and brand constants, never from the
// model, so cards can only show real projects with real links.
export const chatTools = {
    showProjects: tool({
        description:
            'Display visual cards for specific portfolio projects. Use when the visitor asks to see, list, or compare projects, or asks what Natnael has built. Pass slugs exactly as they appear in the retrieved context.',
        inputSchema: z.object({
            slugs: z
                .array(z.string().min(1).max(120))
                .min(1)
                .max(MAX_PROJECT_CARDS)
                .describe('Project slugs from the retrieved context, most relevant first'),
        }),
        execute: async ({ slugs }): Promise<{ projects: ProjectCardData[] }> => {
            const uniqueSlugs = [...new Set(slugs)].slice(0, MAX_PROJECT_CARDS);
            await connectToDatabase();
            const docs = await Project.find({
                slug: { $in: uniqueSlugs },
                visibility: 'public',
                status: { $ne: 'archived' },
            })
                .select('slug title summary techStack images logo_image')
                .lean<ProjectDoc[]>();

            const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));
            const projects = uniqueSlugs
                .map((slug) => bySlug.get(slug))
                .filter((doc): doc is ProjectDoc => Boolean(doc))
                .map((doc) => {
                    const image = getPrimaryImage(doc.images) ?? doc.logo_image;
                    return {
                        slug: doc.slug,
                        title: doc.title,
                        summary: doc.summary,
                        techStack: (doc.techStack ?? []).slice(0, 5),
                        image: image
                            ? { url: getOptimizedProjectImageUrl(image.url), alt: image.alt || doc.title }
                            : null,
                    };
                });

            return { projects };
        },
    }),
    showResume: tool({
        description:
            'Display download buttons for Natnael\'s resume versions. Use whenever the visitor asks for a resume or CV, instead of writing the links in text.',
        inputSchema: z.object({
            recommended: z
                .enum(RESUME_LINKS.map((r) => r.id) as [ResumeId, ...ResumeId[]])
                .describe(
                    'Version that best fits the whole conversation. Use the role the visitor mentioned if any; otherwise '
                    + 'the topics they asked about earlier. "mobile" for mobile, Flutter, iOS, or Android roles or mobile '
                    + 'app questions; "full-stack" for backend, full-stack, web, or API roles or questions; "ai-fde" for '
                    + 'AI engineer, forward deployed, or solutions roles, or questions about agents, RAG, or evaluation; '
                    + '"general" when the conversation gives no signal or mixes several areas'
                ),
        }),
        execute: async ({ recommended }) => ({
            recommended,
            resumes: RESUME_LINKS.map(({ id, label, url }) => ({ id, label, url })),
        }),
    }),
};

export type ChatUIMessage = UIMessage<never, UIDataTypes, InferUITools<typeof chatTools>>;
