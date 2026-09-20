import { Device, Incident, PriorityLevel, IncidentType, TelemetryFrame, Zone } from '../types';

export interface DetectionResult {
  hasIncident: boolean;
  incident?: Partial<Incident>;
  detectionRule: string;
  evidence: {
    metric: string;
    value: number | string;
    threshold: number | string;
  }[];
}

/**
 * Deterministic Leak Detection Engine (PRD Section 3.2)
 * Evaluates continuous flow across zero-occupancy intervals.
 */
export function evaluateContinuousLeak(
  device: Device,
  zone: Zone,
  flowRateLpm: number,
  idleSeconds: number
): DetectionResult {
  // If flow > 0.15 L/min and zone is unoccupied or fixture idle for > 60 seconds
  const isLeaking = flowRateLpm > 0.15 && idleSeconds >= 30;

  if (!isLeaking) {
    return {
      hasIncident: false,
      detectionRule: 'Sliding-Window Zero-Occupancy Continuous Flow Rule',
      evidence: [
        { metric: 'Continuous Idle Flow Rate', value: `${flowRateLpm.toFixed(2)} L/min`, threshold: '0.15 L/min' },
        { metric: 'Idle Dwell Seconds', value: `${idleSeconds}s`, threshold: '30s' },
      ],
    };
  }

  // Determine Severity
  let severity: PriorityLevel = 'P3';
  let slaMinutes = 360; // 6 hours
  if (flowRateLpm > 10.0) {
    severity = 'P1';
    slaMinutes = 30;
  } else if (flowRateLpm > 1.5 || idleSeconds > 180) {
    severity = 'P2';
    slaMinutes = 120;
  }

  const dynamicScore = calculateDynamicPriorityScore(severity, flowRateLpm, zone.criticalityLevel, idleSeconds);

  return {
    hasIncident: true,
    detectionRule: 'Sliding-Window Continuous Non-Zero Flow during Restroom Idle State',
    incident: {
      type: 'CONTINUOUS_LEAK' as IncidentType,
      severity,
      title: flowRateLpm > 10 ? `CRITICAL: Major Uncontained Flushometer Rupture (${flowRateLpm.toFixed(1)} L/min)` : `Continuous Micro-Leak Detected (${flowRateLpm.toFixed(2)} L/min)`,
      description: `Continuous steady-state water loss observed on ${device.name} across ${idleSeconds} seconds of zero-occupancy state.`,
      estimatedWastageRateLpm: flowRateLpm,
      dynamicPriorityScore: dynamicScore,
      slaMinutes,
      slaDeadline: new Date(Date.now() + slaMinutes * 60000).toISOString(),
    },
    evidence: [
      { metric: 'Measured Continuous Flow', value: `${flowRateLpm.toFixed(2)} L/min`, threshold: '> 0.15 L/min' },
      { metric: 'Continuous Idle Duration', value: `${idleSeconds} seconds`, threshold: '≥ 30 seconds' },
      { metric: 'Zone Occupancy Detected', value: zone.occupancyDetected ? 'True' : 'False (Idle)', threshold: 'False' },
      { metric: 'Dynamic Priority Index', value: dynamicScore.toFixed(1), threshold: 'Score 0-100' },
    ],
  };
}

/**
 * Hygiene Demand Index (HDI) calculation formula (PRD Section 3.4)
 * Weights: Flushes (40%), Faucet Cycles (30%), Footfall (20%), Elapsed Time (10%)
 */
export function calculateHygieneDemandIndex(
  flushesSinceClean: number,
  faucetsSinceClean: number,
  footfallSinceClean: number,
  minutesSinceClean: number
): { hdi: number; status: 'OPTIMAL' | 'MODERATE' | 'CLEANING_REQUIRED' } {
  // Baseline targets for airport concourse restroom turn:
  // 25 flushes, 30 handwashes, 40 visitors, or 90 minutes
  const flushComponent = Math.min(1.0, flushesSinceClean / 25) * 40;
  const faucetComponent = Math.min(1.0, faucetsSinceClean / 30) * 30;
  const footfallComponent = Math.min(1.0, footfallSinceClean / 40) * 20;
  const timeComponent = Math.min(1.0, minutesSinceClean / 90) * 10;

  const rawHdi = flushComponent + faucetComponent + footfallComponent + timeComponent;
  const hdi = Math.round(Math.min(100, Math.max(0, rawHdi)));

  let status: 'OPTIMAL' | 'MODERATE' | 'CLEANING_REQUIRED' = 'OPTIMAL';
  if (hdi >= 85) {
    status = 'CLEANING_REQUIRED';
  } else if (hdi >= 65) {
    status = 'MODERATE';
  }

  return { hdi, status };
}

/**
 * Dynamic Priority Formula (PRD Section 4.1):
 * Score = 0.35 * SeverityScore + 0.30 * WastageRateScore + 0.20 * CriticalityScore + 0.15 * DwellScore
 */
export function calculateDynamicPriorityScore(
  severity: PriorityLevel,
  wastageRateLpm: number,
  criticality: string,
  dwellSeconds: number
): number {
  const sevScores: Record<PriorityLevel, number> = { P1: 100, P2: 75, P3: 50, P4: 25 };
  const sevScore = sevScores[severity] || 50;

  // Wastage rate normalized: 0 L/min = 0, 15+ L/min = 100
  const wasteScore = Math.min(100, (wastageRateLpm / 15) * 100);

  // Criticality weight
  let critScore = 50;
  if (criticality === 'CRITICAL_CONCOURSE') critScore = 100;
  else if (criticality === 'HIGH_GATE') critScore = 75;
  else critScore = 40;

  // Dwell score (0 to 300s -> 0 to 100)
  const dwellScore = Math.min(100, (dwellSeconds / 300) * 100);

  const total = 0.35 * sevScore + 0.30 * wasteScore + 0.20 * critScore + 0.15 * dwellScore;
  return Math.round(total * 10) / 10;
}

/**
 * Water Wastage & Sustainability Integrator
 */
export function calculateSustainabilityImpact(totalWastedLiters: number) {
  // Commercial municipal water + sewer average rate in India: ~₹0.32 / Liter (approx ₹320 per kL)
  const utilityCostRupees = totalWastedLiters * 0.32;
  const utilityCostDollars = totalWastedLiters * 0.0038;
  // Embodied potable water treatment carbon intensity: 0.0003 kg CO2e / Liter
  const carbonKg = totalWastedLiters * 0.0003;

  return {
    utilityCostRupees,
    utilityCostDollars,
    carbonKg,
    waterGallons: totalWastedLiters * 0.264172,
  };
}

/**
 * Battery Health Degradation Engine
 */
export function evaluateBatteryPrognostics(voltage: number): {
  healthScore: number;
  estimatedRemainingDays: number;
  recommendReplacement: boolean;
} {
  // Nominal 6V CR-P2 or 3V Lithium
  // Cutoff threshold: < 2.4V
  if (voltage >= 3.1) {
    return { healthScore: 98, estimatedRemainingDays: 720, recommendReplacement: false };
  } else if (voltage >= 2.9) {
    return { healthScore: 82, estimatedRemainingDays: 450, recommendReplacement: false };
  } else if (voltage >= 2.7) {
    return { healthScore: 60, estimatedRemainingDays: 180, recommendReplacement: false };
  } else if (voltage >= 2.4) {
    return { healthScore: 35, estimatedRemainingDays: 45, recommendReplacement: false };
  } else {
    return { healthScore: 12, estimatedRemainingDays: 7, recommendReplacement: true };
  }
}
