const highlights = [
    { label: "Projects Shipped", value: "40+" },
    { label: "DAU Managed", value: "10K+" },
    { label: "Bug Reduction", value: "65%" },
    { label: "Efficiency Gain", value: "30%" },
];

export default function About() {
    return (
        <section
            id="about"
            className="relative w-full text-white py-20 px-6 md:px-12 overflow-hidden bg-black"
        >
            {/* Responsive Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Mobile: Greenish Glow (Glorb) */}
                <div className="md:hidden absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(0,255,153,0.15)_0%,_rgba(0,0,0,0)_60%)] blur-[80px]" />
                <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.1)_0%,_rgba(0,0,0,0)_50%)] blur-[100px]" />
                {/* Desktop: Image Background */}
                <div
                    className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/glorb.png')" }}
                />
            </div>

            <div className="relative max-w-6xl mx-auto space-y-12">
                {/* Top Section - Centered */}
                <div className="md:bg-black/70 md:backdrop-blur-md md:border md:border-white/10 md:rounded-[40px] md:p-12 md:shadow-2xl overflow-hidden">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <div className="space-y-6">
                            <p className="text-xs uppercase tracking-[0.5em] text-[#00ff99]">
                                Senior Software Engineer · AI · Mobile · Cloud
                            </p>
                            <h2 className="text-3xl md:text-6xl font-bold leading-tight">
                                Building AI-native platforms <br className="hidden md:block" /> with measurable business impact
                            </h2>
                            <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
                                {[
                                    "Full-stack AI proficiency",
                                    "Zero-to-One Scale",
                                    "High-Performance Mobile",
                                    "Remote Team Leadership",
                                    "Cloud-Native Infrastructure"
                                ].map((tag) => (
                                    <span key={tag} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Highlights Section - Single Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {highlights.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-white/10 bg-black/70 p-6 text-center hover:bg-black/90 hover:-translate-y-1 hover:border-[#00ff99]/30 transition-all duration-300"
                        >
                            <span className="text-3xl md:text-4xl font-bold text-[#00ff99] block">{item.value}</span>
                            <span className="text-xs uppercase tracking-wider text-gray-400 block mt-2">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Bottom Grid Section */}
                <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="space-y-6 bg-black/50 border border-white/10 rounded-3xl p-8 md:backdrop-blur-lg">
                        <h3 className="text-2xl font-semibold text-[#00ff99]">Core Competencies</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "AI Systems", points: ["LLM Agents & Workflows", "MCP Architectures", "Prompt Engineering"] },
                                { title: "Mobile Dev", points: ["Flutter & React Native", "Offline-first Design", "Push & Real-time"] },
                                { title: "Cloud & Web", points: ["Next.js & Serverless", "Scalable AWS/Docker", "SEO & Performance"] },
                                { title: "Leadership", points: ["Technical Mentorship", "Arch Design Reviews", "Resilient Delivery"] },
                            ].map((item) => (
                                <div key={item.title} className="space-y-3">
                                    <h4 className="text-lg font-bold flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff99]" />
                                        {item.title}
                                    </h4>
                                    <ul className="space-y-1.5 text-gray-400 text-sm pl-3.5 border-l border-white/5">
                                        {item.points.map(p => <li key={p}>{p}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d1a14]/80 via-[#030303]/90 to-[#020202]/90 p-8">
                        <p className="text-sm uppercase tracking-[0.4em] text-[#00ff99]/80 mb-6">Philosophy</p>
                        <ul className="space-y-6">
                            {[
                                { label: "Product-Led", detail: "Code that drives KPIs" },
                                { label: "AI-First", detail: "Modern problem solving" },
                                { label: "System-Scale", detail: "Built for 10K+ DAU" },
                                { label: "Ownership", detail: "End-to-end delivery" }
                            ].map((p) => (
                                <li key={p.label} className="flex items-start gap-4">
                                    <span className="text-[#00ff99] mt-1 text-lg">✓</span>
                                    <div>
                                        <p className="font-semibold text-gray-200">{p.label}</p>
                                        <p className="text-sm text-gray-400">{p.detail}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}