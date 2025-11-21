"use client";

import { motion } from "framer-motion";

const projects = [
    {
        id: 1,
        name: "Bible AI Chat",
        description:
            "AI-powered Bible study chat app with character-driven conversations and vector search.",
        image: "/assets/projects/bible-ai-chat.webp",
        techStack: ["Flutter", "FastAPI", "Ollama", "PostgreSQL", "Firebase"],
        demoUrl: "https://bibleai.example.com",
        codeUrl: "https://github.com/yourusername/bible-ai-chat",
    },
    {
        id: 2,
        name: "Startup Agile CRM",
        description:
            "A CRM tool for startups to manage clients, sales pipelines, and collaboration.",
        image: "/assets/projects/startup-agile.webp",
        techStack: ["React", "Node.js", "Express", "MongoDB", "Docker"],
        demoUrl: "https://crm.startupagile.app",
        codeUrl: "https://github.com/yourusername/startup-agile-crm",
    },
    {
        id: 3,
        name: "Meal Ordering App",
        description:
            "Mobile app to order food with seamless Firebase backend and FlutterFlow UI.",
        image: "/assets/projects/meal-ordering.webp",
        techStack: ["Flutter", "Firebase", "FlutterFlow"],
        demoUrl: "https://mealapp.example.com",
        codeUrl: "https://github.com/yourusername/meal-ordering-app",
    },
    {
        id: 4,
        name: "Portfolio Website",
        description:
            "My personal portfolio website built with Next.js and Tailwind CSS.",
        image: "/assets/projects/portfolio.webp",
        techStack: ["Next.js", "Tailwind", "React"],
        demoUrl: "https://natnael.dev",
        codeUrl: "https://github.com/yourusername/portfolio",
    },
    // Add more projects as needed
];

export default function Projects() {
    return (
        <section id="projects" className="bg-[#0d0d0d] py-20 px-6 md:px-12 text-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center text-[#00ff99]">
                    Projects
                </h2>
                <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {projects.map(({ id, name, description, image, techStack, demoUrl, codeUrl }) => (
                    <motion.article
                        key={id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: id * 0.15 }}
                        className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-[0_0_35px_rgba(0,255,153,0.45)] hover:scale-[1.03] transition-transform duration-300 flex flex-col"
                    >
                        <div className="relative h-48 sm:h-56 md:h-48 lg:h-56">
                            <img
                                src={image}
                                alt={`${name} screenshot`}
                                className="object-cover w-full h-full"
                                loading="lazy"
                            />
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-semibold mb-2">{name}</h3>
                            <p className="text-gray-300 flex-grow">{description}</p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="bg-emerald-600 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full"
                                    >
                    {tech}
                  </span>
                                ))}
                            </div>

                            <div className="mt-6 flex space-x-4">
                                <a
                                    href={demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 bg-[#00ff99] text-black font-semibold rounded-lg hover:bg-[#00e68a] transition"
                                    aria-label={`View demo of ${name}`}
                                >
                                    Demo
                                </a>
                                <a
                                    href={codeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 border border-[#00ff99] text-[#00ff99] font-semibold rounded-lg hover:bg-[#00ff99] hover:text-black transition"
                                    aria-label={`View code of ${name}`}
                                >
                                    Code
                                </a>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
            </div>
        </section>
    );
}
