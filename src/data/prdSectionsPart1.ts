import { PrdSection } from '../types';

export const prdSectionsPart1: PrdSection[] = [
  {
    id: 1,
    slug: 'executive-summary',
    title: '1. Executive Summary',
    category: 'Strategy & Overview',
    readTimeMinutes: 3,
    summary: 'Executive overview of KOHLER SENSE for the KOHLER-MITWPU AI Research Lab Program (Track 2).',
    keyTakeaways: [
      'Core philosophy: Sense → Detect → Predict → Prioritize → Dispatch → Measure',
      'Target deployment: High-footfall airport terminal restrooms (adaptable to hospitals, campuses, transit hubs)',
      'Deterministic statistical/ML anomaly detection paired with grounded LLM reasoning layer to prevent hallucinated physical faults'
    ],
    content: `## 1. Executive Summary

### 1.1 Product Overview
**KOHLER SENSE** is an enterprise-grade, AI-powered Smart Facility & Sustainability Manager designed specifically for high-footfall commercial environments including international airport terminals, multi-specialty hospitals, and university campuses. Built for the **KOHLER-MITWPU AI Research Lab Program (Track 2 — Commercial Smart Facility & Sustainability Manager)**, the system transforms high-frequency commercial plumbing IoT telemetry into deterministic operational interventions and executive sustainability intelligence.

### 1.2 Core Architectural Philosophy
The platform operates on an unyielding six-stage pipeline:
$$\\text{Sense} \\longrightarrow \\text{Detect} \\longrightarrow \\text{Predict} \\longrightarrow \\text{Prioritize} \\longrightarrow \\text{Dispatch} \\longrightarrow \\text{Measure}$$

Crucially, **the Large Language Model (LLM) is never placed in the critical path of raw numerical anomaly detection**. Instead, KOHLER SENSE enforces strict architectural separation:
1. **Low-Latency Edge & Ingestion Pipeline**: Handles high-frequency telemetry ingestion (1–5s intervals) and sliding-window statistical calculation.
2. **Deterministic Rules & ML Engine**: Executes Z-score analysis, rolling baseline comparisons, and multi-feature Isolation Forest classification to detect physical anomalies.
3. **Structured Event Layer**: Packages telemetry, baseline deviations, and device contexts into rigid JSON events.
4. **AI Reasoning & Incident Analyst (LLM)**: Synthesizes structured events into grounded root-cause hypotheses, conversational facility copilot answers, and automated maintenance dispatch briefs.
5. **Closed-Loop Operational Dispatch**: Routes priority-ranked maintenance tickets to facility janitorial and engineering crews with verifiable audit trails.

### 1.3 Key Value Metrics (Target MVP Baseline)
| Dimension | Target KPI | Methodology |
| :--- | :--- | :--- |
| **Leak Detection Latency** | $< 90\\text{ seconds}$ | Continuous sliding window flow monitoring across zero-occupancy intervals |
| **Water Wastage Mitigation** | Up to $35\\%$ reduction in uncontained continuous water loss | Real-time volumetric integration ($Q \\times \\Delta t$) + automated dispatch |
| **Hygiene Demand Index** | $100\\%$ dynamic traffic-weighted dispatch | Multi-signal footfall, flush, and faucet duty-cycle accumulation |
| **AI Grounding Fidelity** | $100\\%$ deterministic parameter verification | Strict JSON schema parsing with zero allowable sensor hallucinations |`
  },
  {
    id: 2,
    slug: 'problem-statement',
    title: '2. Problem Statement',
    category: 'Strategy & Overview',
    readTimeMinutes: 4,
    summary: 'Detailed examination of high-footfall commercial facility challenges in water conservation and hygiene maintenance.',
    keyTakeaways: [
      'High-traffic commercial restrooms experience 1,200–5,000 visits/day with uncoordinated manual cleaning schedules',
      'Silent continuous leaks waste 20–80 L/hour per fixture and go unnoticed for 48–72 hours',
      'Fragmented vendor hardware leads to blind spots and reactive, high-cost maintenance'
    ],
    content: `## 2. Problem Statement

### 2.1 The Commercial Restroom Blind Spot
Commercial restrooms in high-density transit environments (e.g., Terminal 2 at an international hub, university student centers, tertiary hospitals) endure extreme, spiky footfall patterns. Facility management currently relies on:
* **Fixed-Time Cleaning Logs**: Janitorial staff clean on arbitrary 60-minute schedules regardless of whether 12 passengers or 450 passengers used the stalls.
* **Reactive Resident Complaints**: Water leaks, valve stickings, and sensor battery failures are only reported when a guest complains or physical water breaches the threshold.
* **Silent Continuous Water Losses**: A single commercial flushometer or sensor faucet with a debris-fouled diaphragm can weep $0.8\\text{ to }2.2\\text{ L/min}$ continuously. In a facility with 60 fixtures, undetected micro-leaks waste hundreds of thousands of liters of treated potable water each quarter.

### 2.2 Core Operational Challenges
| Challenge | Root Cause | Real-World Impact |
| :--- | :--- | :--- |
| **Undetected Continuous Leaks** | Mechanical valve wear, solenoid failure, debris in diaphragm | Severe potable water wastage ($>40\\text{ L/hr}$ per faulty fixture), floor damage, slip-and-fall liability |
| **Unresponsive Hygiene Scheduling** | Time-based cleaning decoupled from real-time passenger surges | Over-cleaned empty restrooms during lulls; unsanitary conditions during deplaning surges |
| **Sensor & Actuator Degradation** | Battery depletion, optical lens fouling, response latency drift | Passenger frustration, erratic ghost flushing, zero accountability on fixture health |
| **Siloed Telemetry & Alarm Fatigue** | Raw sensor alarms lacking spatial context or priority rank | Maintenance crews ignore alert noise; critical valve stickings get buried under low-priority pings |`
  },
  {
    id: 3,
    slug: 'product-vision',
    title: '3. Product Vision',
    category: 'Strategy & Overview',
    readTimeMinutes: 3,
    summary: 'The long-term vision of KOHLER SENSE as the definitive cognitive intelligence layer for commercial architecture.',
    keyTakeaways: [
      'Elevate connected KOHLER fixtures into self-diagnosing, environmentally intelligent assets',
      'Empower facility directors with executive sustainability dashboards and dispatch automation',
      'Bridge hardware excellence with explainable, grounded generative AI'
    ],
    content: `## 3. Product Vision

### 3.1 Vision Statement
To establish **KOHLER SENSE** as the definitive cognitive intelligence operating system for commercial architectural water infrastructure—transforming every commercial fixture into an active guardian of water conservation, public health, and operational excellence.

### 3.2 Strategic Positioning
* **Hardware Agnostic Intelligence**: While optimized for KOHLER commercial smart fixtures (Touchless Kinesis faucets, Tripoint flushometers, smart valve controllers), the platform architecture interfaces cleanly with standard building management telemetry protocols (BACnet/IP, MQTT, Modbus).
* **Transparent & Explainable AI**: Eliminating "black-box" magic. Every anomaly provides raw numerical evidence, baseline deviation ratios, and confidence bounds before an AI synthesizes human-readable work instructions.
* **Corporate Sustainability Alignment**: Directly advancing KOHLER's *Believing in Better* mission—ensuring commercial real estate partners meet stringent ESG benchmarks (LEED, WELL Building Standard) through auditable water stewardship data.`
  },
  {
    id: 4,
    slug: 'goals',
    title: '4. Goals',
    category: 'Strategy & Overview',
    readTimeMinutes: 3,
    summary: 'Concrete, measurable goals for the MVP prototype and research competition delivery.',
    keyTakeaways: [
      'Deliver a stable, end-to-end demonstrable pipeline within a Python + FastAPI + Streamlit/React architecture',
      'Sub-90 second anomaly-to-dispatch automated workflow for continuous leak scenarios',
      '100% grounded AI Copilot with zero hallucinated telemetry parameters'
    ],
    content: `## 4. Goals

### 4.1 Primary Functional & Technical Goals
1. **High-Frequency Telemetry Ingestion Simulator**: Synthesize realistic 1–5s interval telemetry across multiple restroom zones (Terminal 2 Departures: North Concourse Zone A & Zone B) simulating flow rates, flush states, battery, and optical sensor health.
2. **Hybrid Leak & Wastage Engine**: Detect continuous low-flow and high-flow anomalies using sliding-window statistical baselines and compute real-time cumulative volumetric losses ($Q \\times \\Delta t$).
3. **Dynamic Hygiene Urgency Index**: Formulate a traffic-weighted cleaning recommendation engine driven by occupancy, cumulative flushes, and time elapsed.
4. **Predictive Degradation Monitor**: Surface early warnings of actuator latency drift and sensor error clusters before complete component failure.
5. **AI Reasoning & Dispatch Automation**: Automatically generate structured work orders with actionable diagnostic guidance when incident conditions are met.
6. **Conversational Facility Copilot**: Provide facility executives with a natural-language query interface grounded entirely in real-time SQLite database states.
7. **Flawless Live Demonstration Controls**: Offer one-click simulation scenario triggers (Leak, Traffic Surge, Sensor Glitch, Degradation, Multi-incident) with instant UI reflection.`
  },
  {
    id: 5,
    slug: 'non-goals',
    title: '5. Non-Goals',
    category: 'Strategy & Overview',
    readTimeMinutes: 2,
    summary: 'Explicit boundaries and what will NOT be included in the MVP prototype scope.',
    keyTakeaways: [
      'No physical hardware or live plumbing rigging required for prototype evaluation',
      'No raw numerical anomaly detection handed directly to LLM prompts',
      'No definitive claims of physically verified leaks without human technician confirmation'
    ],
    content: `## 5. Non-Goals

### 5.1 Explicit Non-Goals for the Prototype
* **Physical Hardware Provisioning**: Physical sensor deployment, LoRaWAN gateway mounting, or live pipe plumbing are out of scope. Telemetry will be rigorously generated via a high-fidelity synthetic physics-based simulator.
* **Direct LLM Numerical Ingestion**: The LLM will **not** parse millions of raw time-series floating-point arrays directly. Statistical pre-processing and rule engines must extract discrete event features first.
* **Definitive Ground-Truth Claims**: The system will **never** claim an anomaly is a "physically verified leak" or "confirmed solenoid seizure." It must strictly output calibrated probabilistic determinations: *"Potential continuous water-flow anomaly detected (Confidence: 94%)"*.
* **Full Enterprise CMMS Replacement**: The MVP provides a robust native dispatch ticketing system with complete status lifecycles, rather than attempting full bidirectional integration with proprietary enterprise systems (e.g., SAP PM, IBM Maximo) during the hackathon phase.
* **Commercial Billing / Fiscal Auditing**: Financial water cost estimates will use explicit, user-configurable tariff constants ($/1,000 L) labeled as estimated operational indicators.`
  },
  {
    id: 6,
    slug: 'target-users',
    title: '6. Target Users & Personas',
    category: 'Strategy & Overview',
    readTimeMinutes: 3,
    summary: 'Detailed breakdown of core user personas interacting with KOHLER SENSE.',
    keyTakeaways: [
      'Commercial Facility Director: Focuses on ESG compliance, water wastage trends, and SLA adherence',
      'Facility Operations Manager: Manages active alerts, zone health, and maintenance dispatch queues',
      'Janitorial Supervisor: Monitors traffic-weighted cleaning urgency and stall turnover rates'
    ],
    content: `## 6. Target Users & Personas

### 6.1 Primary User Personas

| Persona | Role & Context | Primary Jobs to Be Done | Key Pain Points |
| :--- | :--- | :--- | :--- |
| **Elena Rostova**<br>*Airport Facility Director* | Oversees all terminal physical operations and capital sustainability targets | • Track macro water consumption against ESG targets<br>• Prevent high-profile public disruptions<br>• Justify infrastructure modernization budgets | • Fragmented vendor dashboards<br>• Lacks auditable water savings data for LEED reports<br>• Discovers plumbing leaks via Twitter/X complaints |
| **Marcus Vance**<br>*Facility Maintenance Lead* | Directs mechanical, electrical, and plumbing (MEP) response technicians | • Identify and triage active fixture faults<br>• Dispatch technicians with exact diagnostic root causes<br>• Track mean-time-to-resolution (MTTR) | • Overwhelmed by false sensor alarms<br>• Technicians waste time finding which stall has a stuck solenoid<br>• Reactive rather than predictive repairs |
| **Priya Patel**<br>*Custodial Operations Supervisor* | Manages shifts of 40+ janitorial staff across terminal concourses | • Direct cleaning crews to high-traffic restrooms dynamically<br>• Monitor stock levels and fixture hygiene status<br>• Validate cleaning completion timestamps | • Rigid 60-minute cleaning schedules waste labor on clean stalls<br>• Sudden passenger arrivals cause sanitary crises before discovery |`
  },
  {
    id: 7,
    slug: 'use-cases',
    title: '7. Core Use Cases',
    category: 'Strategy & Overview',
    readTimeMinutes: 4,
    summary: 'Detailed end-to-end operational use cases in commercial facility management.',
    keyTakeaways: [
      'UC-01: Autonomous Detection and Triage of Continuous Leak in Departure Concourse',
      'UC-02: Demand-Driven Restroom Sanitization Following Wide-Body Flight Arrival',
      'UC-03: Predictive Degradation Triage of Commercial Flushometer Solenoid',
      'UC-04: Conversational Executive Sustainability and Incident Investigation via Copilot'
    ],
    content: `## 7. Core Use Cases

### UC-01: Continuous Water-Flow Leak Detection & Automated Dispatch
* **Trigger**: A commercial diaphragm flushometer in Stall #3 experiences a partial seal failure, maintaining a continuous flow of $1.1\\text{ L/min}$ during a 15-minute lull in occupancy.
* **Actors**: Sensor Telemetry Pipeline, Rule/Statistical Anomaly Detector, AI Incident Analyst, Maintenance Technician.
* **Preconditions**: Fixture is registered in Zone A; baseline flow models are active.
* **Postconditions**: Incident logged in SQLite; AI generates structured diagnostic ticket; alert visible on Command Center; notification dispatched.

### UC-02: Traffic-Driven Dynamic Cleaning Dispatch
* **Trigger**: A wide-body flight deplanes 380 passengers near Concourse Zone B. Faucet activations exceed 250 and flushes exceed 180 within a 20-minute window.
* **System Action**: Hygiene Urgency Score spikes from $28/100$ to $89/100$ (Critical Threshold exceeded).
* **Outcome**: System initiates a "High Urgency Cleaning Request" with estimated turnover requirements, re-routing janitorial staff from an idle concourse.

### UC-03: Predictive Actuator Latency Degradation Detection
* **Trigger**: Touchless faucet optical sensor response latency steadily climbs from a nominal $110\\text{ ms}$ baseline to $680\\text{ ms}$ over 72 hours, accompanied by transient low-voltage battery warnings ($3.1\\text{V} \\rightarrow 2.6\\text{V}$).
* **System Action**: Moving-average latency trend crosses safety boundary. Isolation forest flags multi-variate anomaly.
* **Outcome**: Low-severity preventative ticket issued: *"Preventative battery & sensor lens servicing recommended before complete optical blackout."*

### UC-04: Conversational Facility Copilot Query
* **Trigger**: Facility Director Elena asks: *"Why did Terminal 2 water consumption spike between 2:00 PM and 4:00 PM today?"*
* **System Action**: Copilot queries incident log and zone-level hourly telemetry, aggregates $148\\text{ L}$ loss in Zone A Stall #3, and provides a clear grounded narrative with direct ticket citations.`
  },
  {
    id: 8,
    slug: 'user-journeys',
    title: '8. User Journeys',
    category: 'Strategy & Overview',
    readTimeMinutes: 4,
    summary: 'Step-by-step user journeys for maintenance dispatch and facility operations.',
    keyTakeaways: [
      'Journey 1: Maintenance Lead Marcus responding to an automated leak dispatch',
      'Journey 2: Custodial Supervisor Priya balancing cleaning rosters during peak surges'
    ],
    content: `## 8. User Journeys

### 8.1 Maintenance Lead: Incident Detection to Resolution

\`\`\`
[1. Incident Alert] ──> [2. AI Context] ──> [3. Triage & Dispatch] ──> [4. Field Fix] ──> [5. Verification]
  Audible ping on        Reviews grounded     Accepts auto-created      Technician replaces   Flow returns to 0;
  dashboard: Flush #3    LLM diagnosis:       ticket, assigns to        diaphragm valve;      system closes
  potential leak         "92% Solenoid seal"  field tech (Dave)         marks "Resolved"      incident auto
\`\`\`

1. **Alert Notification**: Dashboard alerts Marcus with high-contrast red indicator: *Zone A Stall #3 - Continuous Water Flow Anomaly ($1.1\\text{ L/min}$, 18 mins active)*.
2. **AI Diagnostic Brief**: Marcus clicks the incident card. The AI Incident Analyst presents:
   * *Evidence*: Zero stall occupancy detected for 16 minutes; flow constant at $1.1\\text{ L/min}$; historical baseline is $0.0\\text{ L/min}$.
   * *Probable Cause*: Diaphragm valve seating debris or solenoid valve failure.
   * *Recommended Action*: Inspect flushometer diaphragm assembly; flush supply line.
3. **Dispatch & Assignment**: Marcus confirms automated ticket assignment to Technician Dave. Ticket status transitions: $\\text{OPEN} \\rightarrow \\text{ASSIGNED}$.
4. **Resolution**: Dave services fixture, enters resolution notes. The next telemetry cycle detects $0.0\\text{ L/min}$ rest state. Incident status auto-resolves.`
  },
  {
    id: 9,
    slug: 'functional-requirements',
    title: '9. Functional Requirements',
    category: 'Architecture & Tech',
    readTimeMinutes: 5,
    summary: 'Exhaustive functional requirement specifications for all 15 core platform capabilities.',
    keyTakeaways: [
      'FR-01 to FR-15 covering Facility Management, IoT Ingestion, Detection, Dispatch, and Reporting',
      'Rigid schema compliance, deterministic fallbacks, and multi-format outputs'
    ],
    content: `## 9. Functional Requirements

### 9.1 Summary Matrix of Functional Requirements
| ID | Module | Requirement Statement | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | Facility Hierarchy | Must maintain multi-tier hierarchy: Facility $\\rightarrow$ Zones $\\rightarrow$ Fixtures with metadata. | P0 |
| **FR-02** | Telemetry Ingestion | Ingest synthetic telemetry at 1–5s intervals supporting 16 standard telemetry fields. | P0 |
| **FR-03** | Continuous Leak Detection | Detect uninterrupted flow $> 0.2\\text{ L/min}$ exceeding configured time thresholds. | P0 |
| **FR-04** | Volumetric Wastage | Compute real-time water loss: $W = Q \\times \\Delta t$ aggregated by fixture, zone, and facility. | P0 |
| **FR-05** | Statistical Anomaly Engine | Calculate rolling mean, standard deviation, and Z-scores ($Z > 3.0$) for all continuous variables. | P0 |
| **FR-06** | ML Isolation Forest | Multi-feature unsupervised anomaly detection evaluating flow, flush count, and occupancy. | P1 |
| **FR-07** | Dynamic Hygiene Urgency | Compute 0–100 Hygiene Urgency Index derived from traffic, flushes, and time-since-cleaning. | P0 |
| **FR-08** | Device Health Matrix | Map device telemetry to 4 states: *Healthy*, *Attention*, *Degrading*, *Offline*. | P0 |
| **FR-09** | Predictive Degradation | Identify trending latency ($>300\\text{ ms}$), voltage drop ($<3.0\\text{V}$), and packet loss. | P0 |
| **FR-10** | Incident Engine | Generate unique UUID incidents containing severity, confidence, evidence, and lifecycle state. | P0 |
| **FR-11** | AI Incident Analyst | Transform structured incident JSON into grounded diagnostic root causes and step-by-step guidance. | P0 |
| **FR-12** | Explainable Priority Engine | Rank incidents using explicit mathematical weighting of Severity, Wastage, Footfall, and Confidence. | P0 |
| **FR-13** | Automated Dispatch | Auto-generate maintenance work orders when incident severity is HIGH/CRITICAL and confidence $> 80\\%$. | P0 |
| **FR-14** | Facility Copilot | Conversational natural language interface answering queries grounded in SQLite state. | P0 |
| **FR-15** | Demo Scenario Controls | One-click simulation triggers for Leak, Surge, Sensor Failure, Degradation, and Reset. | P0 |`
  },
  {
    id: 10,
    slug: 'non-functional-requirements',
    title: '10. Non-Functional Requirements',
    category: 'Architecture & Tech',
    readTimeMinutes: 4,
    summary: 'System qualities including latency, stability, accuracy, offline resilience, and explainability.',
    keyTakeaways: [
      'Latency: Sub-second UI updates, <5s LLM synthesis, <90s anomaly-to-dispatch pipeline',
      'Resilience: 100% operational uptime of core monitoring during LLM API outages',
      'Explainability: No ungrounded or opaque priority scores or unverified physical claims'
    ],
    content: `## 10. Non-Functional Requirements

### 10.1 Performance & Latency
* **NFR-01 (Ingestion Throughput)**: Support simulated ingestion of up to 100 events/sec without thread blocking or UI stuttering.
* **NFR-02 (Detection Latency)**: Detection pipeline must flag continuous flow anomalies within 2 sliding-window ticks ($\\le 10\\text{ seconds}$ from trigger threshold).
* **NFR-03 (AI Copilot Latency)**: Conversational responses must stream or return within 3.5 seconds.
* **NFR-04 (UI Rendering)**: Dashboard charts and telemetry feeds must render smoothly at 60 FPS using reactive state.

### 10.2 Reliability & Fault Tolerance
* **NFR-05 (Offline Fallback Guarantee)**: If the Gemini LLM API returns HTTP 429, 500, or network timeout, the system must trigger deterministic template-based incident summaries and maintenance dispatches without crashing.
* **NFR-06 (Data Consistency)**: SQLite database transactions must enforce ACID properties and foreign key constraints on all telemetry and ticket insertions.

### 10.3 Explainability & Trust
* **NFR-07 (Glass-Box Scoring)**: Every priority score ($0-100$) must display its constituent mathematical sub-scores (Severity, Wastage, Footfall, Confidence).
* **NFR-08 (Zero Hallucination Tolerance)**: Any numerical sensor value generated in an AI narrative that deviates from the underlying database record is considered a catastrophic failure.`
  },
  {
    id: 11,
    slug: 'system-architecture',
    title: '11. System Architecture',
    category: 'Architecture & Tech',
    readTimeMinutes: 5,
    summary: 'Complete technical architecture detailing the 6-stage Sense-to-Measure pipeline and subsystem boundaries.',
    keyTakeaways: [
      'Strict separation of data plane (FastAPI/SQLite/Pandas) and cognitive plane (LLM / Copilot)',
      'Deterministic rule/statistical engine acts as gatekeeper to the AI reasoning module',
      'Clean modular architecture runnable in local and containerized environments'
    ],
    content: `## 11. System Architecture

### 11.1 Conceptual Architecture
\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                        IoT SIMULATION LAYER                           │
│   • Synthetic Telemetry Generator (1-5s intervals)                     │
│   • Scenario Injection Controller (Leak, Surge, Degradation, Offline)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Raw Telemetry Stream
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   INGESTION & EVENT PROCESSING                         │
│   • Data Ingestion API (/api/telemetry)                                │
│   • Sliding Window Buffer (60-300s FIFO)                               │
│   • Baseline Calculator (Rolling mean, std dev, hourly profiles)       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Enriched Window Frames
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 DETERMINISTIC ANOMALY DETECTION ENGINE                 │
│   • Rule-Based Evaluators (Zero-Occupancy Flow, Prolonged Flush)       │
│   • Statistical Anomaly Detector (Z-Score > 3.0, IQR Spikes)           │
│   • ML Engine (Scikit-Learn Isolation Forest on 4D Features)           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Validated Anomalous Events
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 INCIDENT ENGINE & EXPLAINABLE PRIORITY                 │
│   • Incident Deduplication & Aggregator                                │
│   • Volumetric Wastage Integrator (W = Q × Δt)                         │
│   • Priority Score Calculator (Severity, Loss, Footfall, Confidence)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Structured Incident JSON
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   AI REASONING LAYER (GEMINI LLM)                      │
│   • AI Incident Analyst (Root Cause & Diagnostics)                     │
│   • Facility Copilot (RAG Retrieval over SQLite State)                 │
│   • Deterministic Fallback Engine (Offline Resilience)                 │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Grounded Actions & Tickets
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                ACTION, DISPATCH & ANALYTICS INTERFACES                 │
│   • Auto-Dispatch Maintenance Engine (Ticket Lifecycle)                │
│   • Executive Sustainability Command Center (Water Conservation KPIs)   │
│   • Interactive Operator Dashboard (Streamlit / React)                 │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

### 11.2 Subsystem Breakdown
1. **IoT Ingestion Subsystem**: Accepts JSON telemetry frames, validates schema, updates current fixture state cache, and persists to SQLite \`telemetry\` table.
2. **Detection & Processing Subsystem**: Runs streaming evaluations on sliding windows. Flags events where continuous flow persists during zero occupancy or flush counts deviate abnormally.
3. **Cognitive Layer**: Interfaces with Google Gemini API using structured JSON schema output modes. Feeds telemetry evidence and receives verified diagnostic breakdowns.
4. **Operations Subsystem**: Manages automated ticket dispatch, assignment workflows, and resolution tracking.
5. **Presentation Subsystem**: Renders responsive KPIs, live feeds, incident triage cards, and Copilot chat interface.`
  },
  {
    id: 12,
    slug: 'ai-architecture',
    title: '12. AI Architecture',
    category: 'AI & ML Intelligence',
    readTimeMinutes: 5,
    summary: 'Detailed design of the AI cognitive layer, Gemini API integration, prompt orchestration, and RAG pipelines.',
    keyTakeaways: [
      'Two distinct AI agents: AI Incident Analyst (Batch/Event-driven) and Facility Copilot (Interactive/RAG)',
      'Deterministic grounding: Context injection from SQLite state guarantees zero hallucinated metrics',
      'Structured JSON output validation with Pydantic / TypeScript type checks and graceful fallbacks'
    ],
    content: `## 12. AI Architecture

### 12.1 The Two-Agent Cognitive Framework
KOHLER SENSE employs two purpose-built AI agents with complementary operational scopes:

\`\`\`
┌─────────────────────────────────────────────────────────────────────────┐
│                      AI REASONING ORCHESTRATION                         │
├────────────────────────────────────┬────────────────────────────────────┤
│       1. AI INCIDENT ANALYST       │        2. FACILITY COPILOT         │
│         (Event-Triggered)          │       (User Query-Triggered)       │
├────────────────────────────────────┼────────────────────────────────────┤
│ • Trigger: Anomaly detected        │ • Trigger: Conversational prompt   │
│ • Input: Single Incident JSON      │ • Input: User query + RAG Context  │
│ • Task: Synthesize root cause,     │ • Task: Semantic query parsing,    │
│   recommend mechanical repairs,    │   multi-incident correlation,      │
│   estimate uncertainty             │   report drafting, JSON exports    │
│ • Output: Structured JSON payload  │ • Output: Natural language / JSON  │
└────────────────────────────────────┴────────────────────────────────────┘
\`\`\`

### 12.2 Grounding & Anti-Hallucination Pipeline
To prevent the model from generating fictitious sensor numbers or non-existent plumbing fixtures:
1. **Context Construction (RAG)**: The backend queries the current state of the database:
   * Target fixture metadata (model, installation date, last service date).
   * Active telemetry snapshot (current flow, baseline average, standard deviation).
   * Surrounding zone telemetry (zone occupancy, adjacent fixture flows).
2. **Strict Negative Prompts & Constraints**: Prompts explicitly forbid inventing metrics:
   > *"You must ONLY cite metrics explicitly provided in the INCIDENT_CONTEXT block. If a metric is absent, state 'Data unavailable'. Never state a leak is physically confirmed; use 'Potential continuous water-flow anomaly'."*
3. **Schema Validation**: Outputs are parsed against a rigid JSON schema. If parsing fails or an unknown fixture ID appears, the system discards the LLM output and executes the **Deterministic Fallback Engine**.`
  },
  {
    id: 13,
    slug: 'iot-architecture',
    title: '13. IoT Architecture & Telemetry Specification',
    category: 'IoT & Data Processing',
    readTimeMinutes: 4,
    summary: 'Comprehensive specification of the commercial restroom IoT telemetry packet and sensor semantics.',
    keyTakeaways: [
      '16-field standard telemetry payload covering flow, flushes, battery, latency, and hygiene',
      'Realistic physical ranges: Faucet flow (1.5–4.5 L/min), Flushometer (3.8–6.0 L/flush), Standby (0.0 L/min)',
      'Configurable telemetry frequencies from 1s (high-fidelity demo) to 10s (normal monitoring)'
    ],
    content: `## 13. IoT Architecture & Telemetry Specification

### 13.1 Telemetry Packet Schema
Every simulated commercial fixture broadcasts a periodic telemetry frame structured as follows:

\`\`\`json
{
  "timestamp": "2026-09-18T15:30:00Z",
  "facility_id": "FAC-AIRPORT-T2",
  "zone_id": "ZONE-CONCOURSE-A",
  "device_id": "FLUSH-A-03",
  "device_type": "FLUSHOMETER",
  "water_flow_rate_lpm": 1.15,
  "cumulative_water_liters": 4280.5,
  "flush_count_total": 842,
  "faucet_activation_count": 0,
  "occupancy_detected": false,
  "battery_level_pct": 87.5,
  "sensor_status": "NORMAL",
  "response_latency_ms": 124,
  "error_count_24h": 0,
  "cleaning_status": "PENDING",
  "last_cleaning_timestamp": "2026-09-18T13:45:00Z"
}
\`\`\`

### 13.2 Field Definitions & Physical Ranges
| Field Name | Type | Unit / Range | Description |
| :--- | :--- | :--- | :--- |
| \`timestamp\` | ISO-8601 | UTC String | Universal sample generation time |
| \`facility_id\` | String | \`FAC-[A-Z0-9-]+\` | Unique facility identifier |
| \`zone_id\` | String | \`ZONE-[A-Z0-9-]+\` | Sub-facility architectural zone |
| \`device_id\` | String | \`[A-Z]+-[A-Z0-9-]+\` | Unique fixture identifier |
| \`device_type\` | Enum | \`FLUSHOMETER\`, \`FAUCET\`, \`URINAL\` | Physical fixture classification |
| \`water_flow_rate_lpm\` | Float | $0.0 - 15.0\\text{ L/min}$ | Instantaneous water flow rate |
| \`cumulative_water_liters\` | Float | $\\ge 0.0\\text{ L}$ | Monotonic lifetime volume counter |
| \`flush_count_total\` | Integer | $\\ge 0$ | Total lifetime mechanical actuation events |
| \`faucet_activation_count\` | Integer | $\\ge 0$ | Total faucet optical cycle triggers |
| \`occupancy_detected\` | Boolean | \`true\` / \`false\` | Zone or stall PIR/TOF presence sensor |
| \`battery_level_pct\` | Float | $0.0 - 100.0\\%$ | Internal lithium battery pack state |
| \`sensor_status\` | Enum | \`NORMAL\`, \`DEGRADED\`, \`ERROR\`, \`OFFLINE\` | Hardware diagnostic self-check flag |
| \`response_latency_ms\` | Integer | $50 - 2500\\text{ ms}$ | Infrared/capacitive actuation latency |
| \`error_count_24h\` | Integer | $\\ge 0$ | Rolling 24-hour sensor communication error count |
| \`cleaning_status\` | Enum | \`CLEAN\`, \`NORMAL\`, \`URGENT\`, \`CRITICAL\` | Hygiene model derived operational state |
| \`last_cleaning_timestamp\` | ISO-8601 | UTC String | Timestamp of last verified janitorial badge-in |`
  }
];
