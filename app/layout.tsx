// app/layout.tsx
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React, {Suspense} from "react";

import Loading from "@/app/Loading";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/header";
import Footer from "@/components/Footer";
// import ChatWidget from "@/components/ChatWidget";


import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/ChatWidget"), {
    ssr: false,
});

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Natnael Alemseged – AI Engineer & Full-Stack Developer",
    description:
        "AI Engineer and Full-Stack Developer specializing in LLM-powered systems, LangGraph agents, FastAPI backends, vector databases, Next.js, and Flutter.",
    keywords: [
        "Full-stack developer",
        "AI Engineer",
        "React",
        "Flutter",
        "FastAPI",
        "React Native",
        "Express.js",
        "Next.js",
        "TypeScript",
        "Natnael Alemseged",
        "Software Engineer",
        "Portfolio",
    ],
    alternates: {
        canonical: "https://natnaelalemseged.com",
    },
    authors: [
        {
            name: "Natnael Alemseged",
            url: "https://www.linkedin.com/in/natnael-alemseged",
        },
    ],
    metadataBase: new URL("https://natnaelalemseged.com"),
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
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
};


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
        <StructuredData/>

        <Header/>

        <main className="flex-grow">
            <Suspense fallback={<Loading/>}>
                {children}
            </Suspense>
        </main>

        <Footer/>

        <ChatWidget/>
        </body>
        </html>
    );
}