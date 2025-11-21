"use client";
import { motion } from "framer-motion";
import InlineWidget from "@calcom/embed-react";


const contactMethods = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/natnaelalemseged",
    icon: "in",
  },
  {
    label: "GitHub",
    href: "https://github.com/natnaelalemseged",
    icon: "{ }",
  },
  {
    label: "Email",
    href: "mailto:hello@natnael.dev",
    icon: "@",
  },
  {
    label: "Book a Call",
    href: "https://cal.com/natnael-alemseged-astaw-b9o7g9/15min",
    icon: "✦",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function Contact() {
  return (
<section
  id="contact"
  className="relative isolate overflow-hidden bg-[#050505] py-16 px-2 sm:px-4 md:px-6 text-white"
  style={{
    backgroundImage: "url('/Ethereal Metallic Figure 2.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

  {/* Decorative blur orbs */}
  <span className="pointer-events-none absolute -top-16 left-4 h-48 w-48 rounded-full bg-[#00ff99]/25 blur-[80px]" />
  <span className="pointer-events-none absolute -bottom-12 right-2 h-40 w-40 rounded-full bg-[#22d3ee]/20 blur-[80px]" />

  <div className="relative mx-auto max-w-7xl">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="grid gap-10 md:grid-cols-2 items-start"
    >
      {/* LEFT COLUMN: Text + Quick Links */}
      <div className="space-y-6 md:space-y-8 md:max-w-lg lg:max-w-xl">
        <span className="inline-flex items-center rounded-full border border-[#00ff99]/30 bg-[#00ff99]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#00ff99]">
          Connect
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          Let’s build something <br className="hidden sm:block" /> remarkable together
        </h2>
        <p className="text-base md:text-lg text-gray-400">
          Book a quick call to discuss your project, timeline, or any challenges. I usually respond within a few hours.
        </p>

        <div className="flex flex-wrap gap-3 md:gap-4">
          {contactMethods.map((method) => (
            <a
              key={method.label}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 md:px-5 md:py-3 text-sm font-semibold text-white transition hover:border-[#00ff99]/60 hover:bg-[#00ff99]/10"
            >
              <span className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-[#00ff99]/40 bg-[#00ff99]/15 text-sm font-bold text-[#00ff99] transition group-hover:border-[#00ff99] group-hover:bg-[#00ff99]/25">
                {method.icon}
              </span>
              {method.label}
            </a>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Cal.com Booking Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f]/50 p-3 md:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-4 md:mb-6 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-semibold text-[#00ff99]">
              Schedule a call
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Pick a time that works for you — 15 minute discovery call
            </p>
          </div>

      <div className="rounded-2xl overflow-hidden border border-white/5">
<InlineWidget
  calLink="natnael-alemseged-astaw-b9o7g9/15min"
  config={{ theme: "dark" }}
/>

</div>
        </div>
      </motion.div>
    </motion.div>
  </div>

  {/* Bottom decorative blob */}
  <div className="pointer-events-none absolute -bottom-8 left-1/2 hidden h-36 w-36 -translate-x-1/2 rounded-full bg-[#00ff99]/10 blur-[80px] md:block" />
</section>


  );
}