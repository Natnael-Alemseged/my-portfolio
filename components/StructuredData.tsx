// app/components/StructuredData.tsx
import { PROFILE_DESCRIPTION, PROFILE_ROLE, UPWORK_PROFILE_URL } from "@/lib/brand";

export default function StructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": "https://natnaelalemseged.com/#person",
                "name": "Natnael Alemseged",
                "url": "https://natnaelalemseged.com",
                "image": "https://natnaelalemseged.com/avatar_HD.png",
                "jobTitle": PROFILE_ROLE,
                "description": PROFILE_DESCRIPTION,
                "knowsAbout": ["Multi-agent systems", "LLM evaluation", "LangGraph", "FastAPI", "Next.js", "Flutter", "Retrieval-augmented generation", "Distributed systems"],
                "sameAs": [
                    "https://www.linkedin.com/in/natnael-alemseged",
                    "https://github.com/natnael-alemseged",
                    UPWORK_PROFILE_URL,
                    // Add Twitter/X profile if applicable, e.g., "https://x.com/yourhandle"
                ],
            },
            {
                "@type": "WebSite",
                "@id": "https://natnaelalemseged.com/#website",
                "url": "https://natnaelalemseged.com",
                "name": "Natnael Alemseged – Portfolio",
                "publisher": {
                    "@id": "https://natnaelalemseged.com/#person",
                },
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://natnaelalemseged.com/#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://natnaelalemseged.com",
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Projects",
                        "item": "https://natnaelalemseged.com/projects",
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
