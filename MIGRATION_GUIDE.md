# Project Schema Migration Guide

## Overview
The project schema has been upgraded to a more comprehensive structure with better organization and metadata.

## Schema Changes

### New Fields Added
- `slug` - Auto-generated URL-friendly identifier from title
- `summary` - Replaces old `description` field (short description)
- `role` - Your role in the project
- `problem` - Problem statement
- `solution` - Solution approach
- `architecture` - Technical architecture description
- `features` - Array of key features (one per line in form)
- `tags` - Array of tags for categorization
- `featured` - Boolean flag for highlighting projects
- `status` - Project status (active, archived, in-progress)
- `updatedAt` - Last update timestamp

### Structural Changes

#### Images
**Old:** Array of strings
```json
["https://image1.jpg", "https://image2.jpg"]
```

**New:** Array of objects with metadata
```json
[
  {
    "url": "https://image1.jpg",
    "alt": "Description for SEO",
    "caption": "Optional caption",
    "order": 0
  }
]
```

#### Links
**Old:** Nested object with specific keys
```json
{
  "web": "https://...",
  "github": "https://...",
  "playstore": ["url1", "url2"],
  "appstore": ["url1", "url2"]
}
```

**New:** Flexible array of link objects
```json
[
  { "type": "web", "url": "https://...", "label": "Live Demo" },
  { "type": "github", "url": "https://..." },
  { "type": "playstore", "url": "https://..." },
  { "type": "demo", "url": "https://..." }
]
```

#### Metrics (New)
```json
{
  "duration": "3 months",
  "teamSize": 4,
  "impact": "Reduced processing time by 60%"
}
```

### Renamed Fields
- `description` → `summary`

### Unchanged Fields
- `title`
- `content`
- `techStack`
- `supermemoryId`
- `createdAt`

## Migration Steps

### For Existing Projects in Database

You'll need to run a migration script to update existing projects. Here's a sample:

```javascript
// scripts/migrate-projects.js
const mongoose = require('mongoose');
const Project = require('./lib/db/project.model');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const projects = await Project.find({});
  
  for (const project of projects) {
    // Generate slug if missing
    if (!project.slug) {
      project.slug = project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Rename description to summary
    if (project.description && !project.summary) {
      project.summary = project.description;
    }
    
    // Convert images from strings to objects
    if (project.images && Array.isArray(project.images)) {
      project.images = project.images.map((url, idx) => ({
        url: typeof url === 'string' ? url : url.url,
        alt: `${project.title} screenshot ${idx + 1}`,
        order: idx
      }));
    }
    
    // Convert links from nested object to array
    if (project.links && !Array.isArray(project.links)) {
      const linksArray = [];
      if (project.links.web) {
        linksArray.push({ type: 'web', url: project.links.web });
      }
      if (project.links.github) {
        linksArray.push({ type: 'github', url: project.links.github });
      }
      if (project.links.playstore) {
        project.links.playstore.forEach(url => {
          if (url) linksArray.push({ type: 'playstore', url });
        });
      }
      if (project.links.appstore) {
        project.links.appstore.forEach(url => {
          if (url) linksArray.push({ type: 'appstore', url });
        });
      }
      project.links = linksArray;
    }
    
    // Set defaults for new fields
    if (project.featured === undefined) project.featured = false;
    if (!project.status) project.status = 'active';
    
    await project.save();
  }
  
  console.log(`Migrated ${projects.length} projects`);
  await mongoose.disconnect();
}

migrate().catch(console.error);
```

### Running the Migration

```bash
node scripts/migrate-projects.js
```

## Using the New Form

### Form View
The new form is organized into sections:
1. **Basic Information** - Title, summary, role, status, featured
2. **Problem & Solution** - Problem statement and solution approach
3. **Detailed Content** - Markdown content, architecture, features
4. **Technologies & Tags** - Tech stack and categorization tags
5. **Images** - JSON array or file upload
6. **Links** - JSON array of link objects
7. **Metrics** - Optional duration, team size, impact

### JSON View
Switch to JSON mode to:
- Paste LLM-generated project data
- Copy current form data for LLM editing
- Manually edit complex structures

Changes sync automatically between form and JSON views.

## Example JSON for LLM

```json
{
  "title": "AI Chat Platform",
  "summary": "Agent-driven LLM chat system with retrieval and tool orchestration.",
  "role": "AI Engineer & Backend Lead",
  "problem": "Users needed accurate, context-aware answers from large and evolving knowledge bases.",
  "solution": "Implemented RAG pipelines with vector search and agent-based orchestration using LangGraph.",
  "content": "## Overview\nBuilt an AI-powered chat platform...",
  "architecture": "FastAPI backend with LangGraph agents, vector database for retrieval, and Next.js frontend.",
  "features": [
    "Multi-agent orchestration",
    "Retrieval-augmented generation",
    "Tool calling workflows"
  ],
  "techStack": ["FastAPI", "LangGraph", "PostgreSQL", "Next.js"],
  "tags": ["AI/ML", "Full-Stack", "Backend"],
  "images": [
    {
      "url": "https://example.com/screenshot.png",
      "alt": "AI chat interface showing contextual responses"
    }
  ],
  "links": [
    { "type": "web", "url": "https://ai-chat-platform.com" },
    { "type": "github", "url": "https://github.com/user/project" }
  ],
  "metrics": {
    "duration": "3 months",
    "teamSize": 2,
    "impact": "Improved response accuracy by 40%"
  },
  "featured": true,
  "status": "active"
}
```

## Notes

- **Slug Generation**: Automatically created from title on save
- **Backward Compatibility**: Old form backed up as `ProjectForm.old.tsx`
- **Supabase Integration**: Image upload still works with new structure
- **Supermemory**: Updated to index all new fields for chatbot context

## Rollback

If you need to rollback:
```bash
cd components/admin
mv ProjectForm.tsx ProjectForm.new.tsx
mv ProjectForm.old.tsx ProjectForm.tsx
```

Then revert the database model and API changes.
