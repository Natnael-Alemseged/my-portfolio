// components/StructuredData.tsx
"use client";

import { useEffect } from "react";

export default function StructuredData() {
    useEffect(() => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Natnael Alemseged",
            url: "https://natnael-alemseged.vercel.app",
            sameAs: [
                "https://www.linkedin.com/in/natnael-alemseged",
                "https://github.com/NatnaelAlemseged",
            ],
            jobTitle: "Full-Stack Software Engineer",
            worksFor: {
                "@type": "Organization",
                name: "Freelance",
            },
        });
        document.head.appendChild(script);
    }, []);

    return null;
}
