"use client";

import { motion } from "framer-motion";

type Testimonial = {
    id: number;
    name: string;
    role: string;
    headline: string;
    quote: string;
    rating: number;
    gradient: string;
};

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Kate Rogers",
        role: "Product Designer",
        headline: "Amazing Customer Service",
        quote:
            "Natnael transformed our customer support tooling in record time. The experience was seamless, collaborative, and the end result exceeded expectations.",
        rating: 5,
        gradient: "from-[#00ff99]/90 via-[#10b981]/70 to-[#6366f1]/70",
    },
    {
        id: 2,
        name: "Samuel Bekele",
        role: "Startup Founder",
        headline: "A Strategic Partner",
        quote:
            "We needed a developer who could move fast without compromising quality. Every deliverable was pixel-perfect, performant, and thoughtfully engineered.",
        rating: 5,
        gradient: "from-[#26c6da]/80 via-[#00ff99]/80 to-[#7c3aed]/70",
    },
    {
        id: 3,
        name: "Marta Alvarez",
        role: "Product Lead",
        headline: "Delightful Collaboration",
        quote:
            "From ideation to launch, Natnael owned the build and communication. The attention to detail and empathy for our users were remarkable.",
        rating: 5,
        gradient: "from-[#34d399]/80 via-[#00ff99]/80 to-[#f59e0b]/70",
    },
    {
        id: 4,
        name: "Lula Abebe",
        role: "AI Researcher",
        headline: "Reliable & Forward-Thinking",
        quote:
            "We trusted Natnael with complex AI integrations. He delivered maintainable code, clear documentation, and creative solutions to tough problems.",
        rating: 5,
        gradient: "from-[#38bdf8]/80 via-[#00ff99]/80 to-[#9333ea]/70",
    },
];

const getInitials = (name: string): string =>
    name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2);

export default function Testimonials() {
    return (
        <section id="testimonials" className="bg-[#0b0b0b] py-20 px-6 md:px-12 text-white">
  <div className="max-w-6xl mx-auto text-center space-y-4">
    <span className="text-sm uppercase tracking-[0.35em] text-[#00ff99]">
      Kind words
    </span>
    <h2 className="text-4xl sm:text-5xl font-bold">
      Testimonials from collaborators & clients
    </h2>
    <p className="max-w-2xl mx-auto text-gray-400">
      Momentum-driving partnerships, thoughtful communication, and reliable delivery. Here’s what teams say about working together.
    </p>
  </div>

  <div className="mt-16 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {testimonials.map((t, idx) => (
      <motion.div
        key={t.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: idx * 0.1 }}
        className="bg-[#111] rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow"
      >
        {/* Avatar & Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`h-16 w-16 rounded-full bg-gradient-to-tr ${t.gradient} p-1`}>
            <div className="flex items-center justify-center h-full w-full rounded-full bg-[#0b0b0b] text-xl font-semibold">
              {getInitials(t.name)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{t.name}</h3>
            <p className="text-sm text-gray-400">{t.role}</p>
          </div>
        </div>

        {/* Quote & Headline */}
        <h4 className="text-[#00ff99] font-bold text-xl mb-2">{t.headline}</h4>
        <p className="text-gray-300 leading-relaxed flex-1">{t.quote}</p>

        {/* Rating */}
        <div className="mt-4 flex gap-1 text-[#00ff99] text-lg">
          {Array.from({ length: t.rating }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
      </motion.div>
    ))}
  </div>
</section>

    );
}