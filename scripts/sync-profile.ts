// scripts/sync-profile.ts
// Indexes non-project portfolio content into Qdrant so the chatbot can answer
// questions about contact info, work experience, skills, testimonials, and availability.
// Usage: npx tsx scripts/sync-profile.ts
import 'dotenv/config';
import { QdrantClient } from '@qdrant/js-client-rest';
import { generateEmbedding } from '../lib/qdrant-sync';

const QDRANT_URL = process.env.QDRANT_URL!;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY!;
const COLLECTION_NAME = 'chat_memories_v2';
const CONTAINER_TAG = 'natnael-portfolio-chatbot';

function getClient() {
  return new QdrantClient({ url: QDRANT_URL, apiKey: QDRANT_API_KEY, checkCompatibility: false });
}

// Stable deterministic IDs for profile chunks (not MongoDB ObjectIds)
function profileChunkId(chunkType: string): string {
  const map: Record<string, string> = {
    contact:      'f0000001-0000-0000-0000-000000000001',
    skills:       'f0000001-0000-0000-0000-000000000002',
    experience:   'f0000001-0000-0000-0000-000000000003',
    testimonials: 'f0000001-0000-0000-0000-000000000004',
    availability: 'f0000001-0000-0000-0000-000000000005',
  };
  return map[chunkType] ?? `f0000001-0000-0000-0000-${chunkType.slice(0, 12).padStart(12, '0')}`;
}

interface ProfileChunk {
  chunkType: string;
  title: string;
  content: string;
}

