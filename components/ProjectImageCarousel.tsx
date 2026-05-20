"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

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
    const [lightboxImage, setLightboxImage] = useState<CarouselImage | null>(null);

    // Escape key handler to close lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setLightboxImage(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
    }, [sortedImages.length]);

    const handleScroll = (direction: 'left' | 'right') => {
        const el = containerRef.current;
        if (!el) return;
        const scrollAmount = el.clientWidth * 0.8;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    // Render Lightbox Modal
    const renderLightbox = () => (
        <AnimatePresence>
            {lightboxImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-xl cursor-zoom-out"
                    onClick={() => setLightboxImage(null)}
                >
                    {/* Close button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxImage(null);
                        }}
                        className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#00ff99] hover:text-black transition-all duration-300 shadow-lg cursor-pointer"
                        aria-label="Close enlarged view"
                    >
                        <FaTimes size={18} />
                    </button>

                    {/* Image viewport */}
                    <motion.div
                        initial={{ scale: 0.95, y: 15 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 15 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={lightboxImage.url}
                            alt={lightboxImage.alt}
                            className="max-w-full max-h-full object-contain rounded-xl shadow-[0_30px_100px_rgba(0,0,0,0.85)] border border-white/10"
                        />
                    </motion.div>

                    {/* Caption Card */}
                    {lightboxImage.caption && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="mt-6 text-center max-w-xl px-6 py-3 rounded-full bg-black/50 border border-white/5 backdrop-blur-md"
                        >
                            <p className="text-gray-100 text-sm font-semibold tracking-wide">{lightboxImage.caption}</p>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );

    // OPTIMIZED MODE: Single image render (centered, scaled and proportional)
    if (sortedImages.length === 1) {
        const image = sortedImages[0];
        const isTablet = device === 'tablet';

        const singleFigureClassName = isTablet
            ? 'w-full max-w-[850px] mx-auto bg-[#050505] border border-emerald-900/30 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-[0_0_35px_rgba(0,255,153,0.15)] group'
            : 'w-full max-w-[280px] sm:max-w-[320px] mx-auto bg-[#050505] border border-emerald-900/30 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-[0_0_25px_rgba(0,255,153,0.12)] group';

        const singleFrameOuterClassName = isTablet
            ? 'relative w-full rounded-[28px] bg-[#0a0a0a] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-[12px]'
            : 'relative w-full rounded-[40px] bg-[#0a0a0a] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-[10px]';

        const singleScreenClassName = isTablet
            ? 'relative w-full h-[240px] sm:h-[380px] md:h-[480px] overflow-hidden rounded-[18px] bg-gradient-to-b from-gray-900 to-black'
            : 'relative w-full h-[460px] overflow-hidden rounded-[32px] bg-gradient-to-b from-gray-900 to-black';

        return (
            <div className="w-full flex flex-col items-center justify-center">
                <figure className={singleFigureClassName}>
                    <div className={singleFrameOuterClassName}>
                        {!isTablet && (
                            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-10 h-[18px] w-[90px] rounded-full bg-black/70 border border-white/10" />
                        )}
                        <div className={singleScreenClassName}>
                            <div 
                                onClick={() => setLightboxImage(image)}
                                className="absolute inset-0 flex items-center justify-center cursor-zoom-in group/img overflow-hidden"
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    fill
                                    sizes={isTablet ? "(max-width: 768px) 100vw, 850px" : "320px"}
                                    priority
                                    className="object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover/img:scale-[1.025]"
                                />
                                {/* Expanding Cyber Zoom indicator on hover */}
                                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-300">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/85 border border-[#00ff99]/30 text-[#00ff99] text-[11px] font-mono tracking-wider shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-all duration-300">
                                        <FaExpand size={10} />
                                        <span>Click to Zoom</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {image.caption && (
                        <figcaption className="text-sm text-gray-400 text-center font-medium mt-1">
                            {image.caption}
                        </figcaption>
                    )}
                </figure>

                {renderLightbox()}
            </div>
        );
    }

    // MULTIPLE IMAGES MODE: Scrollable Carousel
    const figureClassName =
        device === 'phone'
            ? 'min-w-[220px] sm:min-w-[260px] max-w-[260px] bg-[#050505] border border-emerald-900/30 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-[0_0_25px_rgba(0,255,153,0.12)] snap-center group'
            : 'min-w-[280px] sm:min-w-[420px] max-w-[420px] bg-[#050505] border border-emerald-900/30 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-[0_0_25px_rgba(0,255,153,0.12)] snap-center group';

    const frameOuterClassName =
        device === 'phone'
            ? 'relative w-full rounded-[40px] bg-[#0a0a0a] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-[10px]'
            : 'relative w-full rounded-[28px] bg-[#0a0a0a] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-[12px]';

    const screenClassName =
        device === 'phone'
            ? 'relative w-full h-[460px] overflow-hidden rounded-[32px] bg-gradient-to-b from-gray-900 to-black'
            : 'relative w-full h-[360px] overflow-hidden rounded-[18px] bg-gradient-to-b from-gray-900 to-black';

    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10" />

            {canScrollLeft && (
                <button
                    type="button"
                    aria-label="Scroll screenshots left"
                    onClick={() => handleScroll('left')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-[#00ff99] p-3 rounded-full backdrop-blur border border-emerald-500/40 hover:bg-black/80 hover:scale-105 active:scale-95 transition"
                >
                    <FaChevronLeft />
                </button>
            )}

            {canScrollRight && (
                <button
                    type="button"
                    aria-label="Scroll screenshots right"
                    onClick={() => handleScroll('right')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-[#00ff99] p-3 rounded-full backdrop-blur border border-emerald-500/40 hover:bg-black/80 hover:scale-105 active:scale-95 transition"
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
                                <div 
                                    onClick={() => setLightboxImage(image)}
                                    className="absolute inset-0 flex items-center justify-center cursor-zoom-in group/img overflow-hidden"
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        sizes={device === 'phone' ? '260px' : '420px'}
                                        priority={idx === 0}
                                        className="object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover/img:scale-[1.025]"
                                    />
                                    {/* Expanding Cyber Zoom indicator on hover */}
                                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-300">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 border border-[#00ff99]/30 text-[#00ff99] text-[10px] font-mono tracking-wider shadow-md transform translate-y-2 group-hover/img:translate-y-0 transition-all duration-300">
                                            <FaExpand size={9} />
                                            <span>Zoom</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {image.caption && (
                            <figcaption className="text-sm text-gray-400 text-center font-medium mt-1">
                                {image.caption}
                            </figcaption>
                        )}
                    </figure>
                ))}
            </div>

            {renderLightbox()}
        </div>
    );
}
