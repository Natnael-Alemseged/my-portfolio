// app/components/StructuredData.tsx
export default function StructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": "https://natnael-alemseged.vercel.app/#person",
                "name": "Natnael Alemseged",
                "url": "https://natnael-alemseged.vercel.app",
                "image": "https://natnael-alemseged.vercel.app/images/profile.jpg", // Ensure this exists
                "jobTitle": "Full-Stack Software Engineer & AI Automation Engineer",
                "sameAs": [
                    "https://www.linkedin.com/in/natnael-alemseged",
                    "https://github.com/natnael-alemseged",
                    // Add Twitter/X profile if applicable, e.g., "https://x.com/yourhandle"
                ],
            },
            {
                "@type": "WebSite",
                "@id": "https://natnael-alemseged.vercel.app/#website",
                "url": "https://natnael-alemseged.vercel.app",
                "name": "Natnael Alemseged – Portfolio",
                "publisher": {
                    "@id": "https://natnael-alemseged.vercel.app/#person",
                },
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://natnael-alemseged.vercel.app/#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://natnael-alemseged.vercel.app",
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Projects",
                        "item": "https://natnael-alemseged.vercel.app/projects",
                    },
                ],
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData),
            }}
        />
    );
}