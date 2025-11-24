// import { algoliasearch } from 'algoliasearch';
import { algoliasearch } from 'algoliasearch';
import { Tool } from "@/types/tool"; // Use named import



export const algoliaSearchClient = algoliasearch( // Use algoliasearch here
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);



export const searchCarrierAlgolia = async (searchInput: string): Promise<string[]> => {
    if (!searchInput) {
        throw new Error("Search input is required to fetch details.");
    }

    const algoliaSearchParams = {
        typoTolerance: "strict",
        advancedSyntax: true,
        removeWordsIfNoResults: "allOptional",
        hitsPerPage: 15,
    };

    try {
        const { results } = await algoliaSearchClient.search([
            {
                indexName: "tools_job_impacts_index",
                query: searchInput,
                params: algoliaSearchParams,
            },
        ]);

        const hits = results[0]?.hits || [];
        console.log("Raw hits:", hits);


        // *** CRITICAL CHANGE HERE ***
        // Map over all hits and extract the job_title
        const jobTitles = hits
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((hit: any) => hit.job_title)
            .filter(Boolean); // Filter out any undefined/null job_titles

        if (jobTitles.length === 0) {
            console.warn(`No job titles found for: ${searchInput}`);
            return [];
        }

        console.log(`Matched job titles: ${jobTitles}`);

        return jobTitles;
    } catch (error) {
        console.error(`Algolia error fetching job title for ${searchInput}:`, error);
        throw error;
    }
};


export const searchToolsAlgolia = async (searchInput: string, limit: number): Promise<Tool[]> => {
    if (!searchInput) {
        // It's fine to return an empty array if no input, or throw a more specific error
        return [];
    }

    try {
        const { results } = await algoliaSearchClient.search([
            {
                indexName: "tools_index", // Confirmed correct index name
                query: searchInput,
                params: {
                    hitsPerPage: limit, // Increase hitsPerPage if you need more results
                    attributesToRetrieve: ['*'],
                    // You might want to define searchable attributes in Algolia's dashboard
                    // Or restrict here if needed: restrictSearchableAttributes: ['name', 'description', 'keywords']
                },
            },
        ]);

        console.log(`results for toolSearchAlgolia are: ${results}`); // This will print the entire results object
        // Or, if you want to see the hits (the actual search results):
        console.log(results[0].hits);


        const hits = results[0]?.hits || [];



        // Cast hits to your AlgoliaTool interface.
        // Algolia results are often 'any' initially, so casting helps type safety.
        const tools: Tool[] = hits as Tool[];

        console.log(`Algolia tools_index search found ${tools.length} tools for "${searchInput}"`);

        return tools;
    } catch (error) {
        console.error(`Algolia error fetching tools for "${searchInput}":`, error);
        // It's often better to return an empty array or re-throw if it's a critical error
        throw error; // Re-throw to be caught by the calling fetchTools
    }
};