import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env files first
const envPath = path.resolve(__dirname, '../.env');
const envLocalPath = path.resolve(__dirname, '../.env.local');

dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

console.log('Env variables loaded. MONGODB_URI exists:', !!process.env.MONGODB_URI);

async function run() {
    try {
        // Dynamically import mongoose and model
        const { default: connectToDatabase } = await import('../lib/db/mongoose');
        const { default: Project } = await import('../lib/db/project.model');
        
        console.log('Connecting to database...');
        await connectToDatabase();
        
        const projects = await Project.find({}).sort({ position: 1, createdAt: -1 }).lean();
        console.log(`Found ${projects.length} projects in the database:`);
        
        for (const p of projects) {
            console.log(`- [${p.slug}] (featured: ${p.featured}, position: ${p.position}) Title: "${p.title}" // Role: "${p.role}"`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error checking projects:', error);
        process.exit(1);
    }
}

run();
