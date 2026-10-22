import { tool, type InferUITools, type UIDataTypes, type UIMessage } from 'ai';
import { z } from 'zod';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import { getOptimizedProjectImageUrl } from '@/lib/project-image';
import {
    BOOK_CALL_URL,
    CAL_LINK,
    CONTACT_EMAIL,
    GITHUB_URL,
    LINKEDIN_URL,
    RESUME_LINKS,
    UPWORK_PROFILE_URL,
    type ResumeId,
} from '@/lib/brand';

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

export type ContactChannelId = 'email' | 'linkedin' | 'github' | 'upwork';

export interface ContactChannel {
    id: ContactChannelId;
    label: string;
    value: string;
    href: string;
}

const CONTACT_CHANNELS: ContactChannel[] = [
    { id: 'email', label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { id: 'linkedin', label: 'LinkedIn', value: 'in/natnael-alemseged', href: LINKEDIN_URL },
    { id: 'github', label: 'GitHub', value: 'natnael-alemseged', href: GITHUB_URL },
    { id: 'upwork', label: 'Upwork', value: 'Top Rated freelance profile', href: UPWORK_PROFILE_URL },
];

export interface ProjectCardData {
    slug: string;
    title: string;
    summary: string;
    techStack: string[];
    image: { url: string; alt: string } | null;
}

// Checked in priority order within a message, so "React Native" counts as
// mobile and "AI backend role" as AI before the generic web keywords.
const RESUME_TOPICS: [ResumeId, RegExp][] = [
    ['mobile', /\b(mobile|flutter|ios|android|react native|swift|kotlin|app store|play store)\b/i],
    ['ai-fde', /\b(ai|llms?|agents?|agentic|rag|evals?|evaluation|machine learning|ml|genai|langchain|langgraph|forward[- ]deployed|fde|solutions engineer)\b/i],
    ['full-stack', /\b(backend|back[- ]end|apis?|rest|graphql|node(\.js)?|nestjs|fastapi|django|express|databases?|postgres(ql)?|full[- ]?stack|frontend|front[- ]end|web apps?|react|next\.js|microservices?)\b/i],
];

/**
 * Picks the resume version from the visitor's own messages, most recent
 * first, so the choice does not depend on what the assistant's answers
 * happened to mention. Returns "general" when no message names a topic.
 */
export function suggestResumeVersion(userMessages: string[]): ResumeId {
    for (const text of [...userMessages].reverse()) {
        const match = RESUME_TOPICS.find(([, pattern]) => pattern.test(text));
        if (match) return match[0];
    }
    return 'general';
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
            'Display a download button for the one resume version that fits the visitor. Use whenever the visitor asks for a resume or CV, instead of writing the link in text. Call it again with another version if they ask for one.',
        inputSchema: z.object({
            version: z
                .enum(RESUME_LINKS.map((r) => r.id) as [ResumeId, ...ResumeId[]])
                .describe(
                    'Version that best fits the whole conversation. Use the version or role the visitor mentioned if any; otherwise '
                    + 'the topic of the visitor\'s own earlier questions (most recent wins). "mobile" for mobile, Flutter, iOS, '
                    + 'or Android roles or questions; "full-stack" for backend, full-stack, web, or API roles or questions; '
                    + '"ai-fde" for AI engineer, forward deployed, or solutions roles, or questions about agents, RAG, or '
                    + 'evaluation; "general" only when the visitor has not asked about any of these'
                ),
        }),
        execute: async ({ version }) => {
            const resume = RESUME_LINKS.find((r) => r.id === version) ?? RESUME_LINKS[0];
            return { id: resume.id, label: resume.label, url: resume.url };
        },
    }),
    bookCall: tool({
        description:
            'Display a button that opens Natnael\'s booking calendar for a 10-minute discovery call. Use when the visitor wants to talk, meet, schedule a call, hire him, or discuss a project or role.',
        inputSchema: z.object({}),
        execute: async () => ({
            title: '10-min discovery call',
            calLink: CAL_LINK,
            url: BOOK_CALL_URL,
        }),
    }),
    showContact: tool({
        description:
            'Display a card with Natnael\'s contact channels (email, LinkedIn, GitHub, Upwork). Use when the visitor asks how to reach or contact him, or for his email or profiles, instead of writing them in text.',
        inputSchema: z.object({}),
        execute: async () => ({ channels: CONTACT_CHANNELS }),
    }),
};

export type ChatUIMessage = UIMessage<never, UIDataTypes, InferUITools<typeof chatTools>>;
