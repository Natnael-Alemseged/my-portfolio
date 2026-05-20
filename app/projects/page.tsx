import { Metadata } from "next";
import Projects from "@/components/Projects";
import connectToDatabase from "@/lib/db/mongoose";
import Project from "@/lib/db/project.model";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export const metadata: Metadata = {
    title: "All Projects | Natnael Alemseged",
    description: "Full archive of my projects across AI, mobile, and web development.",
    alternates: {
        canonical: "/projects",
    },
};

async function getProjects() {
    try {
        await connectToDatabase();
        const projects = await Project.find({
            visibility: "public",
            status: { $ne: "archived" }
        })
            .select("_id slug title summary keyTakeaway images logo_image techStack tags links featured schemaType")
            .sort({ position: 1, createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(projects));
    } catch (error) {
        console.error("Failed to fetch projects", error);
        return [];
    }
}

export const revalidate = 3600; // ISR: revalidate projects list every hour

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <main className="relative min-h-screen bg-[#030303] overflow-hidden">
            {/* Ambient Premium background aesthetics */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:64px_64px]" />
            <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,153,0.08),transparent_50%)] pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#00ff99]/[0.015] rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-teal-500/[0.015] rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-20 max-w-7xl mx-auto pt-10 px-6 md:px-12">
                <Link
                    href="/#projects"
                    className="group inline-flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.25em] border border-white/[0.06] bg-white/[0.02] hover:bg-[#00ff99]/[0.04] hover:border-[#00ff99]/30 hover:text-[#00ff99] px-4 py-2.5 rounded-full text-gray-400 transition-all duration-300 backdrop-blur-md shadow-lg"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1.5 transition-transform text-[#00ff99]/80 group-hover:text-[#00ff99]" />
                    Back to Terminal
                </Link>
            </div>

            <Projects
                initialProjects={projects}
                title="Full Project Archive"
                subtitle="A comprehensive collection of my engineering work, experiments, and open-source contributions."
                badge="All Work"
                layout="grid"
                referrerSource="archive"
                centerHeader={true}
            />
        </main>
    );
}
