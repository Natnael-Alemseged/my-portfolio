export default function ProjectLoading() {
    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 animate-pulse">
                {/* Breadcrumbs Skeleton */}
                <div className="flex gap-2 mb-8">
                    <div className="h-4 w-12 bg-gray-800 rounded"></div>
                    <div className="h-4 w-4 bg-gray-800 rounded"></div>
                    <div className="h-4 w-16 bg-gray-800 rounded"></div>
                    <div className="h-4 w-4 bg-gray-800 rounded"></div>
                    <div className="h-4 w-32 bg-gray-800 rounded"></div>
                </div>

                {/* Hero Skeleton */}
                <div className="mb-12">
                    <div className="h-10 md:h-12 w-3/4 max-w-lg bg-gray-800 rounded mb-4"></div>
                    <div className="h-6 w-1/4 bg-gray-800 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-5 w-full bg-gray-800 rounded"></div>
                        <div className="h-5 w-11/12 bg-gray-800 rounded"></div>
                        <div className="h-5 w-10/12 bg-gray-800 rounded"></div>
                    </div>
                </div>

                {/* Images Gallery Skeleton */}
                <div className="mb-12">
                    <div className="w-full h-[360px] md:h-[460px] bg-gray-800 rounded-[28px]"></div>
                </div>

                {/* Content Skeleton */}
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800 h-48"></div>
                    <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800 h-48"></div>
                </div>
            </div>
        </div>
    );
}
