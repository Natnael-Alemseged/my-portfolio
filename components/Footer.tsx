"use client";

import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import Link from "next/link";

const socials = [
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/natnael-alemseged",
        icon: <FaLinkedin />
    },
    {
        label: "GitHub",
        href: "https://github.com/natnael-alemseged",
        icon: <FaGithub />
    },
    {
        label: "X",
        href: "https://x.com/notaznation",
        icon: <FaX />
    },
    {
        label: "Email",
        href: "mailto:natiaabaydam@gmail.com",
        icon: <FaEnvelope />
    },
];

export default function Footer() {
    return (
        <footer className="relative bg-[#020202] text-white border-t border-white/5 overflow-hidden">
            {/* Background Texture: Neural Grid */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#00ff99 0.5px, transparent 0.5px)`,
                    backgroundSize: '32px 32px',
                }}
            />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff99]/20 to-transparent" />

            <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
                <div className="flex flex-col items-center gap-8">
                    {/* Social Links */}
                    <div className="flex gap-4">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#00ff99] hover:border-[#00ff99]/30 hover:bg-[#00ff99]/5 transition-all duration-500 group"
                                title={social.label}
                            >
                                <span className="text-sm group-hover:scale-110 transition-transform duration-300">{social.icon}</span>
                            </a>
                        ))}
                    </div>

                    {/* Navigation & Archive */}
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href="/projects"
                            className="text-gray-400 hover:text-[#00ff99] text-xs font-semibold uppercase tracking-widest transition-colors"
                        >
                            Full Project Archive —&gt;
                        </Link>
                    </div>

                    {/* Copyright & Stack */}
                    <div className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gray-500 text-center leading-relaxed font-medium">
                        © {new Date().getFullYear()} Natnael Alemseged — Engineered with Next.js, Qdrant & My Creativity
                    </div>
                </div>
            </div>
        </footer>
    );
}