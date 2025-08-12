import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    // your schema here
});

// Avoid recompiling model if it already exists (Next.js hot reload)
export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
