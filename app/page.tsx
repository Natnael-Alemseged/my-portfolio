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
    title: 'Natnael Alemseged – Full-Stack Developer & AI Engineer',
    description: "Full-stack developer and AI enthusiast based in Ethiopia, specializing in web, mobile, and AI-powered software solutions. Explore my projects featuring Flutter, React, Node.js, and machine learning.",
    keywords: ['Full-Stack Developer', 'AI Engineer', 'Flutter Developer', 'React Developer', 'Node.js', 'Machine Learning', 'Ethiopia', 'Software Engineer'],
    authors: [{ name: 'Natnael Alemseged' }],
    openGraph: {
        title: 'Natnael Alemseged – Full-Stack Developer & AI Engineer',
        description: "Full-stack developer and AI enthusiast specializing in web, mobile, and AI-powered solutions.",
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Natnael Alemseged – Full-Stack Developer & AI Engineer',
        description: "Full-stack developer and AI enthusiast specializing in web, mobile, and AI-powered solutions.",
    },
});

async function getProjects() {
    try {
        await connectToDatabase();
        // Only fetch public projects for homepage
        const projects = await Project.find({ visibility: 'public' })
            .sort({ featured: -1, createdAt: -1 })
            .lean();
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