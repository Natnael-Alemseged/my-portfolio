// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

import Loading from "@/app/Loading";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Natnael Alemseged – Portfolio",
    description: "Full-stack developer and AI enthusiast based in Ethiopia.",
    keywords: [
        "Full-stack developer",
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
    authors: [
        {
            name: "Natnael Alemseged",
            url: "https://www.linkedin.com/in/natnael-alemseged",
        },
    ],
    metadataBase: new URL("https://natnael-alemseged.vercel.app/"),
    openGraph: {
        title: "Natnael Alemseged – Portfolio",
        description: "Explore my work, skills, and experience.",
        url: "https://natnael-alemseged.vercel.app/",
        siteName: "Natnael Alemseged Portfolio",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Natnael Alemseged Portfolio",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Natnael Alemseged – Portfolio",
        description: "Explore my work, skills, and experience.",
        creator: "@yourhandle", // Optional: Replace with your real Twitter handle
        images: ["/og-image.jpg"],
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
