/**
 * SuperMemory Context Management Script
 * 
 * This script helps you add, update, and manage your personal context in SuperMemory.
 * Run this during development to populate your knowledge base with information about
 * your experience, skills, projects, and background.
 * 
 * Usage:
 * 1. Update the CONTEXT_DATA object below with your information
 * 2. Run: node scripts/manage-context.js
 */

const Supermemory = require('supermemory');
require('dotenv').config();

// Unique container tag for your portfolio chatbot
const CONTAINER_TAG = 'natnael-portfolio-chatbot';

// Initialize SuperMemory client
const supermemory = new Supermemory({
    apiKey: process.env.SUPERMEMORY_API_KEY,
});

// Your personal context data
const CONTEXT_DATA = [
    {
        title: 'Professional Summary',
        content: `Natnael Alemseged is a results-driven full-stack developer with hands-on experience building scalable apps using Flutter, React Native, Next.js, and Node.js/Express. He focuses on delivering high-performance mobile and web solutions, and is passionate about clean architecture, developer experience, open source, and AI-powered innovations.`,
        tags: ['about', 'summary', 'professional'],
    },
    {
        title: 'Technical Skills - Frontend',
        content: `Frontend Technologies:
- React.js & Next.js (Advanced)
- Flutter (Specialist level)
- React Native
- TypeScript & JavaScript
- Tailwind CSS
- Framer Motion for animations
- State management with Redux, Zustand, Provider`,
        tags: ['skills', 'frontend', 'technologies'],
    },
    {
        title: 'Technical Skills - Backend',
        content: `Backend Technologies:
- Node.js & Express.js
- FastAPI (Python)
- MongoDB & Mongoose
- RESTful API design
- Authentication & Authorization
- Database design and optimization`,
        tags: ['skills', 'backend', 'technologies'],
    },
    {
        title: 'Technical Skills - AI & Tools',
        content: `AI & Development Tools:
- AI Integration & Automation
- OpenAI & Groq APIs
- Git & GitHub
- Docker
- CI/CD pipelines
- Agile methodologies`,
        tags: ['skills', 'ai', 'tools'],
    },
    {
        title: 'Work Experience',
        content: `Add your work experience here. Example:
- Company Name (Date - Date): Role and responsibilities
- Key achievements and technologies used
- Impact and results delivered`,
        tags: ['experience', 'work'],
    },
    {
        title: 'Education',
        content: `Add your educational background here. Example:
- Degree, University Name (Year)
- Relevant coursework
- Academic achievements`,
        tags: ['education', 'background'],
    },
    {
        title: 'Notable Projects',
        content: `Add your key projects here. Example:
1. Project Name: Description, technologies used, and impact
2. Project Name: Description, technologies used, and impact
Include links to GitHub repos or live demos if available.`,
        tags: ['projects', 'portfolio'],
    },
    {
        title: 'Contact Information',
        content: `Contact Details:
- Email: natiaabaydam@gmail.com
- GitHub: github.com/Natnael-Alemseged
- LinkedIn: linkedin.com/in/natnael-alemseged
- Location: Ethiopia
- Availability: Open to opportunities`,
        tags: ['contact', 'availability'],
    },
];

/**
 * Add or update context in SuperMemory
 */
async function addContext() {
    console.log('🚀 Starting to add context to SuperMemory...\n');

    for (const item of CONTEXT_DATA) {
        try {
            const response = await supermemory.memories.create({
                content: `${item.title}\n\n${item.content}`,
                metadata: {
                    title: item.title,
                    tags: item.tags,
                    containerTag: CONTAINER_TAG,
                    source: 'portfolio-context-script',
                    lastUpdated: new Date().toISOString(),
                },
            });

            console.log(`✅ Added: ${item.title}`);
        } catch (error) {
            console.error(`❌ Failed to add "${item.title}":`, error.message);
        }
    }

    console.log('\n✨ Context management complete!');
}

/**
 * Search for existing context
 */
async function searchContext(query) {
    try {
        const results = await supermemory.search.execute({
            q: query,
            limit: 10,
            containerTag: CONTAINER_TAG,
        });

        console.log(`\n🔍 Search results for "${query}":\n`);
        results.results?.forEach((result, index) => {
            console.log(`${index + 1}. ${result.content?.substring(0, 100)}...`);
        });
    } catch (error) {
        console.error('❌ Search failed:', error.message);
    }
}

/**
 * List all memories in the container
 */
async function listMemories() {
    try {
        const results = await supermemory.memories.list({
            containerTag: CONTAINER_TAG,
            limit: 50,
        });

        console.log(`\n📋 All memories in container "${CONTAINER_TAG}":\n`);
        results.memories?.forEach((memory, index) => {
            console.log(`${index + 1}. ${memory.metadata?.title || 'Untitled'}`);
        });
    } catch (error) {
        console.error('❌ Failed to list memories:', error.message);
    }
}

// Main execution
const command = process.argv[2];

switch (command) {
    case 'add':
        addContext();
        break;
    case 'search':
        const query = process.argv[3];
        if (!query) {
            console.error('❌ Please provide a search query: node scripts/manage-context.js search "your query"');
        } else {
            searchContext(query);
        }
        break;
    case 'list':
        listMemories();
        break;
    default:
        console.log(`
📚 SuperMemory Context Manager

Usage:
  node scripts/manage-context.js add              - Add all context to SuperMemory
  node scripts/manage-context.js search "query"   - Search for context
  node scripts/manage-context.js list             - List all memories

Container Tag: ${CONTAINER_TAG}
        `);
}
