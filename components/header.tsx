"use client";


import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const navLinks = [
        { name: "About", href: "#about", id: "about" },
        { name: "Projects", href: "#projects", id: "projects" },
        { name: "Testimonials", href: "#testimonials", id: "testimonials" },
        { name: "Work Experience", href: "#workExperience", id: "workExperience" },
    ];

    return (
        <header id="header" className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0d0d0d]/95 md:bg-[#0d0d0d]/80 md:backdrop-blur-md border-b border-gray-800">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-white tracking-widest z-50">
                Natnael Alemseged
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium"
                        onClick={(e) => scrollToSection(e, link.id)}
                    >
                        {link.name}
                    </a>
                ))}
            </nav>

            {/* Desktop Social Icons */}
            <div className="hidden md:flex items-center space-x-4 text-gray-300">
                <Link href="https://github.com/natnael-alemseged" target="_blank">
                    <FaGithub className="w-5 h-5 hover:text-white transition-colors" />
                </Link>
                <Link href="https://www.linkedin.com/in/natnael-alemseged" target="_blank">
                    <FaLinkedin className="w-5 h-5 hover:text-white transition-colors" />
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-gray-300 hover:text-white z-50 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Menu Overlay - Portaled to Body */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-[#0d0d0d] z-[49] pt-24 px-6 md:hidden overflow-y-auto flex flex-col"
                        >
                            <nav className="flex flex-col space-y-6">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-lg font-medium text-white border-b border-gray-800 pb-4"
                                        onClick={(e) => scrollToSection(e, link.id)}
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </nav>

                            <div className="mt-8 flex items-center space-x-6 pb-8">
                                <Link href="https://github.com/natnael-alemseged" target="_blank" className="text-gray-400 hover:text-white">
                                    <FaGithub className="w-8 h-8" />
                                </Link>
                                <Link href="https://www.linkedin.com/in/natnael-alemseged" target="_blank" className="text-gray-400 hover:text-white">
                                    <FaLinkedin className="w-8 h-8" />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </header>
    );
}
