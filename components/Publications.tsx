"use client";

import {
    ArrowUpRight,
    Binary,
    BookOpen,
    Braces,
    Gauge,
    Sigma,
} from "lucide-react";

const featuredArticles = [
    {
        title: "When Generic Benchmarks Fail: Building a Sales-Domain Evaluation Bench from Scratch",
        date: "May 2, 2026",
        url: "https://dev.to/natnael_alemseged/when-generic-benchmarks-fail-building-a-sales-domain-evaluation-bench-from-scratch-1kjf",
        description:
            "A production case study in turning domain failures into a measurable benchmark: contamination-aware task generation, deterministic checks, human grading, preference data, and a trained judge.",
        tags: ["Benchmark Design", "LLM-as-a-Judge", "Preference Data"],
        evidence: [
            ["240", "evaluation tasks"],
            ["4", "task-generation sources"],
            ["+76.6pp", "held-out judge lift"],
        ],
        icon: Gauge,
        accent: "text-[#00ff99]",
    },
    {
        title: "Why Pairing Your Bootstrap Is Necessary, And When It Stops Helping",
        date: "May 8, 2026",
        url: "https://dev.to/natnael_alemseged/why-pairing-your-bootstrap-is-necessary-and-when-it-stops-helping-2iim",
        description:
            "A first-principles explanation of paired versus unpaired bootstrap designs for LLM evaluation, backed by Python simulation and an explicit variance analysis.",
        tags: ["Statistical Evaluation", "Bootstrap", "Python"],
        evidence: [
            ["8.4%", "paired SE reduction"],
            ["r = 0.167", "observed covariance"],
            ["2", "sampling designs compared"],
        ],
        icon: Sigma,
        accent: "text-cyan-300",
    },
];

const researchNotes = [
    {
        title: "DPO vs SimPO: What Your Preference Trainer Is Actually Optimizing",
        date: "May 7, 2026",
        url: "https://dev.to/natnael_alemseged/dpo-vs-simpo-what-your-preference-trainer-is-actually-optimizing-42b4",
        description:
            "Objective functions, length bias, reference-free optimization, gradient behavior, and VRAM tradeoffs for preference tuning.",
        tags: ["Fine-tuning", "DPO", "SimPO"],
        icon: Binary,
    },
    {
        title: "\"Return JSON only\" Doesn't Force JSON. Here's What Actually Forces It.",
        date: "May 6, 2026",
        url: "https://dev.to/natnael_alemseged/return-json-only-doesnt-force-json-heres-what-actually-forces-it-9pn",
        description:
            "Why prompt instructions are weaker than constrained decoding, schema enforcement, and token-level generation controls.",
        tags: ["Structured Output", "Logits", "Constrained Decoding"],
        icon: Braces,
    },
    {
        title: "Why Merged LoRA Barely Changes Inference Time",
        date: "May 5, 2026",
        url: "https://dev.to/natnael_alemseged/why-merged-lora-barely-changes-inference-time-2mhj",
        description:
            "A systems-level explanation of adapter merging, parameter updates, runtime graph shape, and where LoRA inference overhead actually appears.",
        tags: ["LoRA", "Inference", "Fine-tuning"],
        icon: Gauge,
    },
];

