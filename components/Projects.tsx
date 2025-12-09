"use client";

import {motion} from "framer-motion";
import Link from "next/link";
import {FaGithub, FaGlobe, FaGooglePlay, FaAppStoreIos} from "react-icons/fa";

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
export default function Projects({initialProjects = []}: { initialProjects?: Project[] }) {
    const getLinkByType = (links: ProjectLink[] | undefined, type: string) =>
        links?.find((link) => link.type === type);

    return (
        <section id="projects" className="relative bg-[#030303] py-20 px-6 md:px-12 text-white">
            <div
                className="absolute inset-x-0 -top-20 h-32 bg-gradient-to-b from-[#00ff9955] to-transparent blur-3xl pointer-events-none"/>
            <div className="max-w-7xl mx-auto relative">
                <div className="flex flex-col items-center gap-4 mb-14">
                    <p className="text-sm uppercase tracking-[0.4em] text-emerald-400">Selected Work</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-center text-white">
                        Product Engineering Case Studies
                    </h2>
                    <p className="text-gray-400 text-center max-w-2xl">
                        Real-world projects spanning AI copilots, mobile ride-hailing, platform infrastructure, and
                        high-impact experiments.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {initialProjects.map((project, index) => {
                        const webLink = getLinkByType(project.links, 'web');
                        const githubLink = getLinkByType(project.links, 'github');
                        const playLink = getLinkByType(project.links, 'playstore');
                        const appStoreLink = getLinkByType(project.links, 'appstore');

                        const schemaLabel = (project.schemaType || 'Case Study').replace(/([A-Z])/g, ' $1').trim();
                        const coverImage = getPrimaryImage(project.images);
                        const logoImage = project.logo_image;
                        
                        // Debug logging
                        console.log(`Project: ${project.title}`);
                        console.log('logo_image:', project.logo_image);
                        console.log('coverImage:', coverImage);
                        
                        const baseImage = logoImage || coverImage;
                        const hoverImage =
                            logoImage && coverImage && logoImage.url !== coverImage.url ? coverImage : undefined;

                        return (
                            <motion.article
                                key={project._id}
                                initial={{opacity: 0, y: 40}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: true}}
                                transition={{duration: 0.6, delay: (index % 3) * 0.08}}
                                className="relative overflow-hidden rounded-3xl border border-emerald-900/40 bg-gradient-to-br from-[#050505] via-[#040a08] to-[#020202] shadow-[0_0_35px_rgba(0,255,153,0.08)] transition-all duration-400 hover:-translate-y-2 group"
                            >
                                <div
                                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                                    <div className="absolute inset-0 blur-3xl bg-[#00ff99]/15"/>
                                    <div
                                        className="absolute -inset-px rounded-[26px] border border-[#00ff99]/30 animate-pulse-slow"/>
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
                                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
                                    <div
                                        className="absolute top-4 right-4 z-10 text-xs font-semibold px-3 py-1 rounded-full border border-white/40 backdrop-blur bg-black/70 text-white shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                                        {schemaLabel}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3">
                                        <h3 className="text-2xl font-bold text-white leading-tight">
                                            <Link href={`/projects/${project.slug}`}
                                                  className="hover:text-emerald-300 transition">
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
                                </div>

                                <div className="p-8 flex flex-col gap-6">
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
                                                <FaGlobe size={18}/>
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
                                                <FaGithub size={18}/>
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
                                                <FaGooglePlay size={18}/>
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
                                                <FaAppStoreIos size={18}/>
                                            </a>
                                        )}
                                        <Link
                                            href={`/projects/${project.slug}`}
                                            className="ml-auto text-sm text-[#00ff99] hover:text-white transition"
                                        >
                                            Dive deeper →
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
