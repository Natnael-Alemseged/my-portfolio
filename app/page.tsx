import Hero from "@/components/Hero";
import About from "@/components/About";
import { Metadata } from "next";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
// import WorkExperience from "@/components/WorkExperience";
import WorkExperience from "@/components/WorkExperience.modern";
// import Technologies from "@/components/Technologies";
import Technologies from "@/components/Technologies.modern";
import AvailabilityGlobe from "@/components/AvailabilityGlobe";
import Contact from "@/components/Contact";
import connectToDatabase from "@/lib/db/mongoose";
import Project from "@/lib/db/project.model";

export const generateMetadata = (): Metadata => ({
    title: "Natnael Alemseged – AI Engineer & Full-Stack Developer",
    description:
        "AI Engineer and Full-Stack Developer building LLM-powered systems, agent-based architectures, and scalable backends using FastAPI, LangGraph, vector databases, Next.js, and Flutter.",
    authors: [{ name: "Natnael Alemseged" }],
    openGraph: {
        title: "Natnael Alemseged – AI Engineer & Full-Stack Developer",
        description: "AI Engineer and Full-Stack Developer building LLM-powered systems, agent workflows, and scalable applications.",
        url: "https://natnaelalemseged.com",
        siteName: "Natnael Alemseged",
        images: [{ url: "/og-image.jpg" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Natnael Alemseged – AI Engineer & Full-Stack Developer",
        description: "AI Engineer and Full-Stack Developer building LLM-powered systems, agent workflows, and scalable applications.",
        images: ["/og-image.jpg"],
    },
});


async function getProjects() {
    try {
        await connectToDatabase();
        // Only fetch public projects for homepage
        const projects = await Project.find({ visibility: 'public' })
            .sort({ featured: -1, createdAt: -1 })
            .lean();
        console.log('projects', JSON.stringify( projects, null, 2));
        return JSON.parse(JSON.stringify(projects));
    } catch (error) {
        console.error("Failed to fetch projects", error);
        return [];
    }
}

export default async function Home() {
    const projects = await getProjects();

    return (
        <div className="min-h-screen bg-[#f9fafb]">


            {/* Hero Section */}
            <Hero />
            {/* About Me  Section */}
            <About />
            {/*<AvailabilityGlobe /> /!* Here it goes *!/*/}

            <Technologies />

            {/* Projects Section */}
            <Projects initialProjects={projects} />

            {/* Testimonials */}
            <Testimonials />

            {/* Work Experience Section */}
            <WorkExperience />

            {/* Contact Section */}
            <Contact />


        </div>
    )
}