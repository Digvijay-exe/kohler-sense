import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "KOHLER SENSE API Gateway",
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Diagnostic & Root Cause Analysis endpoint
app.post("/api/diagnose", async (req, res) => {
  try {
    const { incident, telemetryHistory, device, zone } = req.body;

    const client = getGeminiClient();
    if (client) {
      const prompt = `You are the lead IoT Plumbing Diagnostic AI for KOHLER SENSE Commercial Facility Manager.
Analyze the following physical plumbing incident and return a structured JSON response.

INCIDENT CONTEXT:
- Type: ${incident?.type || 'UNKNOWN'}
- Severity: ${incident?.severity || 'P2'}
- Device: ${device?.name || 'Commercial Fixture'} (${device?.type || 'Flushometer'}, Model: ${device?.model || 'Kohler K-10673'})
- Zone: ${zone?.name || 'Concourse A Restroom'} (Facility: ${zone?.facility || 'Airport Terminal 2'})
- Current Flow: ${incident?.estimatedWastageRateLpm || 0} L/min
- Occupancy: ${telemetryHistory?.[telemetryHistory.length - 1]?.occupancyDetected ? 'Occupied' : 'Vacant (0 passengers)'}
- Telemetry snippet: ${JSON.stringify(telemetryHistory?.slice(-5) || [])}

TASK:
Provide a rigorous technical diagnosis in valid JSON with these exact keys:
{
  "rootCauseHypothesis": "Concise technical explanation of physical failure mode",
  "confidenceScore": 0.94,
  "failureMechanism": "e.g. Debris blockage in bypass orifice / Solenoid plunger sticking / Diaphragm perforation",
  "recommendedAction": "Clear step-by-step resolution directive for field technician",
  "recommendedParts": [
    { "sku": "K-XXXXX", "name": "Kohler Genuine Part Name", "quantity": 1 }
  ],
  "estimatedRepairTimeMinutes": 25,
  "safetyPrecautions": "e.g. Isolate supply shutoff valve before disassembling bonnet.",
  "recommendedRole": "Licensed Commercial Plumber"
}`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim();
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return res.json({ success: true, diagnosis: parsed, source: 'gemini-2.5-flash' });
        } catch {
          // fallback if json parse error
        }
      }
    }

    // Deterministic Rule-Engine Fallback (Kohler OEM Domain Knowledge)
    const fallbackDiagnosis = generateDeterministicDiagnosis(incident, device);
    return res.json({ success: true, diagnosis: fallbackDiagnosis, source: 'deterministic-rule-engine' });
  } catch (error: any) {
    console.error('Error in /api/diagnose:', error);
    const fallbackDiagnosis = generateDeterministicDiagnosis(req.body.incident, req.body.device);
    return res.json({ success: true, diagnosis: fallbackDiagnosis, source: 'deterministic-fallback', errorNote: error.message });
  }
});

// AI Facility Copilot Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, facilityContext } = req.body;
    const client = getGeminiClient();

    if (client) {
      const systemPrompt = `You are the KOHLER SENSE Facility Copilot, an expert AI assistant specialized in commercial plumbing IoT operations, smart restroom sustainability, and maintenance dispatch for airports, hospitals, and universities.
You speak with professional authority, precision, and practical actionable clarity.
Always reference specific Kohler fixtures (Touchless K-10673, Tripoint Wave Faucets, High-Efficiency Urinals), telemetry data (L/min, bar pressure, HDI score), and operational best practices.

CURRENT FACILITY CONTEXT:
${JSON.stringify(facilityContext, null, 2)}

User Question: ${message}`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
        config: {
          temperature: 0.4,
        },
      });

      return res.json({
        success: true,
        reply: response.text?.trim() || "Kohler Sense Copilot analyzed the facility status. All telemetry streams are nominal.",
        source: 'gemini-2.5-flash',
      });
    }

    // Deterministic conversational fallback
    const fallbackReply = generateDeterministicChatReply(message, facilityContext);
    return res.json({
      success: true,
      reply: fallbackReply,
      source: 'deterministic-rule-engine',
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const fallbackReply = generateDeterministicChatReply(req.body.message, req.body.facilityContext);
    return res.json({
      success: true,
      reply: fallbackReply,
      source: 'deterministic-fallback',
      errorNote: error.message,
    });
  }
});

