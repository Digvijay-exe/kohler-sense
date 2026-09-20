import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Facility,
  Zone,
  Device,
  TelemetryFrame,
  Incident,
  MaintenanceTicket,
  SustainabilityMetrics,
  SimulationScenario,
  CleaningEvent,
  ToastMessage,
} from '../../types';
import { initialFacilities, initialDevices } from '../../data/mockFacilities';
import { simulationScenarios } from '../../data/simulationScenarios';
import {
  evaluateContinuousLeak,
  calculateHygieneDemandIndex,
  calculateDynamicPriorityScore,
  calculateSustainabilityImpact,
} from '../../services/detectionEngine';
import { requestAiIncidentDiagnosis, AiDiagnosisResponse } from '../../services/aiReasoning';

import { FacilityZoneSelector } from './FacilityZoneSelector';
import { LiveTelemetryMonitor } from './LiveTelemetryMonitor';
import { IncidentDispatchManager } from './IncidentDispatchManager';
import { AiDiagnosticModal } from './AiDiagnosticModal';
import { ScenarioSimulatorModal } from './ScenarioSimulatorModal';
import { AiCopilotChat } from './AiCopilotChat';
import { EsgSustainabilityPanel } from './EsgSustainabilityPanel';
import { ToastContainer } from './ToastNotification';

import {
  Sparkles,
  Zap,
  Bot,
  Activity,
  Droplets,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  LayoutGrid,
  Radio,
  ClipboardList,
  Leaf,
  Layers,
} from 'lucide-react';

interface PrototypeContainerProps {
  isDarkMode?: boolean;
}

type ViewTab = 'ALL' | 'TELEMETRY' | 'INCIDENTS' | 'ZONES' | 'ESG';

