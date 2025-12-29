// "use client";
//
// import {FaGithub, FaLinkedin, FaArrowRight} from "react-icons/fa";
// import {BsTwitterX} from "react-icons/bs";
// import {useEffect} from "react";
// import {motion} from "framer-motion";
// import Image from "next/image";
//
// const HeroBackground = () => {
//     return (
//         <div className="absolute top-0 left-0 w-screen h-screen overflow-hidden opacity-20 pointer-events-none">
//             <svg
//                 viewBox="0 0 1440 800"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-full h-full"
//             >
//                 <defs>
//                     <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
//                         <stop offset="0%" stopColor="#00ff99"/>
//                         <stop offset="100%" stopColor="#006644"/>
//                     </linearGradient>
//                 </defs>
//                 <g stroke="url(#grad)" strokeWidth="1.5" fill="none">
//                     {Array.from({length: 15}).map((_, row) =>
//                         Array.from({length: 20}).map((_, col) => (
//                             <rect
//                                 key={`${row}-${col}`}
//                                 x={col * 80}
//                                 y={row * 80}
//                                 width="60"
//                                 height="60"
//                                 rx="6"
//                             />
//                         ))
//                     )}
//                 </g>
//             </svg>
//         </div>
//     );
// };
//
// export default function Hero() {
//     useEffect(() => {
//         //since some of the backends for my projects are on render a health check request is sent to spinup the apis
//         fetch('https://taaft-backend.onrender.com/health').catch(() => {
//         });
//     }, []);
//
//     const containerVariants = {
//         hidden: {opacity: 0},
//         visible: {
//             opacity: 1,
//             transition: {
//                 staggerChildren: 0.15,
//                 delayChildren: 0.2
//             }
//         }
//     };
//
//     const itemVariants = {
//         hidden: {opacity: 0, y: 20},
//         visible: {
//             opacity: 1,
//             y: 0,
//             transition: {
//                 duration: 0.8,
//                 ease: "circOut" as const
//             }
//         }
//     };
//
//     return (
//         <section
//             id="hero"
//             className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-10"
//         >
//             <HeroBackground/>
//
//             {/* Content-Centric Glow - Anchoring the text as the light source */}
//             <div
//                 className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff99]/10 blur-[150px] rounded-full pointer-events-none"/>
//
//             <div className="relative z-10 w-full px-4 md:px-12 lg:px-24">
//                 <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-24 items-center">
//                     {/* LEFT CONTENT - The Main Character */}
//                     <motion.div
//                         variants={containerVariants}
//                         initial="hidden"
//                         animate="visible"
//                         className="text-left space-y-12 relative z-20"
//                     >
//                         <motion.div variants={itemVariants} className="flex flex-col space-y-4">
//                             <div
//                                 className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff99]/10 border border-[#00ff99]/20 text-[#00ff99] text-[10px] font-mono uppercase tracking-[0.4em] w-fit">
//                                 <span className="w-1.5 h-1.5 rounded-full bg-[#00ff99] animate-pulse"/>
//                                 Available for Strategic Partnerships
//                             </div>
//                             <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black text-white leading-[0.95] tracking-tight filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
//                                 Engineering <br/>
//                                 <span
//                                     className="text-transparent bg-clip-text bg-gradient-to-br from-white via-[#00ff99] to-[#00ff99]/30">
//     Intelligent <br/> AI Systems.
//   </span>
//                             </h1>
//
//                         </motion.div>
//
//                         <motion.div variants={itemVariants} className="space-y-8 pl-1 border-l-2 border-[#00ff99]/20">
//                             <div
//                                 className="text-[#00ff99] font-mono text-sm md:text-base tracking-[0.2em] font-black uppercase">
//                                 Natnael Alemseged — AI Engineer & Full-Stack Architect
//                             </div>
//                             <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
//                                 Architecting the next generation of <span className="text-white italic">agentic intelligence</span>.
//                                 I build production-ready systems that solve high-impact problems through
//                                 <span className="text-white"> neural architectures</span> and{" "}
//                                 <span className="text-white">scalable engineering</span>.
//                             </p>
//
//                         </motion.div>
//
//                         {/* CTA GROUP - Dominant proof path */}
//                         <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
//                             <a
//                                 href="#projects"
//                                 className="group relative px-10 py-4 bg-[#00ff99] text-black rounded-xl font-black uppercase tracking-tight text-base
//                overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,255,153,0.45)]
//                hover:-translate-y-1 flex items-center gap-3"
//                             >
//                                 <span className="relative z-10">Explore the Proof</span>
//                                 <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
//                                 <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
//                             </a>
//
//                             <a
//                                 href="#contact"
//                                 className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl
//                font-black uppercase tracking-tight text-base transition-all duration-300
//                hover:bg-white/10 hover:border-[#00ff99]/40"
//                             >
//                                 Let's Connect
//                             </a>
//                         </motion.div>
//
//                     </motion.div>
//
//                     {/* RIGHT ANIMATION - The Supporting Visual */}
//                     <motion.div
//                         initial={{opacity: 0, x: 50}}
//                         animate={{opacity: 1, x: 0}}
//                         transition={{duration: 1.2, ease: "circOut", delay: 0.5}}
//                         className="relative hidden lg:flex justify-center items-center lg:-translate-y-12"
//                     >
//                         {/* Soft Ambient Glow */}
//                         <div
//                             className="absolute inset-0 bg-[#00ff99]/10 blur-[100px] rounded-full pointer-events-none"/>
//
//                         <div className="relative z-10 w-64 h-64 md:w-[24rem] md:h-[24rem]">
//                             {/* Dynamic Orbit rings */}
//                             <svg
//                                 className="absolute inset-0 w-full h-full"
//                                 viewBox="0 0 480 480"
//                                 xmlns="http://www.w3.org/2000/svg"
//                             >
//                                 <defs>
//                                     <linearGradient id="orbit-grad" x1="0" y1="0" x2="1" y2="1">
//                                         <stop offset="0%" stopColor="#00ff99"/>
//                                         <stop offset="100%" stopColor="#00ff99" stopOpacity="0"/>
//                                     </linearGradient>
//                                 </defs>
//
//                                 {/* Outer Orbit */}
//                                 <motion.g
//                                     animate={{rotate: 360}}
//                                     transition={{duration: 60, repeat: Infinity, ease: "linear"}}
//                                     style={{transformOrigin: "240px 240px"}}
//                                 >
//                                     <circle
//                                         cx="240"
//                                         cy="240"
//                                         r="220"
//                                         stroke="url(#orbit-grad)"
//                                         strokeWidth="1"
//                                         strokeDasharray="10 25"
//                                         fill="none"
//                                         className="opacity-40"
//                                     />
//                                 </motion.g>
//
//                                 {/* Inner Orbit */}
//                                 <motion.g
//                                     animate={{rotate: -360}}
//                                     transition={{duration: 40, repeat: Infinity, ease: "linear"}}
//                                     style={{transformOrigin: "240px 240px"}}
//                                 >
//                                     <circle
//                                         cx="240"
//                                         cy="240"
//                                         r="200"
//                                         stroke="url(#orbit-grad)"
//                                         strokeWidth="0.5"
//                                         strokeDasharray="5 15"
//                                         fill="none"
//                                         className="opacity-20"
//                                     />
//                                 </motion.g>
//                             </svg>
//
//                             {/* Refined Avatar Hub */}
//                             <div className="absolute inset-0 flex items-center justify-center">
//                                 <div
//                                     className="relative w-[280px] h-[280px] rounded-full overflow-hidden border border-[#00ff99]/20 bg-black/20 backdrop-blur-sm shadow-[0_0_50px_rgba(0,255,153,0.2)]">
//                                     <Image
//                                         src="/avatar_HD.png"
//                                         alt="Natnael Alemseged - Portfolio Hero"
//                                         fill
//                                         className="object-cover"
//                                         priority
//                                         sizes="280px"
//                                         quality={90}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </div>
//             </div>
//         </section>
//     );
// }

