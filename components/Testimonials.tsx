"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Testimonial = {
    id: number;
    name: string;
    role: string;
    quote: string;
    avatar: string;
    project: string;
    impact: string;
};

type ProofMetric = {
    value: string;
    label: string;
};

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Kate Rogers",
        role: "Product Designer @ ABC Corp",
        quote: "Natnael transformed our customer support tooling in record time. The experience was seamless, collaborative, and the end result exceeded expectations.",
        avatar: "/testimonials/kate.png",
        project: "Support tooling rebuild",
        impact: "faster internal handoffs",
    },
    {
        id: 2,
        name: "Samuel Bekele",
        role: "Startup Founder",
        quote: "We needed a developer who could move fast without compromising quality. Every deliverable was pixel-perfect, performant, and thoughtfully engineered.",
        avatar: "/testimonials/samuel.png",
        project: "Founder-led MVP",
        impact: "launch-ready product system",
    },
    {
        id: 3,
        name: "Marta Alvarez",
        role: "Product Lead @ TechFlow",
        quote: "From ideation to launch, Natnael owned the build and communication. The attention to detail and empathy for our users were remarkable.",
        avatar: "/testimonials/marta.png",
        project: "Product delivery sprint",
        impact: "clear release momentum",
    },
    {
        id: 4,
        name: "Lula Abebe",
        role: "AI Researcher",
        quote: "We trusted Natnael with complex AI integrations. He delivered maintainable code, clear documentation, and creative solutions to tough problems.",
        avatar: "/testimonials/lula.png",
        project: "AI workflow integration",
        impact: "maintainable agent flows",
    },
    {
        id: 5,
        name: "David Chen",
        role: "Senior Architect",
        quote: "The ability to translate complex requirements into elegant, high-performance code is Natnael's superpower. A genuine pleasure to work with.",
        avatar: "/testimonials/samuel.png",
        project: "Platform architecture",
        impact: "cleaner technical direction",
    },
    {
        id: 6,
        name: "Elena K.",
        role: "Operations Manager",
        quote: "Our workflow efficiency improved dramatically after the tools Natnael built were rolled out. Technical depth matched by sharp business intuition.",
        avatar: "/testimonials/marta.png",
        project: "Operations automation",
        impact: "leaner team workflows",
    },
];

const proofMetrics: ProofMetric[] = [
    { value: "30+", label: "projects shipped" },
    { value: "10K+", label: "users reached" },
    { value: "65%", label: "bug reduction" },
];

const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 32, filter: "blur(6px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: (dir: number) => ({ opacity: 0, x: dir * -32, filter: "blur(6px)" }),
};

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = window.setInterval(() => {
            setDirection(1);
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 7000);

        return () => window.clearInterval(interval);
    }, [isPaused]);

    const navigate = (dir: number) => {
        setDirection(dir);
        setActiveIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);
    };

    const goTo = (index: number) => {
        if (index === activeIndex) return;
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
    };

    const t = testimonials[activeIndex];

    return (
        <section
            id="testimonials"
            className="relative overflow-hidden bg-[#050505] px-5 py-16 text-white md:px-12 lg:px-16"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,153,0.08),transparent_34%),linear-gradient(180deg,transparent,rgba(0,0,0,0.7))]" />

            <div className="relative z-10 mx-auto max-w-5xl">
                <div className="mb-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.55 }}
                        className="max-w-2xl text-left"
                    >
                        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.42em] text-[#00ff99]">
                            Client Testimonials
                        </p>
                        <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                            Engineered for Outcomes<span className="text-[#00ff99]">.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="grid grid-cols-3 divide-x divide-white/[0.08] border-y border-white/[0.08] bg-black/30"
                    >
                        {proofMetrics.map((metric) => (
                            <div key={metric.label} className="px-4 py-4 md:px-6">
                                <p className="font-mono text-xl font-black text-white md:text-2xl">{metric.value}</p>
                                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                                    {metric.label}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Compact centered slider wrapper */}
                <div className="max-w-4xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.6 }}
                        className="relative min-h-[300px] md:min-h-[220px] overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0a0d0c] via-[#060706] to-black p-6 shadow-[0_20px_60px_rgba(0,0,0,0.65)] md:p-8 flex flex-col justify-between"
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff99]/40 to-transparent" />
                        
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div className="mb-6 flex items-start justify-between gap-6">
                                <div className="inline-flex items-center gap-1.5 border border-[#00ff99]/20 bg-[#00ff99]/[0.03] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#00ff99]">
                                    <Star className="h-3 w-3 fill-[#00ff99] stroke-[#00ff99]" />
                                    Client verification
                                </div>
                                <Quote className="h-8 w-8 text-[#00ff99]/10" aria-hidden />
                            </div>

                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={t.id}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex flex-1 flex-col justify-between"
                                >
                                    <blockquote className="text-lg md:text-xl font-semibold leading-relaxed text-gray-100 italic">
                                        "{t.quote}"
                                    </blockquote>

                                    <div className="mt-8 pt-5 border-t border-white/[0.05]">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/[0.1] bg-white/[0.03]">
                                                    <Image
                                                        src={t.avatar}
                                                        alt={t.name}
                                                        width={40}
                                                        height={40}
                                                        className="h-full w-full object-cover"
                                                        priority={activeIndex === 0}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold text-white leading-tight">{t.name}</p>
                                                    <p className="truncate text-xs text-gray-500">{t.role}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 sm:gap-8 text-left sm:text-right">
                                                <div>
                                                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gray-600">
                                                        Project
                                                    </p>
                                                    <p className="mt-0.5 text-xs font-semibold text-gray-300">{t.project}</p>
                                                </div>
                                                <div>
                                                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gray-600">
                                                        Impact
                                                    </p>
                                                    <p className="mt-0.5 text-xs font-semibold text-[#00ff99]">{t.impact}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Navigation bar below card */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-black/40 p-3.5">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                type="button"
                                aria-label="Previous testimonial"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-gray-400 transition-all duration-200 hover:border-[#00ff99]/30 hover:bg-[#00ff99]/[0.03] hover:text-[#00ff99] focus:outline-none"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            <div className="flex items-center gap-1.5">
                                {testimonials.map((item, i) => (
                                    <button
                                        key={item.id}
                                        onClick={() => goTo(i)}
                                        type="button"
                                        aria-label={`Go to testimonial ${i + 1}`}
                                        className={`h-1 rounded-full transition-all duration-300 ${
                                            i === activeIndex ? "w-6 bg-[#00ff99]" : "w-2 bg-white/20 hover:bg-white/40"
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => navigate(1)}
                                type="button"
                                aria-label="Next testimonial"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-gray-400 transition-all duration-200 hover:border-[#00ff99]/30 hover:bg-[#00ff99]/[0.03] hover:text-[#00ff99] focus:outline-none"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        <Link
                            href="#contact"
                            className="group flex items-center gap-2 rounded-lg border border-[#00ff99]/20 bg-[#00ff99]/[0.02] px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:border-[#00ff99]/40 hover:bg-[#00ff99] hover:text-black"
                        >
                            <span>Initiate AI Protocol with Natnael</span>
                            <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
