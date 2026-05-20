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
            className="relative overflow-hidden bg-[#050505] px-5 pt-16 pb-10 text-white md:px-12 lg:px-16"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,153,0.08),transparent_34%),linear-gradient(180deg,transparent,rgba(0,0,0,0.7))]" />

            <div className="relative z-10 mx-auto max-w-5xl">
                {/* Title Section */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.55 }}
                        className="max-w-2xl mx-auto text-center"
                    >
                        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.42em] text-[#00ff99]">
                            Client Testimonials
                        </p>
                        <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                            Engineered for Outcomes<span className="text-[#00ff99]">.</span>
                        </h2>
                    </motion.div>
                </div>

                {/* Two-column layout: Testimonial on left (75%), Stats & CTA on right (25%) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
                    {/* Left Column: Testimonial Card + Slider Controls */}
                    <div className="lg:col-span-3 flex flex-col justify-between space-y-4 h-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.6 }}
                            className="relative min-h-[300px] md:min-h-[220px] overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0a0d0c] via-[#060706] to-black p-6 shadow-[0_20px_60px_rgba(0,0,0,0.65)] md:p-8 flex flex-col justify-between flex-grow"
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff99]/40 to-transparent" />
                            
                            <div className="relative z-10 flex h-full flex-col justify-between flex-grow">
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

                                        <div className="mt-6 pt-4 border-t border-white/[0.05]">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/[0.1] bg-white/[0.03]">
                                                        <Image
                                                            src={t.avatar}
                                                            alt={t.name}
                                                            width={44}
                                                            height={44}
                                                            className="h-full w-full object-cover"
                                                            priority={activeIndex === 0}
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-base font-bold text-white leading-tight">{t.name}</p>
                                                        <p className="truncate text-xs text-gray-400">{t.role}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 sm:gap-8 text-left sm:text-right">
                                                    <div>
                                                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500">
                                                            Project
                                                        </p>
                                                        <p className="mt-0.5 text-sm font-semibold text-gray-300">{t.project}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500">
                                                            Impact
                                                        </p>
                                                        <p className="mt-0.5 text-sm font-semibold text-[#00ff99]">{t.impact}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Centered navigation dots and arrow buttons directly under the card */}
                        <div className="flex items-center justify-center gap-4 py-1">
                            <button
                                onClick={() => navigate(-1)}
                                type="button"
                                aria-label="Previous testimonial"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] text-gray-400 bg-black/40 transition-all duration-200 hover:border-[#00ff99]/30 hover:bg-[#00ff99]/[0.03] hover:text-[#00ff99] focus:outline-none"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded-full border border-white/[0.05]">
                                {testimonials.map((item, i) => (
                                    <button
                                        key={item.id}
                                        onClick={() => goTo(i)}
                                        type="button"
                                        aria-label={`Go to testimonial ${i + 1}`}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            i === activeIndex ? "w-6 bg-[#00ff99]" : "w-2 bg-white/20 hover:bg-white/40"
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => navigate(1)}
                                type="button"
                                aria-label="Next testimonial"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] text-gray-400 bg-black/40 transition-all duration-200 hover:border-[#00ff99]/30 hover:bg-[#00ff99]/[0.03] hover:text-[#00ff99] focus:outline-none"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Stats & "Initiate AI Protocol" CTA */}
                    <div className="lg:col-span-1 flex flex-col justify-between space-y-4 h-full">
                        {/* Stats block styled like the card - highly compact and space-efficient */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0a0d0c] via-[#060706] to-black p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.65)] flex flex-col divide-y divide-white/[0.06] flex-grow justify-center"
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff99]/40 to-transparent" />
                            {proofMetrics.map((metric, i) => (
                                <div key={metric.label} className={`py-2.5 ${i === 0 ? "pt-0" : ""} ${i === proofMetrics.length - 1 ? "pb-0" : ""}`}>
                                    <p className="font-mono text-xl md:text-[22px] font-black text-[#00ff99] leading-tight">{metric.value}</p>
                                    <p className="mt-0.5 text-[7.5px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                        {metric.label}
                                    </p>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA button positioned at the bottom of the right column */}
                        <Link
                            href="#contact"
                            className="group flex w-full min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-[#00ff99]/30 bg-[#00ff99]/[0.03] px-3 py-2.5 text-[10px] md:text-[11px] font-bold text-white transition-all duration-300 hover:border-[#00ff99] hover:bg-[#00ff99] hover:text-black shadow-[0_0_15px_rgba(0,255,153,0.05)] hover:shadow-[0_0_25px_rgba(0,255,153,0.25)] text-center"
                        >
                            <span>Initiate AI Protocol</span>
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
