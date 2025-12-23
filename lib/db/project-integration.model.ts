import mongoose from 'mongoose';

const ProjectIntegrationSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    service: { type: String, required: true, enum: ['supermemory', 'algolia', 'qdrant', 'other'] },
    externalId: { type: String, required: true }, // supermemoryId, algoliaId, etc.
    metadata: { type: mongoose.Schema.Types.Mixed },
    syncedAt: { type: Date, default: Date.now },
    lastError: { type: String },
});

// Compound index for fast lookups
ProjectIntegrationSchema.index({ projectId: 1, service: 1 }, { unique: true });

export default mongoose.models.ProjectIntegration || mongoose.model('ProjectIntegration', ProjectIntegrationSchema);