"use client";

import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

export default function Hero() {
    useEffect(() => {
        fetch("https://taaft-backend.onrender.com/health").catch(() => { });
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "circOut" as const },
        },
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden"
        >
            {/* NEW: Interactive Neural Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.15]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(#00ff99 0.5px, transparent 0.5px)`,
                        backgroundSize: '40px 40px',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {/* Ambient background glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff99]/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full px-4 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-24 items-center">

                    {/* LEFT CONTENT */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-10"
                    >
                        {/* Eyebrow */}
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff99]/10 border border-[#00ff99]/20 text-[#00ff99] text-[11px] font-mono uppercase tracking-[0.35em]"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff99] animate-pulse" />
                            AI Systems · Product Engineering
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-6xl lg:text-[4.8rem] font-black leading-[1.1] md:leading-[1.0] tracking-tight text-white mb-2"
                        >
                            AI Engineer & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-[#00ff99] to-[#00ff99]/40">
                                Full-Stack Developer
                            </span>
                        </motion.h1>

                        {/* Impact Tagline & Description block */}
                        <motion.div
                            variants={itemVariants}
                            className="space-y-6 md:space-y-7 pl-4 md:pl-6 border-l-2 border-[#00ff99]/30 relative"
                        >
                            {/* Decorative line end caps */}
                            <div className="absolute -top-1 -left-[2px] w-1 h-1 bg-[#00ff99] rounded-full" />
                            <div className="absolute -bottom-1 -left-[2px] w-1 h-1 bg-[#00ff99] rounded-full" />

                            <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                                Building <span className="text-white font-bold">agentic systems</span>, scalable backends, and high-performance mobile/web experiences. I partner with teams to transform complex ideas into <span className="text-white font-bold">production-grade solutions</span>.
                            </p>

                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Specialty</span>
                                    <span className="text-[#00ff99] font-mono text-sm font-bold">Agentic Intelligence</span>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Track Record</span>
                                    <span className="text-white font-mono text-sm font-bold uppercase">40+ Projects Shipped</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap gap-5"
                        >
                            <a
                                href="#projects"
                                className="group relative px-10 py-4 bg-[#00ff99] text-black rounded-xl font-black uppercase tracking-tight text-base
                overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,255,153,0.45)]
                hover:-translate-y-1 flex items-center gap-3"
                            >
                                <span className="relative z-10">View Selected Work</span>
                                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>

                            <a
                                href="#contact"
                                className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl
                font-black uppercase tracking-tight text-base transition-all duration-300
                hover:bg-white/10 hover:border-[#00ff99]/40"
                            >
                                Let’s Talk
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT VISUAL - Futuristic Orbital Avatar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "circOut", delay: 0.4 }}
                        className="relative hidden lg:flex justify-center items-center"
                    >
                        {/* Orbital Effects */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[420px] h-[420px] rounded-full border border-dashed border-[#00ff99]/10"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[380px] h-[380px] rounded-full border border-dotted border-[#00ff99]/5"
                        />

                        <div className="absolute inset-0 bg-[#00ff99]/5 blur-[120px] rounded-full" />

                        <div className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px]">
                            {/* Glowing Ring Border */}
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#00ff99]/40 via-transparent to-blue-500/40 blur-sm" />

                            <div className="absolute inset-0 rounded-full overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-[0_0_60px_rgba(0,255,153,0.15)] z-10">
                                <Image
                                    src="/avatar_HD.png"
                                    alt="Natnael Alemseged"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                    priority
                                />

                                {/* Scanning line effect */}
                                <motion.div
                                    animate={{ translateY: ['0%', '400%'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-0 left-0 right-0 h-1 bg-[#00ff99]/20 blur-md z-20"
                                />
                            </div>

                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
