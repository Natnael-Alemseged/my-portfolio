import connectToDatabase from '../lib/db/mongoose';
import Project from '../lib/db/project.model';

async function addPositionToProjects() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log('Connected to MongoDB');

    // Get all projects
    const projects = await Project.find({}).sort({ createdAt: 1 });
    console.log(`Found ${projects.length} projects`);

    // Update each project with a position
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      // If position doesn't exist or is not a number, update it
      if (typeof project.position !== 'number') {
        project.position = i + 1; // 1-based indexing
        await project.save();
        console.log(`Updated project "${project.title}" with position ${project.position}`);
      }
    }

    console.log('Successfully updated all projects with position field');
    process.exit(0);
  } catch (error) {
    console.error('Error updating projects:', error);
    process.exit(1);
  }
}

// Run the script
addPositionToProjects();
