// scripts/sync-profile.ts
// Indexes non-project portfolio content into Qdrant so the chatbot can answer
// questions about contact info, work experience, skills, testimonials, and availability.
// Usage: npx tsx scripts/sync-profile.ts
import 'dotenv/config';
import { QdrantClient } from '@qdrant/js-client-rest';
import mongoose from 'mongoose';
import { COLLECTION_NAME, generateEmbedding, initQdrant } from '../lib/qdrant-sync';
import { bumpChatKnowledgeVersion } from '../lib/chat-cache';
import { RESUME_LINKS_TEXT, UPWORK_PROFILE_URL } from '../lib/brand';

const QDRANT_URL = process.env.QDRANT_URL!;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY!;
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
Upwork: ${UPWORK_PROFILE_URL}
Portfolio: https://natnaelalemseged.com

Primary positioning:
Natnael is an Applied AI Engineer focused on agent systems, evaluation, RAG, AI backends, and production AI products. His full-stack and mobile experience supports end-to-end AI delivery rather than serving as a separate professional identity.

Availability and mobility:
Natnael is currently open to Applied AI engineering roles and engagements. He is available for remote roles worldwide and willing to relocate for the right onsite or hybrid opportunity, particularly with established AI startups and leading AI product or research companies. He is also open to contract work and focused consulting. Visitors can reach out via email or the contact form on his portfolio website.`,
  },

  {
    chunkType: 'skills',
    title: 'Technical Skills & Expertise',
    content: `Technical Skills & Expertise — Natnael Alemseged

Applied AI capabilities:
- Agent systems and tool use: LangGraph, multi-agent workflows, MCP, Composio, structured generation, explicit state and recovery paths
- Evaluation and experimentation: LLM-as-a-judge, deterministic evaluators, domain benchmarks, preference data, statistical testing, fine-tuning, LoRA, DPO/SimPO
- Retrieval and AI backends: RAG, vector databases, semantic search, memory systems, Python, FastAPI, Node.js, TypeScript, PostgreSQL, Redis
- Product integration: Next.js, React, Flutter, React Native, Expo, real-time events, analytics, and user-facing AI workflows
- Cloud and ML delivery: AWS EKS, Docker, Kubernetes, Terraform, GitHub Actions, Prometheus, Grafana, TensorRT, CI/CD

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

1. Senior Software Engineer — Hire Armada (United States · Remote) | Jul 2025 – Present
   - Engineers AI-driven backends and product features using Node.js, FastAPI, Next.js, Flutter, Prisma, LangGraph, MCP, Composio, and vector memory.
   - Built social discovery backend supporting 10K+ DAU with 99.9% uptime, real-time matching, and messaging.
   - Created affirmation mobile app with Gemini AI chat, widgets, personalized feeds; boosted retention 35%.
   - Delivered an agentic collaboration workspace with real-time events, email automation, semantic search, and tagged agents, improving team productivity by 20%.

2. Senior Full-Stack Developer — Startup Agile (United States · Remote) | Jan 2025 – May 2026
   - Led React/Next.js web and React Native (Expo) mobile delivery; hit milestones 15% ahead of schedule.
   - Built OTA-enabled RN apps with deep linking, Firebase push, Google Maps, analytics, and AI assistants; cut load 35%.
   - Optimized Next.js SSR/SEO (App Router) and mobile bundles; +50% web traffic and +30% Core Web Vitals.
   - Standardized TypeScript, tRPC, Prisma, Playwright + Detox testing; reduced production bugs 65%.

3. AI Engineer — DataCore Software (United States · Remote, Contract) | Jan 2025 – Aug 2025
   - Built AI-powered storage services with Python, FastAPI, Docker, and self-hosted LLMs for detection, transcription, translation.
   - Delivered <200ms inference and 99.9% uptime via AWS EKS, TensorRT optimizations, and containerized deployments.
   - Fine-tuned LLaMA 3, Mistral 7B, etc., cutting GPU costs 12%; shipped end-to-end ML pipelines with similarity search.
   - Automated CI/CD using GitHub Actions, Terraform, Prometheus/Grafana; rollout failures down 60%.

4. Senior Mobile Developer — Qemer Software Technology PLC (Addis Ababa, Ethiopia · On-site) | Aug 2024 – Sep 2025
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
    content: `Client Testimonials and Verified Delivery Outcomes — Natnael Alemseged

Natnael is Upwork Top Rated with 100% Job Success and verified 5-star client outcomes.
Upwork profile with the verified reviews: ${UPWORK_PROFILE_URL}

1. Social Music Party Game | January–June 2026
   - Delivered a complete client product engagement from implementation through handoff.
   - Outcome: Verified 5.0 Upwork rating.

2. AI Chatbot Engineering | January 2026
   - Completed a focused production chatbot engagement covering integration, product behavior, and delivery.
   - Outcome: Verified 5.0 Upwork rating.

3. Flutter Inventory Tracker | 2025
   - Shipped and supported a cross-platform inventory application through a completed client engagement.
   - Outcome: Verified 5.0 Upwork rating.

No client names or direct quotation text are included in the portfolio evidence.`,
  },

  {
    chunkType: 'availability',
    title: 'Availability, Services & Engagement',
    content: `Availability, Services & Engagement — Natnael Alemseged

Current status: Available for new opportunities.

Primary roles and services:
- Applied AI engineering: agent systems, RAG, evaluation frameworks, LLM integrations, fine-tuning, and vector search
- Production AI backends: FastAPI, Node.js, structured outputs, tool integrations, real-time workflows, and observability
- AI product integration: Next.js, React, Flutter, React Native, and end-to-end user experiences around model capabilities
- Technical discovery, system architecture, rapid prototyping, deployment, and measurable iteration

Engagement types accepted:
- Full-time employment: remote worldwide, onsite, or hybrid with relocation
- Contract and freelance projects
- Technical consulting and advisory

How to reach Natnael:
- Email: Natiaabaydam@gmail.com
- LinkedIn: https://www.linkedin.com/in/natnael-alemseged
- GitHub: https://github.com/Natnael-Alemseged
- Upwork (contract and freelance): ${UPWORK_PROFILE_URL}
- Contact form on portfolio: https://natnaelalemseged.com

Resume / CV downloads (PDF):
${RESUME_LINKS_TEXT}`,
  },
];

async function syncProfile() {
  const client = getClient();
  await initQdrant();

  console.log(`\n🔄 Syncing ${profileChunks.length} profile chunks to Qdrant...\n`);

  for (const chunk of profileChunks) {
    process.stdout.write(`  Indexing "${chunk.title}"... `);
    try {
      const embedding = await generateEmbedding(chunk.content, 'RETRIEVAL_DOCUMENT');
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

  await bumpChatKnowledgeVersion();
  await mongoose.disconnect();

  console.log('\n✅ Profile sync complete.\n');
}

syncProfile().catch(err => {
  console.error('Profile sync failed:', err);
  process.exit(1);
});
