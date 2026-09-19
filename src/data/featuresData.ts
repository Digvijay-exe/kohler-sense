import { FeatureSpec } from '../types';

export const featuresList: FeatureSpec[] = [
  {
    id: 'FEAT-01',
    name: 'Facility & Fixture Registry Management',
    category: 'Facility Management',
    mvpStatus: 'Core MVP',
    purpose: 'Maintain an authoritative spatial and hardware registry mapping commercial facilities, concourse restroom zones, and smart plumbing fixtures.',
    inputs: [
      'Facility metadata (ID, name, type, geographical location)',
      'Zone metadata (ID, floor, occupancy capacity, cleaning thresholds)',
      'Fixture registry (ID, type, model, serial number, firmware version, install date)'
    ],
    processing: 'Validates unique hardware identifiers, verifies foreign key dependencies across facility-zone-device hierarchy in SQLite, and provides cached lookup tables for real-time telemetry correlation.',
    outputs: [
      'Structured JSON facility topology',
      'Device status matrix (Healthy, Attention, Degrading, Offline)',
      'Active fixture health summary endpoints for UI rendering'
    ],
    acceptanceCriteria: [
      'Successfully register 2 terminal concourse zones (Concourse A & B) with 8 commercial fixtures.',
      'Enforce database cascading rules ensuring orphan fixtures or telemetry frames cannot exist.',
      'Lookup latency for any fixture state must execute in < 5ms.'
    ]
  },
  {
    id: 'FEAT-02',
    name: 'High-Frequency IoT Telemetry Simulator',
    category: 'IoT & Telemetry',
    mvpStatus: 'Core MVP',
    purpose: 'Generate high-fidelity, physics-calibrated synthetic telemetry packets simulating commercial smart plumbing fixtures in high-footfall environments.',
    inputs: [
      'Simulation clock frequency (1 to 5 second intervals)',
      'Target scenario profile (Normal, Continuous Leak, Traffic Surge, Sensor Glitch, Degradation)',
      'Device profile configuration (diaphragm flushometer, electronic touchless faucet, urinal)'
    ],
    processing: 'Applies diurnal airport footfall curves, Poisson-distributed arrival events, Gaussian noise to flow rates (±0.05 L/min), and stateful accumulation of cumulative water consumption.',
    outputs: [
      '16-field standard telemetry payload broadcast to /api/telemetry/ingest',
      'Continuous sliding-window buffer in memory',
      'Persisted records in SQLite telemetry table'
    ],
    acceptanceCriteria: [
      'Generate uninterrupted telemetry packets every 2 seconds across all 8 fixtures.',
      'Support real-time scenario switching via /api/simulator/inject with zero server restart.',
      'Telemetry values must strictly stay within physical physical ranges (Flow: 0.0 - 15.0 L/min, Battery: 0-100%).'
    ]
  },
  {
    id: 'FEAT-03',
    name: 'Hybrid Continuous Leak & Volumetric Wastage Engine',
    category: 'Anomaly Detection',
    mvpStatus: 'Core MVP',
    purpose: 'Rapidly identify continuous water-flow anomalies during zero-occupancy windows and quantify the exact volumetric water loss in real-time.',
    inputs: [
      'Instantaneous flow rate Q(t) in L/min',
      'PIR/TOF occupancy state (occupancy_detected)',
      'Timestamp delta Δt between consecutive samples',
      'Fixture historical baseline resting flow'
    ],
    processing: 'Evaluates Tier 1 zero-occupancy rule (Flow > 0.2 L/min for > 90s while occupancy=false). Integrates flow rate trapezoidally (W_loss = Σ (Q_i * Δt_i)) to calculate exact cumulative liters lost.',
    outputs: [
      'Continuous leak anomaly flag with confidence score (0.0 - 1.0)',
      'Estimated water loss in Liters (displayed in real-time)',
      'Structured incident generation trigger sent to Incident Engine'
    ],
    acceptanceCriteria: [
      'Flag a continuous leak within 90 seconds of continuous flow inception.',
      'Never trigger a continuous leak alarm during verified legitimate flush events (< 15s).',
      'Water loss calculation accuracy within ±2% of theoretical Q * Δt integration.'
    ]
  },
  {
    id: 'FEAT-04',
    name: 'Dynamic Usage-Aware Hygiene Prediction Engine',
    category: 'Hygiene & Cleaning',
    mvpStatus: 'Core MVP',
    purpose: 'Calculate a real-time Hygiene Urgency Index (0-100) based on cumulative footfall, flushes, and time elapsed to dynamically route cleaning crews.',
    inputs: [
      'Zone cumulative flush count since last sanitization event',
      'Zone faucet activation count',
      'Time elapsed (minutes) since last verified janitorial badge-in',
      'Real-time passenger occupancy density'
    ],
    processing: 'Computes normalized weighted sum: U_hygiene = min(100, 0.35*(Flushes/150) + 0.30*(Elapsed/180m) + 0.20*(Faucets/200) + 0.15*Surge). Evaluates operational thresholds: Normal (<50), Attention (50-74), Urgent (75-89), Critical (>=90).',
    outputs: [
      'Hygiene Urgency Score (0-100) per restroom zone',
      'Automated Custodial Cleaning Request dispatch when score >= 75',
      'Turnover requirement recommendations with estimated staff time'
    ],
    acceptanceCriteria: [
      'Update zone hygiene score dynamically within 1 second of new telemetry arrival.',
      'Surge trigger must accurately propel score into Urgent tier during 300-passenger flight arrival simulation.',
      'Reset hygiene score to 0 upon receipt of a verified cleaning event payload.'
    ]
  },
  {
    id: 'FEAT-05',
    name: 'Predictive Device Degradation & Health Monitor',
    category: 'Device Health',
    mvpStatus: 'Core MVP',
    purpose: 'Detect early signals of mechanical valve stickiness, optical sensor fouling, and battery depletion before complete fixture blackout.',
    inputs: [
      'Sensor response latency (ms)',
      'Internal lithium battery pack voltage / percentage',
      'Rolling 24-hour sensor communication error count',
      'Ghost actuation frequency (activations with zero presence)'
    ],
    processing: 'Applies moving-average trend tracking over response latency (flagging >300ms drift) and battery threshold gating (<3.0V / 20%). Evaluates multi-variate anomaly score via Scikit-learn Isolation Forest.',
    outputs: [
      'Fixture Health State: Healthy, Attention, Degrading, Offline',
      'Predictive maintenance alert specifying component condition and evidence',
      'Recommended preventative servicing action before catastrophic failure'
    ],
    acceptanceCriteria: [
      'Detect artificial latency degradation from 110ms to 650ms within 5 telemetry frames.',
      'Transition device state to DEGRADING and emit low-severity work order recommendation.',
      'Maintain zero false degradation alerts during nominal voltage operation.'
    ]
  },
  {
    id: 'FEAT-06',
    name: 'AI Incident Analyst (Grounded Cognitive Layer)',
    category: 'AI Intelligence',
    mvpStatus: 'Core MVP',
    purpose: 'Transform raw numerical telemetry and baseline deviations into grounded diagnostic root causes, step-by-step mechanical repair instructions, and uncertainty statements.',
    inputs: [
      'Structured incident payload (flow rate, duration, wastage, occupancy, latency, Z-score)',
      'Fixture hardware metadata (model, installation date, last service date)',
      'Surrounding zone occupancy and traffic context'
    ],
    processing: 'Constructs strict RAG context block with zero-hallucination guardrails. Calls Google Gemini API with response_schema enforcement. Validates returned JSON against Pydantic schema.',
    outputs: [
      'Human-readable incident diagnosis summary',
      'Likely mechanical root cause (e.g., diaphragm debris vs solenoid fatigue)',
      'Actionable maintenance technician steps with required parts and tools',
      'Explicit uncertainty statement advising physical visual confirmation'
    ],
    acceptanceCriteria: [
      'Zero hallucinated numerical values: all numbers in explanation must match input context exactly.',
      'Never claim a leak is physically confirmed; use "Potential" or "Suspected".',
      'Fallback gracefully to deterministic rule-based output if LLM API is unavailable.'
    ]
  },
  {
    id: 'FEAT-07',
    name: 'Explainable Multi-Factor Priority & Dispatch Engine',
    category: 'Operations',
    mvpStatus: 'Core MVP',
    purpose: 'Calculate an explainable operational priority score (0-100) and automatically dispatch maintenance tickets to MEP and janitorial crews.',
    inputs: [
      'Incident severity (Low, Medium, High, Critical)',
      'Cumulative volumetric water loss (Liters)',
      'Zone footfall traffic intensity',
      'Detection confidence score'
    ],
    processing: 'Calculates glass-box priority: Score = 0.35*Severity + 0.30*Wastage + 0.20*Footfall + 0.15*Confidence. When score >= 75 and confidence >= 0.80, creates maintenance ticket in SQLite with assigned team and SLA.',
    outputs: [
      'Explainable priority score with constituent breakdown',
      'Auto-generated maintenance ticket in SQLite maintenance_tickets table',
      'Lifecycle state transitions: OPEN -> ASSIGNED -> ACKNOWLEDGED -> IN_PROGRESS -> RESOLVED'
    ],
    acceptanceCriteria: [
      'Auto-dispatch P1 ticket within 3 seconds of high-severity incident generation.',
      'Every priority score must display its 4 mathematical sub-components in UI.',
      'Automatically resolve ticket when telemetry confirms flow returns to 0.0 L/min.'
    ]
  },
  {
    id: 'FEAT-08',
    name: 'Facility Copilot (Conversational Executive Assistant)',
    category: 'AI Intelligence',
    mvpStatus: 'Core MVP',
    purpose: 'Provide facility managers with a natural language interface to query real-time water consumption, triage incidents, generate summaries, and export reports.',
    inputs: [
      'User natural language query',
      'Real-time SQLite database context (facilities, telemetry, incidents, tickets)',
      'Conversation history'
    ],
    processing: 'Analyzes user intent, executes parameterized read-only queries against SQLite, injects grounded tabular results into Gemini prompt, and synthesizes clear executive answers.',
    outputs: [
      'Conversational response with exact database citations',
      'Exportable JSON summaries of active incidents upon request',
      'Actionable one-click maintenance ticket creation triggers'
    ],
    acceptanceCriteria: [
      'Answer questions such as "What caused our largest water loss today?" citing exact fixtures and liters.',
      'Response latency < 3.5 seconds.',
      'Strictly refuse requests to execute destructive database commands (DROP, DELETE, UPDATE).'
    ]
  },
  {
    id: 'FEAT-09',
    name: 'Sustainability Command Center & Avoided Loss Modeling',
    category: 'Sustainability',
    mvpStatus: 'Core MVP',
    purpose: 'Visualize facility water stewardship KPIs, track consumption against modeled baselines, and calculate Avoided Water Loss for ESG reporting.',
    inputs: [
      'Hourly aggregated facility water consumption (Liters)',
      'Modeled baseline consumption profile',
      'Total accumulated continuous water loss from resolved and active incidents'
    ],
    processing: 'Calculates Avoided Water Loss: W_avoided = Q_leak * (T_manual - T_sense), comparing rapid automated dispatch (<90s) against industry manual discovery average (48 hours). Derives indirect electrical and CO2e savings.',
    outputs: [
      'Real-time sustainability metrics: Total Consumption, Modeled Baseline, Avoided Loss',
      'Top-loss fixture leaderboards',
      'Verifiable audit export for LEED v4.1 Water Efficiency compliance'
    ],
    acceptanceCriteria: [
      'Display Avoided Water Loss KPI with transparent mathematical formula explanation.',
      'Include explicit disclaimer labeling all values as simulated/estimated engineering calculations.',
      'Export formatted CSV/JSON sustainability report for facility ESG audits.'
    ]
  }
];
