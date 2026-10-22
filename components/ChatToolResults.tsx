import Image from 'next/image';
import Link from 'next/link';
import { Download } from 'lucide-react';
import type { ProjectCardData } from '@/lib/chat-tools';
import type { ResumeId } from '@/lib/brand';

const glow = { textShadow: '0 0 2px #00ff99' };

export function ToolStatus({ label, isError = false }: { label: string; isError?: boolean }) {
    return (
        <div className={`flex items-center gap-2 text-xs font-mono tracking-widest my-2 ${isError ? 'text-red-400' : 'text-[#00ff99] animate-pulse'}`}>
            {!isError && <span className="w-2 h-4 bg-[#00ff99] block"></span>}
            <span>{label}</span>
        </div>
    );
}

export function ProjectCards({ projects }: { projects: ProjectCardData[] }) {
    if (projects.length === 0) return null;

    return (
        <div className="my-2 space-y-2">
            {projects.map((project) => (
                <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="group flex gap-3 p-2 border border-[#00ff99]/50 hover:border-[#00ff99] hover:bg-[#00ff99]/10 transition-colors"
                >
                    <div className="relative w-16 h-16 shrink-0 border border-[#00ff99]/30 bg-[#00ff99]/5 overflow-hidden">
                        {project.image && (
                            <Image
                                src={project.image.url}
                                alt={project.image.alt}
                                fill
                                sizes="64px"
                                className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-[filter] duration-300"
                            />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold uppercase truncate" style={glow}>
                            {project.title}
                        </div>
                        <p className="text-xs leading-snug text-[#00ff99]/80 line-clamp-2 mt-0.5">
                            {project.summary}
                        </p>
                        {project.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                                {project.techStack.map((tech) => (
                                    <span key={tech} className="text-[10px] px-1 border border-[#00ff99]/40 text-[#00ff99]/80">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}

interface ResumeLinksProps {
    recommended: ResumeId;
    resumes: { id: ResumeId; label: string; url: string }[];
}

export function ResumeLinks({ recommended, resumes }: ResumeLinksProps) {
    // Recommended version first, the rest in their configured order.
    const ordered = [...resumes].sort((a, b) => Number(b.id === recommended) - Number(a.id === recommended));

    return (
        <div className="my-2 space-y-2">
            {ordered.map((resume) => {
                const isRecommended = resume.id === recommended;
                return (
                    <a
                        key={resume.id}
                        href={resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between gap-3 px-3 py-2 border text-sm font-mono uppercase transition-colors ${isRecommended
                            ? 'border-[#00ff99] bg-[#00ff99] text-black hover:brightness-110'
                            : 'border-[#00ff99]/50 hover:border-[#00ff99] hover:bg-[#00ff99]/10'
                            }`}
                        style={isRecommended ? undefined : glow}
                    >
                        <span className="truncate">
                            {resume.label}
                            {isRecommended && <span className="ml-2 text-[10px] font-bold">[RECOMMENDED]</span>}
                        </span>
                        <Download size={14} className="shrink-0" />
                    </a>
                );
            })}
        </div>
    );
}
