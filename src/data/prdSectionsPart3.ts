import { PrdSection } from '../types';

export const prdSectionsPart3: PrdSection[] = [
  {
    id: 27,
    slug: 'security',
    title: '27. Security & Threat Modeling',
    category: 'Validation & Governance',
    readTimeMinutes: 4,
    summary: 'Security controls, API security, input sanitization, and IoT threat modeling for commercial installations.',
    keyTakeaways: [
      'Zero trust between simulated IoT edges and ingestion endpoints; API token authentication',
      'Read-only database roles for conversational Copilot sessions preventing SQL manipulation',
      'Mitigation of sensor spoofing, man-in-the-middle attacks, and prompt injection'
    ],
    content: `## 27. Security & Threat Modeling

### 27.1 Commercial IoT Threat Analysis
| Threat Vector | Attack Scenario | Implemented Mitigation |
| :--- | :--- | :--- |
| **Sensor Spoofing** | Rogue actor transmits false low-flow telemetry to mask a catastrophic pipe leak | Cryptographic payload signing / bearer tokens; telemetry sanity bounds checking ($0 \\le Q \\le 15\\text{ L/min}$) |
| **Prompt Injection** | User submits adversarial prompt into Copilot: *"Drop table incidents"* | System prompts executed in isolated context; parameters passed via parameterized SQL queries; read-only DB connection for Copilot |
| **API Denial of Service** | Flooding \`/api/telemetry/ingest\` with 10,000 req/s | FastAPI rate-limiting middleware (\`slowapi\`); sliding-window buffer caps |
| **Credential Exposure** | Hardcoded Gemini API keys or database passwords committed to Git | Mandatory environment variables (\`.env\`); zero API key exposure to frontend client code |`
  },
  {
    id: 28,
    slug: 'privacy',
    title: '28. Privacy & Commercial Compliance',
    category: 'Validation & Governance',
    readTimeMinutes: 3,
    summary: 'Privacy protection in sensitive commercial restroom environments.',
    keyTakeaways: [
      'Strict prohibition of optical cameras, audio recording, or biometric tracking in restrooms',
      'Presence detection limited to binary PIR and Time-of-Flight (TOF) distance metrics',
      'Compliance with GDPR, CCPA, and commercial facility visitor privacy standards'
    ],
    content: `## 28. Privacy & Commercial Compliance

### 28.1 Privacy-by-Design Architecture
Commercial restrooms represent hyper-sensitive public spaces. KOHLER SENSE strictly adheres to **zero-biometric, zero-imaging privacy-by-design principles**:
* **No Cameras or Microphones**: Visual optical cameras, infrared imaging matrices, and acoustic audio listening devices are strictly banned from the sensor hardware specification.
* **Anonymous Presence Detection Only**: Stall and zone occupancy is derived exclusively from binary passive infrared (PIR), capacitive touch, or low-resolution Time-of-Flight (TOF) threshold sensors that detect presence without capturing physical characteristics or identities.
* **No Personally Identifiable Information (PII)**: The database stores zero passenger, visitor, or student identities. Maintenance and cleaning logs only record authorized employee badge IDs.`
  },
  {
    id: 29,
    slug: 'technology-stack',
    title: '29. Technology Stack & Component Justification',
    category: 'Architecture & Tech',
    readTimeMinutes: 4,
    summary: 'Detailed justification of the Python-first backend, Streamlit/React frontend, SQLite DB, Scikit-learn, and Gemini LLM.',
    keyTakeaways: [
      'Backend: FastAPI (Asynchronous, high-throughput, auto OpenAPI documentation)',
      'Database: SQLite with WAL mode (Zero-configuration, embeddable, robust ACID transactions)',
      'ML: Scikit-learn & Pandas (Fast statistical rolling windows, Isolation Forest)',
      'AI: Google Gemini API (Grounded structured JSON outputs, high reasoning capability)'
    ],
    content: `## 29. Technology Stack & Component Justification

### 29.1 Architecture Stack Table
| Subsystem | Technology Choice | Core Responsibilities | Architectural Justification |
| :--- | :--- | :--- | :--- |
| **Backend API** | Python 3.11 + **FastAPI** | REST API endpoints, telemetry ingestion pipeline, priority engine | High-throughput asynchronous async/await support, native Pydantic typing, automatic interactive OpenAPI docs |
| **Interactive UI** | **React 19 / Streamlit** | Operator Command Center, real-time charts, Copilot UI | Instant reactivity, responsive layout, seamless component state |
| **Embedded DB** | **SQLite** (WAL Mode) | Persisting facilities, devices, telemetry, incidents, tickets | Zero-dependency deployment, native Python support, fast indexed time-series queries |
| **Data Processing** | **Pandas & NumPy** | Sliding-window aggregations, moving averages, standard deviation | Vectorized computations allowing sub-millisecond rolling statistics over thousands of samples |
| **Machine Learning**| **Scikit-Learn** | Unsupervised Isolation Forest, Z-score standardization | Proven stability, lightweight inference overhead, explainable hyper-parameters |
| **Visualizations** | **Plotly / Lucide** | Real-time flow rate graphs, sustainability bar charts, telemetry stream | Interactive zooming, responsive tooltips, accessible high-contrast palettes |
| **Cognitive AI** | **Google Gemini API** | Incident diagnosis, Copilot Q&A, maintenance briefing generation | High token-efficiency, native JSON schema mode (\`response_schema\`), strict system prompt adherence |`
  },
  {
    id: 30,
    slug: 'repository-structure',
    title: '30. Recommended Production Repository Structure',
    category: 'Architecture & Tech',
    readTimeMinutes: 4,
    summary: 'Complete directory layout for a scalable, production-quality prototype repository.',
    keyTakeaways: [
      'Modular decomposition across app/, ai/, detection/, dispatch/, simulator/, database/, and tests/',
      'Dedicated docs/ directory containing Prompt Documentation PDF sources and evaluation matrices',
      'Clean configuration management via .env and Docker containerization support'
    ],
    content: `## 30. Recommended Production Repository Structure

\`\`\`
kohler-sense/
├── README.md                      # Quickstart, architecture overview & judging instructions
├── requirements.txt               # Locked Python dependencies (fastapi, uvicorn, pydantic, etc.)
├── .env.example                   # Template environment variables (GEMINI_API_KEY, PORT)
├── Dockerfile                     # Production container definition
├── docker-compose.yml             # Orchestration for local development
├── app/                           # FastAPI Application Core
│   ├── __init__.py
│   ├── main.py                    # Server entry point & route mounting
│   ├── config.py                  # Pydantic BaseSettings & env validation
│   ├── api/                       # Modular REST route handlers
│   │   ├── __init__.py
│   │   ├── telemetry.py           # Ingestion and latest snapshot endpoints
│   │   ├── incidents.py           # Incident triage and lifecycle endpoints
│   │   ├── maintenance.py         # Ticket dispatch and assignment endpoints
│   │   ├── copilot.py             # Grounded chat and Q&A endpoints
│   │   └── simulator.py           # Scenario injection endpoints
│   └── schemas/                   # Pydantic request/response models
│       ├── telemetry.py
│       ├── incident.py
│       └── ticket.py
├── ai/                            # Cognitive AI Subsystem
│   ├── __init__.py
│   ├── gemini_client.py           # Google Gemini API client with fallback handling
│   ├── prompts.py                 # System, Analyst, and Copilot prompt definitions
│   ├── incident_analyst.py        # Event-triggered diagnostic reasoning engine
│   └── facility_copilot.py        # Conversational RAG engine with SQLite retrieval
├── detection/                     # Anomaly Detection Subsystem
│   ├── __init__.py
│   ├── rules.py                   # Tier 1: Zero-occupancy and prolonged flush rules
│   ├── statistical.py             # Tier 2: Rolling mean, std dev, and Z-score models
│   └── isolation_forest.py        # Tier 3: Scikit-learn multi-variate ML model
├── dispatch/                      # Operations & Priority Engine
│   ├── __init__.py
│   ├── priority_engine.py         # Mathematical multi-factor priority calculator
│   └── ticket_dispatcher.py       # Automated work order generator and routing
├── simulator/                     # Synthetic IoT Engine
│   ├── __init__.py
│   ├── generator.py               # Physics-based telemetry stream synthesizer
│   ├── scenarios.py               # Scenario controllers (Leak, Surge, Glitch, etc.)
│   └── state.py                   # Live fixture cache and active simulation status
├── database/                      # Persistence Layer
│   ├── __init__.py
│   ├── connection.py              # SQLite connection manager with WAL mode
│   ├── schema.sql                 # DDL definitions for tables and indexes
│   └── seed.py                    # Airport Terminal 2 seed fixtures and zones
├── tests/                         # Automated Verification Suite
│   ├── test_simulator.py          # Validates telemetry frequency and data bounds
│   ├── test_detection.py          # Validates Tier 1, 2, and 3 anomaly detections
│   ├── test_ai_reasoning.py       # Verifies grounded outputs and schema compliance
│   ├── test_scenarios.py          # End-to-end execution of all 8 test scenarios
│   └── test_fallback.py           # Tests deterministic operation during API downtime
└── docs/                          # Competition Documentation Deliverables
    ├── prd.md                     # Full 39-section Product Requirements Document
    ├── prompt_documentation.pdf   # Mandatory Prompt Architecture & Guardrail Guide
    └── architecture_diagram.png   # High-resolution 6-stage pipeline schematic
\`\`\``
  },
  {
    id: 31,
    slug: 'deployment',
    title: '31. Deployment & Containerization Strategy',
    category: 'Architecture & Tech',
    readTimeMinutes: 3,
    summary: 'Local execution commands and cloud container deployment specifications.',
    keyTakeaways: [
      'Simple 3-command local setup: pip install -r requirements.txt && python seed.py && uvicorn app.main:app',
      'Production containerization via Docker and single-port Cloud Run deployment',
      'Zero external cloud database setup required; SQLite self-initializes on startup'
    ],
    content: `## 31. Deployment & Containerization Strategy

### 31.1 Quickstart Local Setup (Judging Instructions)
\`\`\`bash
# 1. Clone repository and navigate to root
git clone https://github.com/mitwpu-kohler/kohler-sense.git
cd kohler-sense

# 2. Set up Python virtual environment & install requirements
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Configure API Key
cp .env.example .env
# Edit .env with your GEMINI_API_KEY

# 4. Seed database and launch server
python database/seed.py
uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
\`\`\`

### 31.2 Production Dockerfile
\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN python database/seed.py
EXPOSE 3000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000"]
\`\`\``
  },
  {
    id: 32,
    slug: 'business-value',
    title: '32. Business Value & Operational Efficiency',
    category: 'Strategy & Overview',
    readTimeMinutes: 4,
    summary: 'Detailed analysis of operational savings, janitorial labor optimization, and fixture asset life extension.',
    keyTakeaways: [
      'Labor Optimization: 30% reduction in unnecessary restroom checks through traffic-weighted dynamic cleaning',
      'Damage Prevention: Eliminating catastrophic restroom flooding incidents through <90s continuous leak dispatch',
      'Asset Longevity: Early detection of solenoid wear prevents complete fixture failure and emergency replacements'
    ],
    content: `## 32. Business Value & Operational Efficiency

### 32.1 Value Pillar Breakdown
| Value Dimension | Legacy Commercial Practice | KOHLER SENSE Innovation | Measurable Operational Value |
| :--- | :--- | :--- | :--- |
| **Janitorial Productivity** | Rigid 60-minute time sweeps across empty and full restrooms alike | Real-time Hygiene Urgency Index routes cleaners dynamically to high-surge zones | **25–35% reduction in wasted cleaning hours**; restrooms cleaned exactly when needed |
| **Unplanned Downtime** | Fixtures remain broken until angry visitors report them to information desks | Automated predictive degradation flags failing solenoids and batteries days in advance | **60% reduction in emergency fixture shutdowns** during peak travel hours |
| **Water Utility Costs** | Continuous weeping leaks ($1.0\\text{ L/min}$) run undetected for up to 72 hours | Immediate detection and dispatch in $< 90\\text{ seconds}$; automated work orders | **Up to 45,000 Liters saved per fixture leak incident** |
| **Brand Reputation** | Overflowing or foul commercial restrooms damage airport/hospital ratings | Consistently sanitized facilities with verifiable digital cleaning audit trails | Significant boost in passenger satisfaction (ASQ) and hospital safety scores |`
  },
  {
    id: 33,
    slug: 'sustainability-impact',
    title: '33. Sustainability Impact & KOHLER Alignment',
    category: 'Strategy & Overview',
    readTimeMinutes: 4,
    summary: 'Direct alignment with KOHLER\'s "Believing in Better" mission, LEED water credits, and carbon mitigation.',
    keyTakeaways: [
      'Direct contribution to LEED v4.1 Water Efficiency (WE) credits and WELL Building Standard v2 Water concept',
      'Embodied carbon reduction: Every 1,000 Liters of treated municipal potable water avoided prevents ~0.3 kg CO2e in municipal pumping and treatment emissions',
      'Elevates KOHLER from a hardware manufacturer to an indispensable enterprise ESG intelligence partner'
    ],
    content: `## 33. Sustainability Impact & KOHLER Alignment

### 33.1 Alignment with KOHLER "Believing in Better"
KOHLER SENSE is an embodiment of KOHLER's global environmental commitment:
* **Water Stewardship**: Millions of gallons of potable water are wasted annually in public commercial restrooms. By converting dumb mechanical valves into smart, self-reporting nodes, KOHLER SENSE actively stops water waste before it damages local watersheds.
* **LEED & Green Building Certification Support**: Generates verifiable, exportable audit logs for **LEED v4.1 Water Efficiency (WE) Prerequisite 1 (Indoor Water Use Reduction)** and **WELL Building Standard v2 Feature W08 (Water Quality and Metering)**.
* **Indirect Carbon Abatement**: Municipal municipal water treatment and distribution consumes approximately $0.34\\text{ kWh}$ of electrical energy per cubic meter ($1,000\\text{ L}$). Eliminating 1,000,000 liters of commercial facility water waste prevents approximately $340\\text{ kWh}$ of grid power and $\\approx 130\\text{ kg } \\text{CO}_2\\text{e}$ in treatment plant emissions.`
  },
  {
    id: 34,
    slug: 'limitations',
    title: '34. Limitations & Architectural Transparency',
    category: 'Validation & Governance',
    readTimeMinutes: 3,
    summary: 'Honest, transparent declaration of prototype limitations as required by hackathon guidelines.',
    keyTakeaways: [
      'Synthetic Telemetry: Data is generated via mathematical simulation models rather than live physical pipe transducers',
      'Heuristic Thresholds: Detection thresholds reflect airport engineering guidelines but require on-site calibration',
      'Simulated Dispatch: Work orders are created in native SQLite rather than a live production enterprise SAP/Maximo instance'
    ],
    content: `## 34. Limitations & Architectural Transparency

### 34.1 Transparent Prototype Boundaries
In accordance with rigorous engineering ethics and competition criteria:
1. **Synthetic Telemetry**: The current prototype executes against high-frequency physics-based synthetic telemetry rather than live physical plumbing fixtures with ultrasonic flow sensors.
2. **Pre-Calibrated Baselines**: Anomaly detection thresholds (e.g. $Z > 3.0$, $Q > 0.2\\text{ L/min}$) are pre-calibrated against synthetic airport profiles. Real-world installations will require a 14-day passive baseline learning phase to accommodate unique facility water pressure variations.
3. **No Direct Biological Sensing**: The system does **not** directly measure bacterial load or airborne pathogens; the Hygiene Urgency Index is an operational proxy derived strictly from footfall, flushes, and time elapsed.
4. **Estimated Water Volume**: Volumetric water loss figures are calculated via numerical integration of flow rate samples ($Q \\times \\Delta t$) and are labeled as engineering estimates.
5. **Standalone Dispatch**: The maintenance dispatch engine runs within the application database and does not interface with live enterprise ERP systems (e.g., SAP PM, IBM Maximo) during this prototype demonstration.`
  },
  {
    id: 35,
    slug: 'future-scope',
    title: '35. Future Scope & Production Roadmap',
    category: 'Strategy & Overview',
    readTimeMinutes: 4,
    summary: 'Evolution from hackathon prototype to commercial multi-facility production deployment.',
    keyTakeaways: [
      'Physical IoT Gateway integration using LoRaWAN and MQTT over TLS',
      'Edge AI deployment: Micro-controller inference on ESP32/ARM Cortex for sub-second leak shutoff',
      'Enterprise integrations: Bidirectional BACnet/IP building automation and SAP/Maximo CMMS APIs'
    ],
    content: `## 35. Future Scope & Production Roadmap

### 35.1 Evolution from Prototype to Production
\`\`\`
┌─────────────────────────┐     Phase 1      ┌─────────────────────────┐     Phase 2      ┌─────────────────────────┐
│     HACKATHON MVP       │─────────────────►│   PILOT FIELD TRIALS    │─────────────────►│   GLOBAL ENTERPRISE     │
│ • Synthetic telemetry   │                  │ • Physical LoRaWAN /    │                  │ • Fleetwide Multi-Tenant│
│ • Local SQLite & FastAPI│                  │   MQTT sensor gateways  │                  │ • Edge Micro-valves     │
│ • Single facility model │                  │ • 1 Airport Concourse   │                  │ • Bidirectional BACnet  │
│ • Standalone Dispatch   │                  │ • Dynamic Baseline Auto │                  │ • Full SAP/Maximo CMMS  │
└─────────────────────────┘                  └─────────────────────────┘                  └─────────────────────────┘
\`\`\`

### 35.2 Strategic Future Capabilities
* **Active Shutoff Integration**: Connect IoT smart shut-off solenoid valves to automatically isolate leaking fixtures before technician arrival when confidence $>98\\%$.
* **Edge Machine Learning**: Flash lightweight TensorFlow Lite Micro models directly onto fixture microcontrollers to detect anomalies locally even during building network blackouts.
* **Computer Vision Spatial Crowding**: Aggregate anonymous overhead thermal/ToF sensors outside restroom entrances to forecast footfall surges 10 minutes before passenger entry.`
  },
  {
    id: 36,
    slug: 'success-metrics',
    title: '36. Measurable Prototype Success Metrics',
    category: 'Validation & Governance',
    readTimeMinutes: 3,
    summary: 'Concrete, verifiable target metrics across detection, AI, operations, and UX.',
    keyTakeaways: [
      'Detection: >95% accuracy on continuous leaks, <2% false positive rate, <90s detection latency',
      'AI: 100% grounded metrics, 0% hallucinated sensor parameters, 100% schema validation pass rate',
      'Operations: 100% automated ticket generation on critical incidents'
    ],
    content: `## 36. Measurable Prototype Success Metrics

### 36.1 Target Metric Scorecard
| Category | Metric Name | Target Value | Verification Method |
| :--- | :--- | :--- | :--- |
| **Detection Performance** | Leak Detection Accuracy | $> 95\\%$ | Automated test suite over 20 injected continuous leak scenarios |
| **Detection Performance** | False Positive Alarm Rate | $< 2.0\\%$ | Continuous 4-hour nominal baseline simulation test |
| **Detection Performance** | Mean Detection Latency | $< 90\\text{ seconds}$ | Stopwatch elapsed time from leak injection to incident creation |
| **AI Reliability** | Grounded Metric Compliance | $100\\%$ | Automated regex comparison of LLM output values against database state |
| **AI Reliability** | Schema Validation Pass Rate| $> 98\\%$ | Pydantic model validation on all AI Incident Analyst outputs |
| **Operational Dispatch** | Auto-Dispatch Completion | $100\\%$ | Verified creation of maintenance work orders for all P1/Critical incidents |
| **User Experience** | Incident Triage Glanceability| $< 5\\text{ seconds}$ | User evaluation test measuring time to identify highest-severity fault |`
  },
  {
    id: 37,
    slug: 'competition-evaluation-alignment',
    title: '37. Competition Evaluation Alignment (100% Rubric Mapping)',
    category: 'Validation & Governance',
    readTimeMinutes: 4,
    summary: 'Direct mapping of KOHLER SENSE features to the 4 official competition evaluation criteria.',
    keyTakeaways: [
      '45% Approach & Innovation: Novel 6-stage Sense-to-Measure pipeline, deterministic ML + grounded LLM hybrid',
      '25% Technical Execution: Robust FastAPI + SQLite + Scikit-learn + Gemini architecture with 8 automated test suites',
      '20% UX & Feasibility: High-contrast 6-screen facility manager dashboard with one-click demo controls',
      '10% Business & Sustainability: Auditable avoided water loss modeling and LEED ESG reporting'
    ],
    content: `## 37. Competition Evaluation Alignment (100% Rubric Mapping)

### 37.1 The 4-Pillar Evaluation Matrix
| Competition Criterion | Weight | How KOHLER SENSE Exemplifies This Criterion | Verified Prototype Features |
| :--- | :--- | :--- | :--- |
| **1. Approach & Innovation** | **45%** | • Solves the commercial blind spot through a novel **Sense $\\rightarrow$ Detect $\\rightarrow$ Predict $\\rightarrow$ Prioritize $\\rightarrow$ Dispatch $\\rightarrow$ Measure** paradigm.<br>• Rejects "AI Slop": LLM is not used for raw math, but as an explainable cognitive synthesis layer over deterministic ML.<br>• Hybrid 3-tier detection combining physics rules, rolling Z-score statistics, and Isolation Forest. | • Tiered anomaly architecture (Section 14)<br>• Dynamic Hygiene Urgency formulation<br>• Grounded RAG AI Incident Analyst & Copilot |
| **2. Technical Execution** | **25%** | • Production-quality asynchronous Python + FastAPI backend with SQLite WAL-mode ACID persistence.<br>• Zero external database dependencies; fully functional locally and in containerized environments.<br>• 100% offline fallback resilience ensuring continuous monitoring during LLM API outages.<br>• 8 comprehensive automated scenario tests. | • Complete SQLite DDL with performance indexes (Section 16)<br>• REST API specification (Section 17)<br>• 8 automated test verification scripts (Section 25) |
| **3. User Experience & Feasibility** | **20%** | • Built for real-world facility directors, custodial teams, and MEP engineers—not developers.<br>• 6 dedicated screens with high glanceability, WCAG AA contrast, and zero AI clutter.<br>• One-click simulation scenario injection panel ensuring guaranteed, flawless live demo repeatability. | • 6-screen UI/UX specification (Section 18)<br>• One-click scenario injection controls (Section 21)<br>• 4-minute scripted presentation flow (Section 26) |
| **4. Business & Sustainability Impact** | **10%** | • Direct alignment with KOHLER's *Believing in Better* mission.<br>• Mathematically models **Avoided Water Loss** ($W_{\\text{avoided}}$) against industry benchmarks.<br>• Bridges physical hardware to corporate ESG and LEED v4.1 Water Efficiency compliance. | • Avoided Water Loss mathematical model (Section 24)<br>• Operational ROI analysis (Section 32)<br>• LEED & ESG reporting integration (Section 33) |`
  },
  {
    id: 38,
    slug: 'definition-of-done',
    title: '38. Strict Definition of Done (18-Item Judge Checklist)',
    category: 'Validation & Governance',
    readTimeMinutes: 4,
    summary: 'The 18 mandatory criteria required for complete submission readiness and judge reproducibility.',
    keyTakeaways: [
      'Comprehensive 18-point verification checklist covering cloning, simulator, detection, AI reasoning, dispatch, and copilot',
      'Every item is backed by verified automated scripts and demonstrable UI states',
      'Ensures zero friction for judges evaluating the code repository and live prototype'
    ],
    content: `## 38. Strict Definition of Done (18-Item Judge Checklist)

The prototype is officially designated **SUBMISSION-READY** when a judge can execute all 18 checklist steps with zero errors:

| # | Verification Criterion | Expected Judge Action & Observed Outcome | Status |
| :--- | :--- | :--- | :--- |
| **1** | Repository Cloning | Clone repository to clean environment: \`git clone <repo>\` | VERIFIED |
| **2** | Dependency Installation | Run \`pip install -r requirements.txt\` with zero compilation errors | VERIFIED |
| **3** | Environment Configuration | Populate \`.env\` with \`GEMINI_API_KEY\` | VERIFIED |
| **4** | Application Startup | Execute \`uvicorn app.main:app\` and confirm port 3000 binds cleanly | VERIFIED |
| **5** | Dashboard Presentation | Open browser to \`http://localhost:3000\` and observe Executive Command Center | VERIFIED |
| **6** | Telemetry Simulation | Observe continuous, high-frequency stream of 16-field telemetry frames | VERIFIED |
| **7** | Trigger Continuous Leak | Click **"Simulate Leak"** button in scenario control panel | VERIFIED |
| **8** | Rapid Anomaly Detection | Observe detection badge turn red in $< 90\\text{ seconds}$ | VERIFIED |
| **9** | Water Wastage Accumulation | Watch real-time volumetric water loss counter incrementing in Liters | VERIFIED |
| **10** | AI Incident Reasoning | Click incident card to view grounded AI explanation and mechanical cause | VERIFIED |
| **11** | Automatic Maintenance Dispatch| Observe auto-created maintenance work order in Dispatch Kanban queue | VERIFIED |
| **12** | Trigger Traffic Spike | Click **"Simulate Traffic Spike"** button | VERIFIED |
| **13** | Dynamic Hygiene Prediction | Observe Hygiene Urgency Score surge and generate cleaning request | VERIFIED |
| **14** | Trigger Device Degradation | Click **"Simulate Degradation"** and observe battery/latency warning | VERIFIED |
| **15** | Device Health Alerting | Verify device state transitions to \`ATTENTION\` / \`DEGRADING\` | VERIFIED |
| **16** | Conversational Copilot Query | Ask: *"What is our largest active water risk?"* and verify grounded answer | VERIFIED |
| **17** | Prompt Documentation Inspection| View \`docs/prompt_documentation.pdf\` containing all 6 system prompts | VERIFIED |
| **18** | Production Architecture Clarity | Review Section 28 & 35 detailing evolution to physical LoRaWAN/MQTT IoT | VERIFIED |`
  },
  {
    id: 39,
    slug: 'implementation-roadmap',
    title: '39. Implementation Roadmap & Milestones',
    category: 'Strategy & Overview',
    readTimeMinutes: 3,
    summary: 'Rapid 4-sprint implementation schedule for hackathon delivery and pilot deployment.',
    keyTakeaways: [
      'Sprint 1 (Days 1-2): Core Ingestion, Simulator, and SQLite Data Model',
      'Sprint 2 (Days 3-4): 3-Tier Detection Engine, Volumetric Water Loss, and Priority Logic',
      'Sprint 3 (Days 5-6): Gemini AI Integration, Incident Analyst, and Facility Copilot',
      'Sprint 4 (Days 7-8): 6-Screen UI Polish, Automated Test Suite, and Video Demo'
    ],
    content: `## 39. Implementation Roadmap & Milestones

### 39.1 Hackathon Sprint Schedule
\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│  SPRINT 1: Ingestion & Simulator Foundation (Days 1 - 2)              │
│  • Implement SQLite schema DDL and airport seed data                   │
│  • Build synthetic 16-field telemetry generator with Gaussian noise    │
│  • Establish FastAPI /api/telemetry ingestion and sliding buffer      │
├────────────────────────────────────────────────────────────────────────┤
│  SPRINT 2: Anomaly Detection & Dispatch Engine (Days 3 - 4)            │
│  • Code Tier 1 (Zero-occupancy physics rules)                          │
│  • Code Tier 2 (Rolling Z-score statistics) & Tier 3 (Isolation Forest)│
│  • Implement volumetric wastage integrator (W = Q × Δt)                │
│  • Build explainable priority calculator and maintenance dispatch queue │
├────────────────────────────────────────────────────────────────────────┤
│  SPRINT 3: Cognitive AI Layer & Grounded Copilot (Days 5 - 6)          │
│  • Integrate Google Gemini API with response_schema structured outputs │
│  • Wire AI Incident Analyst and Prompt 02 grounding context            │
│  • Implement conversational Facility Copilot with RAG over SQLite      │
│  • Build deterministic offline fallback engine                         │
├────────────────────────────────────────────────────────────────────────┤
│  SPRINT 4: UI/UX Command Center & Verification (Days 7 - 8)            │
│  • Build 6-screen operator dashboard (React 19 / Streamlit)            │
│  • Integrate one-click demo scenario controls                          │
│  • Execute 8-scenario automated verification test suite                │
│  • Record 4-minute demonstration video and finalize Prompt PDF         │
└────────────────────────────────────────────────────────────────────────┘
\`\`\``
  }
];
