export interface PrdSection {
  id: number;
  slug: string;
  title: string;
  category: 'Strategy & Overview' | 'Architecture & Tech' | 'AI & ML Intelligence' | 'IoT & Data Processing' | 'Operations & Dispatch' | 'Validation & Governance';
  readTimeMinutes: number;
  summary: string;
  content: string;
  keyTakeaways?: string[];
}

export interface FeatureSpec {
  id: string;
  name: string;
  category: string;
  purpose: string;
  inputs: string[];
  processing: string;
  outputs: string[];
  acceptanceCriteria: string[];
  mvpStatus: 'Core MVP' | 'Demonstrable' | 'Future V2';
}

export interface PromptTemplate {
  id: string;
  name: string;
  purpose: string;
  inputs: string[];
  expectedOutput: string;
  systemPrompt: string;
  userPromptTemplate: string;
  sampleInput: Record<string, unknown>;
  sampleOutput: string;
  guardrails: string[];
  failureBehavior: string;
}

export interface DatabaseTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints: string;
    description: string;
  }[];
  indexes: string[];
  sampleRow: Record<string, unknown>;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  category: string;
  summary: string;
  requestBody?: string;
  responseBody: string;
  errorResponses: { status: number; message: string }[];
}

export interface DodItem {
  id: number;
  text: string;
  category: 'Core Setup' | 'Simulation & Detection' | 'AI & Dispatch' | 'Validation';
  completed: boolean;
  verificationEvidence: string;
}

// ==========================================
// KOHLER SENSE PROTOTYPE OPERATIONAL MODELS
// ==========================================

export type DeviceType = 'FLUSHOMETER' | 'FAUCET' | 'URINAL' | 'MAIN_METER' | 'OCCUPANCY_SENSOR';
export type DeviceStatus = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'MAINTENANCE';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  zoneId: string;
  facilityId: string;
  model: string;
  installationDate: string;
  status: DeviceStatus;
  batteryPercentage: number;
  batteryVoltage: number; // e.g. 3.0V nominal, < 2.4V warning
  firmwareVersion: string;
  currentFlowRateLpm: number;
  currentPressureBar: number;
  cumulativeFlushes: number;
  cumulativeFlowLiters: number;
  idleContinuousFlowSeconds: number;
  lastTelemetryTimestamp: string;
  lastCleanedTimestamp?: string;
}

export interface Zone {
  id: string;
  facilityId: string;
  name: string;
  type: 'RESTROOM_MENS' | 'RESTROOM_WOMENS' | 'RESTROOM_ALL_GENDER' | 'RESTROOM_ACCESSIBLE';
  terminalOrWing: string;
  floor: string;
  criticalityLevel: 'CRITICAL_CONCOURSE' | 'HIGH_GATE' | 'STANDARD_LANDSIDE';
  occupancyCount: number;
  occupancyDetected: boolean;
  currentHdi: number; // Hygiene Demand Index: 0 - 100%
  footfallCountToday: number;
  stallFlushesToday: number;
  faucetActivationsToday: number;
  lastCleanedAt: string;
  minutesSinceClean: number;
  status: 'OPTIMAL' | 'MODERATE' | 'CLEANING_REQUIRED';
  deviceIds: string[];
}

export interface Facility {
  id: string;
  name: string;
  type: 'AIRPORT_TERMINAL' | 'HOSPITAL' | 'UNIVERSITY_CAMPUS';
  location: string;
  totalRestrooms: number;
  totalFixtures: number;
  zones: Zone[];
}

export interface TelemetryFrame {
  deviceId: string;
  timestamp: string;
  flowRateLpm: number;
  pressureBar: number;
  flushCount: number;
  occupancyDetected: boolean;
  batteryVoltage: number;
  ambientVibrationG: number;
  signalDbm: number;
  errorFlags: string[];
}

export type IncidentType =
  | 'CONTINUOUS_LEAK'
  | 'ABNORMAL_FLOW'
  | 'HYGIENE_THRESHOLD_EXCEEDED'
  | 'DEVICE_DEGRADATION'
  | 'WATER_HAMMER'
  | 'SENSOR_OCCLUSION';

export type PriorityLevel = 'P1' | 'P2' | 'P3' | 'P4';
export type IncidentStatus = 'ACTIVE' | 'DISPATCHED' | 'IN_PROGRESS' | 'RESOLVED' | 'VERIFIED';

export interface Incident {
  id: string;
  deviceId: string;
  zoneId: string;
  facilityId: string;
  type: IncidentType;
  severity: PriorityLevel;
  status: IncidentStatus;
  detectedAt: string;
  title: string;
  description: string;
  rootCauseHypothesis: string;
  confidenceScore: number;
  estimatedWastageRateLpm: number;
  cumulativeWastageLiters: number;
  dynamicPriorityScore: number; // Calculated using PRD formula: 0.35*Sev + 0.30*Wastage + 0.20*Criticality + 0.15*Dwell
  slaMinutes: number;
  slaDeadline: string;
  ticketId?: string;
  resolvedAt?: string;
  verifiedAt?: string;
}

export interface MaintenanceTicket {
  id: string;
  incidentId: string;
  zoneId: string;
  deviceId: string;
  title: string;
  priority: PriorityLevel;
  assignedCrew: {
    name: string;
    role: string;
    phone: string;
    avatarInitials: string;
  };
  createdAt: string;
  slaDeadline: string;
  status: 'DISPATCHED' | 'IN_PROGRESS' | 'RESOLVED' | 'VERIFIED';
  recommendedParts: {
    sku: string;
    name: string;
    quantity: number;
    inStock: boolean;
  }[];
  workInstructions: string[];
  safetyNotes: string;
  telemetryVerificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED';
  verificationTelemetry?: {
    observedFlowLpm: number;
    observedPressureBar: number;
    idleConfirmedSeconds: number;
  };
}

export interface CleaningEvent {
  id: string;
  zoneId: string;
  facilityId: string;
  timestamp: string;
  staffName: string;
  triggerType: 'HYGIENE_DEMAND_INDEX' | 'SCHEDULED' | 'MANUAL';
  hdiBefore: number;
  hdiAfter: number;
  durationMinutes: number;
}

export interface SustainabilityMetrics {
  totalWaterConsumedLiters: number;
  totalWaterWastedLiters: number;
  totalWaterSavedLiters: number;
  utilitySavingsDollars: number;
  carbonAvoidedKg: number;
  activeLeaksCount: number;
  averageMttdSeconds: number; // Mean Time to Detect
  averageMttrMinutes: number; // Mean Time to Resolve
  hygieneComplianceRatePercent: number;
}

export interface SimulationScenario {
  id: number;
  title: string;
  category: 'LEAK' | 'TRAFFIC' | 'HARDWARE' | 'HYGIENE' | 'EXTREME';
  description: string;
  targetDeviceId: string;
  targetZoneId: string;
  parameters: {
    flowRateLpm: number;
    occupancy: boolean;
    durationSeconds: number;
    pressureBar: number;
    batteryVoltage: number;
    footfallBurst?: number;
  };
  expectedDetection: {
    incidentType: IncidentType;
    maxDetectionLatencySeconds: number;
    targetSeverity: PriorityLevel;
    expectedParts: string[];
  };
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  source?: 'gemini-2.5-flash' | 'deterministic-rule-engine' | 'deterministic-fallback';
  metadata?: {
    relatedIncidentId?: string;
    recommendedActions?: string[];
  };
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  timestamp?: string;
}