const profileChunks: ProfileChunk[] = [
  {
    chunkType: 'contact',
    title: 'Contact & Availability',
    content: `Contact & Availability for Natnael Alemseged

Email: Natiaabaydam@gmail.com
GitHub: https://github.com/Natnael-Alemseged
LinkedIn: https://www.linkedin.com/in/natnael-alemseged
Portfolio: https://natnaelalemseged.com

Availability:
Natnael is currently open to new opportunities including full-time roles, contract work, and freelance projects. He is available for AI engineering, full-stack development, and mobile development engagements. Visitors can reach out via email or the contact form on his portfolio website.`,
  },

  {
    chunkType: 'skills',
    title: 'Technical Skills & Expertise',
    content: `Technical Skills & Expertise — Natnael Alemseged

Core specializations:
- AI Engineering: LLM-powered systems, LangGraph agents, vector databases, RAG pipelines, FastAPI backends, fine-tuning (LLaMA 3, Mistral 7B)
- Full-Stack Web: Next.js (App Router, SSR, SEO), React, TypeScript, tRPC, Prisma, PostgreSQL, Node.js
- Mobile Development: Flutter (cross-platform iOS/Android), React Native (Expo), Ionic, Firebase, deep linking, OTA updates
- Infrastructure & DevOps: AWS EKS, Docker, Terraform, GitHub Actions, Prometheus/Grafana, TensorRT
- AI Tools & Integrations: OpenAI, Groq, Gemini AI, Composio, Langflow, Supermemory, MCP, Socket.io
- Testing: Playwright, Detox, TypeScript strict mode

Key metrics:
- 30+ production web and mobile platforms shipped
- 10K+ active users reached across platforms
- 65% bug reduction via TypeScript migration and testing standards
- 30% efficiency gain from agent automation pipelines
- <200ms inference latency on self-hosted LLM deployments`,
  },

  {
    chunkType: 'experience',
    title: 'Work Experience',
    content: `Work Experience — Natnael Alemseged

1. Senior Software Engineer — HireArmada (Atlanta, GA · Remote) | Aug 2025 – Present
   - Shipped AI-driven backends and full-stack features using Node.js, FastAPI, Flutter, Next.js, Prisma, Composio, MCP, and Langflow.
   - Built social discovery backend supporting 10K+ DAU with 99.9% uptime, real-time matching, and messaging.
   - Created affirmation mobile app with Gemini AI chat, widgets, personalized feeds; boosted retention 35%.
   - Automated PM bonus system (goal tracking, approvals, payouts) reducing processing time 50%.
   - Built agentic workspace with Socket.io, Composio email AI, Supermemory + Langflow search ending data silos.
   - Prototyped "Steve Jobs" AI persona using MCP, vector DB, and prompt flows for inspirational coaching.

2. Senior Full-Stack Developer — Startup Agile (Atlanta, GA · Remote) | Jan 2025 – Present
   - Led React/Next.js web and React Native (Expo) mobile delivery; hit milestones 15% ahead of schedule.
   - Built OTA-enabled RN apps with deep linking, Firebase push, Google Maps, analytics, and AI assistants; cut load 35%.
   - Optimized Next.js SSR/SEO (App Router) and mobile bundles; +50% web traffic and +30% Core Web Vitals.
   - Standardized TypeScript, tRPC, Prisma, Playwright + Detox testing; reduced production bugs 65%.

3. AI Engineer — DataCore Softwares (Fort Lauderdale, FL · Remote) | Jan 2025 – Jul 2025
   - Built AI-powered storage services with Python, FastAPI, Docker, and self-hosted LLMs for detection, transcription, translation.
   - Delivered <200ms inference and 99.9% uptime via AWS EKS, TensorRT optimizations, and containerized deployments.
   - Fine-tuned LLaMA 3, Mistral 7B, etc., cutting GPU costs 12%; shipped end-to-end ML pipelines with similarity search.
   - Automated CI/CD using GitHub Actions, Terraform, Prometheus/Grafana; rollout failures down 60%.

4. Senior Mobile Developer — Qemer Software Technologies (Addis Ababa, ET · Onsite) | Jan 2024 – Jun 2025
   - Led delivery of 10+ cross-platform Flutter/Ionic apps; execution velocity improved 40%.
   - Optimized app performance (load times -50%) and instituted mentoring program reducing onboarding 30%.
   - Oversaw UI/UX, QA, and release flows for high-availability mobile deployments.

5. Full-Stack Developer & Founder — Metshafe (Addis Ababa · Onsite) | Jun 2022 – Present
   - Co-founded Metshafe eBook platform, leading product strategy, architecture, and launch.
   - Built Flutter apps, Firebase backend, Node.js services, and Kotlin plugins powering payments and DRM.
   - Drove roadmap, analytics, and engagement initiatives for growing reader community.

6. Software Engineer — Freelance & Consulting | Jul 2022 – Mar 2023
   - Delivered bespoke full-stack solutions with React, Next.js, FastAPI, and PostgreSQL for startups.
   - Focused on performant UX, API integration, and project ownership from scoping to release.`,
  },

  {
    chunkType: 'testimonials',
    title: 'Client Testimonials',
    content: `Client Testimonials — Natnael Alemseged

1. Kate Rogers, Product Designer @ ABC Corp
   Project: Support tooling rebuild | Impact: Faster internal handoffs
   "Natnael transformed our customer support tooling in record time. The experience was seamless, collaborative, and the end result exceeded expectations."

2. Samuel Bekele, Startup Founder
   Project: Founder-led MVP | Impact: Launch-ready product system
   "We needed a developer who could move fast without compromising quality. Every deliverable was pixel-perfect, performant, and thoughtfully engineered."

3. Marta Alvarez, Product Lead @ TechFlow
   Project: Product delivery sprint | Impact: Clear release momentum
   "From ideation to launch, Natnael owned the build and communication. The attention to detail and empathy for our users were remarkable."

4. Lula Abebe, AI Researcher
   Project: AI workflow integration | Impact: Maintainable agent flows
   "We trusted Natnael with complex AI integrations. He delivered maintainable code, clear documentation, and creative solutions to tough problems."

5. David Chen, Senior Architect
   Project: Platform architecture | Impact: Cleaner technical direction
   "The ability to translate complex requirements into elegant, high-performance code is Natnael's superpower. A genuine pleasure to work with."

6. Elena K., Operations Manager
   Project: Operations automation | Impact: Leaner team workflows
   "Our workflow efficiency improved dramatically after the tools Natnael built were rolled out. Technical depth matched by sharp business intuition."`,
  },

  {
    chunkType: 'availability',
    title: 'Availability, Services & Engagement',
    content: `Availability, Services & Engagement — Natnael Alemseged

Current status: Available for new opportunities.

Services offered:
- AI engineering: RAG systems, LLM integrations, agentic workflows, fine-tuning, vector search
- Full-stack web development: Next.js, React, Node.js, FastAPI, TypeScript
- Mobile development: Flutter (iOS/Android), React Native, Expo
- Technical architecture and consulting
- MVP development for startups
- Performance optimization and code quality improvement

Engagement types accepted:
- Full-time employment (remote or hybrid)
- Contract and freelance projects
- Technical consulting and advisory

How to reach Natnael:
- Email: Natiaabaydam@gmail.com
- LinkedIn: https://www.linkedin.com/in/natnael-alemseged
- GitHub: https://github.com/Natnael-Alemseged
- Contact form on portfolio: https://natnaelalemseged.com`,
  },
];

async function syncProfile() {
  const client = getClient();

  console.log(`\n🔄 Syncing ${profileChunks.length} profile chunks to Qdrant...\n`);

  for (const chunk of profileChunks) {
    process.stdout.write(`  Indexing "${chunk.title}"... `);
    try {
      const embedding = await generateEmbedding(chunk.content);
      await client.upsert(COLLECTION_NAME, {
        wait: true,
        points: [
          {
            id: profileChunkId(chunk.chunkType),
            vector: embedding,
            payload: {
              content: chunk.content,
              title: chunk.title,
              slug: chunk.chunkType,
              sourceType: 'profile',
              chunkType: chunk.chunkType,
              containerTag: CONTAINER_TAG,
              visibility: 'public',
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });
      console.log('✅');
    } catch (err) {
      console.log(`❌ ${err}`);
    }
  }

  console.log('\n✅ Profile sync complete.\n');
}

syncProfile().catch(err => {
  console.error('Profile sync failed:', err);
  process.exit(1);
});
