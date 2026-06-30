"use client";

import { motion } from "framer-motion";
import { 
    Terminal, 
    Zap, 
    Shield, 
    Send, 
    Sparkles, 
    CheckCircle,
    UserCheck,
    Lock,
    Eye
} from "lucide-react";
import { useState } from "react";

interface DiagnosticStep {
    command: string;
    output: string[];
    status: "success" | "warning" | "info";
    duration: string;
}

const diagnosticSteps: DiagnosticStep[] = [
    {
        command: "fde init --mode fractional --allocation high-bandwidth",
        output: [
            "Initializing FDE operational interface...",
            "✅ Stakeholder context mapped directly with project vision",
            "✅ Technical requirements extracted directly from high-level roadmap",
            "🚀 Communication latency: ~0ms (Immediate feedback loop)"
        ],
        status: "success",
        duration: "0.14s"
    },
    {
        command: "fde execute --scope full-stack --autonomy active",
        output: [
            "Parsing active backend & UI repositories...",
            "✅ Native bridging layers compiled (NestJS + RabbitMQ + React Native)",
            "✅ AST code map and system dependency graph generated",
            "⚡ Autonomy metric: 1.0 (Zero training or hand-holding required)"
        ],
        status: "success",
        duration: "0.42s"
    },
    {
        command: "fde evaluate --systems agentic-state-machines",
        output: [
            "Running deterministic test assertions...",
            "⚠️ Stochastic variation flagged in LLM schema outputs",
            "🔧 Enforcing strict graph transition limits and retry rules",
            "✅ Protocol validation passed (100% strict contract conformity)"
        ],
        status: "warning",
        duration: "0.89s"
    }
];

export default function FdeEdge() {
    const [activeTerminalTab, setActiveTerminalTab] = useState<number>(0);

    return (
        <section id="fde-edge" className="relative py-20 px-6 md:px-12 lg:px-16 bg-black overflow-hidden">
            {/* Elegant boundary gradients */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* Premium backdrop mesh */}
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00ff99]/[0.012] blur-[160px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/[0.01] blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                
                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono text-[#00ff99] uppercase tracking-[0.4em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff99] animate-pulse" />
                        operational_autonomy
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        How I Execute: The Forward-Deployed Edge
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-sans leading-relaxed">
                        I do not wait for a backlog or granular specifications. I operate directly at the intersection of systems architecture, customer alignment, and product vision—autonomously delivering production-grade backend systems and full-stack integrations.
                    </p>
                </div>

                {/* 2-Column Responsive Layout */}
                <div className="grid lg:grid-cols-12 gap-8 items-stretch relative z-10">
                    
                    {/* Left Column: Premium Terminal Console */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 flex flex-col justify-between"
                    >
                        <div className="bg-[#050505] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] h-full flex flex-col">
                            
                            {/* Terminal Window Header */}
                            <div className="bg-[#0b0b0b] px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#00ff99]/70" />
                                    <span className="text-[10px] font-mono text-gray-400 ml-2">fde-engine@natnael: ~ (autonomous_env)</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-600 bg-black/40 px-2 py-0.5 rounded border border-white/[0.04]">
                                    <Terminal size={10} className="text-[#00ff99]/60" />
                                    <span>OPERATIONAL_PROTOCOL_OK</span>
                                </div>
                            </div>

                            {/* Tabs representing different diagnostic steps */}
                            <div className="flex bg-[#080808] border-b border-white/[0.04]">
                                {diagnosticSteps.map((step, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveTerminalTab(idx)}
                                        className={`flex-1 py-3 px-4 text-left border-r border-white/[0.04] transition-all duration-150 ${
                                            activeTerminalTab === idx 
                                                ? "bg-[#050505] text-[#00ff99]" 
                                                : "text-gray-500 hover:text-gray-300 hover:bg-[#060606]"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono tracking-wider font-semibold">STAGE_0{idx + 1}</span>
                                            <span className="text-[8px] font-mono text-gray-600 group-hover:text-gray-400">
                                                {step.duration}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Terminal Window Body */}
                            <div className="p-5 md:p-6 font-mono text-[11.5px] leading-relaxed text-gray-300 flex-1 flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="flex gap-2.5 items-start text-gray-400">
                                        <span className="text-[#00ff99] select-none">&gt;</span>
                                        <span className="text-white font-semibold">
                                            {diagnosticSteps[activeTerminalTab].command}
                                        </span>
                                    </div>

                                    <div className="space-y-2 border-l border-white/[0.04] pl-4 ml-1.5">
                                        {diagnosticSteps[activeTerminalTab].output.map((line, lIdx) => (
                                            <div 
                                                key={lIdx} 
                                                className={`transition-all duration-300 ${
                                                    line.startsWith("✅") 
                                                        ? "text-gray-300" 
                                                        : line.startsWith("⚠️") 
                                                            ? "text-yellow-400/90" 
                                                            : line.startsWith("🔧") || line.startsWith("🚀")
                                                                ? "text-teal-400"
                                                                : "text-gray-500"
                                                }`}
                                            >
                                                {line}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Command Details Block */}
                                <div className="bg-black/30 border border-white/[0.04] rounded-xl p-3.5 flex items-center justify-between text-[10px] text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff99] animate-pulse" />
                                        <span>EXECUTION_STATE: NATNAEL_ACTIVE</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-sans font-semibold text-gray-400">
                                        <span>Stakeholder alignment: 100%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Premium Value-Proposition Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="lg:col-span-5 flex flex-col justify-between gap-4"
                    >
                        {[
                            {
                                title: "Zero Hand-Holding Integration",
                                desc: "I drop straight into complex, distributed codebases, reconstruct accurate system models via AST parsing, and start resolving business bottlenecks immediately without disrupting your core team.",
                                icon: <UserCheck className="text-[#00ff99]" size={18} />
                            },
                            {
                                title: "Cynical & Deterministic Systems Design",
                                desc: "Uncertain systems break under real-world traffic. I enforce strict Pydantic/TypeScript schemas at the API boundary, guard AI outputs with comprehensive evaluation graphs, and treat latency as a core metric.",
                                icon: <Shield className="text-[#00ff99]" size={18} />
                            },
                            {
                                title: "Full-Stack Operational Domain",
                                desc: "I own the entire delivery loop—from writing high-throughput NestJS microservices and configuring RabbitMQ channels to compiling custom React Native/Flutter layouts and database indexing.",
                                icon: <Zap className="text-[#00ff99]" size={18} />
                            }
                        ].map((card, idx) => (
                            <div
                                key={idx}
                                className="group relative flex gap-4 p-5 bg-[#060606] hover:bg-[#070707] border border-white/[0.06] hover:border-[#00ff99]/25 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff99]/[0.005] to-transparent pointer-events-none rounded-2xl" />
                                
                                <div className="w-9 h-9 rounded-xl bg-white/[0.02] group-hover:bg-[#00ff99]/[0.02] border border-white/[0.06] group-hover:border-[#00ff99]/30 flex items-center justify-center shrink-0 transition-all duration-300">
                                    {card.icon}
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-[13px] font-bold text-white font-mono uppercase tracking-wider group-hover:text-[#00ff99] transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-[12px] text-gray-400 leading-relaxed font-sans font-medium">
                                        {card.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                </div>

            </div>
        </section>
    );
}
