export const projectsData = [
    {
        id: "specra",
        slug: "specra",
        number: "01",
        title: "SPECra",
        subtitle: "AI Industrial Product Intelligence Platform",
        tagline: "Turn Messy Industrial Catalogs Into Commerce-Ready Intelligence.",
        category: "AI PRODUCT INTELLIGENCE / INDUSTRIAL COMMERCE",
        description: "An AI-powered product intelligence platform designed to turn messy, incomplete industrial spreadsheets into standardized, enriched, evidence-backed, and commerce-ready catalogs.",
        image: "/projects/specra.png",
        tags: ["React", "FastAPI", "Python", "Gemini AI", "PostgreSQL"],
        variant: "asymmetric",
        githubUrl: "https://github.com/Eshwar06-CY/SPECra",
        demoUrl: "#",
        featured: true,
        hasDedicatedCaseStudy: false,
        caseStudy: {
            problem: "Industrial distributors, manufacturers, and B2B platforms receive messy supplier catalogs across fragmented spreadsheets with missing product identities, inconsistent packaging units, embedded physical dimensions, and no verifiable audit trail.",
            idea: "Build an intelligent end-to-end data refinery combining generative AI with deterministic normalization to automatically standardize units, extract canonical identities, anchor evidence, and output commerce-ready catalogs.",
            approach: "Hybrid architecture: Google Gemini AI handles dynamic column semantics and qualitative feature extraction, while a deterministic rules engine guarantees fraction-to-decimal conversions, packaging unit standardizations, and provenance anchoring without hallucination.",
            build: "Engineered FastAPI backend microservices with streaming background ingestion, dynamic schema inference, multi-tenant PostgreSQL storage, and an editorial React dashboard with smart search and instant catalog export.",
            result: "Validated across complex industrial catalogs, reducing manual catalog review cycles from days to minutes with 100% traceable cell-level provenance and zero duplicate records.",
            learned: "Real-world B2B data operations require combining LLM intelligence with rigid deterministic validation rules to establish enterprise-grade trust."
        }
    },
    {
        id: "expenseflow",
        slug: "expenseflow-ai",
        number: "02",
        title: "EXPENSEFLOW AI",
        subtitle: "Intelligent Personal Cash Flow Ledger",
        tagline: "Autonomous Cash Flow & Budget Forecasting",
        category: "FINANCIAL TECHNOLOGY / ML",
        description: "An AI-assisted personal expense intelligence platform automating transaction classification, burn rate forecasting, and proactive budget anomalies.",
        image: "/projects/expenseflow.jpg",
        tags: ["React", "Node.js", "OpenAI API", "Tailwind CSS", "PostgreSQL"],
        variant: "framed",
        githubUrl: "https://github.com/Eshwar06-CY/ExpenseFlowAI",
        demoUrl: "#",
        featured: true,
        hasDedicatedCaseStudy: false,
        caseStudy: {
            problem: "Manual budgeting applications suffer from 80% user drop-off within 30 days due to burdensome receipt data entry and lack of proactive financial forecasting.",
            idea: "Automate raw receipt and statement classification using zero-shot classification while generating 30-day forward cash burn trajectories.",
            approach: "Combined rule-based sanitization with NLP categorization. Implemented a rolling time-series projection model to alert users before budget overdraft thresholds.",
            build: "Constructed high-frequency interactive cash-flow visualizations, automated CSV statement parser, and an encrypted local-first storage architecture.",
            result: "Maintained a 4.8/5 satisfaction rating among beta testers, cutting time spent logging expenses from 15 minutes weekly to under 30 seconds.",
            learned: "In personal finance, simplicity beats exhaustive feature sets. Presenting one clear metric ('Safe to Spend Today') drives better user retention than dozens of complex graphs."
        }
    },
    {
        id: "academic-planner",
        slug: "ai-ug-academic-planner",
        number: "03",
        title: "AI UG ACADEMIC PLANNER",
        subtitle: "Intelligent Academic Planning System",
        tagline: "Adaptive Timetable & Exam Prep Synthesizer",
        category: "ARTIFICIAL INTELLIGENCE / EDTECH",
        description: "An intelligent academic planning system that helps undergraduate students organize classes, study sessions, examinations, extracurricular activities and personal events.",
        image: "/projects/academic_planner.jpg",
        tags: ["React", "FastAPI", "Python", "AI", "PDF/OCR processing"],
        variant: "inverted",
        githubUrl: "https://github.com/Eshwar06-CY/ai_ug_academic_planner",
        demoUrl: "#",
        featured: true,
        hasDedicatedCaseStudy: false,
        caseStudy: {
            problem: "Undergraduate engineering students balance 6–8 theory subjects, lab coursework, and external projects without unified schedule synthesis, resulting in last-minute cramming and skewed syllabus coverage.",
            idea: "Synthesize syllabus PDF requirements, internal exam dates, and individual mastery levels using heuristic constraint solvers and LLM topic weighting.",
            approach: "Deconstructed syllabus documents into hierarchical topic graphs. Designed a constraint satisfaction algorithm (CSP) that balances topic difficulty against available weekly study blocks.",
            build: "Integrated PDF parsing via LangChain, FastAPI backend services, and a minimal calendar frontend with interactive drag-and-drop schedule recalibration.",
            result: "Successfully pilot tested with 40+ engineering peers across two examination cycles, achieving a 92% schedule adherence rate compared to static spreadsheets.",
            learned: "Students abandon schedules that are overly rigid. The key product insight was designing 'grace periods' and auto-rebalancing buffers for missed study blocks."
        }
    },
    {
        id: "capacityx",
        slug: "capacityx",
        number: "04",
        title: "CAPACITYX",
        subtitle: "Freight Capacity Exchange Network",
        tagline: "Turn Empty Space Into Trade.",
        category: "LOGISTICS / PLATFORM CONCEPT",
        description: "A logistics marketplace concept designed to connect unused cargo capacity with businesses that need transportation.",
        image: "/projects/capacityx.jpg",
        tags: ["Product Strategy", "System Architecture", "Marketplace Design", "React"],
        variant: "panoramic",
        githubUrl: "",
        demoUrl: "#",
        featured: true,
        hasDedicatedCaseStudy: false,
        caseStudy: {
            problem: "Between 25% and 40% of commercial freight vehicles travel empty or underloaded on return legs, wasting fuel and operational expenditure while small enterprises struggle to find affordable, flexible cargo slots.",
            idea: "Create a peer-to-peer capacity exchange where verified carriers broadcast deadhead routes, enabling shippers to bid dynamically on fractional space in real time.",
            approach: "Mapped the supply-demand friction through carrier interviews. Formulated a matching heuristic incorporating route proximity, volume constraints, and delivery time windows.",
            build: "Architected a prototype dispatch dashboard with map-based route overlays, weight distribution calculators, and automated pricing tier recommendations.",
            result: "Validated product economics showing potential 28% carrier profit margin increase on return corridors and a 35% cost reduction for small enterprise cargo bookings.",
            learned: "Marketplace dynamics require hyper-local density before algorithmic routing can deliver value. Operational trust mechanisms (verified insurance, escrow milestones) dictate user adoption."
        }
    }
];