// Deterministic rule-based diagnosis generator
function generateDeterministicDiagnosis(incident: any, device: any) {
  const type = incident?.type || 'CONTINUOUS_LEAK';
  if (type === 'CONTINUOUS_LEAK') {
    const flow = incident?.estimatedWastageRateLpm || 1.2;
    if (flow > 10) {
      return {
        rootCauseHypothesis: "Catastrophic Flushometer Solenoid Seizure or Diaphragm Rupture in open bypass position.",
        confidenceScore: 0.98,
        failureMechanism: "Solenoid armature stuck in energized position or foreign particulate jamming main bleed valve orifice.",
        recommendedAction: "Immediately close manual isolation stop-valve behind escutcheon plate. Disassemble bonnet, inspect diaphragm assembly, flush line, and replace solenoid cartridge.",
        recommendedParts: [
          { sku: "K-1067341", name: "Kohler Commercial Flushometer Solenoid Valve Assembly", quantity: 1 },
          { sku: "K-1032402", name: "High-Efficiency Diaphragm Rebuild Kit (1.28 GPF)", quantity: 1 }
        ],
        estimatedRepairTimeMinutes: 25,
        safetyPrecautions: "Depressurize line before hex cap removal. Wear safety glasses for potential 4.5 bar back-spray.",
        recommendedRole: "Commercial Plumber"
      };
    }
    return {
      rootCauseHypothesis: "Sub-surface diaphragm weep or sediment accumulation in solenoid relief orifice.",
      confidenceScore: 0.92,
      failureMechanism: "Micro-fissure in EPDM rubber diaphragm or mineral scale calcification along valve seat.",
      recommendedAction: "Perform isolation inspection. Inspect bypass orifice for scale; replace diaphragm assembly with genuine Kohler chemical-resistant kit.",
      recommendedParts: [
        { sku: "K-1032402", name: "Kohler Dual-Filtered EPDM Diaphragm Kit", quantity: 1 },
        { sku: "K-4567-01", name: "Viton O-Ring & Vacuum Breaker Gasket Kit", quantity: 1 }
      ],
      estimatedRepairTimeMinutes: 15,
      safetyPrecautions: "Turn control stop clockwise until water stops. Relieve residual pressure.",
      recommendedRole: "Facility Maintenance Technician"
    };
  } else if (type === 'HYGIENE_THRESHOLD_EXCEEDED') {
    return {
      rootCauseHypothesis: "Elevated Footfall Accumulation exceeding Hygiene Demand Index (HDI) threshold.",
      confidenceScore: 0.99,
      failureMechanism: "Peak traffic window generated cumulative stall flushes and faucet activations above sanitation safety limits.",
      recommendedAction: "Dispatch custodial team for immediate Turnaround Sanitize Protocol: restock consumables, wipe touchpoints, sanitize stall handles, disinfect counter surfaces.",
      recommendedParts: [
        { sku: "CL-501", name: "Hospital-Grade Quaternary Disinfectant Solution", quantity: 1 },
        { sku: "PP-204", name: "Kohler Touchless Paper Towel Roll Refill", quantity: 4 }
      ],
      estimatedRepairTimeMinutes: 12,
      safetyPrecautions: "Place 'Restroom Temporarily Closed for Sanitization' sign at threshold. Use nitrile gloves.",
      recommendedRole: "Janitorial Lead / Sanitation Crew"
    };
  } else if (type === 'DEVICE_DEGRADATION') {
    return {
      rootCauseHypothesis: "Lithium Power Cell Depletion and Sensor Window Optical Degradation.",
      confidenceScore: 0.95,
      failureMechanism: "Internal cell voltage dropped below 2.2V threshold; IR optical beam transmission reduced by micro-abrasions.",
      recommendedAction: "Replace internal 6V CR-P2 industrial lithium battery pack. Clean IR emitter lens with isopropyl alcohol wipe.",
      recommendedParts: [
        { sku: "K-89010", name: "Kohler Industrial 6V CR-P2 Lithium Battery Pack", quantity: 1 },
        { sku: "K-3341-LENS", name: "Tripoint IR Optical Protective Window Kit", quantity: 1 }
      ],
      estimatedRepairTimeMinutes: 10,
      safetyPrecautions: "Observe correct polarity when inserting lithium pack. Verify LED sync flash.",
      recommendedRole: "IoT Systems Technician"
    };
  }

  return {
    rootCauseHypothesis: "Atypical sensor telemetry variance requiring on-site diagnostic verification.",
    confidenceScore: 0.85,
    failureMechanism: "Sensor drift or mechanical actuation flutter detected by statistical anomaly engine.",
    recommendedAction: "Inspect fixture physically, check wiring harness, verify water pressure at gauge, and run manual test actuation.",
    recommendedParts: [
      { sku: "K-10673-GEN", name: "Kohler Commercial Sensor Diagnostic Tool", quantity: 1 }
    ],
    estimatedRepairTimeMinutes: 20,
    safetyPrecautions: "Check supply pressure before loosening fittings.",
    recommendedRole: "Commercial Plumber"
  };
}

function generateDeterministicChatReply(message: string, context: any) {
  const q = (message || '').toLowerCase();
  if (q.includes('leak') || q.includes('water waste') || q.includes('wastage')) {
    const wasted = context?.activeWastageLpm || 0;
    return `Currently, the Kohler Sense telemetry engine is tracking ${wasted.toFixed(1)} L/min of water flow across active fixtures. ` +
      `Our sliding-window leak detection pipeline integrates volumetric loss in real time. For uncontained leaks, Kohler Sense triggers automated P1 dispatch with genuine Kohler OEM repair SKUs (K-1067341 / K-1032402) to contain water loss within the target < 90-second SLA.`;
  }
  if (q.includes('hygiene') || q.includes('clean') || q.includes('hdi')) {
    return `The Hygiene Demand Index (HDI) dynamically weights stall flushes (40%), touchless handwashes (30%), zone footfall (20%), and elapsed time since last verified sanitation (10%). When any zone crosses 80%, a Smart Cleaning Ticket is dispatched to custodial crews. Upon completion, staff badge scan or sensor idle verification resets the index.`;
  }
  if (q.includes('battery') || q.includes('health') || q.includes('degradation')) {
    return `Kohler Sense continuously monitors sensor battery discharge curves and solenoid actuation response times. Any device exhibiting cell voltage < 2.4V or abnormal actuation latency is scheduled for predictive replacement before guest-facing failure occurs.`;
  }
  if (q.includes('esg') || q.includes('sustainability') || q.includes('carbon') || q.includes('savings')) {
    return `Through proactive continuous leak mitigation and demand-based flush calibration, Kohler Sense delivers up to 35% reduction in commercial restroom water losses. Each 1,000 liters of treated municipal water saved prevents 0.3 kg of Scope 2 CO₂ equivalent emissions while lowering municipal water and sewer utility tariffs.`;
  }
  return `Kohler Sense Operational Copilot is actively monitoring all commercial facilities. All IoT telemetry feeds—including high-frequency flow rate, flush counts, continuous leak signals, zone occupancy, and sensor diagnostics—are evaluated deterministically every second. How can I assist with your facility management today?`;
}

// Vite middleware & Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KOHLER SENSE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
