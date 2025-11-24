"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, ChevronDown, Terminal } from "lucide-react";
import { useState } from "react";

interface Experience {
    id: number;
    title: string;
    company: string;
    period: string;
    description: string;
}

const experiences: Experience[] = [
    {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'HireArmada – Remote',
        period: 'Aug 2025 – Present',
        description: `- Shipped AI-driven backends and full-stack features using Node.js, FastAPI, Flutter, Next.js, Prisma, Composio, MCP, and Langflow.
- Built social discovery backend supporting 10K+ DAU with 99.9% uptime, real-time matching, and messaging.
- Created affirmation mobile app with Gemini AI chat, widgets, personalized feeds; boosted retention 35%.
- Automated PM bonus system (goal tracking, approvals, payouts) reducing processing time 50%.
- Built agentic workspace w/ Socket.io, Composio email AI, Supermemory + Langflow search ending data silos.
- Prototyped "Steve Jobs" AI persona using MCP, vector DB, and prompt flows for inspirational coaching.`,
    },
    {
        id: 2,
        title: 'Senior Full-Stack Developer',
        company: 'Startup Agile – Atlanta, GA',
        period: 'Jan 2025 – Present',
        description: `- Led React/Next.js web + React Native (Expo) mobile delivery; hit milestones 15% ahead of schedule.
- Built OTA-enabled RN apps w/ deep linking, Firebase push, Google Maps, analytics, and AI assistants; cut load 35%.
- Optimized Next.js SSR/SEO (App Router) and mobile bundles; +50% web traffic and +30% Core Web Vitals.
- Standardized TypeScript, tRPC, Prisma, Playwright + Detox testing; reduced production bugs 65%.`,
    },
    {
        id: 3,
        title: 'Software Engineer',
        company: 'DataCore Softwares – Fort Lauderdale, FL',
        period: 'Jan 2025 – Jul 2025',
        description: `- Built AI-powered storage services w/ Python, FastAPI, Docker, self-hosted LLMs for detection, transcription, translation.
- Delivered <200ms inference and 99.9% uptime via AWS EKS, TensorRT optimizations, and containerized deployments.
- Fine-tuned LLaMA 3, Mistral 7B, etc., cutting GPU costs 12%; shipped end-to-end ML pipelines with similarity search.
- Automated CI/CD using GitHub Actions, Terraform, Prometheus/Grafana; rollout failures down 60%.`,
    },
    {
        id: 4,
        title: 'Senior Mobile Developer',
        company: 'Qemer Software Technologies – Addis Ababa',
        period: 'Jan 2024 – Jun 2025',
        description: `- Led delivery of 10+ cross-platform Flutter/Ionic apps; execution velocity improved 40%.
- Optimized app performance (load times -50%) and instituted mentoring program reducing onboarding 30%.
- Oversaw UI/UX, QA, and release flows for high-availability mobile deployments.`,
    },
    {
        id: 5,
        title: 'Senior Full-Stack Developer & Founder',
        company: 'Metshafe – Addis Ababa',
        period: 'Jun 2022 – Present',
        description: `- Co-founded Metshafe eBook platform, leading product strategy, architecture, and launch.
- Built Flutter apps, Firebase backend, Node.js services, and Kotlin plugins powering payments + DRM.
- Drove roadmap, analytics, and engagement initiatives for growing reader community.`,
    },
    {
        id: 6,
        title: 'Software Engineer',
        company: 'Freelance & Consulting',
        period: 'Jul 2022 – Mar 2023',
        description: `- Delivered bespoke full-stack solutions with React, Next.js, FastAPI, and PostgreSQL for startups.
- Focused on performant UX, API integration, and project ownership from scoping to release.`,
    },
];

