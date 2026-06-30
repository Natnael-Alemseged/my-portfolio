"use client";

import { motion } from "framer-motion";
import { 
    Cpu, 
    Bot, 
    Layers, 
    Activity, 
    Terminal, 
    TrendingUp, 
    ShieldCheck, 
    Zap,
    Maximize2,
    Database,
    PhoneCall
} from "lucide-react";

// ==========================================
// DATA & TYPES
// ==========================================
const highlights = [
    { 
        label: "Projects Shipped", 
        value: "30+", 
        description: "Production web & mobile platforms",
        icon: <Layers size={18} className="text-[#00ff99]" />,
        sparklinePoints: "5,35 15,25 30,30 45,15 60,20 75,5 90,8 100,2"
    },
    { 
        label: "Users Reached", 
        value: "10K+", 
        description: "Active digital platform consumers",
        icon: <TrendingUp size={18} className="text-[#00ff99]" />,
        sparklinePoints: "5,32 20,28 35,22 50,25 65,12 80,15 90,4 100,2"
    },
    { 
        label: "Bug Reduction", 
        value: "65%", 
        description: "Post-migration type-safety standard",
        icon: <ShieldCheck size={18} className="text-[#00ff99]" />,
        sparklinePoints: "5,30 15,28 30,22 45,24 60,14 75,10 90,6 100,1"
    },
    { 
        label: "Efficiency Gain", 
        value: "30%", 
        description: "Agent automation pipelines benefit",
        icon: <Zap size={18} className="text-[#00ff99]" />,
        sparklinePoints: "5,33 15,28 30,26 45,18 60,19 75,8 90,6 100,2"
    },
];


