# KOHLER SENSE™ — Commercial Smart Facility & Sustainability Manager

[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> Autonomous, real-time IoT water monitoring, deterministic leak detection, predictive maintenance dispatch, and ESG sustainability intelligence for high-traffic commercial facilities. Developed under the **KOHLER-MITWPU AI Research Lab Program**.

---

## 📌 Overview

Commercial restrooms account for over **37% of water consumption** in enterprise facilities (airports, healthcare centers, universities, and commercial towers). Uncontained fixture leaks—such as stuck flushometer solenoids or weeping diaphragms—often go undetected for hours or days, causing catastrophic water loss, structural damage, and utility cost spikes.

**KOHLER SENSE** solves this with an end-to-end autonomous **6-stage closed-loop architecture**:

```
[ 1. SENSE ] ──> [ 2. DETECT ] ──> [ 3. PREDICT ] ──> [ 4. PRIORITIZE ] ──> [ 5. DISPATCH ] ──> [ 6. MEASURE ]
High-Freq IoT      Deterministic      Wear & Loss       Dynamic Multi-      Work Orders &       Closed-Loop
1000ms Bus         Continuous Leak    Forecast (HDI)    Factor Scoring      Kohler OEM SKUs     Verification
```

---

## ✨ Key Capabilities & Modules

### 1. High-Frequency IoT Telemetry Bus & Actuation
- **1000ms Ingestion Clock**: Sub-second continuous sampling of volumetric flow (`L/min`), hydraulic line pressure (`bar`), acoustic vibration (`G`), and battery state (`V`).
- **Real-Time Waveform Visualizer**: Dual-axis synchronized Recharts telemetry time series with selectable window buffers (`15s`, `30s`, `Full`).
- **Interactive Fixture Array**: Trigger real-world hydraulic flushes (4.8L stall flushes, 1.9 L/min handwash cycles) or inject component faults on demand.

### 2. Autonomous Incident Prioritization Pipeline
- **Deterministic Leak Detection**: Sliding-window algorithms distinguish genuine user activations from micro-leaks ($0.75\text{ L/min}$) and runaway solenoid failures ($18.0\text{ L/min}$).
- **Dynamic Priority Engine ($P_1 - P_4$)**:
  $$\text{Priority Score} = 0.35 \times \text{Severity} + 0.30 \times \text{Wastage Rate} + 0.20 \times \text{Zone Criticality} + 0.15 \times \text{Dwell Time}$$
- **Closed-Loop Telemetry Verification**: Work orders cannot be closed purely by paperwork; the system automatically validates a $180\text{s}$ zero-flow idle period before marking the incident verified.

### 3. Hygiene Demand Index (HDI) & Custodial Routing
- **Data-Driven Sanitation**: Dynamic 0–100 index weighted by flushes ($40\%$), faucet cycles ($30\%$), footfall presence ($20\%$), and time elapsed since last cleaning ($10\%$).
- **Autonomous Dispatch**: Triggers cleaning crew notifications when a zone reaches $85\%$ demand, replacing inefficient fixed-schedule cleanings.

### 4. Grounded AI Plumbing Diagnostics & Copilot
- **Gemini 2.5 Flash Integration**: Server-side proxy analyzing real-time waveform anomalies against official Kohler commercial specification catalogs.
- **Genuine OEM Parts Provisioning**: Automatically specifies Kohler SKUs (e.g., `K-1067341` Solenoid Assembly, `K-1032402` Diaphragm Rebuild Kit), estimated dwell time, and step-by-step Standard Operating Procedures (SOPs).
- **Interactive Copilot Chat**: Floating interactive AI assistant available across all views for instant technical guidance and queries.

### 5. 20 Production Simulation Scenarios & Benchmark Suite
- **PRD Validation Suite**: 20 pre-configured industrial failure modes spanning micro-leaks, thermal pressure spikes, runaway solenoids, sensor disconnects, and simultaneous peak rush events.
- **Automated Benchmark Runner**: Measures SLA response latency, false-positive rejection, and classification accuracy in real-time.

### 6. Executive ESG & Sustainability Accounting
- **Volumetric Water Accounting**: High-precision tracking of potable water saved vs. unmonitored facilities.
- **Carbon Abatement & Utility Cost Modeling**: Computes Scope 2 emissions avoided ($0.0003\text{ kg CO}_2\text{e / Liter}$) and municipal commercial tariff savings ($0.0038\text{ USD / Liter}$).
- **Instant Report Export**: One-click generation and download of formatted Executive ESG Audit reports in Markdown.

---

## 🎨 Kohler Signature Design System

The user interface follows Kohler's commercial design philosophy:
- **Matte Black (`#111111`)**: Clean, premium architectural foundation.
- **Vibrant Brass (`#c29b38`)**: Kohler signature metallic gold accent.
- **Hydro Blue (`#0284c7` / `#38bdf8`)**: Water flow and real-time telemetry indicators.
- **Adaptive Dark & Light Themes**: Accessible high-contrast typography and subtle borders with zero distracting gradients.
- **Fluid Motion Animations**: Powered by `motion/react` with spring physics on card interactions, modal transitions, and notification toasts.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18+, TypeScript, Vite |
| **Styling** | Tailwind CSS v4 |
| **Motion & FX** | `motion/react` (Framer Motion) |
| **Visualizations** | Recharts (Responsive Line Charts) |
| **Icons** | Lucide React |
| **Backend & Proxy** | Express.js (Node.js) with `tsx` |
| **AI Engine** | Google GenAI SDK (`@google/genai`), Gemini 2.5 Flash |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/kohler-sense.git
   cd kohler-sense
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   # Optional: For live Gemini AI root cause diagnostics & Copilot
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: If no API key is provided, the application automatically uses deterministic rule-based fallback engines with authentic Kohler plumbing specifications.)*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

