"use client";
import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
    FaReact,
    FaNodeJs,
    FaDocker,
    FaGitAlt,
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
} from "react-icons/si";

interface Tech {
    name: string;
    icon: React.ReactNode;
}

const categories: { [key: string]: Tech[] } = {
    "Frontend & Mobile": [
        {name: "Flutter", icon: <SiFlutter className="text-sky-400"/>},
        {name: "React", icon: <FaReact className="text-sky-400"/>},
        {name: "Next.js", icon: <SiNextdotjs className="text-white"/>},
        {name: "Tailwind", icon: <SiTailwindcss className="text-sky-300"/>},
        {name: "Ionic", icon: <SiIonic className="text-blue-500"/>},
        {name: "Kotlin", icon: <SiJetbrains className="text-purple-500"/>},
    ],
    Backend: [
        {name: "Node.js", icon: <FaNodeJs className="text-green-500"/>},
        {name: "Express", icon: <SiExpress className="text-gray-300"/>},
        {name: "FastAPI", icon: <SiFastapi className="text-green-400"/>},
        {name: "Laravel", icon: <SiLaravel className="text-red-600"/>},
    ],
    Tools: [
        {name: "Docker", icon: <FaDocker className="text-blue-400"/>},
        {name: "AWS", icon: <SiAmazon className="text-orange-400"/>},
        {name: "Git", icon: <FaGitAlt className="text-orange-500"/>},
        {name: "MongoDB", icon: <SiMongodb className="text-green-500"/>},
        {name: "PostgreSQL", icon: <SiPostgresql className="text-sky-500"/>},
        {name: "Firebase", icon: <SiFirebase className="text-yellow-400"/>},
        {name: "Terraform", icon: <SiTerraform className="text-green-600"/>},
        {name: "Ansible", icon: <SiAnsible className="text-red-500"/>},
    ],
};

export default function Technologies() {
    const [activeTab, setActiveTab] = useState("Frontend & Mobile");

    const techs = categories[activeTab];
    const gridCols =
        techs.length <= 3
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

    return (
        <section id="technologies" className="py-16 bg-[#0d0d0d] text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-8">Technologies</h2>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-8 flex-wrap">
                    {Object.keys(categories).map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`px-4 py-2 rounded-full border transition-all duration-300 
                ${
                                activeTab === category
                                    ? "bg-white text-black"
                                    : "border-gray-500 hover:bg-gray-800"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Icons Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.3}}
                        className={`grid ${gridCols} gap-6 place-items-center`}
                    >
                        {techs.map((tech) => (
                            <div key={tech.name} className="flex flex-col items-center space-y-2">
                                <div className="text-5xl">{tech.icon}</div>
                                <span className="text-sm">{tech.name}</span>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
