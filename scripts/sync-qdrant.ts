// scripts/sync-qdrant.ts
import 'dotenv/config';
import connectToDatabase from '../lib/db/mongoose';
import Project from '../lib/db/project.model';
import { syncProjectToQdrant } from '../lib/qdrant-sync';
import { bumpChatKnowledgeVersion } from '../lib/chat-cache';


async function syncAll() {
    try {
        console.log('🚀 Starting full sync to Qdrant...');
        console.log('Environment check:', {
            hasMongoUri: !!process.env.MONGODB_URI,
            uriStart: process.env.MONGODB_URI?.substring(0, 10),
            cwd: process.cwd()
        });
        await connectToDatabase();

        const projects = await Project.find({});
        console.log(`Found ${projects.length} projects to sync.`);

        for (const project of projects) {
            console.log(`Syncing project: ${project.title} (${project._id})`);
            await syncProjectToQdrant(project);
        }

        await bumpChatKnowledgeVersion();

        console.log('✅ Full sync completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Sync failed:', error);
        process.exit(1);
    }
}

syncAll();
