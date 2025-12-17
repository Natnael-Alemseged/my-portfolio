const highlights = [
    { label: "Projects shipped", value: "40+" },
    { label: "Team members mentored", value: "25+" },
    { label: "AI automations delivered", value: "15" },
];

export default function About() {
    return (
        <section
            id="about"
            className="relative w-full text-white py-20 px-6 md:px-12 overflow-hidden bg-black"
            style={{
                backgroundImage: "url('/glorb.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="relative max-w-6xl mx-auto space-y-10">
                <div className="text-center space-y-4">
                    <p className="text-xs uppercase tracking-[0.5em] text-[#00ff99]">
                        Senior Software Engineer · AI · Mobile · Cloud
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold">
                        Shipping AI-native mobile and web platforms with measurable impact
                    </h2>
                    <p className="text-gray-300 max-w-4xl mx-auto">
                        I partner with remote product teams to build high-performance experiences across Flutter, React Native, Next.js, and AI stacks. 
                        From 10K+ DAU social platforms to agentic workspaces and Lambda-scale pipelines, I translate ambitious roadmaps into resilient software.
                    </p>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6 bg-black/50 border border-white/10 rounded-3xl p-8 backdrop-blur-lg">
                        <h3 className="text-2xl font-semibold text-[#00ff99]">Core Focus</h3>
                        <div className="space-y-6">
                            {["AI Systems & Automation", "Cross-Platform Mobile", "Cloud-Native Web", "Technical Leadership"].map((area) => (
                                <div key={area}>
                                    <h4 className="text-xl font-semibold flex items-center gap-3">
                                        <span className="text-[#00ff99] text-2xl">▹</span>{area}
                                    </h4>
                                    <p className="text-gray-300 leading-relaxed ml-7">
                                        {area === "AI Systems & Automation" && "Designing LangChain/Langflow agents, MCP workflows, and LLM-tuned services that power search, personalization, and autonomous comms."}
                                        {area === "Cross-Platform Mobile" && "Launching Flutter and React Native apps with OTA updates, Firebase push, Google Maps, AI copilots, and measurable retention lifts."}
                                        {area === "Cloud-Native Web" && "Building Next.js/React platforms with Prisma, tRPC, SSR/SEO tuning, and AWS/Docker delivery pipelines for 50%+ traffic gains."}
                                        {area === "Technical Leadership" && "Leading squads through architecture, code reviews, and mentoring—reducing onboarding time 30% and production bugs 65%."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d1a14]/80 via-[#030303]/90 to-[#020202]/90 p-8 backdrop-blur">
                            <p className="text-sm uppercase tracking-[0.4em] text-[#00ff99]/80">Principles</p>
                            <ul className="mt-4 space-y-3 text-gray-200">
                                <li>• Product-led engineering with explicit KPIs</li>
                                <li>• AI-first problem solving rooted in data privacy</li>
                                <li>• Systems thinking across mobile, web, and cloud</li>
                                <li>• Documentation, mentorship, and resilient delivery</li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {highlights.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur"
                                >
                                    <span className="text-3xl font-bold text-[#00ff99] block">{item.value}</span>
                                    <span className="text-xs uppercase tracking-[0.3em] text-gray-300 block">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
