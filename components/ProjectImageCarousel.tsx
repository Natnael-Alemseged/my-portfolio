"use client";

import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export interface CarouselImage {
    url: string;
    alt: string;
    caption?: string;
    order?: number;
}

export type CarouselDeviceFrame = 'phone' | 'tablet';

interface ProjectImageCarouselProps {
    images: CarouselImage[];
    device?: CarouselDeviceFrame;
}

export default function ProjectImageCarousel({ images, device = 'tablet' }: ProjectImageCarouselProps) {
    const sortedImages = [...images].sort((a, b) => (a.order || 0) - (b.order || 0));
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const figureClassName =
        device === 'phone'
            ? 'min-w-[220px] sm:min-w-[260px] max-w-[260px] bg-[#050505] border border-emerald-900/30 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-[0_0_25px_rgba(0,255,153,0.12)] snap-center'
            : 'min-w-[280px] sm:min-w-[420px] max-w-[420px] bg-[#050505] border border-emerald-900/30 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-[0_0_25px_rgba(0,255,153,0.12)] snap-center';

    const frameOuterClassName =
        device === 'phone'
            ? 'relative w-full rounded-[40px] bg-[#0a0a0a] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-[10px]'
            : 'relative w-full rounded-[28px] bg-[#0a0a0a] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-[12px]';

    const screenClassName =
        device === 'phone'
            ? 'relative w-full h-[460px] overflow-hidden rounded-[32px] bg-gradient-to-b from-gray-900 to-black'
            : 'relative w-full h-[360px] overflow-hidden rounded-[18px] bg-gradient-to-b from-gray-900 to-black';

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const updateScrollState = () => {
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 10);
        };

        updateScrollState();
        el.addEventListener('scroll', updateScrollState, { passive: true });
        window.addEventListener('resize', updateScrollState);
        return () => {
            el.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, []);

    const handleScroll = (direction: 'left' | 'right') => {
        const el = containerRef.current;
        if (!el) return;
        const scrollAmount = el.clientWidth * 0.8;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10" />

            {canScrollLeft && (
                <button
                    type="button"
                    aria-label="Scroll screenshots left"
                    onClick={() => handleScroll('left')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-[#00ff99] p-3 rounded-full backdrop-blur border border-emerald-500/40 hover:bg-black/70 transition"
                >
                    <FaChevronLeft />
                </button>
            )}

            {canScrollRight && (
                <button
                    type="button"
                    aria-label="Scroll screenshots right"
                    onClick={() => handleScroll('right')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-[#00ff99] p-3 rounded-full backdrop-blur border border-emerald-500/40 hover:bg-black/70 transition"
                >
                    <FaChevronRight />
                </button>
            )}

            <div
                ref={containerRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth relative z-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            >
                {sortedImages.map((image, idx) => (
                    <figure
                        key={`${image.url}-${idx}`}
                        className={figureClassName}
                    >
                        <div className={frameOuterClassName}>
                            {device === 'phone' && (
                                <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-10 h-[18px] w-[90px] rounded-full bg-black/70 border border-white/10" />
                            )}
                            <div className={screenClassName}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <img
                                        src={image.url}
                                        alt={image.alt}
                                        className="max-h-full w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>
                        {image.caption && (
                            <figcaption className="text-sm text-gray-400 text-center">
                                {image.caption}
                            </figcaption>
                        )}
                    </figure>
                ))}
            </div>
        </div>
    );
}
