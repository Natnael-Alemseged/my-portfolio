// scripts/test-search.ts
import 'dotenv/config';
import { searchMemories } from '../lib/qdrant-sync';

async function testSearch() {
    try {
        const query = "NFC ride hailing";
        console.log(`🔍 Searching for: "${query}"...`);

        const results = await searchMemories(query, 2);

        console.log(`Found ${results.length} results:`);
        results.forEach((r, i) => {
            console.log(`--- Result ${i + 1} ---`);
            console.log(r.substring(0, 300) + '...');
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Search test failed:', error);
        process.exit(1);
    }
}

testSearch();
