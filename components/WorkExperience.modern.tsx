"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, ChevronDown } from "lucide-react";
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
        <section id="workExperience" className="py-20 px-6 md:px-12 bg-[#0d0d0d]">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Work Experience
                    </h2>
                    <div className="w-20 h-1 bg-[#00ff99] mx-auto rounded-full"></div>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        My professional journey building innovative solutions and delivering exceptional results
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#00ff99] via-gray-700 to-transparent"></div>

                    {/* Experience Cards */}
                    <div className="space-y-8">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row gap-8 items-stretch ${
                                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                                }`}
                            >
                                {/* Timeline Dot */}
                                <motion.div 
                                    className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#00ff99] rounded-full border-4 border-[#0d0d0d] shadow-lg z-10"
                                    whileHover={{ scale: 1.5 }}
                                    transition={{ duration: 0.3 }}
                                ></motion.div>

                                {/* Spacer for alternating layout */}
                                <div className="hidden md:block w-1/2"></div>

                                {/* Card */}
                                <motion.div
                                    className="w-full md:w-1/2"
                                >
                                    <button
                                        onClick={() => toggleExperience(exp.id)}
                                        className={`w-full text-left bg-[#1a1a1a] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 ${
                                            activeId === exp.id 
                                                ? "border-[#00ff99]" 
                                                : "border-gray-700 hover:border-[#00ff99]"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                                    {exp.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-[#00ff99] font-semibold mb-2">
                                                    <Briefcase size={16} />
                                                    <span className="text-sm md:text-base">{exp.company}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <Calendar size={14} />
                                                    <span>{exp.period}</span>
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
                                                <div className="mt-4 p-6 bg-[#1a1a1a] rounded-2xl border border-gray-800">
                                                    <div className="text-gray-300 whitespace-pre-line leading-relaxed">
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

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <p className="text-gray-400 mb-6">
                        Let’s collaborate on the next ambitious mobile, AI, or web product.
                    </p>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-[#00ff99] text-[#0d0d0d] rounded-full hover:bg-white transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                        Book a call
                    </a>
                </motion.div>
            </div>
        </section>
    );
}