// ==========================================
// 1. CORE COMMITMENTS CARD
// ==========================================
const CoreCommitmentsCard = () => {
    return (
        <div className="w-full bg-gradient-to-br from-[#060606] to-[#0c0c0c] border border-white/[0.07] hover:border-[#00ff99]/30 rounded-2xl p-6 font-sans text-gray-300 shadow-[0_15px_30px_rgba(0,0,0,0.6)] relative overflow-hidden group transition-all duration-300">
            {/* Ambient subtle glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff99]/[0.015] to-transparent pointer-events-none z-10" />
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-5">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-[#00ff99]" />
                    <h2 className="font-mono font-bold text-white uppercase tracking-widest text-[10px]">CORE_COMMITMENTS</h2>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#00ff99] border border-[#00ff99]/30 px-2 py-0.5 rounded uppercase">
                    PROVEN_UTILITY
                </div>
            </div>

            {/* Commitments List */}
            <div className="space-y-5 relative z-20">
                {[
                    {
                        title: "Autonomous AI Orchestration",
                        what: "Architecting multi-agent frameworks, prompt workflows, and custom MCP integrations.",
                        why: "Transforms static models into active, task-solving business tools with guarded execution limits.",
                        icon: <Bot size={16} className="text-[#00ff99]" />
                    },
                    {
                        title: "End-to-End Full-Stack Systems",
                        what: "Linking secure Python/FastAPI and Node.js backends to performant Next.js & Flutter frontends.",
                        why: "Provides compile-time type safety across the network layer, eliminating standard runtime crashes.",
                        icon: <Layers size={16} className="text-[#00ff99]" />
                    },
                    {
                        title: "Performance & Scaling Targets",
                        what: "Refining backend request lifecycles and frontend Core Web Vitals (LCP, INP, CLS).",
                        why: "Slashes computing overhead while delivering sub-100ms UI responsiveness for immediate user conversion.",
                        icon: <Zap size={16} className="text-[#00ff99]" />
                    }
                ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start group/item">
                        <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06] group-hover/item:border-[#00ff99]/40 group-hover/item:bg-[#00ff99]/[0.02] flex items-center justify-center shrink-0 transition-all duration-300">
                            {item.icon}
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[12.5px] font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                                <span className="text-[#00ff99]/40 font-normal">0{idx + 1}.</span>
                                {item.title}
                            </h3>
                            <p className="text-[11.5px] text-gray-400 leading-normal font-sans">
                                <strong className="text-gray-200">What:</strong> {item.what}
                            </p>
                            <p className="text-[11.5px] text-gray-500 leading-normal font-sans italic">
                                <strong className="text-gray-400 font-mono text-[10.5px] not-italic">Why:</strong> {item.why}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Retro Bottom Metadata element */}
            <div className="mt-5 pt-3 border-t border-white/[0.04] flex justify-between items-center text-[9px] font-mono text-gray-600">
                <span>SECURE_COMPILER_OK</span>
                <span>VER_2026.05</span>
            </div>
        </div>
    );
};

// ==========================================
// 2. SKILLS MICRO-CARD WITH 3D TILT EFFECT
// ==========================================

// ==========================================
// 3. STAT HIGHLIGHT WITH NEON SPARKLINE CHART
// ==========================================
interface StatCardProps {
    label: string;
    value: string;
    description: string;
    icon: React.ReactNode;
    sparklinePoints: string;
}

const SparklineHighlightCard = ({ label, value, description, icon, sparklinePoints }: StatCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-white/[0.06] bg-[#070707]/60 hover:border-[#00ff99]/30 hover:bg-[#080808] p-5.5 transition-all duration-300 relative overflow-hidden group cursor-pointer"
        >
            {/* Inline SVG Sparkline (Underlay Chart) */}
            <div className="absolute inset-x-0 bottom-0 h-14 overflow-hidden pointer-events-none opacity-15 group-hover:opacity-35 transition-opacity duration-300 z-0">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    {/* Gradient underlay fill */}
                    <defs>
                        <linearGradient id={`grad-${label.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00ff99" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                    
                    <path
                        d={`M 0,40 L ${sparklinePoints} L 100,40 Z`}
                        fill={`url(#grad-${label.replace(/\s+/g, '')})`}
                    />
                    
                    <motion.path
                        d={`M ${sparklinePoints}`}
                        fill="none"
                        stroke="#00ff99"
                        strokeWidth="1.2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                    />
                </svg>
            </div>

            {/* Card Content */}
            <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-3xl md:text-4xl font-extrabold font-mono text-white tracking-tight group-hover:text-[#00ff99] transition-colors duration-300">
                        {value}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:border-[#00ff99]/35 group-hover:bg-[#00ff99]/[0.03] transition-all duration-300">
                        {icon}
                    </div>
                </div>

                <div className="space-y-1">
                    <h4 className="text-xs font-bold font-mono tracking-widest text-gray-300 uppercase">
                        {label}
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-normal font-sans group-hover:text-gray-400 transition-colors">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// 4. MAIN ABOUT ME COMPONENT
// ==========================================
export default function About() {
    return (
        <section id="about" className="relative bg-black py-24 px-6 md:px-12 lg:px-16 overflow-hidden">
            {/* Thin separating boundary lines */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* Glowing Backdrop Mesh */}
            <div className="absolute top-[-250px] right-[-250px] w-[500px] h-[500px] rounded-full bg-blue-500/[0.015] blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-200px] left-[-250px] w-[500px] h-[500px] rounded-full bg-[#00ff99]/[0.01] blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-18">
                
                {/* 2-Column: Bio Details & Diagnostic specs */}
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
                    
                    {/* Left Column: Title & Narrative */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 space-y-7"
                    >
                        <div className="space-y-3.5">
                            <span className="inline-flex items-center gap-2 text-[10px] font-mono text-[#00ff99] uppercase tracking-[0.3em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff99]" />
                                VALUE_PROPOSITION
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-[1.1] tracking-tight">
                                Building AI-native workflows with measurable developer output.
                            </h2>
                        </div>

                        <div className="space-y-5 text-gray-400 text-sm md:text-[14.5px] leading-relaxed font-sans max-w-2xl">
                            <p>
                                I&apos;m a software engineer specializing in autonomous LLM workflows and full-stack development. My technical focus revolves around bridging advanced intelligence models with high-throughput API architectures and beautiful responsive user interfaces.
                            </p>
                            <p>
                                Whether implementing custom Model Context Protocol (MCP) integrations, designing secure database routing layers, or executing precise visual experiences, I engineer for system longevity, strict type-safety, and real-world outcomes.
                            </p>
                            <p className="border-l-2 border-[#00ff99]/20 pl-4 italic text-gray-500 text-[13.5px] font-mono">
                                "The difference between static code and dynamic utility lies in architectural intent. I build interfaces that think."
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column: High-tech System Specs Diagnostic Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="lg:col-span-5"
                    >
                        <CoreCommitmentsCard />
                    </motion.div>

                </div>


                {/* Highlight Stats Dashboard with sparkline charts */}
                <div className="pt-8 border-t border-white/[0.05] relative z-10">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] block mb-6">
                        OPERATIONAL_HIGHLIGHTS
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {highlights.map((item) => (
                            <SparklineHighlightCard
                                key={item.label}
                                label={item.label}
                                value={item.value}
                                description={item.description}
                                icon={item.icon}
                                sparklinePoints={item.sparklinePoints}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
