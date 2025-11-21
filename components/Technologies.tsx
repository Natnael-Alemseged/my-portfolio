"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
            <div className="pointer-events-none absolute top-20 left-10 h-80 w-80 bg-[#00ff99]/10 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 bg-[#1f8eff]/10 blur-[100px]" />

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p className="text-xs uppercase tracking-[0.5em] text-[#00ff99] mb-4">
                        Full-Stack Arsenal
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Technologies & Tools
                    </h2>
                    <p className="text-gray-400 max-w-3xl mx-auto">
                        Comprehensive toolkit spanning languages, frameworks, databases, cloud infrastructure, and DevOps—powering enterprise-grade mobile, web, and AI solutions
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
                            className={`px-5 py-2.5 rounded-full border-2 transition-all duration-300 font-semibold text-xs uppercase tracking-wider justify-center items-center
                ${activeTab === category
                                    ? "bg-[#00ff99] text-black border-[#00ff99] shadow-lg shadow-[#00ff99]/30"
                                    : "border-gray-700 hover:border-[#00ff99] hover:bg-[#00ff99]/10"
                                }`}
                        >
                            {category}
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
                                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00ff99]/50 hover:bg-white/10 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                            >
                                <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">
                                    {tech.icon}
                                </div>
                                <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors text-center">
                                    {tech.name}
                                </span>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00ff99]/0 to-[#00ff99]/0 group-hover:from-[#00ff99]/5 group-hover:to-transparent transition-all duration-300" />
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
                    className="text-center mt-12"
                >
                    <p className="text-sm text-gray-500 uppercase tracking-[0.3em]">
                        {Object.values(categories).flat().length}+ Technologies Mastered
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
