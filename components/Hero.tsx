"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { 
    Terminal, 
    Bot, 
    Cpu, 
    Sparkles, 
    Code, 
    Activity, 
    Layers, 
    ChevronRight,
    Server,
    Globe,
    Database
} from "lucide-react";
import {
    SiPython,
    SiFastapi,
    SiNextdotjs,
    SiFlutter,
    SiDocker,
    SiSupabase
} from "react-icons/si";

// ==========================================
// 1. NEURAL NETWORK CANVAS BACKGROUND
// ==========================================
const NeuralNetworkBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            baseRadius: number;
        }> = [];
        
        let mouse = { x: -1000, y: -1000, active: false };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 75);
            
            for (let i = 0; i < particleCount; i++) {
                const radius = Math.random() * 2 + 1.2;
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: (Math.random() - 0.5) * 0.45,
                    radius: radius,
                    baseRadius: radius,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections between particles
            const connectionDistance = 115;
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const distX = p1.x - p2.x;
                    const distY = p1.y - p2.y;
                    const dist = Math.sqrt(distX * distX + distY * distY);

                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.15;
                        ctx.strokeStyle = `rgba(0, 255, 153, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Mouse interactive connection
                if (mouse.active) {
                    const mDistX = p1.x - mouse.x;
                    const mDistY = p1.y - mouse.y;
                    const mDist = Math.sqrt(mDistX * mDistX + mDistY * mDistY);
                    const mouseRadius = 180;

                    if (mDist < mouseRadius) {
                        const alpha = (1 - mDist / mouseRadius) * 0.35;
                        ctx.strokeStyle = `rgba(0, 255, 153, ${alpha})`;
                        ctx.lineWidth = 1.0;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                        
                        // Slightly enlarge particle near cursor
                        p1.radius = p1.baseRadius * 1.5;
                    } else {
                        p1.radius = p1.baseRadius;
                    }
                }

                // Draw Particle
                ctx.fillStyle = "rgba(0, 255, 153, 0.65)";
                ctx.shadowColor = "#00ff99";
                ctx.shadowBlur = p1.radius > p1.baseRadius ? 4 : 0;
                ctx.beginPath();
                ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0; // reset

                // Update Position
                p1.x += p1.vx;
                p1.y += p1.vy;

                // Bounce off edges
                if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
                if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        };

        const handleMouseLeave = () => {
            mouse.active = false;
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        resizeCanvas();
        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40 md:opacity-60" />;
};

// ==========================================
// 2. CYCLING TYPING SUBTITLE
// ==========================================
const TypingSubtitle = () => {
    const roles = useMemo(() => [
        "Senior AI Agent Engineer",
        "Forward Deployed Engineer",
        "High-Scale Backend Architect",
        "Mobile & Web Specialist"
    ], []);

    const [currentRoleIdx, setCurrentRoleIdx] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        const currentRole = roles[currentRoleIdx];
        
        if (isDeleting) {
            timer = setTimeout(() => {
                setDisplayedText(prev => prev.slice(0, -1));
            }, 30);
        } else {
            timer = setTimeout(() => {
                setDisplayedText(currentRole.slice(0, displayedText.length + 1));
            }, 60);
        }

        if (!isDeleting && displayedText === currentRole) {
            // Pause at full word before deleting
            timer = setTimeout(() => setIsDeleting(true), 2500);
        } else if (isDeleting && displayedText === "") {
            setIsDeleting(false);
            setCurrentRoleIdx(prev => (prev + 1) % roles.length);
        }

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, currentRoleIdx, roles]);

    return (
        <span className="inline-flex items-center text-[#00ff99] drop-shadow-[0_0_8px_rgba(0,255,153,0.35)]">
            {displayedText}
            <span className="w-[3px] h-[1em] ml-1 bg-[#00ff99] animate-[blink_0.8s_infinite]" />
            <style jsx global>{`
                @keyframes blink {
                    0%, 100% { opacity: 0 }
                    50% { opacity: 1 }
                }
            `}</style>
        </span>
    );
};

// ==========================================
// 3. LIVE SIMULATED AI AGENT TERMINAL
// ==========================================
const AIAgentTerminal = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [step, setStep] = useState(0);

    const logPhrases = useMemo(() => [
        "🤖 [SYSTEM] Spawning worker_agent_0x7b...",
        "⚙️ [PLANNER] Querying database: mongoose.connect()",
        "💾 [DATA] Retrieved: 30+ completed projects shipped",
        "🧠 [REASONING] Prompting Claude-3.5-Sonnet with context...",
        "🔥 [API] Running FastAPI dev servers... OK",
        "🚀 [WORKFLOW] Building Next.js responsive frameworks...",
        "📈 [METRICS] Checking speed index: LCP 0.8s // INP 98ms",
        "⚡ [OPTIMIZE] Bundles minified. 100% Core Web Vitals",
        "🎯 [COMPLETED] Portfolio agent online. Human contact ready."
    ], []);

    useEffect(() => {
        // Initial setup
        setLogs([logPhrases[0]]);
        
        const interval = setInterval(() => {
            setStep(prevStep => {
                const nextStep = (prevStep + 1) % logPhrases.length;
                
                setLogs(prev => {
                    // Keep max 5 logs visible to avoid overflow
                    const nextLogs = [...prev, logPhrases[nextStep]];
                    if (nextLogs.length > 5) {
                        nextLogs.shift();
                    }
                    return nextLogs;
                });
                
                return nextStep;
            });
        }, 3200);

        return () => clearInterval(interval);
    }, [logPhrases]);

    return (
        <div className="w-full bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl border border-white/[0.08] p-4 font-mono text-[11px] text-gray-400 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
            {/* Retro scanline underlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff99]/[0.015] to-transparent pointer-events-none z-10 bg-[length:100%_4px]" />
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3.5">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider ml-1">AI_AGENT_CORE.SH</span>
                </div>
                <div className="flex items-center gap-2">
                    <Activity size={10} className="text-[#00ff99] animate-pulse" />
                    <span className="text-[9px] text-[#00ff99]/70 font-semibold tracking-widest uppercase">ACTIVE</span>
                </div>
            </div>

            {/* Simulated Live Terminal Output */}
            <div className="space-y-2 h-[120px] overflow-hidden flex flex-col justify-end">
                <AnimatePresence initial={false}>
                    {logs.map((log, i) => {
                        const isSystem = log.includes("SYSTEM");
                        const isReasoning = log.includes("REASONING");
                        const isCompleted = log.includes("COMPLETED");

                        let textColor = "text-gray-400";
                        if (isSystem) textColor = "text-teal-400/90";
                        if (isReasoning) textColor = "text-amber-400/90";
                        if (isCompleted) textColor = "text-[#00ff99]";

                        return (
                            <motion.div
                                key={log + i}
                                initial={{ opacity: 0, x: -10, y: 5 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className={`flex items-start gap-1 ${textColor}`}
                            >
                                <ChevronRight size={12} className="shrink-0 mt-0.5 opacity-55 text-[#00ff99]" />
                                <span className="leading-relaxed select-none tracking-wide">{log}</span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
            
            {/* Console Footer */}
            <div className="mt-3.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[9px] text-gray-600">
                <span>V2.6.4_LUCID</span>
                <span className="animate-pulse">Awaiting input...</span>
            </div>
        </div>
    );
};

// ==========================================
// 4. HOLOGRAM PORTRAIT SCANNER & FLOATING ORBITALS
// ==========================================
interface FloatingBadgeProps {
    children: React.ReactNode;
    name: string;
    delay: number;
    left: string;
    top: string;
}

const FloatingBadge = ({ children, name, delay, left, top }: FloatingBadgeProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -12, 0],
                x: [0, 8, 0]
            }}
            transition={{
                delay: 0.8,
                duration: 6,
                y: {
                    repeat: Infinity,
                    duration: 5 + delay,
                    ease: "easeInOut"
                },
                x: {
                    repeat: Infinity,
                    duration: 4 + delay,
                    ease: "easeInOut"
                }
            }}
            className="absolute z-20 group cursor-pointer"
            style={{ left, top }}
        >
            <div className="relative">
                {/* Tech Badge Bubble */}
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-black/70 border border-white/10 md:backdrop-blur-md flex items-center justify-center text-gray-300 shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:scale-115 hover:text-[#00ff99] hover:border-[#00ff99]/40 transition-all duration-300">
                    {children}
                </div>
                {/* Micro tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 bg-[#0f0f0f]/95 border border-[#00ff99]/25 text-[9px] font-bold text-white px-2 py-0.5 rounded uppercase tracking-widest transition-all duration-200 pointer-events-none md:backdrop-blur-sm whitespace-nowrap shadow-[0_5px_15px_rgba(0,255,153,0.15)] z-30">
                    {name}
                </span>
            </div>
        </motion.div>
    );
};

const AvatarHologram = () => {
    return (
        <div className="relative w-full max-w-[340px] md:max-w-[420px] aspect-square flex items-center justify-center">
            
            {/* Floating Tech Orbitals */}
            <FloatingBadge name="Python" delay={0.2} left="1%" top="18%">
                <SiPython size={20} className="text-blue-400" />
            </FloatingBadge>
            <FloatingBadge name="FastAPI" delay={0.8} left="88%" top="14%">
                <SiFastapi size={20} className="text-green-400" />
            </FloatingBadge>
            <FloatingBadge name="Next.js" delay={1.4} left="85%" top="74%">
                <SiNextdotjs size={20} className="text-white" />
            </FloatingBadge>
            <FloatingBadge name="Flutter" delay={2.0} left="-2%" top="68%">
                <SiFlutter size={20} className="text-sky-400" />
            </FloatingBadge>
            <FloatingBadge name="Docker" delay={2.6} left="38%" top="-8%">
                <SiDocker size={20} className="text-blue-400" />
            </FloatingBadge>
            <FloatingBadge name="Qdrant" delay={3.2} left="42%" top="94%">
                <Database size={20} className="text-purple-400" />
            </FloatingBadge>

            {/* SVG Concentric Scanner HUD Rings */}
            <div className="absolute inset-0 z-0 flex items-center justify-center animate-pulse pointer-events-none">
                {/* Rotating Tech Ring 1 (Dashed Outer) */}
                <svg className="absolute w-[98%] h-[98%] animate-[spin_50s_linear_infinite]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0, 255, 153, 0.08)" strokeWidth="0.8" strokeDasharray="3 8" />
                </svg>
                {/* Rotating Tech Ring 2 (Reversed Dashed Inner) */}
                <svg className="absolute w-[86%] h-[86%] animate-[spin_24s_linear_infinite_reverse]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0, 255, 153, 0.15)" strokeWidth="0.5" strokeDasharray="12 4 2 4" />
                </svg>
                {/* Glowing Outer boundary */}
                <div className="absolute w-[80%] h-[80%] rounded-full border border-[#00ff99]/20 shadow-[0_0_50px_rgba(0,255,153,0.06)]" />
            </div>

            {/* Central Hologram Frame (Contains Portrait) */}
            <motion.div
                initial={{ scale: 0.94 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-[74%] h-[74%] rounded-full relative z-10 overflow-hidden border-2 border-[#00ff99]/30 bg-black/60 shadow-[0_0_40px_rgba(0,255,153,0.25)] flex items-center justify-center group"
            >
                {/* Retro cyan holographic glow tint */}
                <div className="absolute inset-0 bg-[#00ff99]/5 z-10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff99]/5 to-black/80 z-10 pointer-events-none" />

                <Image
                    src="/avatar_HD.png"
                    alt="Natnael Alemseged"
                    fill
                    sizes="(max-width: 768px) 250px, 350px"
                    className="object-cover object-top filter grayscale contrast-115 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                    priority
                    quality={75}
                />
            </motion.div>

            {/* Corner Decorative brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00ff99]/30 rounded-tl" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00ff99]/30 rounded-tr" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00ff99]/30 rounded-bl" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00ff99]/30 rounded-br" />
        </div>
    );
};

// ==========================================
// 5. MAIN HERO COMPONENT
// ==========================================
export default function Hero() {
    useEffect(() => {
        fetch("https://taaft-backend.onrender.com/health").catch(() => {});
    }, []);

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden py-24 md:py-28 lg:py-0 px-6 md:px-12 lg:px-16">
            
            {/* Interactive Canvas Background */}
            <NeuralNetworkBackground />

            {/* Subtle Gradient Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00ff99]/[0.025] blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full bg-blue-500/[0.02] blur-[120px] pointer-events-none" />

            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
                
                {/* Left side: Copywriting */}
                <div className="lg:col-span-7 flex flex-col items-start text-left space-y-7">
                    
                    {/* Pulsing availability badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <span className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#00ff99]/[0.06] border border-[#00ff99]/15 text-[10px] font-mono text-[#00ff99] uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(0,255,153,0.05)]">
                            <span className="w-2 h-2 rounded-full bg-[#00ff99] animate-ping" />
                            AVAILABLE FOR NEW CONTRACTS
                        </span>
                    </motion.div>

                    {/* Gradient title */}
                    <div className="space-y-3.5">
                        <motion.h1 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="text-[clamp(2.5rem,5.5vw,4.8rem)] font-extrabold tracking-tight leading-[1.05] text-white"
                        >
                            Hi, I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">Natnael</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff99] via-emerald-400 to-teal-400 drop-shadow-[0_0_15px_rgba(0,255,153,0.15)]">Alemseged</span>
                        </motion.h1>

                        {/* Interactive typed role subtitle */}
                        <motion.h2 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="text-lg md:text-xl font-bold font-mono tracking-wide text-gray-300"
                        >
                            Senior AI Agent Engineer | Forward Deployed Engineer
                        </motion.h2>
                    </div>

                    {/* Description paragraph */}
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl font-sans"
                    >
                        I build deterministic, production-grade multi-agent architectures and enterprise-level evaluation systems. Bridging high-scale async backends (FastAPI) with complex LLM state orchestration to eliminate stochastic drift and cascading tool failures.
                        <span className="block mt-4 text-xs font-semibold text-gray-500 font-mono uppercase tracking-wider">
                            📍 Addis Ababa (EAT / UTC+3) — Available for global remote engineering roles.
                        </span>
                    </motion.p>

                    {/* Action buttons (CTAs) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
                    >
                        <a
                            href="#projects"
                            className="group relative flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#00ff99] text-black rounded-xl font-bold text-sm hover:bg-[#00e87f] transition-all duration-300 shadow-[0_0_25px_rgba(0,255,153,0.25)] hover:shadow-[0_0_35px_rgba(0,255,153,0.4)]"
                        >
                            View Core Work
                            <FaArrowRight className="text-xs group-hover:translate-x-1.5 transition-transform duration-300" />
                        </a>
                        <a
                            href="#contact"
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-3.5 border border-white/10 hover:border-[#00ff99]/40 text-white hover:text-[#00ff99] rounded-xl font-bold text-sm bg-white/[0.01] hover:bg-[#00ff99]/[0.02] transition-all duration-300"
                        >
                            Contact System
                        </a>
                    </motion.div>

                    {/* High-end metrics board */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                        className="grid grid-cols-3 gap-3 md:gap-4 pt-6 border-t border-white/[0.08] w-full max-w-xl"
                    >
                        {[
                            { value: "30+", label: "SHIPPED APPS", icon: <Layers size={13} className="text-[#00ff99]/70" /> },
                            { value: "10K+", label: "USERS REACHED", icon: <Globe size={13} className="text-[#00ff99]/70" /> },
                            { value: "5yr+", label: "DEV CONTRACTS", icon: <Server size={13} className="text-[#00ff99]/70" /> },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="group relative flex flex-col justify-between p-3.5 bg-[#080808]/40 border border-white/[0.04] rounded-xl hover:border-[#00ff99]/25 hover:bg-[#00ff99]/[0.015] transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                    <span className="text-[9px] font-mono text-gray-500 tracking-wider group-hover:text-gray-400 transition-colors uppercase">{stat.label}</span>
                                    {stat.icon}
                                </div>
                                <p className="text-xl md:text-2xl font-black text-white group-hover:text-[#00ff99] transition-colors">{stat.value}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right side: Interactive Hologram */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                    {/* Hologram Circle */}
                    <AvatarHologram />
                </div>

            </div>
        </section>
    );
}
