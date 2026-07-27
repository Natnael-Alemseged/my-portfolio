const OPTIMIZED_LOCAL_IMAGES = new Set([
    "/glorb.png",
    "/projects/ai/axiom-ledger.png",
    "/projects/ai/brownfield-cartographer.png",
    "/projects/ai/data-contract-enforcer.png",
    "/projects/ai/dataagentbench.png",
    "/projects/ai/document-intelligence-refinery.png",
    "/projects/ai/github-evaluator.png",
    "/projects/ai/project-chimera.png",
    "/projects/ai/salesconversion-bench.png",
    "/projects/ai/tenacious-conversion-engine.png",
    "/projects/ai/trp1-ai-artist.png",
]);

/**
 * Prefer the checked-in WebP derivative for known large local project images.
 * Supports both root-relative and absolute same-site URLs.
 */
export function getOptimizedProjectImageUrl(url: string): string {
    try {
        const parsedUrl = new URL(url, "https://natnaelalemseged.com");
        if (!OPTIMIZED_LOCAL_IMAGES.has(parsedUrl.pathname)) {
            return url;
        }

        const optimizedPath = parsedUrl.pathname.replace(/\.png$/, ".webp");
        return url.startsWith("http")
            ? `${parsedUrl.origin}${optimizedPath}${parsedUrl.search}`
            : `${optimizedPath}${parsedUrl.search}`;
    } catch {
        return url;
    }
}
