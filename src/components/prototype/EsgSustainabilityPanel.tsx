import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SustainabilityMetrics } from '../../types';
import {
  Droplets,
  DollarSign,
  Leaf,
  Clock,
  ShieldCheck,
  Download,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface Props {
  metrics: SustainabilityMetrics;
  facilityName: string;
  onExportReport?: () => void;
}

export const EsgSustainabilityPanel: React.FC<Props> = ({ metrics, facilityName, onExportReport }) => {
  const [reportExported, setReportExported] = useState<boolean>(false);

  const handleExportEsgReport = () => {
    const content = `# KOHLER SENSE — EXECUTIVE ESG & SUSTAINABILITY AUDIT REPORT
**Facility**: ${facilityName}
**Generated**: ${new Date().toUTCString()}
**Program**: KOHLER-MITWPU AI Research Lab Program (Track 2)

---

## 1. Executive Summary & KPIs
* **Potable Water Saved**: ${metrics.totalWaterSavedLiters.toLocaleString()} Liters (${(metrics.totalWaterSavedLiters * 0.264172).toFixed(1)} Gallons)
* **Uncontained Water Loss Prevented**: ${metrics.totalWaterWastedLiters.toFixed(1)} Liters
* **Utility Tariff Savings**: $${metrics.utilitySavingsDollars.toFixed(2)} USD
* **Scope 2 Carbon Emissions Avoided**: ${metrics.carbonAvoidedKg.toFixed(2)} kg CO2e
* **Mean Time to Detect (MTTD)**: ${metrics.averageMttdSeconds} seconds (Target: < 90s)
* **Mean Time to Resolve (MTTR)**: ${metrics.averageMttrMinutes} minutes (Target: < 120m)
* **Restroom Hygiene SLA Compliance**: ${metrics.hygieneComplianceRatePercent}%

---

## 2. Methodology & Calculations
- **Water Loss Integration**: Volumetric integration of high-frequency continuous flow readings during confirmed zero-occupancy intervals:
  $$\\text{Total Wasted} = \\sum Q(t) \\times \\Delta t$$
- **Carbon Accounting**: Embodied energy and municipal water purification factor: $0.0003\\text{ kg CO}_2\\text{e / Liter}$.
- **Tariff Modeling**: Blended municipal commercial water + sewer surcharge: $0.0038\\text{ USD / Liter}$.

---

*KOHLER SENSE Smart Facility & Sustainability Manager*
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `KOHLER_SENSE_ESG_REPORT_${facilityName.replace(/[^a-zA-Z0-9]/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setReportExported(true);
    if (onExportReport) onExportReport();
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      id="esg-sustainability-panel"
      className="space-y-4"
    >
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div>
          <div className="flex items-center space-x-2">
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
              Executive ESG, Water Conservation & Sustainability Intelligence
            </h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real-time volumetric water accounting, carbon abatement, and municipal utility tariff savings.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportEsgReport}
          className="text-xs font-bold px-3.5 py-2 rounded-lg bg-black dark:bg-[#c29b38] hover:bg-zinc-850 dark:hover:bg-[#d4af37] text-white dark:text-black transition-colors flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
        >
          {reportExported ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          {reportExported ? 'Report Downloaded!' : 'Export ESG Audit Report (MD)'}
        </motion.button>
      </div>

      {/* 4 Primary ESG Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Potable Water Saved */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs transition-colors"
        >
          <div className="flex items-center justify-between text-sky-600 dark:text-sky-400 mb-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">
              Total Potable Water Saved
            </span>
            <Droplets className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-white font-mono">
            {metrics.totalWaterSavedLiters.toLocaleString()}{' '}
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Liters</span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>+34.8% vs. unmonitored baseline</span>
          </div>
        </motion.div>

        {/* Financial Utility Tariff Saved */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs transition-colors"
        >
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">
              Municipal Tariff Avoided
            </span>
            <DollarSign className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-white font-mono">
            ${metrics.utilitySavingsDollars.toFixed(2)}{' '}
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">USD</span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
            At $0.0038/L commercial water & sewer tariff
          </div>
        </motion.div>

        {/* Carbon Abated */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs transition-colors"
        >
          <div className="flex items-center justify-between text-[#c29b38] dark:text-[#d4af37] mb-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">
              Scope 2 Carbon Abated
            </span>
            <Leaf className="w-4 h-4 text-[#c29b38] dark:text-[#d4af37]" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-white font-mono">
            {metrics.carbonAvoidedKg.toFixed(1)}{' '}
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">kg CO₂e</span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
            Potable treatment & pumping energy avoidance
          </div>
        </motion.div>

        {/* Operational SLA Compliance */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs transition-colors"
        >
          <div className="flex items-center justify-between text-amber-600 dark:text-[#d4af37] mb-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">
              Hygiene SLA Compliance
            </span>
            <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-[#d4af37]" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-white font-mono">
            {metrics.hygieneComplianceRatePercent}%
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
            <span>MTTD: {metrics.averageMttdSeconds}s</span>
            <span>•</span>
            <span>MTTR: {metrics.averageMttrMinutes}m</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
