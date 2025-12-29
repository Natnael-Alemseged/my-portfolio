// "use client";
//
// import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp } from "react-icons/fa";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
//
// const navLinks = [
//     { label: "About", href: "#about" },
//     { label: "Technologies", href: "#technologies" },
//     { label: "Projects", href: "#projects" },
//     { label: "Work", href: "#workExperience" },
//     { label: "Testimonials", href: "#testimonials" },
//     { label: "Contact", href: "#contact" },
// ];
//
// const socials = [
//     {
//         label: "LinkedIn",
//         href: "https://www.linkedin.com/in/natnael-alemseged",
//         icon: <FaLinkedin />
//     },
//     {
//         label: "GitHub",
//         href: "https://github.com/natnael-alemseged",
//         icon: <FaGithub />
//     },
//     {
//         label: "Email",
//         href: "mailto:natiaabaydam@gmail.com",
//         icon: <FaEnvelope />
//     },
// ];
//
// export default function Footer() {
//     const [time, setTime] = useState("");
//
//     useEffect(() => {
//         const updateTime = () => {
//             setTime(new Date().toLocaleTimeString('en-US', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true,
//                 timeZone: 'Africa/Addis_Ababa'
//             }));
//         };
//         updateTime();
//         const interval = setInterval(updateTime, 10000);
//         return () => clearInterval(interval);
//     }, []);
//
//     const scrollToTop = () => {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };
//
//     return (
//         <footer className="relative bg-[#020202] pt-20 pb-10 overflow-hidden border-t border-white/5">
//             {/* BACKGROUND EXPERIMENT: Neural Dot Grid */}
//             <div className="absolute inset-0 z-0">
//                 <div
//                     className="absolute inset-0 opacity-[0.15]"
//                     style={{
//                         backgroundImage: `radial-gradient(#00ff99 0.5px, transparent 0.5px)`,
//                         backgroundSize: '24px 24px',
//                     }}
//                 />
//                 {/* Radial mask to fade out the grid at the edges */}
//                 <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202]" />
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-[#020202]" />
//
//                 {/* Animated Ambient Glow */}
//                 <motion.div
//                     animate={{
//                         scale: [1, 1.2, 1],
//                         opacity: [0.05, 0.1, 0.05]
//                     }}
//                     transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//                     className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#00ff99] blur-[120px] rounded-full pointer-events-none"
//                 />
//             </div>
//
//             <div className="max-w-7xl mx-auto px-6 relative z-10">
//                 {/* Main Footer Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
//
//                     {/* Brand Meta - 5 cols */}
//                     <div className="lg:col-span-5 space-y-8">
//                         <div className="space-y-4">
//                             <div className="text-white font-black text-2xl tracking-tighter flex items-center gap-2">
//                                 NATNAEL ALEMSEGED<span className="text-[#00ff99]">.</span>
//                             </div>
//                             <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
//                                 Architecting the next generation of intelligent systems. Specialized in agentic workflows, scalable backends, and neural-inspired digital products.
//                             </p>
//                         </div>
//
//                         {/* Compact Socials */}
//                         <div className="flex gap-4">
//                             {socials.map((social) => (
//                                 <a
//                                     key={social.label}
//                                     href={social.href}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#00ff99] hover:border-[#00ff99]/40 hover:bg-[#00ff99]/5 transition-all duration-300"
//                                     title={social.label}
//                                 >
//                                     <span className="text-lg">{social.icon}</span>
//                                 </a>
//                             ))}
//                         </div>
//                     </div>
//
//                     {/* Navigation Links - 4 cols */}
//                     <div className="lg:col-span-4 grid grid-cols-2 gap-8">
//                         <div className="space-y-6">
//                             <h4 className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Index</h4>
//                             <ul className="space-y-3">
//                                 {navLinks.slice(0, 3).map((link) => (
//                                     <li key={link.label}>
//                                         <a href={link.href} className="text-gray-400 hover:text-[#00ff99] transition-colors text-xs font-medium uppercase tracking-wider">
//                                             {link.label}
//                                         </a>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                         <div className="space-y-6">
//                             <h4 className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Section</h4>
//                             <ul className="space-y-3">
//                                 {navLinks.slice(3).map((link) => (
//                                     <li key={link.label}>
//                                         <a href={link.href} className="text-gray-400 hover:text-[#00ff99] transition-colors text-xs font-medium uppercase tracking-wider">
//                                             {link.label}
//                                         </a>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>
//
//                     {/* Status/Clock - 3 cols */}
//                     <div className="lg:col-span-3">
//                         <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md relative group">
//                             <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#00ff99]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//
//                             <div className="space-y-4">
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Local_Time</span>
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-1.5 h-1.5 rounded-full bg-[#00ff99] animate-pulse" />
//                                         <span className="text-[#00ff99] font-mono text-xs font-bold tracking-tighter">{time || "00:00 --"}</span>
//                                     </div>
//                                 </div>
//
//                                 <div className="h-px bg-white/5 w-full" />
//
//                                 <div className="space-y-1">
//                                     <div className="flex justify-between items-center text-[10px] font-mono">
//                                         <span className="text-gray-500">ORIGIN</span>
//                                         <span className="text-gray-300">ADDIS ABABA, ET</span>
//                                     </div>
//                                     <div className="flex justify-between items-center text-[10px] font-mono">
//                                         <span className="text-gray-500">STATUS</span>
//                                         <span className="text-white">OPERATIONAL</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Footer Bottom */}
//                 <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
//                     <div className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">
//                         © {new Date().getFullYear()} — Built with Intention
//                     </div>
//
//                     <button
//                         onClick={scrollToTop}
//                         className="group flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 hover:border-[#00ff99]/20 hover:bg-[#00ff99]/5 transition-all duration-500"
//                     >
//                         <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#00ff99]">Back to Surface</span>
//                         <FaArrowUp className="text-[10px] text-gray-400 group-hover:text-[#00ff99] group-hover:-translate-y-1 transition-all" />
//                     </button>
//                 </div>
//             </div>
//
//             {/* Scanline overlay for texture */}
//             <div className="absolute inset-0 pointer-events-none opacity-[0.03] terminal-scanlines" />
//         </footer>
//     );
// }

"use client";

import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

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

                    {/* Copyright & Stack */}
                    <div className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gray-500 text-center leading-relaxed font-medium">
                        © {new Date().getFullYear()} Natnael Alemseged — Engineered with Next.js, Qdrant & My Creativity
                    </div>
                </div>
            </div>
        </footer>
    );
}