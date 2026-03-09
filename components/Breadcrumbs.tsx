"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { useSearchParams } from 'next/navigation';

interface BreadcrumbsProps {
    projectTitle: string;
}

export default function Breadcrumbs({ projectTitle }: BreadcrumbsProps) {
    const [cameFromArchive, setCameFromArchive] = useState(false);

    const searchParams = useSearchParams();
    const from = searchParams.get('from');

    useEffect(() => {
        // Use the 'from' param as priority, fallback to referrer
        if (from === 'archive') {
            setCameFromArchive(true);
        } else {
            const referrer = document.referrer;
            if (referrer.includes('/projects') && !referrer.includes('/projects/')) {
                setCameFromArchive(true);
            }
        }
    }, [from]);

    return (
        <nav className="flex items-center gap-1.5 text-[10px] md:text-sm font-medium text-gray-500 mb-8 uppercase tracking-widest font-mono">
            <Link href="/" className="hover:text-[#00ff99] transition-colors">Home</Link>

            <span className="text-gray-700 opacity-50 px-1 text-[8px]"> <ChevronRight color="#12f49aff" /> </span>

            {cameFromArchive && (
                <>
                    <Link href="/projects" className="hover:text-[#00ff99] transition-colors">Projects</Link>
                    <span className="text-gray-700 opacity-50 px-1 text-[8px]"> <ChevronRight color="#12f49aff" /> </span>
                </>
            )}

            <span className="text-[#00ff99] truncate max-w-[120px] md:max-w-none">
                {projectTitle}
            </span>
        </nav>
    );
}
