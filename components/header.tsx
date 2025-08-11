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
                <Link href="/about" className="text-gray-300 hover:text-white">
                    About
                </Link>
                <Link href="/projects" className="text-gray-300 hover:text-white">
                    Projects
                </Link>
                <Link href="/testimonials" className="text-gray-300 hover:text-white">
                    Testimonials
                </Link>
                <Link href="/workExperience" className="text-gray-300 hover:text-white">
                    Work-Experience
                </Link>
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
