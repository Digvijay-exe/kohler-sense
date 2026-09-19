import React, { useState } from 'react';
import { 
  Radio, 
  Activity, 
  BrainCircuit, 
  Sliders, 
  Send, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Code2
} from 'lucide-react';

interface PipelineStage {
  id: string;
  step: number;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  summary: string;
  keyTech: string[];
  latencyTarget: string;
  failureFallback: string;
  mathFormula?: string;
  sampleInput: string;
  sampleOutput: string;
}

export const ArchitectureVisualizer: React.FC = () => {
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-1');

  const stages: PipelineStage[] = [
    {
      id: 'stage-1',
      step: 1,
      label: 'Sense',
      sublabel: 'High-Frequency IoT Simulator',
      icon: <Radio className="w-5 h-5 text-sky-600" />,
      summary: 'Generates 16-field synthetic telemetry packets (flow, flushes, battery, latency, errors) at 1–5s intervals across 8 fixtures in 2 terminal concourse zones.',
      keyTech: ['Python Simulator', 'FastAPI Ingestion', 'Sliding Window FIFO Buffer'],
      latencyTarget: '< 20ms per packet',
      failureFallback: 'Cached fixture state retains last valid reading; timestamps trigger timeout warnings.',
      sampleInput: `{
  "facility_id": "FAC-AIRPORT-T2",
  "zone_id": "ZONE-CONCOURSE-A",
  "device_id": "FLUSH-A-03",
  "water_flow_rate_lpm": 1.15,
  "occupancy_detected": false,
  "battery_level_pct": 87.5
}`,
      sampleOutput: `{
  "status": "BUFFERED",
  "window_size": 30,
  "flow_trend": "Sustained positive",
  "zero_occupancy_duration_sec": 94
}`
    },
    {
      id: 'stage-2',
      step: 2,
      label: 'Detect',
      sublabel: 'Deterministic Rules & Statistical ML',
      icon: <Activity className="w-5 h-5 text-amber-600" />,
      summary: 'Executes 3-tier hybrid detection: Tier 1 zero-occupancy flow rules, Tier 2 rolling Z-scores (|Z| > 3.0), and Tier 3 multi-variate Isolation Forest.',
      keyTech: ['NumPy/Pandas', 'Rolling Z-Score', 'Scikit-Learn Isolation Forest'],
      latencyTarget: '< 50ms evaluation tick',
      failureFallback: 'Rule-based physics gates execute independently if ML feature scaler encounters missing data.',
      mathFormula: 'Z_t = \\frac{x_t - \\mu_w}{\\sigma_w + \\epsilon} > 3.2 \\implies \\text{Statistical Anomaly}',
      sampleInput: `{
  "device_id": "FLUSH-A-03",
  "flow_history_30s": [1.14, 1.15, 1.15, 1.16],
  "occupancy_history": [false, false, false, false]
}`,
      sampleOutput: `{
  "anomaly_flag": true,
  "tier_triggered": "TIER_1_ZERO_OCCUPANCY_FLOW",
  "flow_rate_lpm": 1.15,
  "duration_seconds": 94,
  "z_score": 4.82,
  "confidence": 0.94
}`
    },
    {
      id: 'stage-3',
      step: 3,
      label: 'Predict',
      sublabel: 'Hygiene Urgency & Device Degradation',
      icon: <BrainCircuit className="w-5 h-5 text-indigo-600" />,
      summary: 'Calculates dynamic traffic-weighted Hygiene Urgency Score (0-100) and tracks progressive actuator latency drift and battery starvation.',
      keyTech: ['Dynamic Urgency Formula', 'Moving Average Latency Trend', 'Isolation Forest Anomaly Scoring'],
      latencyTarget: '< 30ms calculation',
      failureFallback: 'Reverts to static time-elapsed threshold (every 60 mins) if occupancy sensor is offline.',
      mathFormula: 'U_{hygiene} = \\min\\left(100, \\; 0.35\\frac{N_f}{150} + 0.30\\frac{T_e}{180} + 0.20\\frac{F_a}{200} + 0.15 I_s\\right)',
      sampleInput: `{
  "zone_id": "ZONE-CONCOURSE-A",
  "flushes_since_cleaning": 142,
  "minutes_since_cleaning": 115,
  "current_surge_factor": 0.85
}`,
      sampleOutput: `{
  "hygiene_urgency_score": 88.4,
  "status": "URGENT",
  "recommended_action": "Dispatch custodial turnover crew before threshold 90 is breached."
}`
    },
    {
      id: 'stage-4',
      step: 4,
      label: 'Prioritize',
      sublabel: 'Explainable Glass-Box Priority Engine',
      icon: <Sliders className="w-5 h-5 text-purple-600" />,
      summary: 'Combines Severity, Estimated Water Wastage, Passenger Footfall, and Model Confidence into a transparent, explainable operational priority score (0-100).',
      keyTech: ['Multi-Criteria Decision Analysis', 'Glass-Box Explainer', 'SLA Router'],
      latencyTarget: '< 10ms calculation',
      failureFallback: 'Direct mapping of Severity enum (CRITICAL -> P1, HIGH -> P2) if traffic metrics unavailable.',
      mathFormula: 'P = 0.35 S_{severity} + 0.30 W_{wastage} + 0.20 F_{footfall} + 0.15 C_{confidence}',
      sampleInput: `{
  "incident_severity": "HIGH",
  "water_loss_liters": 16.33,
  "zone_footfall_pct": 75.0,
  "confidence": 0.94
}`,
      sampleOutput: `{
  "priority_score": 82.3,
  "priority_tier": "P1_CRITICAL",
  "target_sla_minutes": 30,
  "breakdown": { "severity": 26.25, "wastage": 9.8, "footfall": 15.0, "confidence": 14.1 }
}`
    },
    {
      id: 'stage-5',
      step: 5,
      label: 'Dispatch',
      sublabel: 'Grounded AI Analyst & Work Order Router',
      icon: <Send className="w-5 h-5 text-emerald-600" />,
      summary: 'Google Gemini API ingests structured evidence JSON, generates grounded mechanical root cause analysis, and auto-dispatches maintenance tickets to MEP crews.',
      keyTech: ['Google Gemini API (response_schema)', 'Pydantic Validator', 'SQLite Ticket Lifecycle'],
      latencyTarget: '< 3.0s reasoning cycle',
      failureFallback: 'Deterministic Python fallback engine generates standardized work order if LLM API encounters timeout or 503 error.',
      sampleInput: `{
  "incident_id": "INC-20260918-004",
  "device_id": "FLUSH-A-03",
  "model": "KOHLER Tripoint Flushometer",
  "flow_rate_lpm": 1.15,
  "loss_liters": 16.33
}`,
      sampleOutput: `{
  "ticket_id": "TICK-2026-101",
  "diagnosis": "Diaphragm bypass obstruction or deformed relief seal.",
  "assigned_team": "MEP Plumbing Crew A",
  "recommended_part": "KOHLER Diaphragm Kit GP1138930",
  "status": "ASSIGNED"
}`
    },
    {
      id: 'stage-6',
      step: 6,
      label: 'Measure',
      sublabel: 'Sustainability Command & Avoided Loss ROI',
      icon: <BarChart3 className="w-5 h-5 text-teal-600" />,
      summary: 'Calculates real-time volumetric water loss ($W = \\int Q dt$) and Avoided Water Loss compared against 48-hour manual discovery benchmarks for LEED/ESG compliance.',
      keyTech: ['Trapezoidal Integrator', 'Avoided Loss Modeling', 'LEED v4.1 WE Export'],
      latencyTarget: '< 100ms analytics refresh',
      failureFallback: 'Static baseline profiles preserved in SQLite for offline executive auditing.',
      mathFormula: 'W_{avoided} = Q_{leak} \\times (T_{manual\\_discovery} - T_{sense\\_resolution})',
      sampleInput: `{
  "incident_leak_rate_lpm": 1.15,
  "elapsed_to_resolution_minutes": 25,
  "manual_benchmark_minutes": 2880
}`,
      sampleOutput: `{
  "actual_liters_lost": 28.75,
  "unmitigated_benchmark_liters": 3312.0,
  "net_avoided_water_loss_liters": 3283.25,
  "co2e_abatement_kg": 0.42
}`
    }
  ];

  const currentStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 mb-2">
          <Layers className="w-3.5 h-3.5 text-slate-700" />
          <span>Core System Philosophy</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          The 6-Stage Sense-to-Measure Architectural Pipeline
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl mt-1.5 font-normal">
          KOHLER SENSE strictly separates low-latency deterministic detection from cognitive AI reasoning. The LLM is never placed in the critical path of raw numerical math, guaranteeing zero hallucinations and 100% offline resilience.
        </p>
      </div>

      {/* Interactive Horizontal Pipeline Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {stages.map((stage) => {
          const isSelected = stage.id === selectedStageId;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Step {stage.step}
                </span>
                <div className={`p-1 rounded-md ${isSelected ? 'bg-white/10' : 'bg-slate-100'}`}>
                  {stage.icon}
                </div>
              </div>

              <div className="font-bold text-sm tracking-tight">{stage.label}</div>
              <div className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                {stage.sublabel}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep-Dive Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              {currentStage.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pipeline Stage {currentStage.step} of 6
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Target Latency: {currentStage.latencyTarget}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {currentStage.label} — {currentStage.sublabel}
              </h3>
            </div>
          </div>
        </div>

        {/* Narrative & Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Functional Overview
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {currentStage.summary}
              </p>
            </div>

            {currentStage.mathFormula && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Core Mathematical Formula
                </div>
                <code className="text-xs font-mono text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block overflow-x-auto">
                  {currentStage.mathFormula}
                </code>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Key Technologies & Algorithms
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentStage.keyTech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>Deterministic Offline Fallback Strategy</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                {currentStage.failureFallback}
              </p>
            </div>
          </div>

          {/* Code/Data Contract Explorer */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <Code2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Incoming Payload Contract</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">JSON</span>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-40 border border-slate-800">
                {currentStage.sampleInput}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stage Output Transformation</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">JSON</span>
              </div>
              <pre className="bg-slate-950 text-emerald-400 p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-40 border border-slate-800">
                {currentStage.sampleOutput}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
