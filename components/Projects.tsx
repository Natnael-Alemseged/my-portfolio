"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGithub, FaGlobe, FaGooglePlay, FaAppStoreIos, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";

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
    return [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];
};

export default function Projects({
    initialProjects = [],
    limit,
    showViewAll = false,
    title = "Product Engineering Case Studies",
    subtitle = "Real-world projects spanning AI copilots, mobile ride-hailing, platform infrastructure, and high-impact experiments.",
    badge = "Selected Work",
    layout = "carousel"
}: {
    initialProjects?: Project[],
    limit?: number,
    showViewAll?: boolean,
    title?: string,
    subtitle?: string,
    badge?: string,
    layout?: "carousel" | "grid"
}) {
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const displayedProjects = limit ? initialProjects.slice(0, limit) : initialProjects;

    const navigateToProject = (slug: string) => {
        router.push(`/projects/${slug}`);
    };

    const getLinkByType = (links: ProjectLink[] | undefined, type: string) =>
        links?.find((link) => link.type === type);

    const isFromInteractiveElement = (target: EventTarget | null) => {
        if (!(target instanceof Element)) return false;
        return Boolean(target.closest('a,button,[role="button"],input,textarea,select,label'));
    };

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [displayedProjects]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="projects" className="relative bg-[#030303] py-20 px-6 md:px-12 text-white overflow-hidden">
            <div
                className="absolute inset-x-0 -top-20 h-32 bg-gradient-to-b from-[#00ff9955] to-transparent blur-none md:blur-3xl pointer-events-none" />
            <div className="max-w-7xl mx-auto relative">
                <div className="flex flex-col items-center gap-4 mb-14">
                    <p className="text-sm uppercase tracking-[0.4em] text-emerald-400">{badge}</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-center text-white">
                        {title}
                    </h2>
                    <p className="text-gray-400 text-center max-w-2xl">
                        {subtitle}
                    </p>
                </div>

                <div className="relative group/carousel">
                    {/* Navigation Buttons - Only show in carousel layout */}
                    {layout === "carousel" && canScrollLeft && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/60 border border-emerald-500/30 text-emerald-400 backdrop-blur-md hover:bg-emerald-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,255,153,0.2)] hidden md:flex"
                            aria-label="Scroll left"
                        >
                            <FaChevronLeft size={24} />
                        </button>
                    )}

                    {layout === "carousel" && canScrollRight && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/60 border border-emerald-500/30 text-emerald-400 backdrop-blur-md hover:bg-emerald-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,255,153,0.2)] hidden md:flex"
                            aria-label="Scroll right"
                        >
                            <FaChevronRight size={24} />
                        </button>
                    )}

                    <div
                        ref={scrollRef}
                        onScroll={layout === "carousel" ? checkScroll : undefined}
                        className={
                            layout === "carousel"
                                ? "flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 px-2"
                                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12 px-2"
                        }
                        style={layout === "carousel" ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
                    >
                        {displayedProjects.map((project, index) => {
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
                                    key={project._id}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
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
                                    className={`relative flex-shrink-0 ${layout === "carousel" ? "w-[85vw] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] snap-start" : "w-full"} overflow-hidden rounded-3xl border border-emerald-900/40 bg-gradient-to-br from-[#050505] via-[#040a08] to-[#020202] shadow-[0_0_35px_rgba(0,255,153,0.08)] transition-all duration-400 hover:-translate-y-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff99]/50`}
                                >
                                    <div
                                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                                        <div className="hidden md:block absolute inset-0 blur-3xl bg-[#00ff99]/15" />
                                        <div
                                            className="absolute -inset-px rounded-[26px] border border-[#00ff99]/30 animate-pulse-slow" />
                                    </div>
                                    <div
                                        className="relative h-64 overflow-hidden rounded-t-3xl bg-gradient-to-br from-black via-emerald-950/40 to-black">
                                        <div
                                            className={`absolute inset-0 ${hoverImage ? 'transition-opacity duration-500 group-hover:opacity-0' : ''}`}>
                                            <img
                                                src={baseImage?.url || '/placeholder.jpg'}
                                                alt={baseImage?.alt || `${project.title} logo`}
                                                className={`object-contain w-full h-full p-8 ${hoverImage ? 'bg-black/40' : 'object-cover p-0'} transition-transform duration-700 group-hover:scale-105`}
                                                loading="lazy"
                                            />
                                        </div>
                                        {hoverImage && (
                                            <div
                                                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                                <img
                                                    src={hoverImage.url}
                                                    alt={hoverImage.alt || `${project.title} preview`}
                                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div
                                            className="absolute top-4 right-4 z-10 text-xs font-semibold px-3 py-1 rounded-full border border-white/40 md:backdrop-blur bg-black/80 md:bg-black/70 text-white shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                                            {schemaLabel}
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col gap-6">
                                        <div className="flex flex-col gap-3">
                                            <h3 className="text-2xl font-bold text-white leading-tight">
                                                <Link
                                                    href={`/projects/${project.slug}`}
                                                    className="hover:text-emerald-300 transition"
                                                >
                                                    {project.title}
                                                </Link>
                                            </h3>
                                            <Link
                                                href={`/projects/${project.slug}`}
                                                className="w-fit text-sm text-black font-semibold bg-[#00ff99] px-4 py-1.5 rounded-full hover:bg-white transition shadow-[0_10px_25px_rgba(0,255,153,0.35)]"
                                            >
                                                View case
                                            </Link>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-gray-300 leading-relaxed line-clamp-3">{project.summary}</p>
                                            {project.keyTakeaway && (
                                                <p className="text-emerald-300 text-sm italic border-l-2 border-emerald-400/40 pl-3">
                                                    “{project.keyTakeaway}”
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack?.slice(0, 3).map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-3 py-1 text-xs font-semibold rounded-full bg-white/5 text-emerald-200 border border-emerald-900/40"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {(project.techStack?.length || 0) > 3 && (
                                                <span className="text-gray-500 text-xs flex items-center">
                                                    +{(project.techStack?.length || 0) - 3} more
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                            {webLink && (
                                                <a
                                                    href={webLink.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-[#00ff99] transition"
                                                    title="Website"
                                                >
                                                    <FaGlobe size={18} />
                                                </a>
                                            )}
                                            {githubLink && (
                                                <a
                                                    href={githubLink.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-[#00ff99] transition"
                                                    title="GitHub"
                                                >
                                                    <FaGithub size={18} />
                                                </a>
                                            )}
                                            {playLink && (
                                                <a
                                                    href={playLink.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-[#00ff99] transition"
                                                    title="Play Store"
                                                >
                                                    <FaGooglePlay size={18} />
                                                </a>
                                            )}
                                            {appStoreLink && (
                                                <a
                                                    href={appStoreLink.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-[#00ff99] transition"
                                                    title="App Store"
                                                >
                                                    <FaAppStoreIos size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}

                        {/* View All Card */}
                        {showViewAll && initialProjects.length > (limit || 0) && (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`relative flex-shrink-0 ${layout === "carousel" ? "w-[85vw] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] snap-start" : "w-full min-h-[400px]"} flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-900/40 bg-emerald-950/5 group cursor-pointer hover:bg-emerald-950/10 transition-all duration-300`}
                                onClick={() => router.push('/projects')}
                            >
                                <div className="p-12 text-center flex flex-col items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 shadow-lg">
                                        <FaChevronRight size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white">Full Archive</h3>
                                        <p className="text-gray-400">View all {initialProjects.length} projects and case studies</p>
                                    </div>
                                    <span className="text-emerald-400 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                        Browse Everything <span>→</span>
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
