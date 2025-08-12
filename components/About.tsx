export default function About() {
    return (
        <section
            id="about"
            className="bg-[#0d0d0d] text-white py-16 px-6 md:px-12"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Side - Image */}
                <div className="flex justify-center order-2 md:order-1">
                    <div className="relative w-72 h-72 md:w-90 md:h-80">
                        <svg
                            viewBox="0 0 480 480"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                        >
                            <defs>
                                <clipPath id="aboutCircle" clipPathUnits="userSpaceOnUse">
                                    <circle cx="240" cy="240" r="200" />
                                </clipPath>
                            </defs>
                            <image
                                href="avatar.png"
                                x="40"
                                y="40"
                                width="400"
                                height="400"
                                clipPath="url(#aboutCircle)"
                                preserveAspectRatio="xMidYMid meet"
                            />
                        </svg>
                    </div>
                </div>

                {/* Right Side - Text */}
                <div className="space-y-6 order-1 md:order-2">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#00ff99]">
                        About Me
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                        I’m <span className="font-semibold text-white">Natnael Alemseged</span>, a results-driven
                        full-stack developer with a passion for building
                        scalable, high-performance applications. With hands-on
                        experience in <span className="text-[#00ff99]">Flutter, React, Next.js, and Node.js/Express</span>,
                        I craft mobile and web solutions that balance speed,
                        usability, and clean architecture.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        I thrive on creating seamless user experiences, exploring
                        AI-powered innovations, and contributing to open source.
                        My approach blends technical expertise with a strong focus
                        on developer experience and long-term maintainability.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Beyond coding, I enjoy mentoring developers, exploring
                        new frameworks, and experimenting with emerging
                        technologies that push the boundaries of what’s possible.
                    </p>
                </div>
            </div>
        </section>
    );
}
