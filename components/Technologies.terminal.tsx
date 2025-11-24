"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
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
    SiTerraform,
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
    SiVercel,
    SiNetlify,
} from "react-icons/si";

interface Tech {
    name: string;
    icon: React.ReactNode;
}

const categories: { [key: string]: Tech[] } = {
    "Languages": [
        { name: "TypeScript", icon: <SiTypescript className="text-blue-500" /> },
        { name: "JavaScript", icon: <SiJavascript className="text-yellow-400" /> },
        { name: "Python", icon: <FaPython className="text-blue-400" /> },
        { name: "Dart", icon: <SiFlutter className="text-sky-400" /> },
        { name: "Kotlin", icon: <SiJetbrains className="text-purple-500" /> },
    ],
    "Frontend & Mobile": [
        { name: "React", icon: <FaReact className="text-sky-400" /> },
        { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
        { name: "Flutter", icon: <SiFlutter className="text-sky-400" /> },
        { name: "React Native", icon: <SiReact className="text-sky-500" /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="text-sky-300" /> },
        { name: "Ionic", icon: <SiIonic className="text-blue-500" /> },
    ],
    "Backend & APIs": [
        { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
        { name: "Express", icon: <SiExpress className="text-gray-300" /> },
        { name: "FastAPI", icon: <SiFastapi className="text-green-400" /> },
        { name: "Prisma", icon: <SiPrisma className="text-white" /> },
        { name: "GraphQL", icon: <SiGraphql className="text-pink-500" /> },
        { name: "Socket.io", icon: <SiSocketdotio className="text-white" /> },
    ],
    "Databases": [
        { name: "PostgreSQL", icon: <SiPostgresql className="text-sky-500" /> },
        { name: "MongoDB", icon: <SiMongodb className="text-green-500" /> },
        { name: "Redis", icon: <SiRedis className="text-red-500" /> },
        { name: "Firebase", icon: <SiFirebase className="text-yellow-400" /> },
        { name: "Supabase", icon: <SiSupabase className="text-green-400" /> },
    ],
    "Cloud & DevOps": [
        { name: "AWS", icon: <FaAws className="text-orange-400" /> },
        { name: "Docker", icon: <FaDocker className="text-blue-400" /> },
        { name: "Kubernetes", icon: <SiKubernetes className="text-blue-500" /> },
        { name: "Terraform", icon: <SiTerraform className="text-purple-500" /> },
        { name: "GitHub Actions", icon: <SiGithubactions className="text-gray-300" /> },
        { name: "Vercel", icon: <SiVercel className="text-white" /> },
        { name: "Netlify", icon: <SiNetlify className="text-teal-400" /> },
    ],
    "Monitoring & Tools": [
        { name: "Git", icon: <FaGitAlt className="text-orange-500" /> },
        { name: "Prometheus", icon: <SiPrometheus className="text-orange-500" /> },
        { name: "Grafana", icon: <SiGrafana className="text-orange-400" /> },
        { name: "Postman", icon: <SiPostman className="text-orange-500" /> },
    ],
};

export default function Technologies() {
    const [activeTab, setActiveTab] = useState("Languages");

    const techs = categories[activeTab];

    return (
        <section id="technologies" className="relative py-20 px-6 md:px-12 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#050505] text-white overflow-hidden">
            {/* CRT Scanlines Overlay */}
            <div className="terminal-scanlines absolute inset-0 opacity-20 pointer-events-none"></div>

            <div className="pointer-events-none absolute top-20 left-10 h-80 w-80 bg-[#00ff99]/10 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 bg-[#1f8eff]/10 blur-[100px]" />

            <div className="relative max-w-7xl mx-auto z-10">
                {/* Section Header - Terminal Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Terminal className="text-[#00ff99]" size={32} />
                        <h2 className="text-3xl md:text-4xl font-mono font-bold text-[#00ff99] terminal-glow uppercase tracking-wider">
                            &gt;&gt; TECH_STACK.SYS
                        </h2>
                    </div>
                    <div className="h-0.5 bg-[#00ff99] mb-4 terminal-glow"></div>
                    <p className="text-gray-400 font-mono text-sm uppercase tracking-wide">
                        [SYSTEM] Comprehensive toolkit spanning languages, frameworks, databases, cloud infrastructure, and DevOps
                    </p>
                </motion.div>

                {/* Tabs - Terminal Command Style */}
                <div className="flex justify-center gap-2 mb-14 flex-wrap px-4">
                    {Object.keys(categories).map((category) => (
                        <motion.button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-5 py-2.5 border-2 transition-all duration-300 font-mono font-bold text-xs uppercase tracking-wider relative overflow-hidden
                ${activeTab === category
                                    ? "bg-[#00ff99] text-black border-[#00ff99] shadow-[0_0_15px_rgba(0,255,153,0.5)]"
                                    : "bg-black border-[#00ff99]/30 text-[#00ff99] hover:border-[#00ff99] hover:bg-[#00ff99]/10"
                                }`}
                        >
                            {activeTab === category && (
                                <div className="terminal-scanlines absolute inset-0 opacity-20 pointer-events-none"></div>
                            )}
                            <span className="relative z-10">&gt; {category}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Icons Grid - Terminal Style */}
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
                                className="group relative flex flex-col items-center justify-center p-6 bg-black border-2 border-[#00ff99]/30 hover:border-[#00ff99] hover:shadow-[0_0_15px_rgba(0,255,153,0.3)] transition-all duration-300 cursor-pointer"
                            >
                                {/* Scanlines on hover */}
                                <div className="terminal-scanlines absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>

                                <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110 relative z-10">
                                    {tech.icon}
                                </div>
                                <span className="text-xs font-mono font-semibold text-[#00ff99]/70 group-hover:text-[#00ff99] transition-colors text-center uppercase tracking-wide relative z-10">
                                    {tech.name}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Tech Count Badge - Terminal Style */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <p className="text-sm font-mono text-[#00ff99]/60 uppercase tracking-[0.3em]">
                        [TOTAL] {Object.values(categories).flat().length}+ Technologies Mastered
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
