import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String, required: true },
    caption: { type: String },
    order: { type: Number, default: 0 },
}, { _id: false });

const LinkSchema = new mongoose.Schema({
    type: { type: String, required: true }, // web, github, playstore, appstore, demo, docs, etc.
    url: { type: String, required: true },
    label: { type: String },
}, { _id: false });

const MetricsSchema = new mongoose.Schema({
    duration: { type: String },
    teamSize: { type: Number },
    impact: { type: String },
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    role: { type: String },

    problem: { type: String },
    solution: { type: String },
    keyTakeaway: { type: String }, // Quick insight for LLMs and summaries

    content: { type: String },
    contentFormat: { type: String, enum: ['markdown', 'html'], default: 'markdown' },

    architecture: { type: String },
    features: [{ type: String }],

    techStack: [{ type: String }],
    tags: [{ type: String }],

    images: [ImageSchema],
    logo_image: ImageSchema,
    links: [LinkSchema],

    metrics: MetricsSchema,

    // SEO & Visibility
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'archived', 'in-progress'], default: 'active' },
    visibility: { type: String, enum: ['public', 'private', 'unlisted'], default: 'public' },
    schemaType: { type: String, enum: ['SoftwareApplication', 'WebApplication', 'MobileApplication', 'CreativeWork'], default: 'SoftwareApplication' },

    // Ordering
    position: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    publishedAt: { type: Date }, // When made public (different from createdAt for drafts)
});

// Auto-generate slug from title before validation so required slug passes
ProjectSchema.pre('validate', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
    next();
});

// Handle publishedAt & updatedAt timestamps
ProjectSchema.pre('save', function (next) {
    // Set publishedAt when visibility changes to public
    if (this.isModified('visibility') && this.visibility === 'public' && !this.publishedAt) {
        this.publishedAt = new Date();
    }

    this.updatedAt = new Date();
    next();
});

// Avoid recompiling model if it already exists (Next.js hot reload)
export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
