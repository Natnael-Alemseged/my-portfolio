import { Metadata } from "next";
import Projects from "@/components/Projects";
import connectToDatabase from "@/lib/db/mongoose";
import Project from "@/lib/db/project.model";

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
