"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Experience {
    id: number;
    title: string;
    company: string;
    period: string;
    highlights: string[];
}

const experiences: Experience[] = [
    {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'HireArmada – Remote',
        period: 'Aug 2025 – Present',
        highlights: [
            "Shipped AI-driven backends and full-stack features using Node.js, FastAPI, Flutter, Next.js, Prisma, Composio, MCP, and Langflow.",
            "Built social discovery backend supporting 10K+ DAU with 99.9% uptime, real-time matching, and messaging.",
            "Created affirmation mobile app with Gemini AI chat, widgets, personalized feeds; boosted retention 35%.",
            "Automated PM bonus system (goal tracking, approvals, payouts) reducing processing time 50%.",
            "Built agentic workspace w/ Socket.io, Composio email AI, Supermemory + Langflow search ending data silos.",
            "Prototyped \"Steve Jobs\" AI persona using MCP, vector DB, and prompt flows for inspirational coaching."
        ],
    },
    {
        id: 2,
        title: 'Senior Full-Stack Developer',
        company: 'Startup Agile – Atlanta, GA',
        period: 'Jan 2025 – Present',
        highlights: [
            "Led React/Next.js web + React Native (Expo) mobile delivery; hit milestones 15% ahead of schedule.",
            "Built OTA-enabled RN apps w/ deep linking, Firebase push, Google Maps, analytics, and AI assistants; cut load 35%.",
            "Optimized Next.js SSR/SEO (App Router) and mobile bundles; +50% web traffic and +30% Core Web Vitals.",
            "Standardized TypeScript, tRPC, Prisma, Playwright + Detox testing; reduced production bugs 65%."
        ],
    },
    {
        id: 3,
        title: 'AI Engineer',
        company: 'DataCore Softwares – Fort Lauderdale, FL',
        period: 'Jan 2025 – Jul 2025',
        highlights: [
            "Built AI-powered storage services w/ Python, FastAPI, Docker, self-hosted LLMs for detection, transcription, translation.",
            "Delivered <200ms inference and 99.9% uptime via AWS EKS, TensorRT optimizations, and containerized deployments.",
            "Fine-tuned LLaMA 3, Mistral 7B, etc., cutting GPU costs 12%; shipped end-to-end ML pipelines with similarity search.",
            "Automated CI/CD using GitHub Actions, Terraform, Prometheus/Grafana; rollout failures down 60%."
        ],
    },
    {
        id: 4,
        title: 'Senior Mobile Developer',
        company: 'Qemer Software Technologies – Addis Ababa',
        period: 'Jan 2024 – Jun 2025',
        highlights: [
            "Led delivery of 10+ cross-platform Flutter/Ionic apps; execution velocity improved 40%.",
            "Optimized app performance (load times -50%) and instituted mentoring program reducing onboarding 30%.",
            "Oversaw UI/UX, QA, and release flows for high-availability mobile deployments."
        ],
    },
    {
        id: 5,
        title: 'Full-Stack Developer & Founder',
        company: 'Metshafe – Addis Ababa',
        period: 'Jun 2022 – Present',
        highlights: [
            "Co-founded Metshafe eBook platform, leading product strategy, architecture, and launch.",
            "Built Flutter apps, Firebase backend, Node.js services, and Kotlin plugins powering payments + DRM.",
            "Drove roadmap, analytics, and engagement initiatives for growing reader community."
        ],
    },
    {
        id: 6,
        title: 'Software Engineer',
        company: 'Freelance & Consulting',
        period: 'Jul 2022 – Mar 2023',
        highlights: [
            "Delivered bespoke full-stack solutions with React, Next.js, FastAPI, and PostgreSQL for startups.",
            "Focused on performant UX, API integration, and project ownership from scoping to release."
        ],
    },
];

const NetworkBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let points: Array<{ x: number, y: number, vx: number, vy: number }> = [];
        const pointCount = 60;
        const connectionDistance = 150;

        const resize = () => {
            canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
            initPoints();
        };

        const initPoints = () => {
            points = [];
            for (let i = 0; i < pointCount; i++) {
                points.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            points.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Draw point
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 153, 0.4)';
                ctx.fill();

                // Draw connections
                for (let j = i + 1; j < points.length; j++) {
                    const p2 = points[j];
                    const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 255, 153, ${0.1 * (1 - dist / connectionDistance)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener('resize', resize);
        const animationHandle = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationHandle);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ opacity: 0.35 }}
        />
    );
};

