// scripts/sync-supermemory.ts
import 'dotenv/config'; // 1. This loads your MONGODB_URI from .env
import connectToDatabase from '../lib/db/mongoose'; // Import the function
import Project from '../lib/db/project.model';
import { syncProjectToSupermemory, syncAllProjectsIndex } from '../lib/supermemory-sync';
import mongoose from "mongoose";

async function main() {
    try {
        console.log('⏳ Connecting to MongoDB...');

        // 2. Actually call the connection function and wait for it
        await connectToDatabase();
        console.log('✅ Connected successfully.');

        // 3. Check if we have a connection before querying
        const projects = await Project.find({});
        console.log(`🚀 Syncing ${projects.length} existing projects...`);

        for (const project of projects) {
            console.log(`  -> Syncing: ${project.title}`);
            await syncProjectToSupermemory(project);
        }

        await syncAllProjectsIndex();
        console.log('✨ Full initial sync complete!');

    } catch (error) {
        console.error('❌ Sync failed:', error);
    } finally {
        // 4. Close the connection so the script stops running
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB.');
        process.exit(0);
    }
}

main();