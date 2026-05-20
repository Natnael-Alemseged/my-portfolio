"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Bot, Cpu, Database, Terminal, Network, Sparkles } from "lucide-react";

import {
    FaReact,
    FaNodeJs,
    FaDocker,
    FaGitAlt,
    FaPython,
    FaAws,
} from "react-icons/fa";
import {
    SiNextdotjs,
    SiTailwindcss,
    SiExpress,
    SiFastapi,
    SiFlutter,

    SiFirebase,
    SiMongodb,
    SiPostgresql,
    SiAmazon,
    SiLaravel,
    SiTerraform,
    SiAnsible,
    SiIonic,
    SiJetbrains,
    SiTypescript,
    SiJavascript,
    SiPrisma,
    SiReact,
    SiKubernetes,
    SiRedis,
    SiGraphql,
    SiSocketdotio,
    SiGithubactions,
    SiPrometheus,
    SiGrafana,
    SiPostman,
    SiSupabase,
    SiDart,
    SiNestjs,
    SiRabbitmq,
    // SiVercel,
    // SiNetlify,
} from "react-icons/si";

interface Tech {
    name: string;
    icon: React.ReactNode;
}

const categories: { [key: string]: Tech[] } = {
    "AI Architecture": [
        { name: "LangGraph", icon: <Network size={48} className="text-[#00ff99]" /> },
        { name: "LangFlow", icon: <Cpu size={48} className="text-teal-400" /> },
        { name: "Multi-Agent Systems", icon: <Bot size={48} className="text-teal-400" /> },
        { name: "Deterministic State Machines", icon: <Terminal size={48} className="text-[#00ff99]" /> },
        { name: "Directed Acyclic Graphs (DAGs)", icon: <Network size={48} className="text-blue-400" /> },
        { name: "LLM-as-a-Judge / Evals", icon: <Brain size={48} className="text-pink-400" /> },
        { name: "RAG Pipelines", icon: <Cpu size={48} className="text-purple-400" /> },
        { name: "Token Cache Optimization", icon: <Sparkles size={48} className="text-yellow-400" /> },
    ],
    "Backend & Systems": [
        { name: "NestJS Framework", icon: <SiNestjs className="text-red-600" /> },
        { name: "Express.js", icon: <SiExpress className="text-gray-300" /> },
        { name: "Async Python (FastAPI)", icon: <SiFastapi className="text-green-400" /> },
        { name: "Node.js / TypeScript", icon: <FaNodeJs className="text-green-500" /> },
        { name: "Custom MCP Servers", icon: <Terminal size={48} className="text-sky-400" /> },
        { name: "Structured Outputs (Pydantic)", icon: <Brain size={48} className="text-teal-400" /> },
        { name: "WebSockets & Asyncio", icon: <SiSocketdotio className="text-white" /> },
        { name: "RESTful & GraphQL APIs", icon: <SiGraphql className="text-pink-500" /> },
    ],
    "Mobile & Cross-Platform": [
        { name: "React Native (Expo)", icon: <SiReact className="text-sky-500" /> },
        { name: "Flutter (Native Bridge)", icon: <SiFlutter className="text-sky-400" /> },
        { name: "Dart", icon: <SiDart className="text-sky-400" /> },
        { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
        { name: "TypeScript", icon: <SiTypescript className="text-blue-500" /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="text-sky-300" /> },
    ],
    "Infrastructure & MLOps": [
        { name: "Docker & Kubernetes", icon: <FaDocker className="text-blue-400" /> },
        { name: "Terraform", icon: <SiTerraform className="text-[#7B42BC]" /> },
        { name: "Ansible", icon: <SiAnsible className="text-[#EE0000]" /> },
        { name: "MongoDB", icon: <SiMongodb className="text-green-500" /> },
        { name: "RabbitMQ Broker", icon: <SiRabbitmq className="text-orange-500" /> },
        { name: "PostgreSQL / Prisma", icon: <SiPostgresql className="text-sky-500" /> },
        { name: "Redis Cache", icon: <SiRedis className="text-red-500" /> },
        { name: "Vector Databases", icon: <Database size={48} className="text-purple-400" /> },
        { name: "CI/CD & GitHub Actions", icon: <SiGithubactions className="text-gray-300" /> },
        { name: "Observability (Grafana/Prometheus)", icon: <SiGrafana className="text-orange-400" /> },
    ],
};

// Matrix Rain Component
const MatrixRain = ({
    opacity = 0.2,
    fontSize = 14,
    speed = 0.5,
    density = 1,
    color = '#00ff99'
}: {
    opacity?: number,
    fontSize?: number,
    speed?: number,
    density?: number,
    color?: string
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let columns = 0;
        let drops: number[] = [];
        let characters: string[] = [];

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            width = canvas.width = parent.offsetWidth;
            height = canvas.height = parent.offsetHeight;

            columns = Math.floor(width / fontSize) * density;
            // Spread drops across the full height initially
            drops = new Array(Math.ceil(columns)).fill(0).map(() => Math.random() * (height / fontSize));
            characters = new Array(Math.ceil(columns)).fill('').map(() => '');
        };

        const matrixChars = '01<>[]{}(){};:,.ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=?/~`';

        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            ctx.fillStyle = `rgba(0, 0, 0, ${0.1 * speed})`;
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                if (Math.random() > 0.95) {
                    characters[i] = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                } else if (!characters[i]) {
                    characters[i] = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                }

                const char = characters[i];
                const x = (i / density) * fontSize;
                const y = drops[i] * fontSize;

                const rand = Math.random();
                if (rand > 0.99) {
                    ctx.fillStyle = '#fff';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#fff';
                } else if (rand > 0.95) {
                    ctx.fillStyle = color;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = color;
                } else {
                    ctx.fillStyle = `rgba(${color === '#00ff99' ? '0, 255, 153' : '255, 255, 255'}, 0.3)`;
                    ctx.shadowBlur = 0;
                }

                ctx.fillText(char, x, y);

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += speed * (0.5 + Math.random() * 0.5);
            }
        };

        const interval = setInterval(draw, 33);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resize);
        };
    }, [fontSize, speed, density, color]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000"
            style={{ opacity }}
        />
    );
};

