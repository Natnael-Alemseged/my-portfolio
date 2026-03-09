import { FaArrowLeft } from "react-icons/fa";

export default function ProjectsLoading() {
    return (
        <main className="min-h-screen bg-[#030303]">
            <div className="max-w-7xl mx-auto pt-10 px-6 md:px-12">
                <div
                    className="inline-flex items-center gap-2 text-emerald-400/70 animate-pulse"
                    aria-hidden
                >
                    <FaArrowLeft className="w-4 h-4" />
                    <span className="h-5 w-24 bg-emerald-400/20 rounded" />
                </div>
            </div>

            <section className="relative bg-[#030303] py-20 px-6 md:px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto relative">
                    <div className="flex flex-col items-center gap-4 mb-14 animate-pulse">
                        <div className="h-4 w-24 bg-gray-800 rounded" />
                        <div className="h-10 md:h-12 w-64 md:w-80 bg-gray-800 rounded" />
                        <div className="h-5 w-full max-w-2xl bg-gray-800/80 rounded" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden h-80"
                            >
                                <div className="h-48 bg-gray-800/80" />
                                <div className="p-5 space-y-3">
                                    <div className="h-6 w-3/4 bg-gray-800 rounded" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-gray-800/80 rounded" />
                                        <div className="h-4 w-11/12 bg-gray-800/80 rounded" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-16 bg-gray-800 rounded-full" />
                                        <div className="h-6 w-20 bg-gray-800 rounded-full" />
                                        <div className="h-6 w-14 bg-gray-800 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