export default function WorkExperience() {
    const [activeId, setActiveId] = useState<number | null>(null);

    const toggleExperience = (id: number) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <section id="workExperience" className="relative py-20 px-6 md:px-12 bg-[#0d0d0d]">
            {/* CRT Scanlines Overlay */}
            <div className="terminal-scanlines absolute inset-0 opacity-20 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Header - Terminal Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Terminal className="text-[#00ff99]" size={32} />
                        <h2 className="text-3xl md:text-4xl font-mono font-bold text-[#00ff99] terminal-glow uppercase tracking-wider">
                            &gt;&gt; WORK_EXPERIENCE.LOG
                        </h2>
                    </div>
                    <div className="h-0.5 bg-[#00ff99] mb-4 terminal-glow"></div>
                    <p className="text-gray-400 font-mono text-sm uppercase tracking-wide">
                        [SYSTEM] Loading professional timeline...
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#00ff99] via-[#00ff99]/50 to-transparent terminal-glow"></div>

                    {/* Experience Cards */}
                    <div className="space-y-8">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row gap-8 items-stretch ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Timeline Dot - Terminal Style */}
                                <motion.div
                                    className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#00ff99] rounded-full border-2 border-[#0d0d0d] shadow-[0_0_10px_#00ff99] z-10"
                                    whileHover={{ scale: 1.5, boxShadow: "0 0 20px #00ff99" }}
                                    transition={{ duration: 0.3 }}
                                ></motion.div>

                                {/* Spacer for alternating layout */}
                                <div className="hidden md:block w-1/2"></div>

                                {/* Card - Terminal Style */}
                                <motion.div
                                    className="w-full md:w-1/2"
                                >
                                    <button
                                        onClick={() => toggleExperience(exp.id)}
                                        className={`w-full text-left bg-black/90 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 relative overflow-hidden ${activeId === exp.id
                                                ? "border-[#00ff99] shadow-[0_0_15px_rgba(0,255,153,0.3)]"
                                                : "border-[#00ff99]/30 hover:border-[#00ff99]"
                                            }`}
                                    >
                                        {/* Scanlines on hover */}
                                        <div className={`terminal-scanlines absolute inset-0 opacity-0 hover:opacity-20 transition-opacity pointer-events-none`}></div>

                                        <div className="flex items-start justify-between gap-4 relative z-10">
                                            <div className="flex-1">
                                                <div className="text-[10px] font-mono text-[#00ff99]/60 uppercase tracking-widest mb-2">
                                                    [ROLE]
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-mono font-bold text-[#00ff99] mb-2">
                                                    {exp.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-[#00ff99]/80 font-mono font-semibold mb-2">
                                                    <Briefcase size={14} />
                                                    <span className="text-xs md:text-sm">[COMPANY] {exp.company}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                                                    <Calendar size={12} />
                                                    <span>[PERIOD] {exp.period}</span>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: activeId === exp.id ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-[#00ff99] flex-shrink-0"
                                            >
                                                <ChevronDown size={24} />
                                            </motion.div>
                                        </div>
                                    </button>

                                    {/* Expandable Description */}
                                    <AnimatePresence>
                                        {activeId === exp.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-4 p-6 bg-black/90 border-2 border-[#00ff99]/30 relative">
                                                    <div className="terminal-scanlines absolute inset-0 opacity-10 pointer-events-none"></div>
                                                    <div className="text-xs font-mono text-[#00ff99]/60 uppercase tracking-widest mb-3">
                                                        [ACHIEVEMENTS]
                                                    </div>
                                                    <div className="text-gray-300 font-mono text-sm whitespace-pre-line leading-relaxed relative z-10">
                                                        {exp.description}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Call to Action - Terminal Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <p className="text-gray-400 font-mono text-sm mb-6 uppercase tracking-wide">
                        [SYSTEM] Ready to collaborate on ambitious projects
                    </p>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-[#00ff99] text-black font-mono font-bold uppercase tracking-wider hover:bg-white transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,153,0.5)] border-2 border-[#00ff99]"
                    >
                        &gt; INITIATE_CONTACT
                    </a>
                </motion.div>
            </div>
        </section>
    );
}