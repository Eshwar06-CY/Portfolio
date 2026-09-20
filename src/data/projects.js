export const projectsData = [
    {
        id: "specra",
        slug: "specra",
        number: "01",
        title: "SPECra",
        subtitle: "AI Industrial Product-Data Cleaning & Intelligence",
        tagline: "Turn Messy Industrial Catalogs Into Standardized, Evidence-Backed Data.",
        category: "AI PRODUCT DATA INTELLIGENCE / B2B COMMERCE",
        description: "SPECra is an AI-powered product-data cleaning and intelligence platform for industrial/B2B commerce.",
        image: "/projects/specra.png",
        tags: ["React", "TypeScript", "FastAPI", "Python", "Google Gemini", "PostgreSQL"],
        variant: "asymmetric",
        githubUrl: "https://github.com/Eshwar06-CY/SPECra",
        demoUrl: "#",
        status: "Completed working prototype / competition project, with an ongoing future roadmap.",
        contribution: "Core developer — Team DEADLOCK",
        featured: true,
        hasDedicatedCaseStudy: false,
        workflow: [
            "Upload CSV/Excel",
            "Tell SPECra what information you need",
            "AI analyzes products",
            "Data gets normalized",
            "Quality is validated",
            "Export clean catalog"
        ],
        capabilities: [
            "Understand uploaded spreadsheet structure",
            "Identify product names, brands, manufacturers, MPNs and specifications",
            "Extract information from messy descriptions using Gemini",
            "Normalize units such as 1/2\" → 0.5 in",
            "Interpret packaging such as 6pc → 6 pieces",
            "Show provenance/evidence for extracted information",
            "Run quality and consistency checks",
            "Natural-language catalog search",
            "Export processed catalog as CSV/XLSX",
            "Support the 252-column UniHack schema"
        ],
        productPrinciple: "If SPECra cannot find or infer a specification from source data, it leaves the field blank rather than inventing information.",
        architecturalPrinciple: "AI is used for interpreting messy product information. Deterministic rules are used where exactness matters, including: unit conversion, fractions, packaging, provenance, and schema mapping.",
        caseStudy: {
            problem: "Industrial companies receive product catalogs from suppliers as messy Excel/CSV files. Product information can contain inconsistent names, dimensions buried inside descriptions, packaging such as \"6pc\", missing brands/MPNs and other inconsistencies.",
            idea: "SPECra transforms messy catalogs into a clean, standardized, searchable and evidence-backed product catalog using a hybrid pipeline of generative AI and deterministic normalization rules.",
            approach: "AI is used for interpreting messy product information, while deterministic rules are used where exactness matters (unit conversion, fractions, packaging, provenance, and schema mapping). If SPECra cannot find or infer a specification from source data, it leaves the field blank rather than inventing information.",
            build: "Engineered FastAPI backend services with Pydantic validation, dynamic spreadsheet parsing, Google Gemini API integration, PostgreSQL catalog storage, and an editorial React dashboard supporting the 252-column UniHack schema.",
            result: "Completed working prototype / competition project with cell-level provenance, deterministic rule verification, and high-fidelity catalog export.",
            learned: "Real-world B2B data operations require combining LLM interpretation with rigid deterministic validation rules where exactness matters."
        }
    },
    {
        id: "expenseflow",
        slug: "expenseflow-ai",
        number: "02",
        title: "ExpenseFlowAI",
        subtitle: "Intelligent Expense Management with AI",
        tagline: "Intelligent expense management with AI.",
        category: "FINANCIAL TECHNOLOGY / AI",
        description: "ExpenseFlowAI is an AI-focused personal finance and expense-management project.",
        image: "/projects/expenseflow.jpg",
        tags: ["AI", "Python", "Web Technologies"],
        variant: "framed",
        githubUrl: "https://github.com/Eshwar06-CY/ExpenseFlowAI",
        demoUrl: "#",
        status: "Project Stage",
        contribution: "Project concept, Product development, Implementation, AI/application integration",
        featured: true,
        hasDedicatedCaseStudy: false,
        keyFeatures: [
            "Expense management",
            "Intelligent analysis",
            "Automated workflow",
            "User-focused financial tracking"
        ],
        caseStudy: {
            problem: "Personal expense tracking can become difficult when users have to manually organize and understand their spending.",
            idea: "ExpenseFlowAI aims to simplify this process through technology and AI, delivering intelligent analysis and automated workflows.",
            approach: "Designed a user-focused financial tracking flow combining Python backend processing with modern web application technologies for intuitive expense management.",
            build: "Structured personal finance workflows with automated categorization routines and responsive web presentation.",
            result: "Delivers automated tracking workflows and intelligent personal expense analysis.",
            learned: "Simplicity and proactive intelligence significantly lower user friction in personal finance management."
        }
    },
    {
        id: "academic-planner",
        slug: "ai-ug-academic-planner",
        number: "03",
        title: "AI UG Academic Planner",
        subtitle: "AI-Powered Academic Planning for Undergraduate Students",
        tagline: "An AI-powered academic planning platform for undergraduate students.",
        category: "ARTIFICIAL INTELLIGENCE / EDTECH",
        description: "An AI-powered academic planning platform for undergraduate students.",
        image: "/projects/academic_planner.jpg",
        tags: ["Python", "FastAPI", "React", "Vite", "JavaScript", "pdfplumber", "Pytesseract", "Tesseract", "Uvicorn"],
        variant: "inverted",
        githubUrl: "https://github.com/Eshwar06-CY/ai_ug_academic_planner",
        demoUrl: "#",
        status: "Ongoing Project",
        contribution: "Full-stack development, Backend architecture, Frontend development, Document processing, OCR integration, Scheduling logic, Product development",
        featured: true,
        hasDedicatedCaseStudy: false,
        keyFeatures: [
            "Timetable upload",
            "PDF and image processing",
            "OCR-based timetable extraction",
            "Calendar of Events integration",
            "Syllabus processing",
            "Automated study-plan generation",
            "Test and exam preparation planning",
            "Schedule rescheduling",
            "Calendar-based visualization"
        ],
        caseStudy: {
            problem: "Students often have to manage timetables, syllabus, exams, academic events, extracurricular activities and personal commitments across different places.",
            idea: "The platform brings these elements together to help students create and manage personalized academic schedules.",
            approach: "Combined OCR document extraction (pdfplumber, Pytesseract, Tesseract) with backend scheduling logic in FastAPI and an interactive React/Vite calendar visualization.",
            build: "Full-stack development encompassing backend architecture, document processing pipelines, OCR integration, scheduling algorithms, and responsive frontend calendar views.",
            result: "Ongoing platform actively synthesizing timetables, syllabus requirements, and examination calendars into actionable study plans.",
            learned: "Academic schedules require dynamic rescheduling buffers because student routines change frequently."
        }
    },
    {
        id: "capacityx",
        slug: "capacityx",
        number: "04",
        title: "CAPACITYX",
        subtitle: "Turn Empty Space Into Trade.",
        tagline: "Turn Empty Space Into Trade.",
        category: "LOGISTICS MARKETPLACE / RESEARCH CONCEPT",
        description: "CAPACITYX is a logistics marketplace concept focused on connecting available logistics capacity with demand.",
        image: "/projects/capacityx.jpg",
        tags: ["Marketplace Concept", "Product Thinking", "Market Research", "Business Models"],
        variant: "panoramic",
        githubUrl: "", // Concept / Research stage: No GitHub button, no fake demo
        demoUrl: "",
        status: "Research / Startup Concept / Pitch Stage",
        contribution: "Problem identification, Startup concept development, Market research, Product thinking, Business-model exploration, Pitch development, Logistics-marketplace research",
        featured: true,
        hasDedicatedCaseStudy: false,
        howItWorks: [
            "Identifies available logistics capacity",
            "Connects capacity with demand",
            "Improves capacity utilization",
            "Creates a technology-driven logistics marketplace"
        ],
        caseStudy: {
            problem: "Unused transportation and logistics capacity can exist while businesses simultaneously need logistics resources. CAPACITYX explores how technology can connect these two sides more efficiently.",
            idea: "Turn empty cargo space into trade by creating a technology-driven logistics marketplace connecting available transportation capacity with commercial demand.",
            approach: "Explored marketplace dynamics, carrier capacity patterns, dynamic pricing mechanisms, and trust models to bridge operational freight inefficiency.",
            build: "Developed startup concept, conducted in-depth logistics-marketplace research, designed system product models, and prepared pitch presentations (pitched at TiE U Global Pitch Competition 2026).",
            result: "Validated market problem, established core marketplace architecture, and formulated pitch deck for startup competitions.",
            learned: "Marketplace trust, regional route density, and capacity visibility are the primary drivers of transport network efficiency."
        }
    }
];

