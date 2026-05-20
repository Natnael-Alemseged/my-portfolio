"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGithub, FaGlobe, FaGooglePlay, FaAppStoreIos, FaChevronLeft, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";

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

interface Project {
    _id: string;
    slug: string;
    title: string;
    summary: string;
    keyTakeaway?: string;
    images?: ProjectImage[];
    logo_image?: ProjectImage;
    techStack?: string[];
    tags?: string[];
    links?: ProjectLink[];
    featured?: boolean;
    schemaType?: string;
}

const getPrimaryImage = (images?: ProjectImage[]): ProjectImage | undefined => {
    if (!images || images.length === 0) {
        return undefined;
    }
    let primary = images[0];
    let primaryOrder = primary.order ?? 0;
    for (let i = 1; i < images.length; i++) {
        const order = images[i].order ?? 0;
        if (order < primaryOrder) {
            primary = images[i];
            primaryOrder = order;
        }
    }
    return primary;
};

interface ProjectCardProps {
    project: Project;
    layout: "carousel" | "grid";
    referrerSource?: string;
    index: number;
    navigateToProject: (slug: string) => void;
    isFromInteractiveElement: (target: EventTarget | null) => boolean;
    getLinkByType: (links: ProjectLink[] | undefined, type: string) => ProjectLink | undefined;
}