export const PrototypeContainer: React.FC<PrototypeContainerProps> = ({ isDarkMode = false }) => {
  // Master Facilities & Zones State
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [selectedFacility, setSelectedFacility] = useState<Facility>(initialFacilities[0]);
  const [selectedZone, setSelectedZone] = useState<Zone>(initialFacilities[0].zones[0]);

  // View Tab Filter for seamless navigation
  const [activeViewTab, setActiveViewTab] = useState<ViewTab>('ALL');

  // Devices State for selected zone
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  // High-frequency telemetry stream buffer (last 30 samples)
  const [telemetryHistory, setTelemetryHistory] = useState<(TelemetryFrame & { timeLabel: string })[]>([]);
  const [isStreamActive, setIsStreamActive] = useState<boolean>(true);

  // Active Incidents & Work Order Tickets
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [cleaningEvents, setCleaningEvents] = useState<CleaningEvent[]>([]);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Simulation & Modals State
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // AI Diagnostic Modal State
  const [selectedIncidentForAi, setSelectedIncidentForAi] = useState<Incident | null>(null);
  const [aiDiagnosis, setAiDiagnosis] = useState<AiDiagnosisResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Cumulative Sustainability Metrics
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState<SustainabilityMetrics>({
    totalWaterConsumedLiters: 48200,
    totalWaterWastedLiters: 14.2,
    totalWaterSavedLiters: 12450,
    utilitySavingsRupees: 3984.00,
    utilitySavingsDollars: 47.31,
    carbonAvoidedKg: 3.73,
    activeLeaksCount: 0,
    averageMttdSeconds: 42,
    averageMttrMinutes: 38,
    hygieneComplianceRatePercent: 99.4,
  });

  // Calculate active wastage in L/min
  const activeWastageLpm = devices.reduce(
    (sum, d) => (d.currentFlowRateLpm > 0.15 ? sum + d.currentFlowRateLpm : sum),
    0
  );
  const activeLeaksCount = devices.filter((d) => d.currentFlowRateLpm > 0.15).length;

  // Real-time Ingestion Loop (1000ms clock ticker)
  useEffect(() => {
    if (!isStreamActive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString();

      // 1. Update device states slightly & compute aggregate flow
      setDevices((prevDevices) => {
        return prevDevices.map((dev) => {
          const flow = dev.currentFlowRateLpm;
          let idleSecs = dev.idleContinuousFlowSeconds;

          // If fixture is currently leaking, accumulate idle seconds
          if (flow > 0.15) {
            idleSecs += 1;
          } else {
            idleSecs = 0;
          }

          return {
            ...dev,
            currentFlowRateLpm: flow,
            idleContinuousFlowSeconds: idleSecs,
            lastTelemetryTimestamp: now.toISOString(),
          };
        });
      });

      // 2. Append new frame to waveform history buffer
      setTelemetryHistory((prev) => {
        const totalFlow = devices.reduce((s, d) => s + d.currentFlowRateLpm, 0);
        const avgPressure = devices[0]?.currentPressureBar || 4.1;

        const newFrame: TelemetryFrame & { timeLabel: string } = {
          deviceId: devices[0]?.id || 'dev-wm-109',
          timestamp: now.toISOString(),
          flowRateLpm: Number(totalFlow.toFixed(2)),
          pressureBar: Number(avgPressure.toFixed(2)),
          flushCount: devices[0]?.cumulativeFlushes || 0,
          occupancyDetected: selectedZone.occupancyDetected,
          batteryVoltage: devices[0]?.batteryVoltage || 3.1,
          ambientVibrationG: 0.02,
          signalDbm: -68,
          errorFlags: [],
          timeLabel,
        };

        const updated = [...prev, newFrame];
        return updated.slice(-30);
      });

      // 3. Evaluate Detection Engine for continuous leaks on all fixtures
      devices.forEach((dev) => {
        if (dev.currentFlowRateLpm > 0.15 && dev.idleContinuousFlowSeconds >= 10) {
          // Check if incident already exists for this device
          setIncidents((currentIncidents) => {
            const existing = currentIncidents.find(
              (inc) =>
                inc.deviceId === dev.id &&
                (inc.status === 'ACTIVE' || inc.status === 'DISPATCHED' || inc.status === 'IN_PROGRESS')
            );

            const wastedLitersIncrement = dev.currentFlowRateLpm / 60;

            if (existing) {
              // Update cumulative loss
              return currentIncidents.map((inc) =>
                inc.id === existing.id
                  ? {
                      ...inc,
                      cumulativeWastageLiters: inc.cumulativeWastageLiters + wastedLitersIncrement,
                      dynamicPriorityScore: calculateDynamicPriorityScore(
                        inc.severity,
                        dev.currentFlowRateLpm,
                        selectedZone.criticalityLevel,
                        dev.idleContinuousFlowSeconds
                      ),
                    }
                  : inc
              );
            }

            // Create new Incident via Detection Engine
            const detection = evaluateContinuousLeak(
              dev,
              selectedZone,
              dev.currentFlowRateLpm,
              dev.idleContinuousFlowSeconds
            );

            if (detection.hasIncident && detection.incident) {
              const newInc: Incident = {
                id: `inc-${Date.now()}-${dev.id}`,
                deviceId: dev.id,
                zoneId: selectedZone.id,
                facilityId: selectedFacility.id,
                type: detection.incident.type || 'CONTINUOUS_LEAK',
                severity: detection.incident.severity || 'P2',
                status: 'ACTIVE',
                detectedAt: now.toISOString(),
                title: detection.incident.title || `Leak Detected on ${dev.name}`,
                description: detection.incident.description || 'Sliding window continuous flow detected.',
                rootCauseHypothesis: 'Sub-surface diaphragm weep or debris obstruction in pilot bleed hole.',
                confidenceScore: 0.94,
                estimatedWastageRateLpm: dev.currentFlowRateLpm,
                cumulativeWastageLiters: wastedLitersIncrement,
                dynamicPriorityScore: detection.incident.dynamicPriorityScore || 75,
                slaMinutes: detection.incident.slaMinutes || 120,
                slaDeadline: detection.incident.slaDeadline || new Date(Date.now() + 120 * 60000).toISOString(),
              };

              addToast({
                type: 'error',
                title: `Telemetry Alert: ${newInc.title}`,
                description: `${dev.name} continuous idle flow (${dev.currentFlowRateLpm.toFixed(2)} L/min) triggered autonomous incident response.`,
              });

              return [newInc, ...currentIncidents];
            }

            return currentIncidents;
          });

          // Accumulate water wastage in sustainability metrics
          setSustainabilityMetrics((prev) => {
            const addedWastage = dev.currentFlowRateLpm / 60;
            const newWasted = prev.totalWaterWastedLiters + addedWastage;
            const impact = calculateSustainabilityImpact(newWasted);

            return {
              ...prev,
              totalWaterWastedLiters: newWasted,
              utilitySavingsRupees: impact.utilityCostRupees,
              utilitySavingsDollars: impact.utilityCostDollars,
              carbonAvoidedKg: impact.carbonKg,
            };
          });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreamActive, devices, selectedZone, selectedFacility]);

  // Handle Actuation simulation (Flush / Wash hands)
  const handleSimulateActuation = (deviceId: string, type: 'FLUSH' | 'FAUCET') => {
    const targetDev = devices.find((d) => d.id === deviceId);

    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const flow = type === 'FLUSH' ? (d.type === 'URINAL' ? 0.9 : 4.8) : 1.9;
          return {
            ...d,
            currentFlowRateLpm: flow,
            cumulativeFlushes: d.cumulativeFlushes + 1,
            cumulativeFlowLiters: d.cumulativeFlowLiters + (type === 'FLUSH' ? 4.8 : 0.8),
          };
        }
        return d;
      })
    );

    addToast({
      type: 'info',
      title: `${type === 'FLUSH' ? 'Flush Actuation' : 'Faucet Stream'} Simulated`,
      description: `Discharged ${type === 'FLUSH' ? '4.8L' : '1.9 L/min'} hydraulic cycle on ${
        targetDev?.name || 'fixture'
      }.`,
    });

    // Increment Zone traffic metrics & recalculate HDI
    setSelectedZone((prev) => {
      const flushes = type === 'FLUSH' ? prev.stallFlushesToday + 1 : prev.stallFlushesToday;
      const faucets = type === 'FAUCET' ? prev.faucetActivationsToday + 1 : prev.faucetActivationsToday;
      const footfall = prev.footfallCountToday + 1;

      const { hdi, status } = calculateHygieneDemandIndex(
        flushes,
        faucets,
        footfall,
        prev.minutesSinceClean
      );

      return {
        ...prev,
        stallFlushesToday: flushes,
        faucetActivationsToday: faucets,
        footfallCountToday: footfall,
        currentHdi: hdi,
        status,
      };
    });

    // Reset flow back to 0 after pulse duration (3.5s for flush, 8s for faucet)
    const pulseDuration = type === 'FLUSH' ? 3500 : 8000;
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((d) => {
          if (d.id === deviceId && d.idleContinuousFlowSeconds === 0) {
            return { ...d, currentFlowRateLpm: 0.0 };
          }
          return d;
        })
      );
    }, pulseDuration);
  };

  // Inject manual fault on fixture
  const handleInjectFault = (
    deviceId: string,
    faultType: 'MICRO_LEAK' | 'RUNAWAY_LEAK' | 'LOW_BATTERY' | 'RESET'
  ) => {
    const targetDev = devices.find((d) => d.id === deviceId);

    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          if (faultType === 'MICRO_LEAK') {
            return {
              ...d,
              status: 'WARNING',
              currentFlowRateLpm: 0.75,
              idleContinuousFlowSeconds: 15,
            };
          } else if (faultType === 'RUNAWAY_LEAK') {
            return {
              ...d,
              status: 'CRITICAL',
              currentFlowRateLpm: 18.0,
              idleContinuousFlowSeconds: 20,
            };
          } else if (faultType === 'LOW_BATTERY') {
            return {
              ...d,
              status: 'WARNING',
              batteryVoltage: 2.12,
              batteryPercentage: 14,
            };
          } else {
            return {
              ...d,
              status: 'NORMAL',
              currentFlowRateLpm: 0.0,
              idleContinuousFlowSeconds: 0,
            };
          }
        }
        return d;
      })
    );

    if (faultType === 'RESET') {
      addToast({
        type: 'success',
        title: 'Fixture Restored to Nominal',
        description: `${targetDev?.name || 'Fixture'} flow set to 0.0 L/min and clear state.`,
      });
    } else {
      addToast({
        type: 'warning',
        title: `Simulated Fault Injected: ${faultType.replace('_', ' ')}`,
        description: `Applied ${
          faultType === 'MICRO_LEAK' ? '0.75 L/min leak' : faultType === 'RUNAWAY_LEAK' ? '18.0 L/min burst' : 'low battery'
        } on ${targetDev?.name || 'fixture'}.`,
      });
    }
  };

  // Trigger Custodial Cleaning Protocol (Resets HDI)
  const handleTriggerCleanEvent = (zoneId: string) => {
    const prevHdi = selectedZone.currentHdi;

    setSelectedZone((prev) => ({
      ...prev,
      currentHdi: 0,
      minutesSinceClean: 0,
      lastCleanedAt: new Date().toISOString(),
      status: 'OPTIMAL',
    }));

    const cleanEvt: CleaningEvent = {
      id: `clean-${Date.now()}`,
      zoneId,
      facilityId: selectedFacility.id,
      timestamp: new Date().toISOString(),
      staffName: 'Maria Santos (Custodial Lead)',
      triggerType: prevHdi >= 85 ? 'HYGIENE_DEMAND_INDEX' : 'MANUAL',
      hdiBefore: prevHdi,
      hdiAfter: 0,
      durationMinutes: 12,
    };

    setCleaningEvents((prev) => [cleanEvt, ...prev]);

    addToast({
      type: 'success',
      title: 'Custodial Sanitation Verified',
      description: `Hygiene Demand Index reset from ${prevHdi}% to 0% (Optimal) for ${selectedZone.name}.`,
    });
  };

  // Load and execute simulation scenario
  const handleSelectScenario = (scenario: SimulationScenario) => {
    setActiveScenario(scenario);

    // Apply scenario parameters
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === scenario.targetDeviceId) {
          return {
            ...d,
            currentFlowRateLpm: scenario.parameters.flowRateLpm,
            currentPressureBar: scenario.parameters.pressureBar,
            batteryVoltage: scenario.parameters.batteryVoltage,
            idleContinuousFlowSeconds: scenario.parameters.flowRateLpm > 0.15 ? 35 : 0,
            status:
              scenario.parameters.flowRateLpm > 10
                ? 'CRITICAL'
                : scenario.parameters.flowRateLpm > 0
                ? 'WARNING'
                : 'NORMAL',
          };
        }
        return d;
      })
    );

    setSelectedZone((prev) => {
      let hdi = prev.currentHdi;
      let status = prev.status;

      if (scenario.category === 'HYGIENE' || scenario.parameters.footfallBurst) {
        hdi = 88;
        status = 'CLEANING_REQUIRED';
      }

      return {
        ...prev,
        occupancyDetected: scenario.parameters.occupancy,
        currentHdi: hdi,
        status,
      };
    });

    addToast({
      type: 'info',
      title: `Scenario Loaded: ${scenario.title}`,
      description: `${scenario.category} scenario active. Target flow: ${scenario.parameters.flowRateLpm.toFixed(1)} L/min.`,
    });
  };

  // Open AI Diagnostic Modal
  const handleOpenAiDiagnostic = async (incident: Incident) => {
    setSelectedIncidentForAi(incident);
    setAiDiagnosis(null);
    setIsAiLoading(true);

    const dev = devices.find((d) => d.id === incident.deviceId) || devices[0];
    const res = await requestAiIncidentDiagnosis(incident, dev, selectedZone, telemetryHistory);

    setAiDiagnosis(res);
    setIsAiLoading(false);
  };

  // Dispatch Maintenance Work Order
  const handleDispatchTicket = (incidentId: string, customSpec?: AiDiagnosisResponse) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (!inc) return;

    const parts = customSpec?.recommendedParts?.length
      ? customSpec.recommendedParts.map((p) => ({
          ...p,
          inStock: true,
          priceInr: p.priceInr || (p.sku === 'K-1067341' ? 3850 : p.sku === 'K-1032402' ? 1450 : p.sku === 'K-89010' ? 950 : 450),
        }))
      : inc.estimatedWastageRateLpm > 10
      ? [
          { sku: 'K-1067341', name: 'Kohler Flushometer Solenoid Assembly', quantity: 1, inStock: true, priceInr: 3850 },
          { sku: 'K-1032402', name: 'EPDM Diaphragm Rebuild Kit', quantity: 1, inStock: true, priceInr: 1450 },
        ]
      : [
          { sku: 'K-1032402', name: 'EPDM Diaphragm Rebuild Kit', quantity: 1, inStock: true, priceInr: 1450 },
          { sku: 'K-4567-01', name: 'Viton O-Ring Kit', quantity: 1, inStock: true, priceInr: 450 },
        ];

    const newTicket: MaintenanceTicket = {
      id: `WO-${Date.now().toString().slice(-5)}`,
      incidentId: inc.id,
      zoneId: inc.zoneId,
      deviceId: inc.deviceId,
      title: `Emergency Repair: ${inc.title}`,
      priority: inc.severity,
      assignedCrew: {
        name: inc.severity === 'P1' ? 'David Vance (Master Plumber)' : 'John Miller (Commercial Field Tech)',
        role: inc.severity === 'P1' ? 'Licensed Commercial Plumber' : 'Facility Maintenance Specialist',
        phone: '+1 (415) 890-4122',
        avatarInitials: 'DV',
      },
      createdAt: new Date().toISOString(),
      slaDeadline: inc.slaDeadline,
      status: 'DISPATCHED',
      recommendedParts: parts,
      workInstructions: [
        'Close manual isolation control stop behind wall flange.',
        'Relieve hydraulic pressure by actuating manual override button.',
        'Unscrew bonnet cap using spud wrench; inspect diaphragm assembly for debris or tear.',
        'Replace with genuine Kohler OEM parts specified in work order.',
        'Slowly reopen control stop; monitor telemetry stream for 180s idle verification.',
      ],
      safetyNotes: 'Caution: Line operates at 4.0 bar. Wear protective eye gear during bonnet removal.',
      telemetryVerificationStatus: 'PENDING',
    };

    setTickets((prev) => [newTicket, ...prev]);

    setIncidents((prev) =>
      prev.map((i) => (i.id === inc.id ? { ...i, status: 'DISPATCHED', ticketId: newTicket.id } : i))
    );

    addToast({
      type: 'success',
      title: `Work Order ${newTicket.id} Dispatched`,
      description: `Assigned to ${newTicket.assignedCrew.name}. Parts staged from Kohler facility inventory.`,
    });
  };

  // Update ticket workflow status
  const handleUpdateTicketStatus = (ticketId: string, status: 'IN_PROGRESS' | 'RESOLVED') => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );

    setIncidents((prev) =>
      prev.map((i) => {
        const ticket = tickets.find((t) => t.id === ticketId);
        if (ticket && i.id === ticket.incidentId) {
          return { ...i, status };
        }
        return i;
      })
    );

    // If technician marks resolved, reset fixture flow to simulate successful physical repair
    if (status === 'RESOLVED') {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (ticket) {
        setDevices((prev) =>
          prev.map((d) => {
            if (d.id === ticket.deviceId) {
              return {
                ...d,
                status: 'NORMAL',
                currentFlowRateLpm: 0.0,
                idleContinuousFlowSeconds: 0,
              };
            }
            return d;
          })
        );
      }

      addToast({
        type: 'info',
        title: `Work Order ${ticketId} Repaired`,
        description: 'Physical repair completed by technician. Ready for closed-loop telemetry audit.',
      });
    } else {
      addToast({
        type: 'info',
        title: `Work Order ${ticketId} In Progress`,
        description: 'Technician on site and inspecting plumbing assembly.',
      });
    }
  };

  // Closed-loop Telemetry Verification
  const handleVerifyClosedLoop = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const dev = devices.find((d) => d.id === ticket.deviceId);
    const isNominal = dev ? dev.currentFlowRateLpm === 0.0 : true;

    if (isNominal) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                status: 'VERIFIED',
                telemetryVerificationStatus: 'VERIFIED',
                verificationTelemetry: {
                  observedFlowLpm: 0.0,
                  observedPressureBar: 4.1,
                  idleConfirmedSeconds: 180,
                },
              }
            : t
        )
      );

      setIncidents((prev) =>
        prev.map((i) =>
          i.id === ticket.incidentId
            ? {
                ...i,
                status: 'VERIFIED',
                verifiedAt: new Date().toISOString(),
              }
            : i
        )
      );

      addToast({
        type: 'success',
        title: 'Closed-Loop Telemetry Audit Verified!',
        description: `Autonomous validation confirmed 0.0 L/min flow over 180s idle window. Work Order ${ticketId} officially closed.`,
      });
    } else {
      addToast({
        type: 'error',
        title: 'Verification Failed: Flow Persists',
        description: `Telemetry detected ${dev?.currentFlowRateLpm.toFixed(2)} L/min still flowing. Reopening inspection.`,
      });
    }
  };

  // Reset entire dashboard state to nominal
  const handleResetAllToNominal = () => {
    setDevices(
      initialDevices.map((d) => ({
        ...d,
        status: 'NORMAL',
        currentFlowRateLpm: 0.0,
        idleContinuousFlowSeconds: 0,
      }))
    );
    setSelectedZone((prev) => ({
      ...prev,
      currentHdi: 18,
      status: 'OPTIMAL',
      stallFlushesToday: 42,
      faucetActivationsToday: 38,
      footfallCountToday: 55,
      minutesSinceClean: 15,
    }));
    setActiveScenario(null);

    addToast({
      type: 'info',
      title: 'Facility Reset to Nominal',
      description: 'Cleared all simulated leaks, reset continuous idle timers, and restored baseline flow.',
    });
  };

  const pendingIncidentsCount = incidents.filter((i) => i.status !== 'VERIFIED').length;

  return (
    <div id="prototype-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar: Kohler Signature Mission Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#111111] text-white rounded-2xl p-6 shadow-xl border border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#c29b38] via-[#d4af37] to-zinc-700" />
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="bg-[#c29b38] text-black text-[11px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase flex items-center gap-1 shadow-2xs">
              <Zap className="w-3 h-3 text-black" /> Kohler Sense IoT
            </span>
            <span className="text-zinc-400 text-xs">
              KOHLER-MITWPU Commercial AI Engineering Track
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
            Commercial Smart Facility & Sustainability Manager
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-3xl leading-relaxed">
            Kohler autonomous 6-stage telemetry processing architecture:{' '}
            <span className="font-mono text-[#d4af37] font-semibold">
              Sense ➔ Detect ➔ Predict ➔ Prioritize ➔ Dispatch ➔ Measure
            </span>
            . High-frequency water flow monitoring, deterministic leak detection, and closed-loop work order verification.
          </p>
        </div>

        {/* Quick Launch Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="launch-scenarios-btn"
            onClick={() => setIsScenarioModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#c29b38] hover:bg-[#b08928] text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-black" />
            Launch 20 Scenarios
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="launch-copilot-btn"
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#c29b38]" />
            {isCopilotOpen ? 'Hide Copilot' : 'Ask AI Copilot'}
          </motion.button>
        </div>
      </motion.div>

      {/* Guided Interactive Showcase Strip (Quick Testing Actions) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-[#c29b38]/20 flex items-center justify-center text-[#c29b38]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-white font-sans">
              Instant Interaction Showcase
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              One-click simulation actions to experience autonomous event cascades:
            </div>
          </div>
        </div>

        {/* Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSimulateActuation(devices[0]?.id || 'dev-wm-101', 'FLUSH')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            Simulate Flush
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleInjectFault(devices[1]?.id || 'dev-wm-102', 'MICRO_LEAK')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-[#d4af37] border border-amber-300 dark:border-amber-800/80 hover:bg-amber-100 dark:hover:bg-amber-900/60 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Inject Micro-Leak
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleInjectFault(devices[0]?.id || 'dev-wm-101', 'RUNAWAY_LEAK')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80 hover:bg-rose-100 dark:hover:bg-rose-900/60 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Simulate P1 Runaway Solenoid
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTriggerCleanEvent(selectedZone.id)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Verify Cleaning
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetAllToNominal}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1 cursor-pointer transition-colors"
            title="Reset all flow to 0.0 L/min"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Nominal
          </motion.button>
        </div>
      </motion.div>

      {/* Segmented View Mode Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-2 font-mono">
            View Mode:
          </span>

          <button
            onClick={() => setActiveViewTab('ALL')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewTab === 'ALL'
                ? 'bg-black dark:bg-[#c29b38] text-white dark:text-black shadow-2xs'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            All Modules
          </button>

          <button
            onClick={() => setActiveViewTab('TELEMETRY')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewTab === 'TELEMETRY'
                ? 'bg-black dark:bg-[#c29b38] text-white dark:text-black shadow-2xs'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-sky-500" />
            Live Telemetry & Fixtures
          </button>

          <button
            onClick={() => setActiveViewTab('INCIDENTS')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewTab === 'INCIDENTS'
                ? 'bg-black dark:bg-[#c29b38] text-white dark:text-black shadow-2xs'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-rose-500" />
            Incident Pipeline
            {pendingIncidentsCount > 0 && (
              <span className="text-[10px] bg-rose-600 text-white font-black px-1.5 py-0.2 rounded-full">
                {pendingIncidentsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveViewTab('ZONES')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewTab === 'ZONES'
                ? 'bg-black dark:bg-[#c29b38] text-white dark:text-black shadow-2xs'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            Restroom Zones
          </button>

          <button
            onClick={() => setActiveViewTab('ESG')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewTab === 'ESG'
                ? 'bg-black dark:bg-[#c29b38] text-white dark:text-black shadow-2xs'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-500" />
            ESG Sustainability
          </button>
        </div>

        {/* Live status badge */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Ingestion Clock Active</span>
        </div>
      </div>

      {/* Main Content Animated Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeViewTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Module 1: Facility & Restroom Zone Hierarchy Selector */}
          {(activeViewTab === 'ALL' || activeViewTab === 'ZONES') && (
            <FacilityZoneSelector
              facilities={facilities}
              selectedFacility={selectedFacility}
              selectedZone={selectedZone}
              onSelectFacility={(fac) => {
                setSelectedFacility(fac);
                setSelectedZone(fac.zones[0]);
                addToast({
                  type: 'info',
                  title: `Switched Facility: ${fac.name}`,
                  description: `Now monitoring ${fac.totalRestrooms} restrooms and ${fac.totalFixtures} fixtures.`,
                });
              }}
              onSelectZone={(zone) => {
                setSelectedZone(zone);
                addToast({
                  type: 'info',
                  title: `Selected Zone: ${zone.name}`,
                  description: `${zone.floor} • HDI ${zone.currentHdi}% • ${zone.deviceIds.length} Fixtures`,
                });
              }}
              activeLeaksCount={activeLeaksCount}
              activeWastageLpm={activeWastageLpm}
            />
          )}

          {/* Module 2: Live IoT Telemetry Monitor, Waveforms & Fixture Board */}
          {(activeViewTab === 'ALL' || activeViewTab === 'TELEMETRY') && (
            <LiveTelemetryMonitor
              selectedZone={selectedZone}
              devices={devices}
              telemetryHistory={telemetryHistory}
              isStreamActive={isStreamActive}
              isDarkMode={isDarkMode}
              onToggleStream={() => {
                setIsStreamActive(!isStreamActive);
                addToast({
                  type: 'info',
                  title: !isStreamActive ? 'Ingestion Stream Resumed' : 'Ingestion Stream Paused',
                  description: !isStreamActive ? 'Telemetry updates running at 1000ms.' : 'Telemetry updates paused.',
                });
              }}
              onSimulateActuation={handleSimulateActuation}
              onInjectFault={handleInjectFault}
              onTriggerCleanEvent={handleTriggerCleanEvent}
              activeWastageLpm={activeWastageLpm}
            />
          )}

          {/* Module 3: Incident Prioritization & Maintenance Dispatch Pipeline */}
          {(activeViewTab === 'ALL' || activeViewTab === 'INCIDENTS') && (
            <IncidentDispatchManager
              incidents={incidents}
              tickets={tickets}
              onOpenAiDiagnostic={handleOpenAiDiagnostic}
              onDispatchTicket={(incId) => handleDispatchTicket(incId)}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onVerifyClosedLoop={handleVerifyClosedLoop}
            />
          )}

          {/* Module 4: Executive ESG & Sustainability Panel */}
          {(activeViewTab === 'ALL' || activeViewTab === 'ESG') && (
            <EsgSustainabilityPanel
              metrics={sustainabilityMetrics}
              facilityName={selectedFacility.name}
              onExportReport={() => {
                addToast({
                  type: 'success',
                  title: 'ESG Audit Report Exported',
                  description: 'Markdown executive report generated and downloaded.',
                });
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 20 Production Scenarios Modal */}
      <ScenarioSimulatorModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        onSelectScenario={handleSelectScenario}
        activeScenarioId={activeScenario?.id || null}
      />

      {/* AI Diagnostic Modal */}
      <AiDiagnosticModal
        incident={selectedIncidentForAi}
        device={devices.find((d) => d.id === selectedIncidentForAi?.deviceId)}
        zone={selectedZone}
        diagnosis={aiDiagnosis}
        isLoading={isAiLoading}
        onClose={() => setSelectedIncidentForAi(null)}
        onDispatchWithSpec={(incId, diag) => handleDispatchTicket(incId, diag)}
      />

      {/* AI Copilot Chat (Modal & Floating trigger) */}
      <AiCopilotChat
        facility={selectedFacility}
        selectedZone={selectedZone}
        activeLeaksCount={activeLeaksCount}
        activeWastageLpm={activeWastageLpm}
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onOpen={() => setIsCopilotOpen(true)}
      />

      {/* Floating Animated Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
