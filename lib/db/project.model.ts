import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String }, // Detailed content for the project page
    images: [{ type: String }], // Array of image URLs
    techStack: [{ type: String }],
    links: {
        web: { type: String },
        playstore: { type: String },
        appstore: { type: String },
        github: { type: String },
    },
    supermemoryId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// Avoid recompiling model if it already exists (Next.js hot reload)
export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
