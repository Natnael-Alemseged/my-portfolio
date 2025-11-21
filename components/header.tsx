"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Header() {
    return (
        <header id="header" className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0d0d0d] border-b border-gray-800">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-white tracking-widest">
                Natnael Alemseged
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center space-x-8">
                <a
                    href="#about"
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById('about');
                        if (element) {
                            const offset = 80; // Height of fixed header
                            const elementPosition = element.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - offset;
                            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        }
                    }}
                >
                    About
                </a>
                <a
                    href="#projects"
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById('projects');
                        if (element) {
                            const offset = 80;
                            const elementPosition = element.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - offset;
                            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        }
                    }}
                >
                    Projects
                </a>
                <a
                    href="#testimonials"
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById('testimonials');
                        if (element) {
                            const offset = 80;
                            const elementPosition = element.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - offset;
                            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        }
                    }}
                >
                    Testimonials
                </a>
                <a
                    href="#workExperience"
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById('workExperience');
                        if (element) {
                            const offset = 80;
                            const elementPosition = element.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - offset;
                            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        }
                    }}
                >
                    Work Experience
                </a>
            </nav>

            {/* Social Icons */}
            <div className="flex items-center space-x-4 text-gray-300">
                <Link href="https://github.com" target="_blank">
                    <FaGithub className="w-5 h-5 hover:text-white" />
                </Link>
                <Link href="https://linkedin.com" target="_blank">
                    <FaLinkedin className="w-5 h-5 hover:text-white" />
                </Link>
                <Link href="https://twitter.com" target="_blank">
                    <FaTwitter className="w-5 h-5 hover:text-white" />
                </Link>
            </div>
        </header>
    );
}
