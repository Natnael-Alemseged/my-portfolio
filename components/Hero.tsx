"use client";

import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay },
    },
});

export default function Hero() {
    useEffect(() => {
        fetch("https://taaft-backend.onrender.com/health").catch(() => {});
    }, []);

    return (
        <section id="hero" className="relative min-h-screen flex items-center bg-black overflow-hidden">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00ff99]/[0.05] blur-[140px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-24">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

                    {/* Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                        }}
                        className="flex-1 space-y-8 max-w-xl"
                    >
                        <motion.div variants={fadeUp(0)}>
                            <span className="inline-flex items-center gap-2 text-[11px] font-mono text-[#00ff99] uppercase tracking-[0.4em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff99] animate-pulse" />
                                Available for new projects
                            </span>
                        </motion.div>

                        <motion.div variants={fadeUp(0.05)}>
                            <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tight leading-[0.95]">
                                <span className="text-white">Building</span>{" "}
                                <span className="text-[#00ff99]">AI-native</span>
                                <br />
                                <span className="text-white">software that</span>
                                <br />
                                <span className="text-white">ships.</span>
                            </h1>
                        </motion.div>

                        <motion.div variants={fadeUp(0.1)} className="space-y-1.5">
                            <p className="text-sm font-semibold text-gray-300">Natnael Alemseged</p>
                            <p className="text-gray-400 text-[15px] leading-relaxed">
                                AI engineer and full-stack developer. I build agentic systems, scalable
                                backends, and polished mobile and web experiences—end to end.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeUp(0.15)} className="flex items-center gap-3">
                            <a
                                href="#projects"
                                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-[#00ff99] text-black rounded-lg font-bold text-sm hover:bg-[#00e87f] transition-colors duration-150"
                            >
                                View Work
                                <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform duration-150" />
                            </a>
                            <a
                                href="#contact"
                                className="inline-flex items-center px-6 py-3 border border-white/[0.15] text-white rounded-lg font-semibold text-sm hover:border-white/30 hover:bg-white/[0.04] transition-all duration-150"
                            >
                                Get in Touch
                            </a>
                        </motion.div>

                        <motion.div variants={fadeUp(0.2)} className="flex items-stretch pt-2">
                            {[
                                { value: "30+", label: "Projects shipped" },
                                { value: "10K+", label: "Users reached" },
                                { value: "5yr+", label: "Experience" },
                            ].map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className={`flex-1 ${i > 0 ? "border-l border-white/[0.08] pl-6" : "pr-6"}`}
                                >
                                    <p className="text-2xl font-black text-white">{stat.value}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Avatar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                        className="hidden lg:block shrink-0"
                    >
                        <div className="relative w-[300px] h-[380px]">
                            <div className="absolute -inset-4 bg-[#00ff99]/[0.06] blur-[50px] rounded-3xl" />
                            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.10]">
                                <Image
                                    src="/avatar_HD.png"
                                    alt="Natnael Alemseged"
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="300px"
                                    quality={90}
                                />
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
