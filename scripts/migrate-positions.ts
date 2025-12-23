/**
 * Migration script to add position field to existing projects
 * Run with: npx tsx scripts/migrate-positions.ts
 */

import mongoose from 'mongoose';
import Project from '../lib/db/project.model';

const MONGODB_URI = process.env.MONGODB_URI || '';

async function migratePositions() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find all projects that don't have a position field or have position = 0
        const projects = await Project.find({}).sort({ createdAt: -1 });

        console.log(`Found ${projects.length} projects`);

        // Update each project with a position based on creation date
        const updatePromises = projects.map((project, index) => {
            // If position doesn't exist or is 0, set it based on index
            if (project.position === undefined || project.position === 0) {
                console.log(`Setting position ${index} for project: ${project.title}`);
                return Project.findByIdAndUpdate(
                    project._id,
                    { position: index },
                    { new: true }
                );
            }
            return Promise.resolve(project);
        });

        await Promise.all(updatePromises);

        console.log('✅ Migration completed successfully!');
        console.log(`Updated ${projects.length} projects with position values`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

migratePositions();
