import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Incident, Device, Zone } from '../../types';
import { AiDiagnosisResponse } from '../../services/aiReasoning';
import {
  X,
  Sparkles,
  Bot,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Package,
  Cpu,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  incident: Incident | null;
  device?: Device;
  zone?: Zone;
  diagnosis: AiDiagnosisResponse | null;
  isLoading: boolean;
  onClose: () => void;
  onDispatchWithSpec: (incidentId: string, diagnosis: AiDiagnosisResponse) => void;
}

export const AiDiagnosticModal: React.FC<Props> = ({
  incident,
  device,
  zone,
  diagnosis,
  isLoading,
  onClose,
  onDispatchWithSpec,
}) => {
  return (
    <AnimatePresence>
      {incident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative z-10 bg-white dark:bg-[#111111] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-colors"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-black dark:bg-[#c29b38] flex items-center justify-center text-white dark:text-black shadow-2xs">
                  <Sparkles className="w-4 h-4 text-[#c29b38] dark:text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
                    KOHLER SENSE — AI Incident Diagnostic Brief
                  </h3>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Grounded Plumbing Intelligence • Model: {diagnosis?.source || 'gemini-2.5-flash'}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[65vh] space-y-4">
              {/* Incident Banner */}
              <div className="bg-zinc-50 dark:bg-zinc-900/80 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                      {incident.severity}
                    </span>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{incident.title}</h4>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    ID: {incident.id}
                  </span>
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-2">
                  <span className="font-semibold">Fixture:</span> {device?.name || incident.deviceId} (
                  {device?.model}) • <span className="font-semibold">Zone:</span> {zone?.name || incident.zoneId}
                </div>
                <div className="text-xs text-rose-700 dark:text-rose-400 font-semibold mt-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Estimated Continuous Loss: {incident.estimatedWastageRateLpm.toFixed(2)} L/min (
                  {(incident.estimatedWastageRateLpm * 60 * 24).toLocaleString()} L/day if unresolved)
                </div>
              </div>

              {/* AI Diagnostic Output or Loading State */}
              {isLoading ? (
                <div className="py-12 text-center space-y-3">
                  <div className="inline-block relative">
                    <div className="w-10 h-10 rounded-full border-2 border-[#c29b38] border-t-transparent animate-spin" />
                    <Bot className="w-5 h-5 text-[#c29b38] absolute inset-0 m-auto" />
                  </div>
                  <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Analyzing continuous waveform telemetry against Kohler OEM specification database...
                  </div>
                  <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
                    Synthesizing hydraulic pressure drops, cycle counts, and acoustic vibration harmonics.
                  </p>
                </div>
              ) : diagnosis ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Root Cause Card */}
                  <div className="bg-white dark:bg-zinc-900/90 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-[#c29b38]" />
                        <h5 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-sans">
                          AI Root Cause Analysis
                        </h5>
                      </div>
                      <span className="text-[11px] font-bold text-black dark:text-black bg-[#c29b38] px-2 py-0.5 rounded-full font-mono">
                        {Math.round(diagnosis.confidenceScore * 100)}% Confidence
                      </span>
                    </div>

                    <p className="text-xs text-zinc-800 dark:text-zinc-200 mt-2.5 leading-relaxed font-medium">
                      {diagnosis.rootCauseHypothesis}
                    </p>

                    <div className="mt-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/80">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">
                        Plumbing Physics & Failure Mechanism:
                      </span>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {diagnosis.failureMechanism}
                      </p>
                    </div>
                  </div>

                  {/* Required OEM Parts Spec */}
                  <div className="bg-white dark:bg-zinc-900/90 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                    <div className="flex items-center space-x-2 pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                      <Package className="w-4 h-4 text-[#c29b38]" />
                      <h5 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-sans">
                        Kohler Genuine Replacement Parts Specification
                      </h5>
                    </div>

                    <div className="space-y-2 mt-2">
                      {diagnosis.recommendedParts.map((part, idx) => {
                        const price = part.priceInr || (part.sku?.includes('1067341') ? 3850 : part.sku?.includes('1032402') ? 1450 : part.sku?.includes('89010') ? 950 : 450);
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-xs"
                          >
                            <div>
                              <div className="font-semibold text-zinc-900 dark:text-white">{part.name}</div>
                              <div className="text-[10px] font-mono text-zinc-500">
                                Kohler SKU: {part.sku} • Qty: {part.quantity}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800">
                                ₹{price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                In Central Stock
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step-by-Step Resolution Procedures */}
                  <div className="bg-white dark:bg-zinc-900/90 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                    <div className="flex items-center space-x-2 pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                      <Wrench className="w-4 h-4 text-[#c29b38]" />
                      <h5 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-sans">
                        Technician Standard Operating Procedures (SOP)
                      </h5>
                    </div>

                    <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-2 leading-relaxed">
                      {diagnosis.recommendedAction}
                    </p>

                    {diagnosis.safetyPrecautions && (
                      <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-800 dark:text-[#d4af37] flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Safety Precautions:</span> {diagnosis.safetyPrecautions}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-4 text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        Est. Repair Dwell: {diagnosis.estimatedRepairTimeMinutes} mins
                      </span>
                      <span>•</span>
                      <span className="text-amber-800 dark:text-[#d4af37] font-semibold">
                        Target Role: {diagnosis.recommendedRole}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Dismiss
              </button>

              {diagnosis && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onDispatchWithSpec(incident.id, diagnosis);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-lg bg-black dark:bg-[#c29b38] hover:bg-zinc-850 dark:hover:bg-[#d4af37] text-white dark:text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Dispatch Work Order with Specified Parts
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
