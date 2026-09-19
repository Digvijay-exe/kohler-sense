import { Incident, Device, Zone, TelemetryFrame } from '../types';

export interface AiDiagnosisResponse {
  rootCauseHypothesis: string;
  confidenceScore: number;
  failureMechanism: string;
  recommendedAction: string;
  recommendedParts: {
    sku: string;
    name: string;
    quantity: number;
    inStock?: boolean;
  }[];
  estimatedRepairTimeMinutes: number;
  safetyPrecautions: string;
  recommendedRole: string;
  source: 'gemini-2.5-flash' | 'deterministic-rule-engine' | 'deterministic-fallback';
}

export async function requestAiIncidentDiagnosis(
  incident: Partial<Incident>,
  device: Device,
  zone: Zone,
  telemetryHistory: TelemetryFrame[]
): Promise<AiDiagnosisResponse> {
  try {
    const res = await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        incident,
        device,
        zone,
        telemetryHistory: telemetryHistory.slice(-8),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.diagnosis) {
        return {
          ...data.diagnosis,
          source: data.source || 'gemini-2.5-flash',
          recommendedParts: (data.diagnosis.recommendedParts || []).map((p: any) => ({
            ...p,
            inStock: true,
          })),
        };
      }
    }
  } catch (err) {
    console.warn('Backend /api/diagnose unreachable, using client-side deterministic diagnostic engine:', err);
  }

  // Client-side deterministic Kohler OEM fallback
  return getClientSideFallbackDiagnosis(incident, device);
}

export async function sendCopilotChatMessage(
  message: string,
  facilityContext: Record<string, any>
): Promise<{ reply: string; source: string }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, facilityContext }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return { reply: data.reply, source: data.source || 'gemini-2.5-flash' };
      }
    }
  } catch (err) {
    console.warn('Backend /api/chat unreachable, using fallback copilot reply:', err);
  }

  return {
    reply: getClientSideFallbackReply(message, facilityContext),
    source: 'deterministic-rule-engine',
  };
}

