import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env files first
const envPath = path.resolve(__dirname, '../.env');
const envLocalPath = path.resolve(__dirname, '../.env.local');

dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

const github = (repo: string) => ({
    type: 'github',
    url: `https://github.com/Natnael-Alemseged/${repo}`,
    label: 'View GitHub Repo'
});

const cover = (fileName: string, alt: string, caption: string) => ([
    {
        url: `/projects/ai/${fileName}.png`,
        alt,
        caption,
        order: 0
    }
]);

async function seed() {
    try {
        const { default: connectToDatabase } = await import('../lib/db/mongoose');
        const { default: Project } = await import('../lib/db/project.model');
        
        console.log('Connecting to database...');
        await connectToDatabase();
        
        const aiProjects = [
            {
                slug: 'tenacious-conversion-engine',
                title: 'Tenacious Conversion Engine',
                role: 'AI Sales Automation & Evaluation Engineer',
                summary: 'FastAPI sales automation engine for synthetic-prospect outreach, combining inbound email/SMS webhooks, HubSpot write-back, Cal.com booking, enrichment signals, Langfuse traces, and tau2-bench evaluation.',
                keyTakeaway: 'Built the sales agent with sink-routed outbound safety and sealed-eval guardrails before any live-channel workflow.',
                problem: 'Sales automation agents can easily over-message, route real outbound traffic accidentally, overclaim prospect signals, or optimize against generic benchmarks that miss Tenacious-specific failure modes.',
                solution: 'Implemented a safety-first conversion workflow with synthetic-prospect assumptions, sink-mode defaults, CRM and booking integrations, hiring-signal enrichment, adversarial probes, and sealed tau2-bench coordination experiments.',
                content: `### What It Does
Tenacious Conversion Engine is a FastAPI backend for email-first and warm-SMS sales automation. It handles Resend and Africa's Talking webhooks, writes prospect state to HubSpot, schedules through Cal.com, enriches accounts with public hiring and firmographic signals, and traces runs through Langfuse.

### Engineering Highlights
* **Safety by default:** outbound email and SMS are routed to staff sink destinations until live delivery is explicitly enabled.
* **Evaluation harness:** tau2-bench wrapper scripts, sealed held-out protections, score logs, and trace exports make coordination prompt changes measurable.
* **Failure research:** adversarial probes and failure taxonomies turn business-risk categories into concrete regression targets.`,
                techStack: ['FastAPI', 'Python', 'HubSpot API', 'Cal.com', 'Langfuse', 'tau2-bench'],
                tags: ['Sales Automation', 'AI Evaluation', 'CRM', 'Safety Guardrails'],
                featured: true,
                visibility: 'public',
                status: 'active',
                schemaType: 'SoftwareApplication',
                position: 0,
                links: [github('tenacious-conversion-engine')],
                images: cover(
                    'tenacious-conversion-engine',
                    'Tenacious Conversion Engine safety-routed outreach workflow',
                    'Sink-routed email and SMS workflow with enrichment, CRM write-back, booking, tracing, and tau2 evaluation'
                )
            },
            {
                slug: 'salesconversion-bench',
                title: 'SalesConversion-Bench',
                role: 'Domain Benchmark & Judge Training Architect',
                summary: 'Sales-domain benchmark and trained critic layer for Tenacious-style B2B outreach, with contamination-aware task generation, deterministic scoring checks, preference data, and a small LoRA judge.',
                keyTakeaway: 'Turned prospect-facing sales failures into a measurable benchmark and judge gate instead of trusting generated drafts by default.',
                problem: 'Generic agent benchmarks miss high-cost sales mistakes such as bench overcommitment, ICP misclassification, ungrounded gap claims, tone drift, and booking CTAs that arrive too early.',
                solution: 'Built Tenacious-Bench v0.2 with 240 tasks, deterministic evaluator checks, human grading support, preference-pair generation, and a Path B judge that reproduces a +76.6pp held-out lift over the deterministic baseline.',
                content: `### What It Measures
SalesConversion-Bench evaluates whether a sales agent follows Tenacious-specific business rules. The dataset covers trace-derived, programmatic, multi-LLM, and hand-authored tasks across failure categories such as bench overcommitment, signal overclaiming, ICP misclassification, and tone drift.

### Engineering Highlights
* **Machine-checkable evaluator:** schema-backed tasks and deterministic scoring provide inspectable pass/fail reasons.
* **Preference training loop:** failed drafts are converted into chosen/rejected pairs for a small SimPO/LoRA critic.
* **Published artifacts:** the repo links to the Hugging Face dataset, judge adapter, technical write-up, and reproducible paired-bootstrap scripts.`,
                techStack: ['Python', 'JSON Schema', 'LoRA', 'SimPO', 'Hugging Face', 'Streamlit'],
                tags: ['Benchmarking', 'LLM Judge', 'Preference Training', 'Sales AI'],
                featured: true,
                visibility: 'public',
                status: 'active',
                schemaType: 'CreativeWork',
                position: 1,
                links: [github('SalesConversion-Bench')],
                images: cover(
                    'salesconversion-bench',
                    'SalesConversion-Bench evaluation and trained critic pipeline',
                    'Domain benchmark, deterministic checks, paired bootstrap evidence, and judge-gated outreach drafts'
                )
            },
            {
                slug: 'data-contract-enforcer',
                title: 'Data Contract Enforcer',
                role: 'Enterprise Data Reliability Engineer',
                summary: 'Schema integrity and lineage attribution system that turns inter-system dependencies into formal contracts, detects schema/type/statistical drift, and reports downstream blast radius.',
                keyTakeaway: 'Made AI pipeline contracts executable: validate, attribute, and explain exactly which consumers break when data drifts.',
                problem: 'Multi-system AI pipelines silently break when upstream schemas drift, confidence scales change, enums mutate, or event payloads stop matching downstream expectations.',
                solution: 'Implemented contract generation, validation, violation attribution, schema evolution analysis, AI-specific drift checks, and stakeholder reports backed by registry-first blast-radius analysis.',
                content: `### What It Enforces
Data Contract Enforcer manages contracts across a five-system AI pipeline: Intent-Code Correlator, Digital Courtroom, Document Refinery, Brownfield Cartographer, and Axiom Ledger.

### Engineering Highlights
* **Contract generation:** profiles JSONL into Bitol YAML, dbt schema files, and timestamped snapshots.
* **Validation runner:** catches type, range, enum, UUID, and statistical drift in audit, warn, or enforce mode.
* **Violation attribution:** combines dependency registry, lineage BFS, and git blame to produce actionable blast-radius reports.`,
                techStack: ['Python', 'Pydantic', 'dbt', 'Bitol', 'YAML', 'Streamlit'],
                tags: ['Data Contracts', 'Lineage', 'Drift Detection', 'Data Quality'],
                featured: true,
                visibility: 'public',
                status: 'active',
                schemaType: 'SoftwareApplication',
                position: 2,
                links: [github('data-contract-enforcer')],
                images: cover(
                    'data-contract-enforcer',
                    'Data Contract Enforcer schema validation and blast radius map',
                    'Contract gate catching drift and attributing downstream breakage through lineage and registry analysis'
                )
            },
            {
                slug: 'document-intelligence-refinery',
                title: 'Document Intelligence Refinery',
                role: 'Document AI & Provenance Systems Engineer',
                summary: 'PDF triage and extraction pipeline that detects document origin, layout, and domain, escalates extraction strategies by confidence, builds PageIndex trees, and answers with provenance chains.',
                keyTakeaway: 'Converted messy PDFs into auditable structured facts with confidence gates, retrieval indexes, and source-cited answers.',
                problem: 'Enterprise PDFs mix native text, scans, tables, forms, legal language, and financial facts, making naive OCR or single-pass extraction brittle and hard to audit.',
                solution: 'Built a triage-first pipeline with FastText, layout, and vision extraction strategies, chunk validation, PageIndex navigation, Chroma vector search, FactTable extraction, and claim verification.',
                content: `### What It Refines
Document Intelligence Refinery starts by profiling PDFs, then routes each document through the cheapest extraction strategy likely to work. Low-confidence outputs escalate from fast text to layout-aware parsing and finally to vision extraction.

### Engineering Highlights
* **PageIndex retrieval:** hierarchical page trees improve navigation over naive vector search.
* **Provenance chains:** answers include document name, page number, bounding box, and content hash.
* **Audit mode:** claims can be verified, marked not found, or declared unverifiable with cited evidence.`,
                techStack: ['Python', 'Pydantic', 'Docling', 'LangGraph', 'ChromaDB', 'SQLite'],
                tags: ['Document AI', 'PDF Extraction', 'RAG', 'Provenance'],
                featured: true,
                visibility: 'public',
                status: 'active',
                schemaType: 'SoftwareApplication',
                position: 3,
                links: [github('Document-Intelligence-Refinery-')],
                images: cover(
                    'document-intelligence-refinery',
                    'Document Intelligence Refinery confidence-gated PDF extraction pipeline',
                    'Triage, multi-strategy extraction, PageIndex retrieval, FactTable storage, and provenance-backed answers'
                )
            },
            {
                slug: 'axiom-ledger',
                title: 'Axiom Ledger',
                role: 'Event-Sourced AI Workflow Engineer',
                summary: 'Event-sourced lending pipeline for document intake, extraction, credit analysis, fraud, compliance, and decision orchestration over an append-only ledger.',
                keyTakeaway: 'Modeled lending decisions as replayable event streams so every agent action has an audit trail.',
                problem: 'AI-assisted lending workflows need strict traceability across document processing, credit reasoning, fraud checks, compliance blocks, and final decision outcomes.',
                solution: 'Created a canonical event schema, synthetic company/document generator, in-memory and PostgreSQL event stores, multi-agent pipeline phases, optimistic concurrency tests, projections, and refinery-backed document extraction.',
                content: `### What It Tracks
Axiom Ledger represents lending workflows as streams of immutable events. Document packages, extraction results, credit analysis, fraud checks, compliance decisions, and orchestrator outcomes can all be replayed from the ledger.

### Engineering Highlights
* **45 event types:** typed envelopes and schemas define the domain contract.
* **Five-agent pipeline:** document, credit, fraud, compliance, and decision orchestration phases.
* **Document Refinery integration:** financial facts can be extracted from PDFs and normalized into ledger events.`,
                techStack: ['Python', 'PostgreSQL', 'Event Sourcing', 'Pydantic', 'pytest', 'Docker'],
                tags: ['Event Sourcing', 'Fintech', 'Audit Trail', 'Multi-Agent Systems'],
                featured: true,
                visibility: 'public',
                status: 'active',
                schemaType: 'SoftwareApplication',
                position: 4,
                links: [github('Axiom-Ledger')],
                images: cover(
                    'axiom-ledger',
                    'Axiom Ledger event-sourced lending pipeline',
                    'Append-only loan event streams powering document, credit, fraud, compliance, and orchestration agents'
                )
            },
            {
                slug: 'dataagentbench',
                title: 'DataAgentBench Evaluation Fork',
                role: 'Data Agent Benchmark Operator',
                summary: 'Fork and evaluation workspace for DAB, a realistic enterprise data-agent benchmark spanning multi-database integration, messy joins, unstructured text transformation, and domain knowledge.',
                keyTakeaway: 'Used a serious external benchmark to stress data agents against multi-database enterprise complexity rather than SQL-only toy tasks.',
                problem: 'Data agents often appear strong on single-database SQL tasks but fail when real enterprise workloads require cross-system joins, text transformation, domain reasoning, and tool execution.',
                solution: 'Set up the DAB benchmark workflow with local database dependencies, Dockerized Python execution, supported LLM provider configuration, run logs, validation scripts, and pass@1 aggregation.',
                content: `### What It Evaluates
DataAgentBench covers 12 datasets and 54 queries across 9 domains and multiple DBMSes, including PostgreSQL, MongoDB, SQLite, and DuckDB. It evaluates agents on realistic data work rather than isolated SQL answering.

### Engineering Highlights
* **Multi-database setup:** local DB configuration and dataset structure mirror enterprise data sprawl.
* **Safe tool execution:** agents use read-only database querying plus Docker-backed Python execution.
* **Run validation:** logs capture final answers, tool calls, LLM calls, termination reasons, and pass@1 scoring.`,
                techStack: ['Python', 'Docker', 'PostgreSQL', 'MongoDB', 'DuckDB', 'SQLite'],
                tags: ['Data Agents', 'Benchmarking', 'Tool Use', 'Enterprise Data'],
                featured: true,
                visibility: 'public',
                status: 'active',
                schemaType: 'CreativeWork',
                position: 5,
                links: [
                    github('DataAgentBench'),
                    {
                        type: 'docs',
                        url: 'https://ucbepic.github.io/DataAgentBench/',
                        label: 'Benchmark Website'
                    }
                ],
                images: cover(
                    'dataagentbench',
                    'DataAgentBench multi-database benchmark workflow',
                    'Enterprise data-agent benchmark across databases, tools, validation scripts, and pass@1 scoring'
                )
            },
            {
                slug: 'brownfield-cartographer',
                title: 'Brownfield Cartographer',
                role: 'Codebase Intelligence & Lineage Engineer',
                summary: 'Multi-agent codebase cartography tool that analyzes local or GitHub repositories with Surveyor and Hydrologist agents to produce module graphs and data lineage artifacts.',
                keyTakeaway: 'Mapped legacy repositories into graph artifacts that agents can query instead of guessing architecture from raw files.',
                problem: 'AI agents waste context and hallucinate architecture in brownfield systems when they lack structural maps of modules, imports, SQL transformations, and data lineage.',
                solution: 'Built a CLI pipeline that clones or reads repositories, extracts AST/SQL/YAML structure, runs survey and lineage passes, and writes schema-versioned cartography artifacts.',
                content: `### What It Maps
Brownfield Cartographer has two core agents. Surveyor extracts module graphs, PageRank, git velocity, and dead-code candidates. Hydrologist traces data lineage through SQL, Python, dbt, and notebook assets.

### Engineering Highlights
* **Repo ingestion:** accepts local paths or GitHub URLs and analyzes them in a temporary workspace.
* **Graph outputs:** writes module and lineage graphs under .cartography for downstream tooling.
* **Schema versioning:** graph artifacts include schema versions and migration guidance as the model evolves.`,
                techStack: ['Python', 'AST Analysis', 'sqlglot', 'Pydantic', 'CLI', 'Git'],
                tags: ['Code Intelligence', 'Lineage', 'Static Analysis', 'Developer Tools'],
                featured: true,
                visibility: 'public',
                status: 'active',
                schemaType: 'SoftwareApplication',
                position: 6,
                links: [github('brownfield-cartographer')],
                images: cover(
                    'brownfield-cartographer',
                    'Brownfield Cartographer module graph and data lineage map',
                    'Surveyor and Hydrologist agents turning legacy repositories into dependency and lineage graphs'
                )
            },
            {
                slug: 'github-evaluator',
                title: 'GitHub Evaluator / Automaton Auditor',
                role: 'Agentic Code Review Systems Engineer',
                summary: 'LangGraph forensic codebase evaluator using a Digital Courtroom protocol: evidence-gathering detectives, three judge personas, deterministic conflict resolution, and hallucination policing.',
                keyTakeaway: 'Made repository evaluation adversarial and evidence-bound instead of letting a single judge model grade from vibes.',
                problem: 'Automated code evaluators can hallucinate file evidence, collapse into one weak opinion, or miss security and production-readiness failures when grading complex repositories.',
                solution: 'Designed a fan-out/fan-in LangGraph workflow where investigators collect AST, git, security, PDF, and vision evidence, judges argue independently, and Chief Justice rules apply deterministic vetoes and synthesis.',
                content: `### What It Audits
Automaton Auditor evaluates repositories through staged graph execution. It gathers objective evidence, merges it with integrity checks, asks prosecutor/defense/tech-lead personas to score independently, and writes a final audit report.

### Engineering Highlights
* **Evidence integrity:** cited file paths are checked against the repo manifest and hallucinated paths are penalized.
* **Deterministic justice node:** security, evidence, and functionality rules settle disputes without another LLM call.
* **Report output:** final Markdown includes executive summary, per-criterion scores, dissent summaries, remediation steps, and evidence audit.`,
                techStack: ['LangGraph', 'Python', 'RAG', 'AST Analysis', 'LangSmith', 'Docker'],
                tags: ['Code Review', 'Agent Workflows', 'LLM Evaluation', 'LangGraph'],
                featured: true,
                visibility: 'public',
                status: 'active',
                schemaType: 'SoftwareApplication',
                position: 7,
                links: [github('Github-Evaluator')],
                images: cover(
                    'github-evaluator',
                    'GitHub Evaluator forensic codebase audit workflow',
                    'Detective evidence fan-out, adversarial judge synthesis, deterministic verdict rules, and hallucination audit'
                )
            },
            {
                slug: 'project-chimera',
                title: 'Project Chimera',
                role: 'Autonomous Agent Platform Architect',
                summary: 'Spec-driven autonomous influencer network foundation using FastRender Swarm architecture, MCP-only external IO, Planner/Worker/Judge task DAGs, HITL review, multi-tenancy, and budget governance.',
                keyTakeaway: 'Designed agentic social-media infrastructure with explicit governance, tenant isolation, and human review before risky actions.',
                problem: 'Autonomous content agents need more than schedulers: they require perception, planning, safety review, economic guardrails, tenant isolation, and auditable external interactions.',
                solution: 'Defined a spec-first platform with runtime skill contracts, TDD tests, Dockerized automation, CI checks, MCP-only interaction rules, budget governors, and Judge/HITL routing for content safety.',
                content: `### What It Defines
Project Chimera is the foundation for a fleet of virtual influencer agents managed by a human super-orchestrator. The repo establishes the architecture, contracts, tests, and governance rules that future runtime work must satisfy.

### Engineering Highlights
* **FastRender Swarm:** Planner decomposes goals, Workers execute tasks, and Judge validates outputs.
* **MCP-only IO:** external resources, tools, and prompts are routed through Model Context Protocol interfaces.
* **Governance:** HITL thresholds, budget limits, tenant isolation, and EU AI Act transparency are built into the specs.`,
                techStack: ['Python', 'MCP', 'Pydantic', 'pytest', 'Docker', 'GitHub Actions'],
                tags: ['Agent Swarms', 'MCP', 'AI Governance', 'Spec-Driven Development'],
                featured: true,
                visibility: 'public',
                status: 'in-progress',
                schemaType: 'SoftwareApplication',
                position: 8,
                links: [github('Project-Chimera')],
                images: cover(
                    'project-chimera',
                    'Project Chimera autonomous influencer swarm architecture',
                    'Planner, Worker, and Judge modules coordinating MCP tools, HITL review, tenant lanes, and budget governance'
                )
            },
            {
                slug: 'trp1-ai-artist',
                title: 'TRP1 AI Artist',
                role: 'Generative Media Infrastructure Engineer',
                summary: 'Async multi-provider AI content generation framework for music, video, and images with plugin providers, style presets, CLI workflows, job tracking, duplicate detection, and cost controls.',
                keyTakeaway: 'Unified music, image, and video generation into a provider-agnostic pipeline with persistent job management.',
                problem: 'Generative media APIs have inconsistent capabilities, long-running jobs, duplicate-cost risks, provider lock-in, and messy post-processing paths from source material to final output.',
                solution: 'Built a typed plugin architecture for Google, AIMLAPI, and Kling providers, plus style presets, Archive.org source discovery, SQLite job tracking, async status sync, FFmpeg media merge, and export workflows.',
                content: `### What It Generates
TRP1 AI Artist orchestrates music, image, and video generation across multiple providers. It can search source material, run parallel generation jobs, merge media locally, and prepare outputs for YouTube or S3.

### Engineering Highlights
* **Provider registry:** new music or video providers can be added without modifying core orchestration.
* **Job tracking:** SQLite persistence records queued, processing, completed, downloaded, and failed jobs.
* **Cost control:** duplicate detection prevents repeated API calls for the same prompt and provider setup.`,
                techStack: ['Python', 'Typer', 'Pydantic', 'SQLite', 'FFmpeg', 'AsyncIO'],
                tags: ['Generative Media', 'AI Art', 'Provider Plugins', 'Creative Tools'],
                featured: true,
                visibility: 'public',
                status: 'active',
                schemaType: 'CreativeWork',
                position: 9,
                links: [github('trp1-ai-artist')],
                images: cover(
                    'trp1-ai-artist',
                    'TRP1 AI Artist multi-provider content generation pipeline',
                    'Async music, image, and video generation with provider plugins, job tracking, cost controls, and media export'
                )
            }
        ];

        console.log(`Upserting ${aiProjects.length} AI projects...`);
        const aiProjectSlugs = aiProjects.map(p => p.slug);
        
        for (const project of aiProjects) {
            console.log(`Upserting: "${project.title}"`);
            await Project.findOneAndUpdate(
                { slug: project.slug },
                { $set: project },
                { upsert: true, new: true }
            );
        }
        
        console.log(`Shifting existing projects to positions ${aiProjects.length}+ to preserve their visibility additively...`);
        const remainingProjects = await Project.find({ slug: { $nin: aiProjectSlugs } }).sort({ createdAt: -1 });
        
        for (let i = 0; i < remainingProjects.length; i++) {
            const p = remainingProjects[i];
            const newPos = aiProjects.length + i;
            console.log(`Shifting "${p.title}" to position: ${newPos} (featured: false)`);
            await Project.findByIdAndUpdate(p._id, {
                $set: {
                    position: newPos,
                    featured: false
                }
            });
        }
        
        console.log('AI project seeding and shifting completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