export const specraDeepDive = {
    title: "SPECra",
    subtitle: "AI INDUSTRIAL PRODUCT-DATA CLEANING & INTELLIGENCE",
    openingStatement: "Turn messy industrial catalogs into clean, standardized, and evidence-backed product catalogs.",
    overview: "SPECra is an AI-powered product-data cleaning and intelligence platform for industrial/B2B commerce. Industrial companies receive product catalogs from suppliers as messy Excel/CSV files with inconsistent names, dimensions buried inside descriptions, packaging such as \"6pc\", missing brands/MPNs and other inconsistencies. SPECra transforms these into clean, standardized, searchable and evidence-backed product catalogs.",

    section1Problem: {
        kicker: "SECTION 01 — THE PROBLEM",
        title: "MESSY SPREADSHEETS & INCONSISTENT SPECIFICATIONS",
        narrative: "Industrial companies receive product catalogs from suppliers as messy Excel/CSV files. Product information can contain inconsistent names, dimensions buried inside descriptions, packaging such as \"6pc\", missing brands/MPNs and other inconsistencies.",
        bulletPoints: [
            "Inconsistent product naming and mixed brand series obscure search and classification.",
            "Dimensions and attributes buried deep inside freeform product descriptions.",
            "Packaging units and piece counts recorded unpredictably across supplier files.",
            "Complete lack of provenance anchoring makes quality validation difficult."
        ]
    },

    section2Data: {
        kicker: "SECTION 02 — THE SOLUTION & CAPABILITIES",
        title: "STANDARDIZED, EVIDENCE-BACKED PRODUCT CATALOG",
        narrative: "SPECra transforms messy catalogs into a clean, standardized, searchable and evidence-backed product catalog.",
        attributes: [
            { name: "Spreadsheet Structure", type: "Analysis", desc: "Understands uploaded CSV/Excel spreadsheet structure and schema variations." },
            { name: "Brand & Manufacturer", type: "Categorical", desc: "Identifies product names, brands, manufacturers, and manufacturer part numbers (MPNs)." },
            { name: "Attribute Extraction", type: "Gemini AI", desc: "Extracts information and specifications from messy descriptions using Google Gemini." },
            { name: "Unit Normalization", type: "Deterministic", desc: "Normalizes units such as 1/2\" → 0.5 in with mathematical exactness." },
            { name: "Packaging Interpretation", type: "Deterministic", desc: "Interprets packaging notations such as 6pc → 6 pieces." },
            { name: "Provenance & Evidence", type: "Audit Trail", desc: "Shows traceable provenance and evidence for every extracted piece of information." },
            { name: "Quality Checks", type: "Validation", desc: "Runs automated quality, consistency, and completeness validation checks." },
            { name: "Catalog Search & Export", type: "Export Engine", desc: "Natural-language catalog search and export to CSV/XLSX and the 252-column UniHack schema." }
        ]
    },

    section3Pipeline: {
        kicker: "SECTION 03 — CORE WORKFLOW",
        title: "THE SPECRA DATA REFINERY WORKFLOW",
        narrative: "Raw supplier tables flow through a six-step pipeline from upload to validated export:",
        stages: [
            { step: "01", name: "UPLOAD", desc: "Upload messy CSV or Excel supplier catalogs." },
            { step: "02", name: "SPECIFY NEED", desc: "Tell SPECra what information and attributes you need." },
            { step: "03", name: "AI ANALYSIS", desc: "AI analyzes products and extracts complex information from descriptions." },
            { step: "04", name: "NORMALIZATION", desc: "Deterministic rules normalize units, fractions, and packaging." },
            { step: "05", name: "VALIDATION", desc: "Quality is validated against consistency rules and provenance evidence." },
            { step: "06", name: "EXPORT", desc: "Export clean catalog as CSV/XLSX and UniHack 252-column schema." }
        ]
    },

    section4Analytics: {
        kicker: "SECTION 04 — PRODUCT PRINCIPLES",
        title: "FOUNDATIONAL ARCHITECTURAL PRINCIPLES",
        kpis: [
            { label: "Core Workflow", value: "6 Stages", delta: "Upload to Clean Export" },
            { label: "Schema Target", value: "252 Col", delta: "UniHack Standard Schema" },
            { label: "Unit Accuracy", value: "100%", delta: "Deterministic conversion" },
            { label: "Data Integrity", value: "Zero Guessing", delta: "Blank if not in source" }
        ],
        departmentComparison: [
            { dept: "Fasteners & Hardware", rate: 99.2, count: 1200, avgSalary: 14.5 },
            { dept: "Piping & Valves", rate: 98.1, count: 950, avgSalary: 12.0 },
            { dept: "Electrical & Motors", rate: 97.4, count: 880, avgSalary: 10.5 },
            { dept: "Pneumatics & Hydraulics", rate: 96.8, count: 720, avgSalary: 8.9 },
            { dept: "Industrial Safety", rate: 99.5, count: 640, avgSalary: 7.8 }
        ],
        skillDemand: [
            { skill: "Gemini AI Extraction", demand: 96 },
            { skill: "Deterministic Normalization", demand: 94 },
            { skill: "FastAPI Backend", demand: 88 },
            { skill: "PostgreSQL Persistence", demand: 82 },
            { skill: "React Catalog UI", demand: 78 }
        ]
    },

    section5Tech: {
        kicker: "SECTION 05 — TECHNOLOGY",
        title: "FULL SYSTEM TECHNOLOGY STACK",
        technologies: [
            { name: "Frontend", role: "React, TypeScript, Vite, Axios", desc: "Responsive editorial interface with real-time feedback and smart catalog search." },
            { name: "Backend", role: "Python, FastAPI, SQLAlchemy, Pydantic", desc: "High-concurrency async REST API handling spreadsheet parsing and validation." },
            { name: "AI", role: "Google Gemini", desc: "Semantic understanding and qualitative attribute extraction from messy descriptions." },
            { name: "Database", role: "PostgreSQL", desc: "Relational persistence with schema mapping and indexed search." },
            { name: "Deterministic Rules", role: "Unit & Packaging Engine", desc: "Rules for fractions, units (1/2\" → 0.5 in), packaging (6pc → 6 pieces), and provenance." }
        ]
    },

    section6Learning: {
        kicker: "SECTION 06 — CORE PRINCIPLES",
        title: "ARCHITECTURAL & PRODUCT PRINCIPLES",
        lessons: [
            {
                number: "01",
                topic: "AI vs Deterministic Rules",
                takeaway: "AI is used for interpreting messy product information. Deterministic rules are used where exactness matters, including unit conversion, fractions, packaging, provenance, and schema mapping."
            },
            {
                number: "02",
                topic: "Data Integrity Over Invention",
                takeaway: "If SPECra cannot find or infer a specification from source data, it leaves the field blank rather than inventing information."
            },
            {
                number: "03",
                topic: "Auditable Provenance",
                takeaway: "Traceable evidence back to the source data is essential so users can verify every normalized value."
            },
            {
                number: "04",
                topic: "Team Contribution",
                takeaway: "Core developer — Team DEADLOCK. Collaborated to bring the platform from initial problem discovery to a completed working prototype."
            }
        ]
    }
};
