// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";

import Loading from "@/app/Loading";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Natnael Alemseged – Portfolio",
    description: "Full-stack Developer & AI Automation Engineer specializing in React, Flutter, FastAPI, and Node.js.",
    keywords: [
        "Full-stack developer",
        "AI Automation Engineer",
        "React",
        "Flutter",
        "FastAPI",
        "Express.js",
        "Next.js",
        "TypeScript",
        "Natnael Alemseged",
        "Software Engineer",
        "Portfolio",
    ],
    alternates: {
        canonical: "https://natnael-alemseged.vercel.app",
    },
    authors: [
        {
            name: "Natnael Alemseged",
            url: "https://www.linkedin.com/in/natnael-alemseged",
        },
    ],
    metadataBase: new URL("https://natnael-alemseged.vercel.app"),
    openGraph: {
        title: "Natnael Alemseged – Portfolio",
        description: "Full-stack Developer & AI Automation Engineer specializing in React, Flutter, FastAPI, and Node.js.",
        url: "https://natnael-alemseged.vercel.app",
        siteName: "Natnael Alemseged",
        images: [
            {
                url: "https://natnael-alemseged.vercel.app/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Natnael Alemseged – Full-Stack Developer and AI Automation Engineer",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Natnael Alemseged – Portfolio",
        description: "Full-stack Developer & AI Automation Engineer specializing in React, Flutter, FastAPI, and Node.js.",
        creator: "@yourhandle",
        images: ["https://natnael-alemseged.vercel.app/og-image.jpg"],
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
        <StructuredData />
        <Suspense fallback={<Loading />}>
            {/*<MixpanelTracker>*/}
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
            {/*</MixpanelTracker>*/}
        </Suspense>
        </body>
        </html>
    );
}
