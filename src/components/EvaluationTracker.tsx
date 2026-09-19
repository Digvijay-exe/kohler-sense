import React, { useState } from 'react';
import { dodChecklist } from '../data/schemasAndApis';
import { DodItem } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  CheckSquare, 
  Square, 
  Zap, 
  Code, 
  Layout, 
  Leaf, 
  ExternalLink 
} from 'lucide-react';

export const EvaluationTracker: React.FC = () => {
  const [checklist, setChecklist] = useState<DodItem[]>(dodChecklist);

  const toggleItem = (id: number) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  const criteriaBreakdown = [
    {
      title: 'Approach & Innovation',
      weight: '45%',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Novelty of problem-solving methodology, creative and effective application of AI models/prompts, and architectural sophistication.',
      highlights: [
        'Novel 6-stage Sense ➔ Detect ➔ Predict ➔ Prioritize ➔ Dispatch ➔ Measure paradigm.',
        'Strict rejection of "AI Slop": LLM is never tasked with raw numerical anomaly detection; deterministic statistical/ML engines act as authoritative gatekeepers.',
        '3-tier hybrid detection: Zero-occupancy physics rules (Tier 1), Rolling Z-Scores (Tier 2), and Unsupervised Isolation Forest (Tier 3).'
      ]
    },
    {
      title: 'Technical Execution',
      weight: '25%',
      icon: <Code className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      description: 'Quality of code execution, working model stability, robustness, and overall system performance.',
      highlights: [
        'Production Python + FastAPI asynchronous backend with SQLite WAL-mode ACID persistence.',
        'Zero external database dependencies; runnable out-of-the-box in local and container environments.',
        '100% offline fallback resilience: continuous detection and dispatch persist even during complete LLM API outages.',
        '8 comprehensive automated test suites covering all operational edge cases.'
      ]
    },
    {
      title: 'User Experience & Feasibility',
      weight: '20%',
      icon: <Layout className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Intuitive interface design, practical real-world deployment potential, and clear output generation.',
      highlights: [
        'Engineered specifically for airport facility directors, custodial supervisors, and MEP technicians.',
        '6 glanceable, high-contrast screens adhering strictly to WCAG AA color accessibility.',
        'One-click demo scenario injection panel guaranteeing flawless, repeatable judging demonstrations.',
        'Conversational Facility Copilot with transparent database citations and multi-format exports.'
      ]
    },
    {
      title: 'Business & Sustainability Impact',
      weight: '10%',
      icon: <Leaf className="w-5 h-5 text-teal-600" />,
      color: 'bg-teal-50 border-teal-200 text-teal-900',
      badgeColor: 'bg-teal-100 text-teal-800',
      description: 'Alignment with KOHLER\'s commitment to design excellence, water conservation and operational efficiency.',
      highlights: [
        'Direct alignment with KOHLER\'s "Believing in Better" environmental stewardship mission.',
        'Mathematically models Avoided Water Loss (W_avoided) against 48-hour commercial manual discovery benchmarks.',
        'Directly supports LEED v4.1 Water Efficiency (WE) and WELL Building Standard compliance.'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 mb-2">
          <Award className="w-3.5 h-3.5 text-slate-700" />
          <span>Competition Governance & Judge Checklist</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Competition Evaluation Alignment & Definition of Done
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl mt-1 font-normal">
          KOHLER SENSE is directly engineered against the four official evaluation criteria of the KOHLER-MITWPU AI Research Lab Program (Track 2). Every claim is backed by reproducible technical evidence.
        </p>
      </div>

      {/* 4-Pillar Evaluation Rubric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {criteriaBreakdown.map((crit, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    {crit.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {crit.title}
                  </h3>
                </div>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${crit.badgeColor}`}>
                  {crit.weight} of Total Score
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 font-normal">
                {crit.description}
              </p>

              <div className="space-y-2">
                {crit.highlights.map((h, i) => (
                  <div key={i} className="flex items-start text-xs text-slate-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Definition of Done (DoD) Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Section 38: 18-Item Judge's Definition of Done Checklist</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Interactive verification tracker for hackathon judges to validate every mandatory requirement step-by-step.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">
                {completedCount} of {checklist.length} Verified
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {progressPct}% Completion
              </div>
            </div>
            <div className="w-24 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checklist Rows */}
        <div className="divide-y divide-slate-100 mt-4">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="py-3 flex items-start justify-between cursor-pointer hover:bg-slate-50/70 px-2 rounded-lg transition-colors select-none group"
            >
              <div className="flex items-start space-x-3">
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 group-hover:text-slate-600"
                >
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <div>
                  <div
                    className={`text-xs font-semibold ${
                      item.completed ? 'text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {item.text}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1.5">
                    <span className="font-semibold text-slate-600">Verification:</span>
                    <span>{item.verificationEvidence}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0 ml-4">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
