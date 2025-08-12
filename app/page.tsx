// app/page.tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import {Metadata} from "next";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import WorkExperience from "@/components/WorkExperience";
import Technologies from "@/components/Technologies";
import AvailabilityGlobe from "@/components/AvailabilityGlobe";

export const generateMetadata = (): Metadata => ({
    title: 'Home – Natnael Alemseged',
    description: "I'm a full-stack developer and AI enthusiast based in Ethiopia, specializing in web, mobile, and AI-powered software solutions."

});


export default function Home() {
    return (
        <div className="min-h-screen bg-[#f9fafb]">


            {/* Hero Section */}
            <Hero />
            {/* About Me  Section */}
            <About />
            {/*<AvailabilityGlobe /> /!* Here it goes *!/*/}

            <Technologies />

            {/* Projects Section */}
            <Projects />

            {/* Testimonials */}
            <Testimonials />

            {/* Work Experience Section */}
            <WorkExperience />


        </div>
    )
}