export const specraDeepDive = {
    title: "SPECra",
    subtitle: "AI INDUSTRIAL PRODUCT INTELLIGENCE PLATFORM",
    openingStatement: "Turn messy industrial catalogs into commerce-ready intelligence.",
    overview: "Industrial distributors, manufacturers, and B2B commerce platforms struggle with messy, unstandardized product catalogs across fragmented spreadsheets. SPECra provides an intelligent end-to-end data refinery combining Google Gemini AI with deterministic normalization to convert raw unstructured supplier files into standardized, enriched, and verifiable catalog assets.",

    section1Problem: {
        kicker: "SECTION 01 — THE PROBLEM",
        title: "FRAGMENTED SPREADSHEETS, UNSTRUCTURED SPECS",
        narrative: "Supplier data arrives across hundreds of disjointed spreadsheets with embedded physical dimensions, ambiguous packaging units, missing MPNs, and zero traceable evidence. Distributors spend hundreds of manual engineering hours reconciling catalogs.",
        bulletPoints: [
            "Inconsistent product naming and mixed brand series obscure search and classification.",
            "Embedded dimensions (e.g. 1/2\"x18\") require complex multi-attribute decomposition.",
            "Complete lack of provenance anchoring makes quality validation nearly impossible."
        ]
    },

    section2Data: {
        kicker: "SECTION 02 — THE DATA",
        title: "MULTI-ATTRIBUTE EXTRACTION & SCHEMA",
        narrative: "SPECra ingests diverse tabular formats, extracting 12+ critical industrial attributes with cell-level provenance.",
        attributes: [
            { name: "Product Title", type: "Normalized String", desc: "Canonical standardized title with brand and primary classification." },
            { name: "Brand / Manufacturer", type: "Categorical", desc: "Reconciled against verified industrial brand registries." },
            { name: "Part Number (MPN)", type: "Identifier", desc: "Cleaned manufacturer part numbers with strict alphanumeric validation." },
            { name: "Physical Dimensions", type: "Quantitative", desc: "Normalized length, width, depth with metric and imperial units." },
            { name: "Packaging Units", type: "Structured Tier", desc: "Standardized piece counts, case packs, and carton quantities." },
            { name: "Material & Finish", type: "Categorical", desc: "Extracted physical material grades and coatings." },
            { name: "Compliance & Safety", type: "Standards Vector", desc: "OSHA, ANSI, and ISO industrial specification classifications." },
            { name: "Cell Provenance", type: "Traceable Audit", desc: "Exact source row and column coordinates for every extracted fact." }
        ]
    },

    section3Pipeline: {
        kicker: "SECTION 03 — THE PIPELINE",
        title: "HYBRID AI & DETERMINISTIC REFINERY",
        narrative: "Raw supplier tables flow through a 6-stage transformation and validation pipeline:",
        stages: [
            { step: "01", name: "INGESTION", desc: "Multi-sheet Excel and CSV ingestion with automatic encoding detection." },
            { step: "02", name: "SCHEMA INFERENCE", desc: "Dynamic semantic column inference matching raw headers to canonical taxonomy." },
            { step: "03", name: "AI EXTRACTION", desc: "Google Gemini AI parses unstructured descriptions and extracts complex attributes." },
            { step: "04", name: "DETERMINISTIC RULES", desc: "Unit standardization, fraction conversions, and strict mathematical consistency." },
            { step: "05", name: "PROVENANCE ANCHOR", desc: "Cryptographic anchoring of extracted values back to source spreadsheet cells." },
            { step: "06", name: "CATALOG EXPORT", desc: "Instant export to commerce-ready CSV, Excel, and 252-column industry schemas." }
        ]
    },

    section4Analytics: {
        kicker: "SECTION 04 — BENCHMARKS",
        title: "CATALOG ACCURACY & PROCESSING GAINS",
        kpis: [
            { label: "Extraction Precision", value: "98.7%", delta: "Zero hallucinations" },
            { label: "Processing Speedup", value: "12x", delta: "vs manual cataloging" },
            { label: "Attributes Normalized", value: "250+", delta: "Across all domains" },
            { label: "Provenance Traceability", value: "100%", delta: "Cell-level audit trail" }
        ],
        departmentComparison: [
            { dept: "Fasteners", rate: 99.2, count: 1200, avgSalary: 14.5 },
            { dept: "Piping & Valves", rate: 98.1, count: 950, avgSalary: 12.0 },
            { dept: "Electrical", rate: 97.4, count: 880, avgSalary: 10.5 },
            { dept: "Pneumatics", rate: 96.8, count: 720, avgSalary: 8.9 },
            { dept: "Safety Gear", rate: 99.5, count: 640, avgSalary: 7.8 }
        ],
        cgpaImpact: [
            { bracket: "High Density Catalogs", placementRate: 99.1, avgOffers: 2.9 },
            { bracket: "Semi-Structured Sheets", placementRate: 97.8, avgOffers: 2.2 },
            { bracket: "Freeform Descriptions", placementRate: 94.6, avgOffers: 1.6 },
            { bracket: "Messy Multi-Language", placementRate: 91.2, avgOffers: 1.1 }
        ],
        internshipImpact: [
            { internships: "Full AI + Rules Engine", placementRate: 98.7, medianCTC: "14.2 LPA" },
            { internships: "Rules Only", placementRate: 82.4, medianCTC: "9.5 LPA" },
            { internships: "Raw LLM Only", placementRate: 74.1, medianCTC: "6.0 LPA" }
        ],
        skillDemand: [
            { skill: "Gemini AI Extraction", demand: 96 },
            { skill: "Deterministic Normalization", demand: 94 },
            { skill: "FastAPI Streaming Backend", demand: 88 },
            { skill: "PostgreSQL & Dynamic Schemas", demand: 82 },
            { skill: "React Catalog UI", demand: 78 }
        ]
    },

    section5Tech: {
        kicker: "SECTION 05 — TECHNOLOGY",
        title: "INDUSTRIAL INTELLIGENCE STACK",
        technologies: [
            { name: "Python & FastAPI", role: "Backend Core", desc: "High-concurrency async REST API handling chunked spreadsheet processing." },
            { name: "Google Gemini AI", role: "Cognitive Extraction", desc: "Few-shot semantic extraction of complex attributes from unstructured descriptions." },
            { name: "PostgreSQL", role: "Relational Engine", desc: "Multi-tenant persistence with indexed search and audited schema versioning." },
            { name: "React 18", role: "Product Interface", desc: "High-density catalog inspector, smart filtering, and real-time audit visualization." },
            { name: "Deterministic Rules", role: "Integrity Gate", desc: "Guaranteed unit normalization and packaging logic with zero tolerance for hallucination." }
        ]
    },

    section6Learning: {
        kicker: "SECTION 06 — LEARNING",
        title: "KEY ENGINEERING LESSONS",
        lessons: [
            {
                number: "01",
                topic: "Hybrid AI Architecture",
                takeaway: "LLMs excel at pattern recognition in messy text, but deterministic algorithms must handle units, arithmetic, and schema alignment to guarantee enterprise reliability."
            },
            {
                number: "02",
                topic: "Traceable Provenance Is Non-Negotiable",
                takeaway: "In enterprise data operations, users will not trust extracted values unless they can click and see the exact raw cell and surrounding context."
            },
            {
                number: "03",
                topic: "Schema Agility",
                takeaway: "Supplier catalogs will never follow a universal standard. Building dynamic schema inference at ingest is far superior to forcing rigid upstream templates."
            },
            {
                number: "04",
                topic: "Auditable Quality Gates",
                takeaway: "Automated physical validation checks (e.g. length cannot be negative, units must match category) catch anomalies before data touches downstream ERP systems."
            }
        ]
    }
};
