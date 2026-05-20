"use client";

import { motion } from "framer-motion";
import { 
    BookOpen, 
    ArrowUpRight, 
    ExternalLink, 
    Binary, 
    Sigma,
    Terminal,
    Cpu,
    Workflow
} from "lucide-react";

export default function Publications() {
    const articles = [
        {
            title: "Why Pairing Your Bootstrap Is Necessary — And When It Stops Helping",
            date: "May 8, 2026",
            url: "https://dev.to/natnael_alemseged/why-pairing-your-bootstrap-is-necessary-and-when-it-stops-helping-2iim",
            desc: "A mathematical first-principles exploration of paired vs. unpaired bootstrap sampling distributions for LLM evaluation. Maps why pairing is correct by experimental design in within-subject setups, explains the variance-reduction mechanism, and details empirical simulation results in Python.",
            tags: ["LLM Evaluation", "Statistics", "Bootstrap Simulation", "ML Evals"],
            category: "Statistical Evaluation",
            badge: "Latest Release",
            mathHeader: "VARIANCE_REDUCTION_MATH",
            mathContent: `// 1. Paired Standard Error (Within-Subject Design)
SE_paired = sqrt( (Var(A) + Var(B) - 2 · Cov(A, B)) / n )

// 2. Unpaired Standard Error (Independent Samples)
SE_unpaired = sqrt( (Var(A) + Var(B)) / n )

// Covariance r(A, B) = 0.167 reduces paired SE by 8.4%`,
            mathNote: "Pairing is correct by experimental design; however, near-zero covariance limits its statistical efficiency advantage.",
            icon: <Sigma className="text-[#00ff99] h-3.5 w-3.5" />
        },
        {
            title: "DPO vs SimPO: What Your Preference Trainer Is Actually Optimizing",
            date: "May 7, 2026",
            url: "https://dev.to/natnael_alemseged/dpo-vs-simpo-what-your-preference-trainer-is-actually-optimizing-42b4",
            desc: "Direct Preference Optimization (DPO) bypassed complex reward models, but SimPO introduces a length-normalized, reference-free objective that mitigates length bias. This deep dive maps their objective functions, gradient deviations, and VRAM footprints under LoRA configurations.",
            tags: ["Preference Tuning", "RLHF Bounds", "Loss Functions", "VRAM Optimization"],
            category: "Preference Alignment",
            badge: "Featured Publication",
            mathHeader: "OBJECTIVE_LOSS_FUNCTIONS",
            mathContent: `// 1. DPO Reference-Relative Loss Objective
L_DPO = -E[log σ ( β log(π_θ(y_w|x)/π_ref(y_w|x)) 
               - β log(π_θ(y_l|x)/π_ref(y_l|x)) )]

// 2. SimPO Reference-Free Length-Normalized Loss
L_SimPO = -E[log σ ( β/|y_w| log π_θ(y_w|x) 
                 - β/|y_l| log π_θ(y_l|x) - γ )]`,
            mathNote: "SimPO eliminates the reference model requirement, saving 50%+ VRAM during preference alignment runs.",
            icon: <Binary className="text-teal-400 h-3.5 w-3.5" />
        }
    ];

    return (
        <section id="publications" className="relative py-20 px-6 md:px-12 lg:px-16 bg-black overflow-hidden">
            {/* Elegant boundary gradients */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* Glowing meshes */}
            <div className="absolute top-[30%] right-[-10%] w-[550px] h-[550px] rounded-full bg-blue-500/[0.01] blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[#00ff99]/[0.008] blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono text-[#00ff99] uppercase tracking-[0.4em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff99] animate-pulse" />
                        systems_alignment_research
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        Thought Leadership & Publications
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-sans leading-relaxed">
                        Deep-dives analyzing core statistical boundaries, machine learning objectives, and mathematical formulations in production AI systems.
                    </p>
                </div>

                {/* Publications Stack */}
                <div className="space-y-8">
                    {articles.map((article, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            className="grid lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-[#060606] via-[#090909] to-[#040404] border border-white/[0.06] hover:border-[#00ff99]/30 rounded-3xl p-6 md:p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative group transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff99]/[0.005] to-transparent pointer-events-none rounded-3xl" />
                            
                            {/* Left Column: Article Details */}
                            <div className="lg:col-span-7 space-y-5">
                                <div className="flex items-center gap-3">
                                    <span className="bg-[#00ff99]/[0.06] text-[#00ff99] border border-[#00ff99]/20 font-mono text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                                        {article.icon}
                                        {article.badge}
                                    </span>
                                    <span className="text-gray-500 font-mono text-[9px]">{article.date} • {article.category}</span>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xl md:text-2xl font-extrabold text-white group-hover:text-[#00ff99] transition-colors leading-snug">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-400 text-[13px] leading-relaxed font-sans font-medium">
                                        {article.desc}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 font-mono text-[9px]">
                                    {article.tags.map((tag) => (
                                        <span key={tag} className="px-2.5 py-0.5 bg-white/[0.02] border border-white/[0.06] rounded-md text-gray-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-1">
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-[#00ff99] rounded-xl font-bold font-mono text-[10px] transition-all duration-200 uppercase"
                                    >
                                        Read Full Article
                                        <ExternalLink size={11} className="stroke-[2.5px]" />
                                    </a>
                                </div>
                            </div>

                            {/* Right Column: Mathematical Visualizations */}
                            <div className="lg:col-span-5 bg-[#030303] border border-white/[0.06] rounded-2xl p-5 font-mono text-[10px] leading-normal text-gray-300 relative overflow-hidden shadow-inner">
                                <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[8px] text-gray-600">
                                    <Binary size={10} className="text-[#00ff99]/50" />
                                    <span>{article.mathHeader}</span>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="bg-black/40 border border-white/[0.04] p-3 rounded-lg text-gray-400 italic overflow-x-auto whitespace-pre text-[9px] leading-relaxed">
                                        {article.mathContent}
                                    </div>
                                    <div className="text-[9px] text-gray-500 leading-relaxed">
                                        {article.mathNote}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Dev.to Call to Action */}
                <div className="pt-6 text-center">
                    <a
                        href="https://dev.to/natnael_alemseged"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/[0.08] hover:border-[#00ff99]/30 bg-white/[0.02] text-gray-400 hover:text-white font-mono text-xs font-bold transition-all duration-300 shadow-md group"
                    >
                        Explore More Deep-Dives on Dev.to
                        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                </div>

            </div>
        </section>
    );
}
