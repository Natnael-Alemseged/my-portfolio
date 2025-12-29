import { Metadata } from "next";
import Projects from "@/components/Projects";
import connectToDatabase from "@/lib/db/mongoose";
import Project from "@/lib/db/project.model";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export const metadata: Metadata = {
    title: "All Projects | Natnael Alemseged",
    description: "Full archive of my projects across AI, mobile, and web development.",
};

async function getProjects() {
    try {
        await connectToDatabase();
        const projects = await Project.find({ visibility: "public" })
            .sort({ position: 1, createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(projects));
    } catch (error) {
        console.error("Failed to fetch projects", error);
        return [];
    }
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <main className="min-h-screen bg-[#030303]">
            <div className="max-w-7xl mx-auto pt-10 px-6 md:px-12">
                <Link
                    href="/#projects"
                    className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>

            <Projects
                initialProjects={projects}
                title="Full Project Archive"
                subtitle="A comprehensive collection of my engineering work, experiments, and open-source contributions."
                badge="All Work"
                layout="grid"
            />
        </main>
    );
}
