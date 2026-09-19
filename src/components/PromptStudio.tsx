import React, { useState } from 'react';
import { promptsList } from '../data/promptsData';
import { PromptTemplate } from '../types';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ShieldAlert, 
  Code2, 
  Terminal, 
  AlertOctagon, 
  FileText 
} from 'lucide-react';

export const PromptStudio: React.FC = () => {
  const [selectedPromptId, setSelectedPromptId] = useState<string>('P-02');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const currentPrompt = promptsList.find((p) => p.id === selectedPromptId) || promptsList[1];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-slate-700" />
          <span>Mandatory Deliverable (Section 22)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Prompt Engineering Studio & Guardrail Catalog
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl mt-1 font-normal">
          Inspect the 6 official Google Gemini system prompts powering KOHLER SENSE. Every prompt is engineered with negative constraints to prevent numerical hallucinations and unverified physical claims.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Nav: 6 Prompts */}
        <div className="lg:col-span-4 space-y-2">
          {promptsList.map((prompt) => {
            const isSelected = prompt.id === selectedPromptId;
            return (
              <button
                key={prompt.id}
                onClick={() => setSelectedPromptId(prompt.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {prompt.id}
                  </span>
                  <span
                    className={`text-[11px] ${
                      isSelected ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    Gemini 2.5
                  </span>
                </div>
                <div className="font-bold text-sm tracking-tight">{prompt.name.split(':')[1]?.trim() || prompt.name}</div>
                <div
                  className={`text-xs mt-1 line-clamp-2 font-normal ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {prompt.purpose}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Pane: Detailed Prompt Inspection */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Header Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {currentPrompt.id}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {currentPrompt.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentPrompt.purpose}
                </p>
              </div>

              <button
                onClick={() => handleCopy(currentPrompt.systemPrompt)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied System Prompt</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy System Prompt</span>
                  </>
                )}
              </button>
            </div>

            {/* System Prompt Code Box */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                <span className="flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-700" />
                  <span>Official System Prompt Instructions</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">markdown / text</span>
              </div>
              <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto border border-slate-800">
                {currentPrompt.systemPrompt}
              </pre>
            </div>

            {/* Two Column: Guardrails & Failure Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enforced Safety Guardrails</span>
                </div>
                <ul className="space-y-1.5">
                  {currentPrompt.guardrails.map((g, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 mr-2 shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-700" />
                  <span>Offline / Timeout Failure Behavior</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  {currentPrompt.failureBehavior}
                </p>
              </div>
            </div>

            {/* Test Bench: Grounded Execution Sample */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Grounded Test Bench (Sample Input ➔ Output)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">
                    Sample Injected Context (Variables)
                  </div>
                  <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800">
                    {JSON.stringify(currentPrompt.sampleInput, null, 2)}
                  </pre>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-emerald-700 mb-1">
                    Grounded Model Output
                  </div>
                  <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800">
                    {currentPrompt.sampleOutput}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
