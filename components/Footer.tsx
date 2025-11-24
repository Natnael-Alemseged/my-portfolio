const navLinks = [
    { label: "About", href: "#about" },
    { label: "Technologies", href: "#technologies" },
    { label: "Projects", href: "#projects" },
    { label: "Work", href: "#workExperience" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
];

const socials = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/natnael-alemseged" },
    { label: "GitHub", href: "https://github.com/natnael-alemseged" },
    { label: "Email", href: "mailto:natnaelalemseged@gmail.com" },
];

export default function Footer() {
    return (
        <footer className="bg-[#020202] text-white border-t border-white/10">


            <div className="border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs uppercase tracking-[0.4em] text-gray-500">
                    <span>© {new Date().getFullYear()} Natnael Alemseged</span>
                    <span>Built with Next.js · Tailwind · My Creativity & Passion</span>
                </div>
            </div>
        </footer>
    );
}
