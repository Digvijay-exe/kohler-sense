import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Incident, MaintenanceTicket, PriorityLevel } from '../../types';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Wrench,
  Sparkles,
  Bot,
  ExternalLink,
  ShieldAlert,
  Droplets,
  Send,
} from 'lucide-react';

interface Props {
  incidents: Incident[];
  tickets: MaintenanceTicket[];
  onOpenAiDiagnostic: (incident: Incident) => void;
  onDispatchTicket: (incidentId: string) => void;
  onUpdateTicketStatus: (ticketId: string, status: 'IN_PROGRESS' | 'RESOLVED') => void;
  onVerifyClosedLoop: (ticketId: string) => void;
}

export const IncidentDispatchManager: React.FC<Props> = ({
  incidents,
  tickets,
  onOpenAiDiagnostic,
  onDispatchTicket,
  onUpdateTicketStatus,
  onVerifyClosedLoop,
}) => {
  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'P1':
        return (
          <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
            P1 CRITICAL
          </span>
        );
      case 'P2':
        return (
          <span className="bg-[#c29b38] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            P2 HIGH
          </span>
        );
      case 'P3':
        return (
          <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            P3 MEDIUM
          </span>
        );
      case 'P4':
        return (
          <span className="bg-zinc-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            P4 LOW
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
            UNASSIGNED
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-[#d4af37] border border-amber-200 dark:border-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
            CREW DISPATCHED
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="bg-[#c29b38]/15 dark:bg-[#c29b38]/20 text-zinc-900 dark:text-[#d4af37] border border-[#c29b38]/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
            IN PROGRESS
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
            AWAITING VERIFICATION
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> CLOSED LOOP VERIFIED
          </span>
        );
      default:
        return (
          <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] px-2 py-0.5 rounded-md">
            {status}
          </span>
        );
    }
  };

  return (
    <div id="incident-dispatch-manager" className="space-y-4">
      {/* Header bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
      >
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-rose-500/15 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
              Autonomous Incident Prioritization & Maintenance Dispatch Pipeline
            </h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Deterministic prioritization: Severity (35%) + Wastage Rate (30%) + Zone Criticality (20%) + Dwell Time (15%)
          </p>
        </div>
        <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors">
          Total Incidents: <span className="text-zinc-900 dark:text-white font-bold">{incidents.length}</span> (
          {incidents.filter((i) => i.status !== 'VERIFIED').length} Pending)
        </div>
      </motion.div>

      {/* Incidents & Work Orders List */}
      {incidents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-500 dark:text-zinc-400 transition-colors"
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            All Restroom Zones Operating Nominally
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Zero active leaks or hygiene violations. To test the pipeline, inject a fault above or launch a Scenario.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {incidents.map((incident) => {
              const ticket = tickets.find((t) => t.incidentId === incident.id);

              return (
                <motion.div
                  key={incident.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  id={`incident-item-${incident.id}`}
                  className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  {/* Top Row: Priority, Title, Status, SLA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      {getPriorityBadge(incident.severity)}
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{incident.title}</h4>
                      {getStatusBadge(incident.status)}
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                        SLA: {incident.slaMinutes}m
                      </span>
                      <span
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700"
                        title="Calculated Dynamic Priority Score (0-100)"
                      >
                        P-Score: {incident.dynamicPriorityScore.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Body Row: Description & Impact */}
                  <div className="py-2.5 text-xs text-zinc-600 dark:text-zinc-300 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <p className="text-zinc-700 dark:text-zinc-300">{incident.description}</p>
                      {incident.rootCauseHypothesis && (
                        <div className="mt-2 bg-zinc-50 dark:bg-zinc-900/90 p-2.5 rounded-md border border-zinc-200 dark:border-zinc-800">
                          <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                            <Bot className="w-3 h-3 text-[#c29b38]" />
                            AI Root Cause Hypothesis ({Math.round(incident.confidenceScore * 100)}% Confidence)
                          </div>
                          <p className="text-zinc-800 dark:text-zinc-200 text-[11px] mt-0.5 font-medium">
                            {incident.rootCauseHypothesis}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Impact Stats Card */}
                    <div className="bg-zinc-50 dark:bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-1 text-[11px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-500 dark:text-zinc-400 font-sans">Flow Loss Rate:</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          {incident.estimatedWastageRateLpm.toFixed(2)} L/min
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 dark:text-zinc-400 font-sans">Cumulative Loss:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                          {incident.cumulativeWastageLiters.toFixed(1)} L
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 dark:text-zinc-400 font-sans">Detected At:</span>
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {new Date(incident.detectedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance Ticket / Dispatch Information if ticket exists */}
                  {ticket && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#c29b38] block">
                            Dispatched Work Order #{ticket.id}
                          </span>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                            Assigned to: <span className="text-zinc-900 dark:text-white font-bold">{ticket.assignedCrew.name}</span> (
                            {ticket.assignedCrew.role})
                          </div>
                          <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                            Parts Staged:{' '}
                            <span className="font-mono text-zinc-800 dark:text-zinc-200">
                              {ticket.recommendedParts.map((p) => `${p.name} [${p.sku}]`).join(', ')}
                            </span>
                          </div>
                        </div>

                        {/* Ticket Workflow buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {ticket.status === 'DISPATCHED' && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onUpdateTicketStatus(ticket.id, 'IN_PROGRESS')}
                              className="text-xs font-bold px-3 py-1.5 rounded-md bg-[#c29b38] hover:bg-[#b08b30] text-black transition-colors cursor-pointer shadow-2xs"
                            >
                              Mark In Progress
                            </motion.button>
                          )}
                          {ticket.status === 'IN_PROGRESS' && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onUpdateTicketStatus(ticket.id, 'RESOLVED')}
                              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-2xs"
                            >
                              Technician Repaired
                            </motion.button>
                          )}
                          {ticket.status === 'RESOLVED' && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onVerifyClosedLoop(ticket.id)}
                              className="text-xs font-bold px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 shadow-xs animate-pulse cursor-pointer"
                              title="Closed-loop verification: system checks if idle flow is 0.0 L/min"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Run Telemetry Verification
                            </motion.button>
                          )}
                          {ticket.status === 'VERIFIED' && (
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2 py-1 rounded-md">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Audit Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Bottom Action Row */}
                  <div className="pt-2.5 mt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => onOpenAiDiagnostic(incident)}
                      className="text-[#c29b38] dark:text-[#d4af37] font-semibold hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#c29b38]" />
                      AI Root Cause Analysis & Parts Spec
                    </button>

                    {!ticket && incident.status === 'ACTIVE' && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDispatchTicket(incident.id)}
                        className="font-bold px-3.5 py-1.5 rounded-lg bg-black dark:bg-[#c29b38] text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-[#d4af37] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Dispatch Maintenance Work Order
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