export default function Publications() {
    return (
        <section
            id="publications"
            aria-labelledby="publications-heading"
            className="relative overflow-hidden border-y border-white/[0.07] bg-[#050706] px-6 py-24 md:px-12 lg:px-16"
        >
            <div className="pointer-events-none absolute right-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#00ff99]/[0.035] blur-[120px]" />

            <div className="relative mx-auto max-w-7xl">
                <header className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
                    <div className="max-w-3xl">
                        <div className="mb-5 flex items-center gap-3 text-[#00ff99]">
                            <BookOpen size={18} aria-hidden="true" />
                            <span className="font-mono text-xs">5 published research notes</span>
                        </div>
                        <h2
                            id="publications-heading"
                            className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-white md:text-5xl"
                        >
                            Technical Writing &amp; AI Research
                        </h2>
                    </div>
                    <p className="max-w-[65ch] text-pretty text-sm leading-7 text-gray-300">
                        Reproducible explanations of the evaluation, alignment, and
                        inference decisions behind production LLM systems—not a glossary
                        of AI terminology.
                    </p>
                </header>

                <div className="grid gap-5 lg:grid-cols-2">
                    {featuredArticles.map((article) => {
                        const Icon = article.icon;

                        return (
                            <article
                                key={article.url}
                                className="group flex min-h-full flex-col border border-white/[0.09] bg-black/60 p-6 transition-colors duration-300 hover:border-[#00ff99]/35 md:p-8"
                            >
                                <div className="mb-8 flex items-start justify-between gap-5">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center border border-current/20 ${article.accent}`}
                                    >
                                        <Icon size={18} aria-hidden="true" />
                                    </div>
                                    <time className="font-mono text-xs text-gray-400">
                                        {article.date}
                                    </time>
                                </div>

                                <h3 className="max-w-[24ch] text-balance text-xl font-bold leading-snug tracking-[-0.02em] text-white md:text-2xl">
                                    {article.title}
                                </h3>
                                <p className="mt-4 max-w-[68ch] text-pretty text-sm leading-7 text-gray-300">
                                    {article.description}
                                </p>

                                <dl className="my-7 grid grid-cols-3 border-y border-white/[0.08] py-5">
                                    {article.evidence.map(([value, label]) => (
                                        <div key={label} className="pr-3">
                                            <dt className="font-mono text-sm font-bold text-[#00ff99]">
                                                {value}
                                            </dt>
                                            <dd className="mt-1 text-[11px] leading-4 text-gray-400">
                                                {label}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>

                                <div className="mt-auto flex flex-wrap items-center justify-between gap-5">
                                    <div className="flex flex-wrap gap-2">
                                        {article.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="border border-white/[0.08] px-2.5 py-1 font-mono text-[10px] text-gray-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-[#00ff99]/50 underline-offset-4 transition-colors hover:text-[#00ff99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00ff99]"
                                    >
                                        Read analysis
                                        <ArrowUpRight size={15} aria-hidden="true" />
                                    </a>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="mt-5 border border-white/[0.09] bg-black/40">
                    {researchNotes.map((article, index) => {
                        const Icon = article.icon;

                        return (
                            <article
                                key={article.url}
                                className={`group grid gap-5 p-6 transition-colors hover:bg-white/[0.025] md:grid-cols-[2.5rem_minmax(0,1fr)_auto] md:items-center md:p-7 ${
                                    index > 0 ? "border-t border-white/[0.08]" : ""
                                }`}
                            >
                                <div className="flex h-10 w-10 items-center justify-center text-gray-400 transition-colors group-hover:text-[#00ff99]">
                                    <Icon size={18} aria-hidden="true" />
                                </div>
                                <div>
                                    <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <h3 className="text-balance text-lg font-bold tracking-[-0.015em] text-white">
                                            {article.title}
                                        </h3>
                                        <time className="font-mono text-[11px] text-gray-500">
                                            {article.date}
                                        </time>
                                    </div>
                                    <p className="max-w-[75ch] text-pretty text-sm leading-6 text-gray-300">
                                        {article.description}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-gray-500">
                                        {article.tags.map((tag) => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Read ${article.title}`}
                                    className="inline-flex h-10 w-10 items-center justify-center border border-white/[0.1] text-gray-300 transition-colors hover:border-[#00ff99]/50 hover:text-[#00ff99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00ff99]"
                                >
                                    <ArrowUpRight size={16} aria-hidden="true" />
                                </a>
                            </article>
                        );
                    })}
                </div>

                <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.08] pt-7 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-2xl text-sm leading-6 text-gray-400">
                        Published source material supporting the evaluation and fine-tuning
                        capabilities listed in my résumé.
                    </p>
                    <a
                        href="https://dev.to/natnael_alemseged"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 self-start border border-[#00ff99]/35 px-4 py-2.5 font-mono text-xs font-bold text-[#00ff99] transition-colors hover:bg-[#00ff99] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00ff99]"
                    >
                        View DEV profile
                        <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                </div>
            </div>
        </section>
    );
}
