"use client";

import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Hero() {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] text-center px-4 overflow-hidden md:px-8"
        >
            {/* Background tech network effect */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <svg
                    viewBox="0 0 1440 800"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full"
                >
                    <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#00ff99" />
                            <stop offset="100%" stopColor="#006644" />
                        </linearGradient>
                    </defs>
                    <g stroke="url(#grad)" strokeWidth="1.5" fill="none">
                        {Array.from({ length: 15 }).map((_, row) =>
                            Array.from({ length: 20 }).map((_, col) => (
                                <rect
                                    key={`${row}-${col}`}
                                    x={col * 80}
                                    y={row * 80}
                                    width="60"
                                    height="60"
                                    rx="6"
                                />
                            ))
                        )}
                    </g>
                </svg>
            </div>

            {/* Main content */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* LEFT CONTENT */}
                <div className="text-left space-y-6 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Natnael Alemseged <br />
                        <span className="text-[#00ff99]">
                            Full-Stack Developer, Flutter Specialist & AI Enthusiast
                        </span>
                    </h1>
                    <p className="text-gray-400 max-w-lg">
                        I’m Natnael Alemseged, a results-driven full-stack developer with hands-on experience
                        building scalable apps using Flutter, React Native, Next.js, and Node.js/Express.
                        I focus on delivering high-performance mobile and web solutions,
                        and I’m passionate about clean architecture, developer experience, open source, and AI-powered innovations.
                    </p>
                    <div className="flex gap-6 text-gray-400">
                        <a
                            href="https://github.com/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 hover:text-white transition"
                        >
                            <FaGithub /> <span>GitHub</span>
                        </a>
                        <a
                            href="https://linkedin.com/in/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 hover:text-white transition"
                        >
                            <FaLinkedin /> <span>LinkedIn</span>
                        </a>
                        <a
                            href="https://twitter.com/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 hover:text-white transition"
                        >
                            <FaTwitter /> <span>Twitter</span>
                        </a>
                    </div>
                </div>

                {/* RIGHT ANIMATION with Illustration */}
                <div className="relative flex justify-center items-center">
                    <svg
                        className="w-80 h-80 md:w-[28rem] md:h-[28rem]"
                        viewBox="0 0 480 480"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <clipPath id="fullCircleClip" clipPathUnits="userSpaceOnUse">
                                <circle cx="250" cy="250" r="195" />
                            </clipPath>
                        </defs>

                        {/* Rotating group: circle and dots */}
                        <g className="animate-spin-slow" style={{ transformOrigin: "250px 250px" }}>
                            <circle
                                cx="250"
                                cy="250"
                                r="200"
                                stroke="url(#grad)"
                                strokeWidth="2"
                                fill="none"
                            />
                            {Array.from({ length: 30 }).map((_, i) => (
                                <circle
                                    key={i}
                                    cx={250 + 200 * Math.cos((i * 12 * Math.PI) / 180)}
                                    cy={250 + 200 * Math.sin((i * 12 * Math.PI) / 180)}
                                    r="3"
                                    fill="#00ff99"
                                />
                            ))}
                        </g>

                        {/* Fixed image inside circle */}
                        <image
                            href="Illustration.png"  // use your new image file name
                            x="56"
                            y="58"
                            width="388"
                            height="388"
                            clipPath="url(#fullCircleClip)"
                            preserveAspectRatio="xMidYMid meet"
                            style={{ pointerEvents: "none" }}
                        />


                    </svg>

                    <style jsx>{`
                        .animate-spin-slow {
                            animation: spin 20s linear infinite;
                        }
                        @keyframes spin {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(360deg);
                            }
                        }
                    `}</style>
                </div>
            </div>
        </section>
    );
}