export default function WorkExperience() {
    const [activeId, setActiveId] = useState<number | null>(null);

    const toggleExperience = (id: number) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <section id="workExperience" className="relative py-20 px-6 md:px-12 bg-black overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0d0d0d] to-black" />
                <NetworkBackground />
                {/* Visual glow spots */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff99]/5 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ff99]/5 blur-[120px] rounded-full opacity-50" />
            </div>

            <div className="relative max-w-6xl mx-auto z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <p className="text-xs uppercase tracking-[0.5em] text-[#00ff99] mb-4">
                        Career Path
                    </p>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Experience<span className="text-[#00ff99]">.</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#00ff99] to-transparent mx-auto rounded-full"></div>
                    <p className="text-gray-400 mt-8 max-w-2xl mx-auto text-lg">
                        Building the future of AI and mobile through years of dedicated engineering and product vision.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line with Pulse Effect */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800 to-transparent" />
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff99]/50 to-transparent"
                            animate={{
                                opacity: [0.1, 0.5, 0.1],
                                height: ["0%", "100%", "0%"]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </div>

                    {/* Experience Cards */}
                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row gap-12 items-start ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Timeline Dot with Outer Glow */}
                                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 top-8 z-20">
                                    <motion.div
                                        className="w-4 h-4 bg-black border-2 border-[#00ff99] rounded-full shadow-[0_0_15px_rgba(0,255,153,0.5)]"
                                        whileInView={{ scale: [0.8, 1.2, 1] }}
                                        viewport={{ once: true }}
                                    />
                                    <div className="absolute inset-0 w-4 h-4 bg-[#00ff99] blur-[8px] opacity-30 animate-pulse" />
                                </div>

                                <div className="hidden md:block w-1/2"></div>

                                {/* Card */}
                                <motion.div className="w-full md:w-1/2">
                                    <div className="group relative">
                                        {/* Hover border glow */}
                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00ff99]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />

                                        <button
                                            onClick={() => toggleExperience(exp.id)}
                                            className={`relative w-full text-left transition-all duration-300 p-8 border border-white/10 rounded-2xl backdrop-blur-md ${activeId === exp.id
                                                ? "bg-[#0a0a0a] ring-1 ring-[#00ff99]/30 shadow-[0_0_40px_rgba(0,255,153,0.05)]"
                                                : "bg-white/5 hover:bg-white/10"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="flex-1">
                                                    <span className="text-[#00ff99]/80 text-xs font-mono tracking-widest mb-3 block">
                                                        {exp.period}
                                                    </span>
                                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 transition-colors">
                                                        {exp.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-gray-400 font-medium">
                                                        <Briefcase size={16} className="text-[#00ff99]/40" />
                                                        <span className="text-sm uppercase tracking-[0.2em]">{exp.company}</span>
                                                    </div>
                                                </div>
                                                <motion.div
                                                    animate={{ rotate: activeId === exp.id ? 180 : 0 }}
                                                    transition={{ duration: 0.4, ease: "circOut" }}
                                                    className={`mt-2 p-2 rounded-full ${activeId === exp.id ? "bg-[#00ff99] text-black" : "text-[#00ff99] bg-white/5 hover:bg-[#00ff99]/20"}`}
                                                >
                                                    <ChevronDown size={20} />
                                                </motion.div>
                                            </div>

                                            {/* Expandable Description */}
                                            <AnimatePresence>
                                                {activeId === exp.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.5, ease: "circOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pt-8 border-t border-white/5 mt-8">
                                                            <ul className="space-y-4">
                                                                {exp.highlights.map((point, idx) => (
                                                                    <motion.li
                                                                        key={idx}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: idx * 0.05 }}
                                                                        className="flex gap-4 text-gray-300"
                                                                    >
                                                                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00ff99]/60" />
                                                                        <span className="text-sm md:text-base leading-relaxed">
                                                                            {point}
                                                                        </span>
                                                                    </motion.li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-24 text-center p-12 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff99]/10 blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00ff99]/5 blur-[100px] -ml-32 -mb-32" />

                    <h3 className="text-3xl font-bold text-white mb-4 relative z-10">Ready to build something legendary?</h3>
                    <p className="text-gray-400 mb-10 text-lg relative z-10">
                        I'm currently open to senior roles and strategic partnerships.
                    </p>
                    <a
                        href="#contact"
                        className="relative z-10 inline-flex items-center gap-3 px-10 py-4 bg-[#00ff99] text-black rounded-xl hover:bg-white transition-all duration-500 font-black uppercase tracking-tighter shadow-[0_0_30px_rgba(0,255,153,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:-translate-y-1"
                    >
                        Initiate Collaboration
                    </a>
                </motion.div>
            </div>
        </section>
    );
}