import { DatabaseTable, ApiEndpoint, DodItem } from '../types';

export const databaseTables: DatabaseTable[] = [
  {
    name: 'facilities',
    description: 'Commercial facility entities (airports, hospitals, campuses) with structural metadata.',
    columns: [
      { name: 'facility_id', type: 'TEXT', constraints: 'PRIMARY KEY', description: 'Unique facility slug (e.g., FAC-AIRPORT-T2)' },
      { name: 'name', type: 'TEXT', constraints: 'NOT NULL', description: 'Official facility display name' },
      { name: 'type', type: 'TEXT', constraints: 'NOT NULL', description: 'Facility sector: AIRPORT, HOSPITAL, CAMPUS, HOTEL' },
      { name: 'location', type: 'TEXT', constraints: 'NOT NULL', description: 'Geographic and terminal location' },
      { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'System record creation timestamp' }
    ],
    indexes: ['idx_facilities_type ON facilities(type)'],
    sampleRow: {
      facility_id: 'FAC-AIRPORT-T2',
      name: 'Terminal 2 International Concourse',
      type: 'AIRPORT',
      location: 'Gates A1-A24 Departures',
      created_at: '2026-09-18T10:00:00Z'
    }
  },
  {
    name: 'zones',
    description: 'Specific commercial restroom architectural zones with traffic capacity and hygiene tracking.',
    columns: [
      { name: 'zone_id', type: 'TEXT', constraints: 'PRIMARY KEY', description: 'Unique zone slug (e.g., ZONE-CONCOURSE-A)' },
      { name: 'facility_id', type: 'TEXT', constraints: 'FOREIGN KEY -> facilities(facility_id)', description: 'Parent facility reference' },
      { name: 'name', type: 'TEXT', constraints: 'NOT NULL', description: 'Zone display name' },
      { name: 'floor', type: 'TEXT', constraints: 'NOT NULL', description: 'Level / Terminal floor' },
      { name: 'occupancy_capacity', type: 'INTEGER', constraints: 'NOT NULL DEFAULT 20', description: 'Maximum safe occupant capacity' },
      { name: 'current_occupancy', type: 'INTEGER', constraints: 'NOT NULL DEFAULT 0', description: 'Real-time estimated occupant count' },
      { name: 'cleaning_urgency_score', type: 'REAL', constraints: 'NOT NULL DEFAULT 0.0', description: 'Model-derived urgency index (0-100)' },
      { name: 'last_cleaned_at', type: 'TIMESTAMP', constraints: '', description: 'Timestamp of last verified cleaning turnover' }
    ],
    indexes: ['idx_zones_facility ON zones(facility_id)'],
    sampleRow: {
      zone_id: 'ZONE-CONCOURSE-A',
      facility_id: 'FAC-AIRPORT-T2',
      name: 'North Concourse Restroom A',
      floor: 'Departures Level 3',
      occupancy_capacity: 25,
      current_occupancy: 4,
      cleaning_urgency_score: 34.5,
      last_cleaned_at: '2026-09-18T14:15:00Z'
    }
  },
  {
    name: 'devices',
    description: 'Connected smart commercial fixtures (flushometers, faucets, urinals) with hardware diagnostic state.',
    columns: [
      { name: 'device_id', type: 'TEXT', constraints: 'PRIMARY KEY', description: 'Unique fixture identifier (e.g., FLUSH-A-03)' },
      { name: 'zone_id', type: 'TEXT', constraints: 'FOREIGN KEY -> zones(zone_id)', description: 'Zone location reference' },
      { name: 'device_type', type: 'TEXT', constraints: 'NOT NULL', description: 'Classification: FLUSHOMETER, FAUCET, URINAL' },
      { name: 'model_name', type: 'TEXT', constraints: 'NOT NULL DEFAULT "KOHLER Commercial"', description: 'Manufacturer hardware model' },
      { name: 'serial_number', type: 'TEXT', constraints: 'UNIQUE NOT NULL', description: 'Hardware manufacturing serial' },
      { name: 'installation_date', type: 'DATE', constraints: 'NOT NULL', description: 'Date of physical installation' },
      { name: 'health_status', type: 'TEXT', constraints: 'NOT NULL DEFAULT "HEALTHY"', description: 'HEALTHY, ATTENTION, DEGRADING, OFFLINE' },
      { name: 'battery_level_pct', type: 'REAL', constraints: 'NOT NULL DEFAULT 100.0', description: 'Internal lithium battery pack percentage' },
      { name: 'firmware_version', type: 'TEXT', constraints: 'NOT NULL DEFAULT "v2.4.1"', description: 'Installed IoT firmware version' }
    ],
    indexes: ['idx_devices_zone ON devices(zone_id)', 'idx_devices_health ON devices(health_status)'],
    sampleRow: {
      device_id: 'FLUSH-A-03',
      zone_id: 'ZONE-CONCOURSE-A',
      device_type: 'FLUSHOMETER',
      model_name: 'KOHLER Tripoint Touchless Flushometer',
      serial_number: 'SN-KOH-2024-8849',
      installation_date: '2024-03-15',
      health_status: 'ATTENTION',
      battery_level_pct: 88.0,
      firmware_version: 'v2.4.1'
    }
  },
  {
    name: 'telemetry',
    description: 'High-frequency time-series telemetry frames recording instantaneous flow, flushes, and sensor health.',
    columns: [
      { name: 'telemetry_id', type: 'INTEGER', constraints: 'PRIMARY KEY AUTOINCREMENT', description: 'Monotonic sample identifier' },
      { name: 'timestamp', type: 'TIMESTAMP', constraints: 'NOT NULL DEFAULT CURRENT_TIMESTAMP', description: 'Universal UTC timestamp' },
      { name: 'device_id', type: 'TEXT', constraints: 'FOREIGN KEY -> devices(device_id)', description: 'Target fixture reference' },
      { name: 'water_flow_rate_lpm', type: 'REAL', constraints: 'NOT NULL', description: 'Instantaneous flow rate in Liters per minute' },
      { name: 'cumulative_water_liters', type: 'REAL', constraints: 'NOT NULL', description: 'Lifetime cumulative volume counter in Liters' },
      { name: 'flush_count_total', type: 'INTEGER', constraints: 'NOT NULL', description: 'Lifetime mechanical actuation count' },
      { name: 'faucet_activation_count', type: 'INTEGER', constraints: 'NOT NULL', description: 'Lifetime faucet optical cycle triggers' },
      { name: 'occupancy_detected', type: 'BOOLEAN', constraints: 'NOT NULL DEFAULT 0', description: 'PIR/TOF presence state' },
      { name: 'battery_level_pct', type: 'REAL', constraints: 'NOT NULL', description: 'Battery level percentage' },
      { name: 'sensor_status', type: 'TEXT', constraints: 'NOT NULL', description: 'Hardware diagnostic status: NORMAL, ERROR, DEGRADED' },
      { name: 'response_latency_ms', type: 'INTEGER', constraints: 'NOT NULL', description: 'Actuator response latency in milliseconds' },
      { name: 'error_count_24h', type: 'INTEGER', constraints: 'NOT NULL DEFAULT 0', description: 'Rolling 24-hour error count' }
    ],
    indexes: ['idx_telemetry_device_time ON telemetry(device_id, timestamp DESC)'],
    sampleRow: {
      telemetry_id: 14209,
      timestamp: '2026-09-18T15:32:00Z',
      device_id: 'FLUSH-A-03',
      water_flow_rate_lpm: 1.15,
      cumulative_water_liters: 4295.1,
      flush_count_total: 843,
      faucet_activation_count: 0,
      occupancy_detected: false,
      battery_level_pct: 86.9,
      sensor_status: 'NORMAL',
      response_latency_ms: 130,
      error_count_24h: 0
    }
  },
  {
    name: 'incidents',
    description: 'Structured anomalies flagged by rules/ML with diagnostic evidence and lifecycle state.',
    columns: [
      { name: 'incident_id', type: 'TEXT', constraints: 'PRIMARY KEY', description: 'Unique incident identifier (e.g., INC-20260918-004)' },
      { name: 'timestamp', type: 'TIMESTAMP', constraints: 'NOT NULL DEFAULT CURRENT_TIMESTAMP', description: 'Detection timestamp' },
      { name: 'device_id', type: 'TEXT', constraints: 'FOREIGN KEY -> devices(device_id)', description: 'Affected fixture reference' },
      { name: 'incident_type', type: 'TEXT', constraints: 'NOT NULL', description: 'CONTINUOUS_LEAK, SENSOR_FAILURE, TRAFFIC_SURGE, DEGRADATION' },
      { name: 'severity', type: 'TEXT', constraints: 'NOT NULL', description: 'Severity rank: LOW, MEDIUM, HIGH, CRITICAL' },
      { name: 'confidence_score', type: 'REAL', constraints: 'NOT NULL', description: 'Detection confidence probability (0.0 - 1.0)' },
      { name: 'flow_rate_lpm', type: 'REAL', constraints: 'NOT NULL', description: 'Anomaly flow rate at trigger' },
      { name: 'duration_minutes', type: 'REAL', constraints: 'NOT NULL', description: 'Continuous duration of anomalous state' },
      { name: 'estimated_water_loss_liters', type: 'REAL', constraints: 'NOT NULL', description: 'Trapezoidal integrated water loss' },
      { name: 'evidence_summary', type: 'TEXT', constraints: 'NOT NULL', description: 'Mathematical and sensor evidence string' },
      { name: 'ai_diagnosis', type: 'TEXT', constraints: '', description: 'Grounded LLM mechanical root cause analysis' },
      { name: 'recommended_action', type: 'TEXT', constraints: 'NOT NULL', description: 'Recommended technician intervention' },
      { name: 'status', type: 'TEXT', constraints: 'NOT NULL DEFAULT "OPEN"', description: 'State: OPEN, ACKNOWLEDGED, RESOLVED' },
      { name: 'resolved_at', type: 'TIMESTAMP', constraints: '', description: 'Timestamp when flow returned to 0.0 L/min' }
    ],
    indexes: ['idx_incidents_status ON incidents(status)', 'idx_incidents_device ON incidents(device_id)'],
    sampleRow: {
      incident_id: 'INC-20260918-004',
      timestamp: '2026-09-18T15:20:00Z',
      device_id: 'FLUSH-A-03',
      incident_type: 'CONTINUOUS_LEAK',
      severity: 'HIGH',
      confidence_score: 0.94,
      flow_rate_lpm: 1.15,
      duration_minutes: 14.2,
      estimated_water_loss_liters: 16.33,
      evidence_summary: 'Flow 1.15 L/min sustained across zero-occupancy interval (>90s). Z-score: 4.82.',
      ai_diagnosis: 'Diaphragm bypass orifice obstruction or deformed relief valve seal.',
      recommended_action: 'Inspect flushometer diaphragm assembly; flush supply line.',
      status: 'OPEN',
      resolved_at: null
    }
  },
  {
    name: 'maintenance_tickets',
    description: 'Operational work orders dispatched to MEP plumbing and custodial teams.',
    columns: [
      { name: 'ticket_id', type: 'TEXT', constraints: 'PRIMARY KEY', description: 'Work order identifier (e.g., TICK-2026-101)' },
      { name: 'incident_id', type: 'TEXT', constraints: 'UNIQUE NOT NULL, FOREIGN KEY -> incidents', description: 'Triggering incident link' },
      { name: 'assigned_team', type: 'TEXT', constraints: 'NOT NULL DEFAULT "MEP Plumbing Crew A"', description: 'Assigned crew classification' },
      { name: 'assigned_technician', type: 'TEXT', constraints: '', description: 'Named field technician' },
      { name: 'priority', type: 'TEXT', constraints: 'NOT NULL', description: 'P1_CRITICAL, P2_HIGH, P3_MEDIUM, P4_LOW' },
      { name: 'title', type: 'TEXT', constraints: 'NOT NULL', description: 'Work order summary title' },
      { name: 'description', type: 'TEXT', constraints: 'NOT NULL', description: 'Detailed diagnostic brief and SOP instructions' },
      { name: 'recommended_parts', type: 'TEXT', constraints: '', description: 'Replacement components (KOHLER Genuine Parts)' },
      { name: 'status', type: 'TEXT', constraints: 'NOT NULL DEFAULT "OPEN"', description: 'OPEN, ASSIGNED, ACKNOWLEDGED, IN_PROGRESS, RESOLVED' },
      { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Ticket creation timestamp' }
    ],
    indexes: ['idx_tickets_status ON maintenance_tickets(status)'],
    sampleRow: {
      ticket_id: 'TICK-2026-101',
      incident_id: 'INC-20260918-004',
      assigned_team: 'MEP Plumbing Crew A',
      assigned_technician: 'Dave Miller (Lead Journeyman)',
      priority: 'P1_CRITICAL',
      title: 'Continuous Leak Service - Stall #3 Diaphragm Assembly',
      description: 'Isolate supply stop, replace commercial diaphragm assembly GP1138930, verify 0.0 L/min standby flow.',
      recommended_parts: 'KOHLER Diaphragm Repair Kit GP1138930',
      status: 'ASSIGNED',
      created_at: '2026-09-18T15:21:00Z'
    }
  }
];

export const apiEndpoints: ApiEndpoint[] = [
  {
    method: 'POST',
    path: '/api/telemetry/ingest',
    category: 'Telemetry',
    summary: 'Ingest high-frequency telemetry packet, evaluate anomaly rules, update fixture cache, and persist to SQLite.',
    requestBody: `{
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
  "error_count_24h": 0
}`,
    responseBody: `{
  "status": "INGESTED",
  "telemetry_id": 14209,
  "anomaly_flag": true,
  "incident_generated": {
    "incident_id": "INC-20260918-004",
    "type": "CONTINUOUS_LEAK",
    "severity": "HIGH",
    "confidence": 0.94
  }
}`,
    errorResponses: [
      { status: 400, message: 'Invalid JSON or schema validation failure' },
      { status: 404, message: 'Referenced device_id does not exist' }
    ]
  },
  {
    method: 'GET',
    path: '/api/incidents',
    category: 'Incidents',
    summary: 'Retrieve all recorded incidents with optional filters by status, severity, and zone.',
    responseBody: `[
  {
    "incident_id": "INC-20260918-004",
    "device_id": "FLUSH-A-03",
    "incident_type": "CONTINUOUS_LEAK",
    "severity": "HIGH",
    "confidence_score": 0.94,
    "flow_rate_lpm": 1.15,
    "estimated_water_loss_liters": 16.33,
    "status": "OPEN",
    "ticket_id": "TICK-2026-101"
  }
]`,
    errorResponses: [
      { status: 500, message: 'Database query execution failure' }
    ]
  },
  {
    method: 'POST',
    path: '/api/copilot/chat',
    category: 'AI Copilot',
    summary: 'Submit conversational query to Facility Copilot grounded in real-time SQLite state.',
    requestBody: `{
  "message": "Why is water consumption unusually high in Concourse A today?",
  "zone_id": "ZONE-CONCOURSE-A"
}`,
    responseBody: `{
  "response": "Water consumption in Concourse A is elevated primarily due to an ongoing continuous leak in Stall #3 (Fixture FLUSH-A-03). The fixture has exhibited an uninterrupted flow of 1.15 L/min for 14.2 minutes, resulting in an estimated 16.33 Liters of lost water. Maintenance Ticket TICK-101 has already been dispatched.",
  "citations": [
    { "type": "incident", "id": "INC-20260918-004" },
    { "type": "ticket", "id": "TICK-2026-101" }
  ],
  "suggested_actions": ["View Ticket TICK-101", "Inspect Zone A Telemetry"]
}`,
    errorResponses: [
      { status: 429, message: 'Rate limit reached on AI inference' },
      { status: 500, message: 'AI model service unavailable (Triggered fallback response)' }
    ]
  },
  {
    method: 'POST',
    path: '/api/simulator/inject',
    category: 'Simulator',
    summary: 'Inject predefined scenario profile into active simulation loop.',
    requestBody: `{
  "scenario": "LEAK_CONTINUOUS",
  "target_device": "FLUSH-A-03"
}`,
    responseBody: `{
  "status": "SCENARIO_INJECTED",
  "scenario": "LEAK_CONTINUOUS",
  "target_device": "FLUSH-A-03",
  "expected_behavior": "Simulating stuck diaphragm seal (1.15 L/min flow during zero occupancy)."
}`,
    errorResponses: [
      { status: 400, message: 'Unknown scenario key' }
    ]
  }
];

export const dodChecklist: DodItem[] = [
  { id: 1, category: 'Core Setup', text: '1. Clone the repository cleanly from Git with zero missing submodules.', completed: true, verificationEvidence: 'Standard Git repository structure verified in Section 30.' },
  { id: 2, category: 'Core Setup', text: '2. Install all Python dependencies via requirements.txt with zero build errors.', completed: true, verificationEvidence: 'Locked requirements file with pre-compiled wheels verified in Section 31.' },
  { id: 3, category: 'Core Setup', text: '3. Configure the GEMINI_API_KEY environment variable securely in .env.', completed: true, verificationEvidence: '.env.example template configured with proper documentation.' },
  { id: 4, category: 'Core Setup', text: '4. Start the application cleanly on host 0.0.0.0 and port 3000.', completed: true, verificationEvidence: 'FastAPI / Vite development server starts with single command.' },
  { id: 5, category: 'Core Setup', text: '5. Open the dashboard and observe the Executive Command Center render at 60 FPS.', completed: true, verificationEvidence: 'High-contrast light layout rendered with responsive grid.' },
  { id: 6, category: 'Simulation & Detection', text: '6. Run the IoT simulator and observe the live 16-field telemetry stream updating every 2s.', completed: true, verificationEvidence: 'Verified in Screen 2 live telemetry graph.' },
  { id: 7, category: 'Simulation & Detection', text: '7. Trigger the "Simulate Leak" button in the demo control panel.', completed: true, verificationEvidence: 'One-click scenario injection endpoint /api/simulator/inject active.' },
  { id: 8, category: 'Simulation & Detection', text: '8. Observe automatic anomaly detection triggering in under 90 seconds.', completed: true, verificationEvidence: 'Tier 1 zero-occupancy sliding window logic flags anomaly in <90s.' },
  { id: 9, category: 'Simulation & Detection', text: '9. See real-time cumulative water-loss estimation (W = Q × Δt) accumulating in Liters.', completed: true, verificationEvidence: 'Trapezoidal integration engine updates real-time loss counter.' },
  { id: 10, category: 'AI & Dispatch', text: '10. Inspect the AI Incident Analyst explanation, root cause diagnosis, and uncertainty statement.', completed: true, verificationEvidence: 'Prompt P-02 executed with strict grounding guardrails.' },
  { id: 11, category: 'AI & Dispatch', text: '11. Observe automated maintenance ticket creation and assignment in Dispatch Kanban.', completed: true, verificationEvidence: 'P1 ticket auto-generated in maintenance_tickets table.' },
  { id: 12, category: 'Simulation & Detection', text: '12. Trigger the "Simulate Traffic Spike" scenario representing a 350-passenger flight arrival.', completed: true, verificationEvidence: 'Traffic surge scenario injector multiplies footfall and flush cycles.' },
  { id: 13, category: 'Simulation & Detection', text: '13. Observe the Hygiene Urgency Score surge and generate a dynamic cleaning request.', completed: true, verificationEvidence: 'Hygiene formula recalculates urgency to >85/100.' },
  { id: 14, category: 'Simulation & Detection', text: '14. Trigger "Simulate Device Degradation" and observe battery/latency drift warnings.', completed: true, verificationEvidence: 'Isolation Forest flags multi-variate latency/voltage anomaly.' },
  { id: 15, category: 'Simulation & Detection', text: '15. See device state transitions from HEALTHY to ATTENTION / DEGRADING.', completed: true, verificationEvidence: 'Fixture registry list updates visual status chips dynamically.' },
  { id: 16, category: 'AI & Dispatch', text: '16. Ask the Facility Copilot a conversational query and verify grounded answer with citations.', completed: true, verificationEvidence: 'Prompt P-03 retrieves SQLite state and cites specific incident IDs.' },
  { id: 17, category: 'Validation', text: '17. Inspect the Prompt Documentation guide containing all 6 production prompts.', completed: true, verificationEvidence: 'Section 19 and Prompt Studio provide complete prompt templates.' },
  { id: 18, category: 'Validation', text: '18. Understand how the architecture scales to real-world LoRaWAN/MQTT physical IoT gateways.', completed: true, verificationEvidence: 'Detailed architectural roadmap in Section 28 & 35.' }
];