### Production Build

```bash
# Build both frontend assets and backend server
npm run build

# Start production server
npm run start
```

---

## 📁 Repository Structure

```
├── server.ts                       # Express backend server & Gemini API proxy
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── App.tsx                     # Top-level shell with theme toggle & layout
│   ├── types.ts                    # Core TypeScript interfaces & domain models
│   ├── components/
│   │   ├── prototype/
│   │   │   ├── PrototypeContainer.tsx      # Main application state & orchestration hub
│   │   │   ├── FacilityZoneSelector.tsx    # Facility switcher & zone selector
│   │   │   ├── LiveTelemetryMonitor.tsx    # Waveform charts & fixture board
│   │   │   ├── IncidentDispatchManager.tsx # Autonomous incident pipeline & tickets
│   │   │   ├── AiDiagnosticModal.tsx       # AI root-cause & OEM parts modal
│   │   │   ├── ScenarioSimulatorModal.tsx  # 20 PRD scenarios & automated benchmark
│   │   │   ├── AiCopilotChat.tsx           # Floating AI facility copilot
│   │   │   ├── EsgSustainabilityPanel.tsx  # ESG metrics & report exporter
│   │   │   └── ToastNotification.tsx       # Animated status toast system
│   ├── data/
│   │   ├── mockFacilities.ts       # Facility hierarchies, zones & fixture data
│   │   └── simulationScenarios.ts  # 20 industrial simulation scenarios
│   └── services/
│       ├── detectionEngine.ts      # Deterministic leak detection & scoring logic
│       └── aiReasoning.ts          # Client-side AI diagnostic caller & fallbacks
├── public/                         # Static assets
├── index.html                      # HTML entry point with metadata tags
├── metadata.json                   # Applet configuration & permissions
├── package.json                    # Project dependencies and npm scripts
└── vite.config.ts                  # Vite build configuration
```

---

## 🧪 Simulation Scenarios Included

| ID | Title | Category | Target Fixture | Expected Action |
|---|---|---|---|---|
| SC-01 | Micro-Diaphragm Weep | LEAK | Primary Stall Flushometer | Flagged at $0.75\text{ L/min}$, P2 ticket dispatched |
| SC-02 | Runaway Solenoid Mechanical Latch | LEAK | Men's West Stall #1 | Critical alarm at $18.0\text{ L/min}$, P1 emergency SLA |
| SC-03 | Flight Deplaning Footfall Surge | TRAFFIC | North Terminal Concourse | HDI surges to $88\%$, custodial cleaning automated |
| SC-04 | Dual-Flush Valve O-Ring Erosion | HARDWARE | Staff ADA Stall | Continuous bypass flagged after 60s idle |
| SC-05 | Aerator Scale Obstruction | HARDWARE | Basin Sensor Faucet #2 | Low-flow alert generated with descaling SOP |
| ... | *+15 additional scenarios* | *EXTREME / HYGIENE* | *Various Fixtures* | *PRD Matrix Verification* |

---

**KOHLER SENSE™ — Built for the Future of Smart Commercial Plumbing & Sustainable Facilities.**
