"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function BackButton() {
    const router = useRouter();
    const [backPath, setBackPath] = useState('/#projects');
    const [backLabel, setBackLabel] = useState('Back to Projects');

    useEffect(() => {
        // Check if the user came from /projects
        const referrer = document.referrer;
        if (referrer.includes('/projects') && !referrer.includes('/projects/')) {
            setBackPath('/projects');
            setBackLabel('Back to Archive');
        } else {
            setBackPath('/#projects');
            setBackLabel('Back to Projects');
        }
    }, []);

    return (
        <button
            onClick={() => router.push(backPath)}
            className="inline-flex items-center gap-2 text-[#00ff99] hover:underline"
            aria-label={backLabel}
        >
            <FaArrowLeft /> {backLabel}
        </button>
    );
}
