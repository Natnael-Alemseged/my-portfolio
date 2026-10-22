import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Download } from 'lucide-react';
import { getCalApi } from '@calcom/embed-react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiUpwork } from 'react-icons/si';
import type { ContactChannel, ContactChannelId, ProjectCardData } from '@/lib/chat-tools';
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

interface ResumeLinkProps {
    id: ResumeId;
    label: string;
    url: string;
}

export function ResumeLink({ label, url }: ResumeLinkProps) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="my-2 flex items-center justify-between gap-3 px-3 py-2 border border-[#00ff99] bg-[#00ff99] text-black text-sm font-mono uppercase hover:brightness-110 transition-[filter]"
        >
            <span className="truncate">
                <span className="text-[10px] font-bold mr-2">[RESUME]</span>
                {label}
            </span>
            <Download size={14} className="shrink-0" />
        </a>
    );
}

type CalApi = Awaited<ReturnType<typeof getCalApi>>;

interface BookCallCardProps {
    title: string;
    calLink: string;
    url: string;
}

// Opens the Cal.com booking modal over the page. Until the embed script has
// loaded (or if it fails to), the link falls back to Cal.com in a new tab.
export function BookCallCard({ title, calLink, url }: BookCallCardProps) {
    const [cal, setCal] = useState<CalApi | null>(null);

    useEffect(() => {
        let cancelled = false;
        getCalApi()
            .then((api) => {
                if (!cancelled) setCal(() => api);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    const openModal = (event: MouseEvent<HTMLAnchorElement>) => {
        if (!cal) return;
        event.preventDefault();
        cal('modal', { calLink, config: { theme: 'dark' } });
    };

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={openModal}
            className="my-2 flex items-center justify-between gap-3 px-3 py-2 border border-[#00ff99] bg-[#00ff99] text-black text-sm font-mono uppercase hover:brightness-110 transition-[filter]"
        >
            <span className="truncate">
                <span className="text-[10px] font-bold mr-2">[BOOK]</span>
                {title}
            </span>
            <Calendar size={14} className="shrink-0" />
        </a>
    );
}

const CHANNEL_ICONS: Record<ContactChannelId, ReactNode> = {
    email: <FaEnvelope />,
    linkedin: <FaLinkedin />,
    github: <FaGithub />,
    upwork: <SiUpwork />,
};

export function ContactCard({ channels }: { channels: ContactChannel[] }) {
    if (channels.length === 0) return null;

    return (
        <div className="my-2 border border-[#00ff99]/50 divide-y divide-[#00ff99]/20">
            {channels.map((channel) => (
                <a
                    key={channel.id}
                    href={channel.href}
                    target={channel.id === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#00ff99]/10 transition-colors"
                >
                    <span className="text-[#00ff99] shrink-0">{CHANNEL_ICONS[channel.id]}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest w-16 shrink-0" style={glow}>
                        {channel.label}
                    </span>
                    <span className="text-xs text-[#00ff99]/80 truncate">{channel.value}</span>
                </a>
            ))}
        </div>
    );
}