export default function Technologies() {
    const [activeTab, setActiveTab] = useState("AI Architecture");

    const techs = categories[activeTab];

    return (
        <section id="technologies" className="relative py-20 px-6 md:px-12 bg-black text-white overflow-hidden">
            {/* Main Matrix Background - Large & Subtle */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <MatrixRain opacity={0.15} fontSize={16} speed={0.4} density={0.8} />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative text-center mb-16"
                >
                    <p className="text-xs uppercase tracking-[0.5em] text-[#00ff99] mb-4">
                        Cognitive Stack & Tech Arsenal
                    </p>
                    <div className="relative inline-block">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 relative z-10">
                            Technologies & Tools
                        </h2>
                        {/* Decorative Header Matrix Bar */}
                        <div
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-64 h-1 overflow-hidden opacity-50">
                            <MatrixRain opacity={0.8} fontSize={8} speed={2} density={2} />
                        </div>
                    </div>
                    <p className="text-gray-400 max-w-3xl mx-auto mt-8 font-sans leading-relaxed">
                        Advanced autonomous AI orchestrations alongside a production-ready, type-safe full-stack ecosystem spanning frontend platforms, cloud infrastructure, databases, and automated pipelines.
                    </p>
                </motion.div>


                {/* Tabs */}
                <div className="flex justify-center gap-2 mb-14 flex-wrap px-4">
                    {Object.keys(categories).map((category) => (
                        <motion.button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-5 py-2.5 rounded-full border-2 transition-all duration-300 font-semibold text-xs uppercase tracking-wider justify-center items-center relative overflow-hidden
                ${activeTab === category
                                    ? "bg-[#00ff99] text-black border-[#00ff99] shadow-lg shadow-[#00ff99]/30"
                                    : "border-gray-700 hover:border-[#00ff99] hover:bg-[#00ff99]/10"
                                }`}
                        >
                            <span className="relative z-10">{category}</span>
                            {activeTab === category && (
                                <div className="absolute inset-0 opacity-20">
                                    <MatrixRain opacity={1} fontSize={6} speed={1.5} density={3} color="#000" />
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Icons Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid gap-10 justify-center grid-cols-[repeat(auto-fit,minmax(200px,200px))]"
                    >
                        {techs.map((tech, index) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.04 }}
                                whileHover={{ scale: 1.08, y: -8 }}
                                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00ff99]/50 hover:bg-white/10 transition-all duration-300 cursor-pointer md:backdrop-blur-sm overflow-hidden"
                            >
                                {/* Card Internal Matrix Effect on Hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                                    <MatrixRain opacity={1} fontSize={10} speed={0.8} density={1.5} />
                                </div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div
                                        className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">
                                        {tech.icon}
                                    </div>
                                    <span
                                        className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors text-center">
                                        {tech.name}
                                    </span>
                                </div>

                                <div
                                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00ff99]/0 to-[#00ff99]/0 group-hover:from-[#00ff99]/5 group-hover:to-transparent transition-all duration-300" />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Tech Count Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12 relative"
                >
                    <div className="inline-block relative">
                        <p className="text-sm text-gray-500 uppercase tracking-[0.3em] relative z-10 py-2">
                            {Object.values(categories).flat().length}+ Technologies Mastered
                        </p>
                        {/* Subtle background glow for the badge */}
                        <div className="absolute inset-0 bg-[#00ff99]/5 blur-xl rounded-full" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
