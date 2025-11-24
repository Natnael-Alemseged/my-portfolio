"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaGlobe, FaGooglePlay, FaAppStoreIos } from "react-icons/fa";

interface Project {
    _id: string;
    title: string;
    description: string;
    images: string[];
    techStack: string[];
    links: {
        web?: string;
        playstore?: string;
        appstore?: string;
        github?: string;
    };
}

export default function Projects({ initialProjects = [] }: { initialProjects?: Project[] }) {
    return (
        <section id="projects" className="bg-[#0d0d0d] py-20 px-6 md:px-12 text-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center text-[#00ff99]">
                    Projects
                </h2>
                <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {initialProjects.map((project, index) => (
                        <motion.article
                            key={project._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-[0_0_35px_rgba(0,255,153,0.45)] hover:scale-[1.03] transition-transform duration-300 flex flex-col"
                        >
                            <div className="relative h-48 sm:h-56 md:h-48 lg:h-56 group">
                                <img
                                    src={project.images[0] || '/placeholder.jpg'}
                                    alt={`${project.title} screenshot`}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Link href={`/project/${project._id}`} className="px-6 py-2 bg-[#00ff99] text-black font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        View Details
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-semibold mb-2 text-[#00ff99]">
                                    <Link href={`/project/${project._id}`} className="hover:underline">
                                        {project.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-300 flex-grow line-clamp-3">{project.description}</p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {project.techStack.slice(0, 4).map((tech) => (
                                        <span
                                            key={tech}
                                            className="bg-gray-800 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-900/30"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.techStack.length > 4 && (
                                        <span className="text-gray-500 text-xs flex items-center">+{project.techStack.length - 4} more</span>
                                    )}
                                </div>

                                <div className="mt-6 flex space-x-4">
                                    {project.links.web && (
                                        <a href={project.links.web} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00ff99] transition" title="Website">
                                            <FaGlobe size={20} />
                                        </a>
                                    )}
                                    {project.links.github && (
                                        <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00ff99] transition" title="GitHub">
                                            <FaGithub size={20} />
                                        </a>
                                    )}
                                    {project.links.playstore && (
                                        <a href={project.links.playstore} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00ff99] transition" title="Play Store">
                                            <FaGooglePlay size={20} />
                                        </a>
                                    )}
                                    {project.links.appstore && (
                                        <a href={project.links.appstore} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00ff99] transition" title="App Store">
                                            <FaAppStoreIos size={20} />
                                        </a>
                                    )}
                                    <Link href={`/project/${project._id}`} className="ml-auto text-sm text-[#00ff99] hover:underline">
                                        View More &rarr;
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
