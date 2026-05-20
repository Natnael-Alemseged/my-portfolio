"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Quote, Sparkles } from "lucide-react";
import { useState } from "react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  project: string;
  impact: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Kate Rogers",
    role: "Product Designer @ ABC Corp",
    quote: "Natnael transformed our customer support tooling in record time. The experience was seamless, collaborative, and the end result exceeded expectations.",
    avatar: "/testimonials/kate.png",
    project: "Support tooling rebuild",
    impact: "Faster handoffs",
  },
  {
    id: 2,
    name: "Samuel Bekele",
    role: "Startup Founder",
    quote: "We needed a developer who could move fast without compromising quality. Every deliverable was pixel-perfect, performant, and thoughtfully engineered.",
    avatar: "/testimonials/samuel.png",
    project: "Founder-led MVP",
    impact: "Launch-ready build",
  },
  {
    id: 3,
    name: "Marta Alvarez",
    role: "Product Lead @ TechFlow",
    quote: "From ideation to launch, Natnael owned the build and communication. The attention to detail and empathy for our users were remarkable.",
    avatar: "/testimonials/marta.png",
    project: "Product delivery sprint",
    impact: "Clearer user journey",
  },
  {
    id: 4,
    name: "Lula Abebe",
    role: "AI Researcher",
    quote: "We trusted Natnael with complex AI integrations. He delivered maintainable code, clear documentation, and creative solutions to tough problems.",
    avatar: "/testimonials/lula.png",
    project: "AI workflow integration",
    impact: "Stable research ops",
  },
  {
    id: 5,
    name: "David Chen",
    role: "Senior Architect",
    quote: "The ability to translate complex requirements into elegant, high-performance code is Natnael's superpower. A pleasure to work with.",
    avatar: "/testimonials/samuel.png",
    project: "Platform architecture",
    impact: "Cleaner system design",
  },
  {
    id: 6,
    name: "Elena K.",
    role: "Operations Manager",
    quote: "Our workflow efficiency improved by 40% after the tools Natnael built were implemented. His technical depth is matched by business intuition.",
    avatar: "/testimonials/marta.png",
    project: "Operations automation",
    impact: "40% efficiency gain",
  }
];

const trustStats = [
  { value: "6+", label: "Product teams supported" },
  { value: "40%", label: "Workflow efficiency gain cited" },
  { value: "99.9%", label: "Reliability target delivered" },
];

const TestimonialSelector = ({ t, isActive, onSelect }: { t: Testimonial; isActive: boolean; onSelect: () => void }) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={isActive}
    className={`flex min-w-[240px] snap-start items-center gap-3 rounded-2xl border p-2.5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff99]/70 sm:min-w-0 ${isActive
      ? "border-[#00ff99]/70 bg-[#00ff99]/10"
      : "border-white/10 bg-white/[0.035] hover:border-[#00ff99]/35 hover:bg-white/[0.06]"
      }`}
  >
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[#00ff99]/25 bg-[#00ff99]/10">
      <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="40px" />
    </div>
    <div className="min-w-0 flex-1">
      <span className="block truncate text-sm font-bold text-white">{t.name}</span>
      <span className="mt-0.5 block truncate text-xs text-gray-400">{t.impact}</span>
    </div>
  </button>
);

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonials[activeIndex];

  const move = (direction: "previous" | "next") => {
    setActiveIndex((current) => {
      if (direction === "next") return (current + 1) % testimonials.length;
      return (current - 1 + testimonials.length) % testimonials.length;
    });
  };

  return (
    <section id="testimonials" className="relative overflow-hidden bg-[#050505] px-6 py-14 text-white md:px-12 md:py-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff99]/30 to-transparent" />
      <div className="absolute inset-0 pointer-events-none terminal-scanlines opacity-[0.07]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(0,255,153,0.12),transparent_34%),linear-gradient(180deg,#050505_0%,#09100d_48%,#030303_100%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          className="mb-8 grid gap-4 lg:grid-cols-[1fr_0.82fr] lg:items-end"
        >
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.4em] text-[#00ff99]">
              Client Signal
            </p>
            <h2 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-4xl">
              Proof from people who shipped the work.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-gray-400 lg:justify-self-end">
            A tighter look at how teams describe the collaboration: clear communication, practical engineering judgment, and products that make it past launch day.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.72fr)]">
          <motion.article
            key={activeTestimonial.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden rounded-3xl border border-[#00ff99]/25 bg-[#07110d]/90 p-5 shadow-[0_24px_80px_rgba(0,255,153,0.11)] md:p-6"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00ff99] via-white to-transparent opacity-80" />
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#00ff99]/30 bg-[#00ff99]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00ff99]">
                <Sparkles className="h-4 w-4" />
                Featured feedback
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move("previous")}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-gray-300 transition hover:border-[#00ff99]/50 hover:text-[#00ff99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff99]/70"
                  aria-label="Show previous testimonial"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => move("next")}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-gray-300 transition hover:border-[#00ff99]/50 hover:text-[#00ff99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff99]/70"
                  aria-label="Show next testimonial"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <Quote className="mt-6 h-9 w-9 text-[#00ff99]/35" />
            <blockquote className="mt-3 text-lg font-semibold leading-7 text-white md:text-2xl md:leading-[1.3]">
              “{activeTestimonial.quote}”
            </blockquote>

            <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-[1fr_auto] md:items-end">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[#00ff99]/35 bg-[#00ff99]/10">
                  <Image
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <cite className="not-italic">
                    <span className="block truncate text-base font-bold text-white">
                      {activeTestimonial.name}
                    </span>
                    <span className="mt-1 block truncate text-sm text-gray-400">
                      {activeTestimonial.role}
                    </span>
                  </cite>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Project</p>
                <p className="mt-2 text-sm font-semibold text-[#00ff99]">{activeTestimonial.project}</p>
              </div>
            </div>
          </motion.article>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-3">
            <div className="grid grid-cols-3 gap-2 border-b border-white/10 pb-3">
              {trustStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-black/25 p-3">
                  <p className="text-xl font-black text-white">{stat.value}</p>
                  <p className="mt-1 text-[11px] leading-4 text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0">
              {testimonials.map((testimonial, index) => (
                <TestimonialSelector
                  key={testimonial.id}
                  t={testimonial}
                  isActive={activeIndex === index}
                  onSelect={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
