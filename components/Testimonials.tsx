"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Kate Rogers",
    role: "Product Designer @ ABC Corp",
    quote: "Natnael transformed our customer support tooling in record time. The experience was seamless, collaborative, and the end result exceeded expectations.",
    avatar: "/testimonials/kate.png",
  },
  {
    id: 2,
    name: "Samuel Bekele",
    role: "Startup Founder",
    quote: "We needed a developer who could move fast without compromising quality. Every deliverable was pixel-perfect, performant, and thoughtfully engineered.",
    avatar: "/testimonials/samuel.png",
  },
  {
    id: 3,
    name: "Marta Alvarez",
    role: "Product Lead @ TechFlow",
    quote: "From ideation to launch, Natnael owned the build and communication. The attention to detail and empathy for our users were remarkable.",
    avatar: "/testimonials/marta.png",
  },
  {
    id: 4,
    name: "Lula Abebe",
    role: "AI Researcher",
    quote: "We trusted Natnael with complex AI integrations. He delivered maintainable code, clear documentation, and creative solutions to tough problems.",
    avatar: "/testimonials/lula.png",
  },
  {
    id: 5,
    name: "David Chen",
    role: "Senior Architect",
    quote: "The ability to translate complex requirements into elegant, high-performance code is Natnael's superpower. A pleasure to work with.",
    avatar: "/testimonials/samuel.png",
  },
  {
    id: 6,
    name: "Elena K.",
    role: "Operations Manager",
    quote: "Our workflow efficiency improved by 40% after the tools Natnael built were implemented. His technical depth is matched by business intuition.",
    avatar: "/testimonials/marta.png",
  }
];

const TestimonialCard = ({ t }: { t: Testimonial }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="flex-shrink-0 w-[450px] mx-6 group relative"
  >
    {/* Glow Effect Layer */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff99]/20 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

    <div className="relative h-full bg-[#111]/40 backdrop-blur-md border border-white/5 rounded-3xl p-10 flex flex-col justify-between transition-all duration-300 group-hover:bg-[#111]/60 group-hover:border-[#00ff99]/30">
      {/* Quote Icon */}
      <div className="mb-6">
        <Quote className="w-10 h-10 text-[#00ff99] opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
      </div>

      <p className="text-xl text-gray-200 leading-relaxed font-medium mb-12">
        "{t.quote}"
      </p>

      <div className="flex items-center gap-5 pt-6 border-t border-white/5">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-[#00ff99]/20 shadow-2xl group-hover:border-[#00ff99]/50 transition-colors">
          <Image
            src={t.avatar}
            alt={t.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-white text-lg tracking-tight group-hover:text-[#00ff99] transition-colors">{t.name}</span>
          <span className="text-xs text-gray-500 font-mono tracking-widest uppercase flex items-center gap-2">
            <span className="w-1 h-1 bg-[#00ff99] rounded-full animate-pulse" />
            {t.role}
          </span>
        </div>
      </div>

      {/* Subtle Matrix-style Decorative Element */}
      <div className="absolute bottom-4 right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <span className="text-xs font-mono text-[#00ff99]">0x{t.id.toString(16).padStart(4, '0')}</span>
      </div>
    </div>
  </motion.div>
);

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-[#0b0b0b] py-40 overflow-hidden">
      {/* Background Texture & Gradients */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff99]/20 to-transparent" />
      <div className="absolute inset-0 pointer-events-none terminal-scanlines opacity-10" />

      <div className="relative max-w-7xl mx-auto px-6 mb-24 flex flex-col items-center text-center">


        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
          Tested by the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff99] to-white">community.</span>
        </h2>
        <p className="max-w-xl text-gray-500 text-lg leading-relaxed">
          Analyzing real-world impact across diverse technical architectures.
          Consistency and performance verified.
        </p>
      </div>

      {/* Single Row Marquee */}
      <div className="group relative flex overflow-hidden py-12">
        <motion.div
          animate={{
            x: [0, -2988],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ display: "flex", width: "fit-content" }}
          className="hover:[animation-play-state:paused]"
        >
          {/* Multiply items to ensure seamless loop */}
          {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
            <TestimonialCard key={`${t.id}-${idx}`} t={t} />
          ))}
        </motion.div>

        {/* Edge Fades */}
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Bottom Accent */}
      <div className="mt-20 flex justify-center">
        <div className="flex gap-2 items-center text-[#00ff99]/40 font-mono text-[10px] tracking-[0.5em] uppercase">
          <span>99.9% Satisfaction Rate</span>
          <span className="w-1.5 h-1.5 bg-[#00ff99]/40 rounded-full" />
          <span>Active Deployments Confirmed</span>
        </div>
      </div>

      {/* Background Decorative Blob */}
      <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-[#00ff99]/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}