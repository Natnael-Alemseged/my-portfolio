import Hero from "@/components/Hero";
import About from "@/components/About";
import { Metadata } from "next";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
// import WorkExperience from "@/components/WorkExperience";
import WorkExperience from "@/components/WorkExperience.modern";
// import Technologies from "@/components/Technologies";
import Technologies from "@/components/Technologies.modern";
import FdeEdge from "@/components/FdeEdge";
import Publications from "@/components/Publications";
import Contact from "@/components/Contact";
import connectToDatabase from "@/lib/db/mongoose";
import Project from "@/lib/db/project.model";

export const generateMetadata = (): Metadata => ({
    title: "Natnael Alemseged – Senior AI Agent Engineer | Forward Deployed Engineer",
    description:
        "Senior AI Agent Engineer & Forward Deployed Engineer building deterministic multi-agent architectures, enterprise evaluation frameworks (Evals), and high-performance cross-platform systems.",
    authors: [{ name: "Natnael Alemseged" }],
    openGraph: {
        title: "Natnael Alemseged – Senior AI Agent Engineer | Forward Deployed Engineer",
        description: "Senior AI Agent Engineer and Forward Deployed Engineer building deterministic multi-agent state machines, system-level evals, and high-performance cross-platform systems.",
        url: "https://natnaelalemseged.com",
        siteName: "Natnael Alemseged",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Natnael Alemseged – Senior AI Agent Engineer | Forward Deployed Engineer",
        description: "Senior AI Agent Engineer and Forward Deployed Engineer building deterministic multi-agent state machines, system-level evals, and high-performance cross-platform systems.",
    },
    alternates: {
        canonical: "/",
    },
});


async function getProjects() {
    try {
        await connectToDatabase();
        const projects = await Project.find({
            visibility: 'public',
            status: { $ne: 'archived' }
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

export const revalidate = 3600; // ISR: revalidate homepage every hour

export default async function Home() {
    const projects = await getProjects();

    return (
        <div className="min-h-screen bg-[#030303]">


            {/* Hero Section */}
            <Hero />
            {/* About Me  Section */}
            <About />
            {/*<AvailabilityGlobe /> /!* Here it goes *!/*/}

            <Technologies />

            {/* FDE Edge (Why Hire Me) Section */}
            <FdeEdge />

            {/* Projects Section */}
            <Projects initialProjects={projects} limit={6} showViewAll={true} />

            {/* Publications & Alignment Section */}
            <Publications />

            {/* Testimonials */}
            <Testimonials />

            {/* Work Experience Section */}
            <WorkExperience />

            {/* Contact Section */}
            <Contact />


        </div>
    )
}