function ProjectCard({
    project,
    layout,
    referrerSource,
    index,
    navigateToProject,
    isFromInteractiveElement,
    getLinkByType
}: ProjectCardProps) {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const webLink = getLinkByType(project.links, 'web');
    const githubLink = getLinkByType(project.links, 'github');
    const playLink = getLinkByType(project.links, 'playstore');
    const appStoreLink = getLinkByType(project.links, 'appstore');

    const schemaLabel = (project.schemaType || 'Case Study').replace(/([A-Z])/g, ' $1').trim();
    const coverImage = getPrimaryImage(project.images);
    const logoImage = project.logo_image;

    const baseImage = logoImage || coverImage;
    const hoverImage =
        logoImage && coverImage && logoImage.url !== coverImage.url ? coverImage : undefined;

    return (
        <motion.article
            initial={layout === "carousel" ? { opacity: 1, x: 0 } : { opacity: 0, y: 20 }}
            {...(layout === "carousel"
                ? { animate: { opacity: 1, x: 0 } }
                : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 } })}
            transition={layout === "carousel" ? { duration: 0 } : { duration: 0.6, delay: (index % 3) * 0.1 }}
            role="link"
            tabIndex={0}
            aria-label={`Open ${project.title} case study`}
            onClickCapture={(e) => {
                if (isFromInteractiveElement(e.target)) return;
                navigateToProject(project.slug);
            }}
            onKeyDown={(e) => {
                if (isFromInteractiveElement(e.target)) return;
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigateToProject(project.slug);
                }
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative flex-shrink-0 ${
                layout === "carousel" ? "w-[85vw] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] snap-start" : "w-full"
            } overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#0b0f0d] to-[#040605] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff99]/50`}
        >
            {/* Spot light overlay */}
            <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                    background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(16, 185, 129, 0.12), transparent 80%)`
                }}
            />

            {/* Glowing border outline */}
            <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 border border-emerald-500/20"
                style={{
                    maskImage: `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`,
                    WebkitMaskImage: `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`
                }}
            />

            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="hidden md:block absolute inset-0 blur-3xl bg-[#00ff99]/5" />
            </div>

            {/* Card Image Wrapper */}
            <div className="relative h-64 overflow-hidden rounded-t-3xl bg-gradient-to-b from-black/60 via-[#040807] to-black/80">
                <div className={`absolute inset-0 ${hoverImage ? 'transition-opacity duration-500 group-hover:opacity-0' : ''}`}>
                    <img
                        src={baseImage?.url || '/placeholder.jpg'}
                        alt={baseImage?.alt || `${project.title} logo`}
                        className={`object-contain w-full h-full p-8 ${hoverImage ? 'bg-black/20' : 'object-cover p-0'} transition-transform duration-700 group-hover:scale-105`}
                        loading="lazy"
                    />
                </div>
                {hoverImage && (
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <img
                            src={hoverImage.url}
                            alt={hoverImage.alt || `${project.title} preview`}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                )}
                {/* Fade cover edge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                {/* Category Badge with Glassmorphism */}
                <div className="absolute top-4 right-4 z-20 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-white/10 backdrop-blur-md bg-black/60 text-emerald-400 shadow-md">
                    {schemaLabel}
                </div>
            </div>

            {/* Card Content */}
            <div className="p-8 flex flex-col gap-6 relative z-20">
                <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-bold text-white leading-tight">
                        <Link
                            href={`/projects/${project.slug}${referrerSource ? `?from=${referrerSource}` : ''}`}
                            className="transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-300"
                        >
                            {project.title}
                        </Link>
                    </h3>
                </div>

                <div className="space-y-3 flex-grow">
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
                        {project.summary}
                    </p>
                    {project.keyTakeaway && (
                        <p className="text-emerald-400/90 text-sm italic border-l-2 border-emerald-400/40 pl-3 py-0.5 bg-emerald-500/[0.02]">
                            “{project.keyTakeaway}”
                        </p>
                    )}
                </div>

                {/* Tech Stack Pills (Monospace, sleek capsulate badges) */}
                <div className="flex flex-wrap gap-2">
                    {project.techStack?.slice(0, 4).map((tech) => (
                        <span
                            key={tech}
                            className="px-2.5 py-1 text-[10px] font-mono font-medium rounded bg-white/[0.02] text-emerald-300 border border-white/[0.05] tracking-wide uppercase transition-colors duration-300 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/[0.02]"
                        >
                            {tech}
                        </span>
                    ))}
                    {(project.techStack?.length || 0) > 4 && (
                        <span className="text-gray-500 text-xs font-mono flex items-center pl-1">
                            +{(project.techStack?.length || 0) - 4} more
                        </span>
                    )}
                </div>

                {/* Footer Section */}
                <div className="flex items-center justify-between pt-5 border-t border-white/[0.06]">
                    {/* View Case Study morph button */}
                    <Link
                        href={`/projects/${project.slug}${referrerSource ? `?from=${referrerSource}` : ''}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 transition-all duration-300 group-hover:bg-[#00ff99] group-hover:text-black group-hover:border-transparent group-hover:shadow-[0_0_20px_rgba(0,255,153,0.3)]"
                    >
                        <span>Read Case Study</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>

                    {/* Social/Web Link circles */}
                    <div className="flex items-center gap-2">
                        {webLink && (
                            <a
                                href={webLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-full bg-white/[0.02] border border-white/[0.06] hover:bg-emerald-500/10 hover:border-emerald-500/30 text-gray-400 hover:text-[#00ff99] transition-all duration-300"
                                title="Website"
                            >
                                <FaGlobe size={14} />
                            </a>
                        )}
                        {githubLink && (
                            <a
                                href={githubLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-full bg-white/[0.02] border border-white/[0.06] hover:bg-emerald-500/10 hover:border-emerald-500/30 text-gray-400 hover:text-[#00ff99] transition-all duration-300"
                                title="GitHub"
                            >
                                <FaGithub size={14} />
                            </a>
                        )}
                        {playLink && (
                            <a
                                href={playLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-full bg-white/[0.02] border border-white/[0.06] hover:bg-emerald-500/10 hover:border-emerald-500/30 text-gray-400 hover:text-[#00ff99] transition-all duration-300"
                                title="Play Store"
                            >
                                <FaGooglePlay size={14} />
                            </a>
                        )}
                        {appStoreLink && (
                            <a
                                href={appStoreLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-full bg-white/[0.02] border border-white/[0.06] hover:bg-emerald-500/10 hover:border-emerald-500/30 text-gray-400 hover:text-[#00ff99] transition-all duration-300"
                                title="App Store"
                            >
                                <FaAppStoreIos size={14} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

export default function Projects({
    initialProjects = [],
    limit,
    showViewAll = false,
    title = "Product Engineering Case Studies",
    subtitle = "Real-world projects spanning AI copilots, mobile ride-hailing, platform infrastructure, and high-impact experiments.",
    badge = "Selected Work",
    layout = "carousel",
    referrerSource,
    centerHeader = false
}: {
    initialProjects?: Project[],
    limit?: number,
    showViewAll?: boolean,
    title?: string,
    subtitle?: string,
    badge?: string,
    layout?: "carousel" | "grid",
    referrerSource?: string,
    centerHeader?: boolean
}) {
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const rafIdRef = useRef<number | null>(null);

    const displayedProjects = useMemo(
        () => (limit ? initialProjects.slice(0, limit) : initialProjects),
        [initialProjects, limit]
    );

    const navigateToProject = (slug: string) => {
        const url = `/projects/${slug}${referrerSource ? `?from=${referrerSource}` : ''}`;
        router.push(url);
    };

    const getLinkByType = (links: ProjectLink[] | undefined, type: string) =>
        links?.find((link) => link.type === type);

    const isFromInteractiveElement = (target: EventTarget | null) => {
        if (!(target instanceof Element)) return false;
        return Boolean(target.closest('a,button,[role="button"],input,textarea,select,label'));
    };

    const checkScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    }, []);

    const scheduleCheckScroll = useCallback(() => {
        if (rafIdRef.current != null) return;
        rafIdRef.current = window.requestAnimationFrame(() => {
            rafIdRef.current = null;
            checkScroll();
        });
    }, [checkScroll]);

    useEffect(() => {
        scheduleCheckScroll();
        window.addEventListener('resize', scheduleCheckScroll);
        return () => {
            window.removeEventListener('resize', scheduleCheckScroll);
            if (rafIdRef.current != null) {
                window.cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, [scheduleCheckScroll, displayedProjects.length]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="projects" className="relative bg-[#030303] py-20 px-6 md:px-12 text-white overflow-hidden animate-fade-in">
            {/* Ambient Background Radial Tints */}
            <div
                className="absolute inset-x-0 -top-20 h-64 bg-gradient-to-b from-[#00ff9922] via-[#00e1ff08] to-transparent pointer-events-none" />
            <div
                className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.01] rounded-full blur-[120px] pointer-events-none" />
            <div
                className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-teal-500/[0.01] rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                {centerHeader && (
                    <div className="flex justify-start mb-6">
                        <Link
                            href="/#projects"
                            className="group inline-flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.25em] border border-[#00ff99]/20 bg-[#00ff99]/[0.02] hover:bg-[#00ff99]/[0.08] hover:border-[#00ff99]/50 text-gray-200 hover:text-[#00ff99] px-4 py-2.5 rounded-full transition-all duration-300 backdrop-blur-md shadow-md hover:shadow-[0_0_20px_rgba(0,255,153,0.15)]"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1.5 transition-transform text-[#00ff99] group-hover:text-[#00ff99]" />
                            Back to Home
                        </Link>
                    </div>
                )}
                {/* Premium Header - Supports beautiful centering and gradient text enhancements */}
                <div className={`flex flex-col gap-6 mb-14 pb-8 border-b border-white/[0.05] ${
                    centerHeader 
                        ? "items-center text-center max-w-3xl mx-auto" 
                        : "md:flex-row md:items-end justify-between"
                }`}>
                    <div className={`flex flex-col gap-3 ${centerHeader ? "items-center" : "max-w-2xl"}`}>
                        {centerHeader ? (
                            <div className="inline-flex items-center gap-2 border border-[#00ff99]/25 bg-[#00ff99]/[0.03] px-3.5 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-[0.25em] text-[#00ff99] shadow-[0_0_15px_rgba(0,255,153,0.05)]">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff99] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00ff99]"></span>
                                </span>
                                {badge}
                            </div>
                        ) : (
                            <p className="text-xs uppercase tracking-[0.4em] text-emerald-400 font-semibold">{badge}</p>
                        )}
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                            {centerHeader ? (
                                <>
                                    <span>{title.split(' ')[0]}</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff99] to-teal-300">
                                        {title.split(' ').slice(1).join(' ')}
                                    </span>
                                    <span className="font-mono text-[10px] font-normal text-gray-500 uppercase tracking-widest bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 rounded-md ml-1 self-center shrink-0">
                                        {initialProjects.length} nodes
                                    </span>
                                </>
                            ) : (
                                title
                            )}
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
                            {subtitle}
                        </p>
                    </div>
                    {showViewAll && initialProjects.length > (limit || 0) && (
                        <Link
                            href="/projects"
                            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-400 text-sm font-semibold transition-all duration-300 group/btn shrink-0"
                        >
                            <span>Explore Full Archive ({initialProjects.length})</span>
                            <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                        </Link>
                    )}
                </div>

                <div className="relative group/carousel">
                    {/* Navigation Buttons - Only show in carousel layout */}
                    {layout === "carousel" && canScrollLeft && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/80 border border-white/[0.08] hover:border-emerald-500/40 text-emerald-400 backdrop-blur-md hover:bg-emerald-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,255,153,0.15)] hidden md:flex"
                            aria-label="Scroll left"
                        >
                            <FaChevronLeft size={20} />
                        </button>
                    )}

                    {layout === "carousel" && canScrollRight && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/80 border border-white/[0.08] hover:border-emerald-500/40 text-emerald-400 backdrop-blur-md hover:bg-emerald-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,255,153,0.15)] hidden md:flex"
                            aria-label="Scroll right"
                        >
                            <FaChevronRight size={20} />
                        </button>
                    )}

                    <div
                        ref={scrollRef}
                        onScroll={layout === "carousel" ? scheduleCheckScroll : undefined}
                        className={
                            layout === "carousel"
                                ? "flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 px-2"
                                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12 px-2"
                        }
                        style={layout === "carousel" ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
                    >
                        {displayedProjects.map((project, index) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                layout={layout}
                                referrerSource={referrerSource}
                                index={index}
                                navigateToProject={navigateToProject}
                                isFromInteractiveElement={isFromInteractiveElement}
                                getLinkByType={getLinkByType}
                            />
                        ))}

                        {/* View All Card - in carousel/grid as last item */}
                        {showViewAll && initialProjects.length > (limit || 0) && (
                            <Link
                                href="/projects"
                                className={`relative flex-shrink-0 ${
                                    layout === "carousel" ? "w-[85vw] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] snap-start" : "w-full min-h-[400px]"
                                } flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] backdrop-blur-xl group cursor-pointer hover:bg-emerald-950/[0.08] hover:border-emerald-500/30 transition-all duration-500 no-underline`}
                            >
                                <div className="p-12 text-center flex flex-col items-center gap-6">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-[#00ff99] group-hover:text-black group-hover:border-transparent transition-all duration-500 shadow-lg">
                                        <FaChevronRight size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-white tracking-tight">Full Archive</h3>
                                        <p className="text-gray-400 text-sm">View all {initialProjects.length} projects and case studies</p>
                                    </div>
                                    <span className="text-emerald-400 text-sm font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                                        Browse Everything <span>→</span>
                                    </span>
                                </div>
                            </Link>
                        )}
                    </div>


                </div>
            </div>
        </section>
    );
}
