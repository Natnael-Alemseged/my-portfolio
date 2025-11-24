import Hero from "@/components/Hero";
import About from "@/components/About";
import { Metadata } from "next";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import WorkExperience from "@/components/WorkExperience";
import Technologies from "@/components/Technologies";
import AvailabilityGlobe from "@/components/AvailabilityGlobe";
import Contact from "@/components/Contact";
import connectToDatabase from "@/lib/db/mongoose";
import Project from "@/lib/db/project.model";

export const generateMetadata = (): Metadata => ({
    title: 'Home – Natnael Alemseged',
    description: "I'm a full-stack developer and AI enthusiast based in Ethiopia, specializing in web, mobile, and AI-powered software solutions."

});

async function getProjects() {
    try {
        await connectToDatabase();
        const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
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