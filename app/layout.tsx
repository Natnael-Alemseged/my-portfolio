// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Loading from "@/app/Loading";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import ChatWidgetWrapper from "@/components/ChatWidgetWrapper";
import { PROFILE_DESCRIPTION, PROFILE_TITLE } from "@/lib/brand";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: PROFILE_TITLE,
    description: PROFILE_DESCRIPTION,
    keywords: [
        "Applied AI Engineer",
        "AI Systems Engineer",
        "AI Engineer",
        "Multi-agent systems",
        "LLM Evals",
        "Full-stack developer",
        "FastAPI",
        "LangGraph",
        "Next.js",
        "Flutter",
        "TypeScript",
        "Natnael Alemseged",
        "Software Engineer",
        "Portfolio",
    ],
    authors: [
        {
            name: "Natnael Alemseged",
            url: "https://www.linkedin.com/in/natnael-alemseged",
        },
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ? (process.env.NEXT_PUBLIC_SITE_URL.startsWith('http') ? process.env.NEXT_PUBLIC_SITE_URL : `https://${process.env.NEXT_PUBLIC_SITE_URL}`) : "https://natnaelalemseged.com"),
    openGraph: {
        title: PROFILE_TITLE,
        description: PROFILE_DESCRIPTION,
        url: "https://natnaelalemseged.com/",
        siteName: "Natnael Alemseged",
        type: "website",
        images: [{ url: "/og-image.jpg", alt: "Natnael Alemseged" }],
    },
    twitter: {
        card: "summary_large_image",
        title: PROFILE_TITLE,
        description: PROFILE_DESCRIPTION,
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
                <StructuredData />

                <Header />

                <main className="flex-grow pt-20">
                    <Suspense fallback={<Loading />}>
                        {children}
                    </Suspense>
                </main>

                <Footer />

                <ChatWidgetWrapper />
                <SpeedInsights />
            </body>
        </html>
    );
}