function getClientSideFallbackDiagnosis(incident: Partial<Incident>, device: Device): AiDiagnosisResponse {
  const type = incident.type || 'CONTINUOUS_LEAK';
  const flow = incident.estimatedWastageRateLpm || 1.2;

  if (type === 'CONTINUOUS_LEAK') {
    if (flow > 8) {
      return {
        rootCauseHypothesis: 'Catastrophic Solenoid Plunger Seizure in Wide-Open Bypass Position',
        confidenceScore: 0.98,
        failureMechanism: 'Particulate obstruction jammed solenoid armature; main bleed valve unable to equalize hydraulic pilot pressure.',
        recommendedAction: 'Isolate control stop valve immediately. Disassemble bonnet, flush line for 10s, inspect valve seat, and replace solenoid cartridge assembly.',
        recommendedParts: [
          { sku: 'K-1067341', name: 'Kohler Tripoint DC Solenoid Valve Assembly', quantity: 1, inStock: true },
          { sku: 'K-1032402', name: 'Commercial Diaphragm Rebuild Kit (1.28 GPF)', quantity: 1, inStock: true },
        ],
        estimatedRepairTimeMinutes: 25,
        safetyPrecautions: 'Depressurize supply line before hex cap removal. Wear eye protection against potential 4.0 bar back-spray.',
        recommendedRole: 'Licensed Commercial Plumber',
        source: 'deterministic-rule-engine',
      };
    }

    return {
      rootCauseHypothesis: 'Sub-surface Diaphragm Perforation or Scale-Fouled Relief Orifice',
      confidenceScore: 0.92,
      failureMechanism: 'Degraded EPDM rubber diaphragm weeping through flexure tears; bypass orifice partially clogged with mineral calcite.',
      recommendedAction: 'Isolate control stop. Remove brass bonnet, inspect bypass orifice, clean seat, and install genuine Kohler chemical-resistant dual-filter diaphragm.',
      recommendedParts: [
        { sku: 'K-1032402', name: 'Kohler EPDM Dual-Filtered Diaphragm Kit', quantity: 1, inStock: true },
        { sku: 'K-4567-01', name: 'Viton O-Ring & Vacuum Breaker Gasket Kit', quantity: 1, inStock: true },
      ],
      estimatedRepairTimeMinutes: 15,
      safetyPrecautions: 'Turn stop valve clockwise until firmly seated. Relieve line pressure by triggering manual bypass button.',
      recommendedRole: 'Facility Maintenance Technician',
      source: 'deterministic-rule-engine',
    };
  }

  if (type === 'HYGIENE_THRESHOLD_EXCEEDED') {
    return {
      rootCauseHypothesis: 'Restroom Sanitation Saturation — Hygiene Demand Index (HDI) Exceeded 85%',
      confidenceScore: 0.99,
      failureMechanism: 'Flight passenger deplaning burst generated cumulative footfall, stall flushes, and handwashes exceeding safe hygiene thresholds.',
      recommendedAction: 'Dispatch custodial sanitation squad for Level-1 Turnaround Sanitization: disinfect high-touch stall latches, restock paper & soap, wipe lavatory counters.',
      recommendedParts: [
        { sku: 'CL-501', name: 'Hospital-Grade Disinfectant Solution (5L Concentrate)', quantity: 1, inStock: true },
        { sku: 'PP-204', name: 'Kohler Touchless Paper Towel Roll (Pack of 6)', quantity: 1, inStock: true },
        { sku: 'SP-101', name: 'Kohler Foam Soap Refill 1000ml Pouch', quantity: 2, inStock: true },
      ],
      estimatedRepairTimeMinutes: 12,
      safetyPrecautions: 'Deploy floor signage: "Caution Wet Floor / Sanitization in Progress". Wear PPE gloves.',
      recommendedRole: 'Custodial Sanitation Lead',
      source: 'deterministic-rule-engine',
    };
  }

  if (type === 'DEVICE_DEGRADATION') {
    return {
      rootCauseHypothesis: 'Industrial Lithium Power Cell Voltage Degradation (< 2.2V)',
      confidenceScore: 0.95,
      failureMechanism: 'Internal cell resistance increased due to lifecycle aging; operating voltage dropped below sensor microcontroller stability threshold.',
      recommendedAction: 'Unscrew security screw on battery compartment. Replace with fresh Kohler 6V CR-P2 industrial lithium pack. Observe confirmation LED blink sequence.',
      recommendedParts: [
        { sku: 'K-89010', name: 'Kohler Industrial 6V CR-P2 Lithium Battery Pack', quantity: 1, inStock: true },
        { sku: 'K-3341-LENS', name: 'Tripoint IR Lens Protective Seal', quantity: 1, inStock: true },
      ],
      estimatedRepairTimeMinutes: 10,
      safetyPrecautions: 'Verify polarity alignment. Do not mix new and used battery cells.',
      recommendedRole: 'IoT Systems Technician',
      source: 'deterministic-rule-engine',
    };
  }

  return {
    rootCauseHypothesis: 'Atypical Telemetry Flow Pattern Detected by Statistical Anomaly Engine',
    confidenceScore: 0.88,
    failureMechanism: 'Actuation duration or hydraulic profile departed > 3.0 standard deviations from baseline rolling profile.',
    recommendedAction: 'Perform physical inspection of fixture, check supply line pressure, verify sensor window cleanliness, and test manual override actuation.',
    recommendedParts: [
      { sku: 'K-10673-DIAG', name: 'Kohler Commercial Sensor Diagnostic Tool', quantity: 1, inStock: true },
    ],
    estimatedRepairTimeMinutes: 20,
    safetyPrecautions: 'Check supply pressure gauge before loosening fittings.',
    recommendedRole: 'Facility Maintenance Technician',
    source: 'deterministic-rule-engine',
  };
}

function getClientSideFallbackReply(message: string, context: any): string {
  const q = (message || '').toLowerCase();
  if (q.includes('leak') || q.includes('waste') || q.includes('water')) {
    const wasted = context?.activeWastageLpm || 0;
    return `The Kohler Sense real-time telemetry engine is continuously tracking water flow across all restrooms. When continuous flow is detected without stall occupancy for > 60s, our sliding-window algorithm immediately logs an incident and dispatches a work order with genuine Kohler replacement parts (K-1032402 / K-1067341) to contain water loss.`;
  }
  if (q.includes('hygiene') || q.includes('clean') || q.includes('hdi')) {
    return `The Hygiene Demand Index (HDI) dynamically tracks stall flushes (40%), faucet handwashes (30%), door footfall (20%), and minutes since last clean (10%). Whenever a zone exceeds 85%, a Smart Custodial Dispatch is generated automatically.`;
  }
  if (q.includes('scenario') || q.includes('test') || q.includes('simulate')) {
    return `You can trigger any of the 20 comprehensive test scenarios directly from the Scenario Simulator panel. Each scenario tests specific failure modes such as Continuous Micro-Leaks, Solenoid Runaway Leaks, Flight Deplaning Surges, and Low-Battery Degradation.`;
  }
  return `Kohler Sense Copilot is active. All airport terminal, hospital, and university restroom zones are being continuously monitored for water conservation, fixture health, and hygiene compliance. You can inspect live telemetry, trigger maintenance work orders, or run diagnostic scenarios.`;
}
