import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import { FaGithub, FaGlobe, FaGooglePlay, FaAppStoreIos, FaArrowLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AnimatedSection from '@/components/AnimatedSection';
import ProjectImageCarousel from '@/components/ProjectImageCarousel';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ProjectImage {
    url: string;
    alt: string;
    caption?: string;
    order?: number;
}

interface ProjectLink {
    type: string;
    url: string;
    label?: string;
}

interface ProjectData {
    _id: string;
    slug: string;
    title: string;
    summary: string;
    role?: string;
    problem?: string;
    solution?: string;
    keyTakeaway?: string;
    content?: string;
    contentFormat?: string;
    architecture?: string;
    features?: string[];
    techStack?: string[];
    tags?: string[];
    images?: ProjectImage[];
    links?: ProjectLink[];
    metrics?: {
        duration?: string;
        teamSize?: number;
        impact?: string;
    };
    schemaType?: string;
    createdAt?: string;
}

async function getProject(slug: string): Promise<ProjectData | null> {
    try {
        await connectToDatabase();
        const project = await Project.findOne({ slug, visibility: 'public' }).lean();
        return project ? JSON.parse(JSON.stringify(project)) : null;
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        return {
            title: 'Project Not Found',
        };
    }

    const imageUrl = project.images?.[0]?.url || '';
    const description = project.summary || '';

    return {
        title: `${project.title} – Natnael Alemseged`,
        description,
        keywords: [...(project.techStack || []), ...(project.tags || [])],
        authors: [{ name: 'Natnael Alemseged' }],
        openGraph: {
            title: project.title,
            description,
            type: 'article',
            images: imageUrl ? [{ url: imageUrl, alt: project.images?.[0]?.alt || project.title }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: project.keyTakeaway || description,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    // Schema.org JSON-LD for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': project.schemaType || 'SoftwareApplication',
        name: project.title,
        description: project.summary,
        applicationCategory: project.tags?.join(', '),
        operatingSystem: project.schemaType === 'MobileApplication' ? 'iOS, Android' : 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        author: {
            '@type': 'Person',
            name: 'Natnael Alemseged',
        },
        dateCreated: project.createdAt,
        image: project.images?.map(img => img.url),
    };

    const markdownComponents = {
        h2: ({ children }: any) => (
            <h2 className="text-2xl font-bold text-[#00ff99] mt-10 mb-4">{children}</h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-xl font-semibold text-white mt-8 mb-3">{children}</h3>
        ),
        p: ({ children }: any) => (
            <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }: any) => (
            <ul className="space-y-3 mb-6">{children}</ul>
        ),
        li: ({ children }: any) => (
            <li className="flex items-start gap-3 bg-gray-900/70 border border-emerald-900/30 rounded-lg p-3">
                <span className="text-[#00ff99] mt-1">•</span>
                <span className="text-gray-200">{children}</span>
            </li>
        ),
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-[#00ff99] bg-gray-900/50 p-4 rounded-r-lg italic text-emerald-200 mb-6">
                {children}
            </blockquote>
        ),
        strong: ({ children }: any) => (
            <strong className="text-white font-semibold">{children}</strong>
        ),
        code: ({
            inline,
            className,
            children,
            ...props
        }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match) {
                return (
                    <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-xl border border-emerald-900/30 shadow-[0_0_20px_rgba(0,255,153,0.12)]"
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                );
            }
            return (
                <code className="bg-gray-900/70 text-emerald-200 px-1.5 py-0.5 rounded" {...props}>
                    {children}
                </code>
            );
        },
    };

    const hasLinkType = (type: string) => Boolean(project.links?.some((link) => link.type === type));
    const deviceFrame = hasLinkType('appstore') || hasLinkType('playstore') ? 'phone' : 'tablet';

    return (
        <>
            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-[#0d0d0d] text-white">
                <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
                    {/* Back Button */}
                    <AnimatedSection className="mb-8">
                        <Link
                            href="/#projects"
                            className="inline-flex items-center gap-2 text-[#00ff99] hover:underline"
                            aria-label="Back to projects section"
                        >
                            <FaArrowLeft /> Back to Projects
                        </Link>
                    </AnimatedSection>

                    {/* Hero Section */}
                    <AnimatedSection className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-[#00ff99] mb-4">
                            {project.title}
                        </h1>
                        {project.role && (
                            <p className="text-xl text-gray-300 mb-4">{project.role}</p>
                        )}
                        <p className="text-lg text-gray-200 leading-relaxed">{project.summary}</p>
                        {project.keyTakeaway && (
                            <blockquote className="mt-6 border-l-4 border-[#00ff99] pl-4 italic text-emerald-300 bg-gray-900/40 py-3 rounded-r-lg">
                                "{project.keyTakeaway}"
                            </blockquote>
                        )}
                    </AnimatedSection>

                    {/* Images Gallery */}
                    {project.images && project.images.length > 0 && (
                        <AnimatedSection className="mb-12">
                            <ProjectImageCarousel images={project.images} device={deviceFrame} />
                        </AnimatedSection>
                    )}

                    {/* Problem & Solution */}
                    {(project.problem || project.solution) && (
                        <AnimatedSection className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {project.problem && (
                                <div className="bg-gray-900/80 p-6 rounded-lg border border-emerald-900/30">
                                    <h2 className="text-2xl font-bold text-[#00ff99] mb-4">Problem</h2>
                                    <p className="text-gray-300 leading-relaxed">{project.problem}</p>
                                </div>
                            )}
                            {project.solution && (
                                <div className="bg-gray-900/80 p-6 rounded-lg border border-emerald-900/30">
                                    <h2 className="text-2xl font-bold text-[#00ff99] mb-4">Solution</h2>
                                    <p className="text-gray-300 leading-relaxed">{project.solution}</p>
                                </div>
                            )}
                        </AnimatedSection>
                    )}

                    {/* Architecture */}
                    {project.architecture && (
                        <AnimatedSection className="mb-12 bg-gray-900/80 p-6 rounded-lg border border-emerald-900/30">
                            <h2 className="text-2xl font-bold text-[#00ff99] mb-4">Architecture</h2>
                            <p className="text-gray-300 leading-relaxed">{project.architecture}</p>
                        </AnimatedSection>
                    )}

                    {/* Features */}
                    {project.features && project.features.length > 0 && (
                        <AnimatedSection className="mb-12">
                            <h2 className="text-2xl font-bold text-[#00ff99] mb-6">Key Features</h2>
                            <ul className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                                {project.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 bg-gray-900 p-4 rounded-lg">
                                        <span className="text-[#00ff99] mt-1">✓</span>
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </AnimatedSection>
                    )}

                    {/* Detailed Content */}
                    {project.content && (
                        <AnimatedSection className="mb-12">
                            <h2 className="text-2xl font-bold text-[#00ff99] mb-6">Deep Dive</h2>
                            <div className="text-gray-300 leading-relaxed space-y-4">
                                {project.contentFormat === 'html' ? (
                                    <div className="prose prose-invert prose-emerald max-w-none" dangerouslySetInnerHTML={{ __html: project.content }} />
                                ) : (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={markdownComponents}
                                    >
                                        {project.content}
                                    </ReactMarkdown>
                                )}
                            </div>
                        </AnimatedSection>
                    )}

                    {/* Tech Stack & Tags */}
                    <AnimatedSection className="mb-12">
                        {project.techStack && project.techStack.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-[#00ff99] mb-4">Tech Stack</h2>
                                <div className="flex flex-wrap gap-3">
                                    {project.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="bg-gray-800 text-emerald-400 px-4 py-2 rounded-full border border-emerald-900/30"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {project.tags && project.tags.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-[#00ff99] mb-4">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-gray-900 text-gray-400 text-sm px-3 py-1 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </AnimatedSection>

                    {/* Metrics */}
                    {project.metrics && (project.metrics.duration || project.metrics.teamSize || project.metrics.impact) && (
                        <AnimatedSection className="mb-12 bg-gray-900/80 p-6 rounded-lg border border-emerald-900/30">
                            <h2 className="text-2xl font-bold text-[#00ff99] mb-6">Project Metrics</h2>
                            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
                                {project.metrics.duration && (
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Duration</p>
                                        <p className="text-white text-lg font-semibold">{project.metrics.duration}</p>
                                    </div>
                                )}
                                {project.metrics.teamSize && (
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Team Size</p>
                                        <p className="text-white text-lg font-semibold">{project.metrics.teamSize} {project.metrics.teamSize === 1 ? 'person' : 'people'}</p>
                                    </div>
                                )}
                                {project.metrics.impact && (
                                    <div className="md:col-span-3">
                                        <p className="text-gray-400 text-sm mb-1">Impact</p>
                                        <p className="text-white text-lg">{project.metrics.impact}</p>
                                    </div>
                                )}
                            </div>
                        </AnimatedSection>
                    )}

                    {/* Links */}
                    {project.links && project.links.length > 0 && (
                        <AnimatedSection className="flex flex-wrap gap-4">
                            {project.links.map((link, idx) => {
                                const Icon = link.type === 'github' ? FaGithub :
                                    link.type === 'web' ? FaGlobe :
                                        link.type === 'playstore' ? FaGooglePlay :
                                            link.type === 'appstore' ? FaAppStoreIos : FaGlobe;

                                return (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#00ff99] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#00e68a] transition"
                                    >
                                        <Icon size={20} />
                                        {link.label || link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                                    </a>
                                );
                            })}
                        </AnimatedSection>
                    )}
                </div>
            </div>
        </>
    );
}
