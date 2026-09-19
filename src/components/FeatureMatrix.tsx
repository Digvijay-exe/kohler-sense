import React, { useState } from 'react';
import { featuresList } from '../data/featuresData';
import { FeatureSpec } from '../types';
import { 
  Table2, 
  Search, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Zap, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export const FeatureMatrix: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [expandedId, setExpandedId] = useState<string>('FEAT-03'); // default expanded to leak detection

  const categories = ['All Categories', ...Array.from(new Set(featuresList.map((f) => f.category)))];

  const filteredFeatures = featuresList.filter((f) => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.processing.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All Categories' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? '' : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 mb-2">
          <Table2 className="w-3.5 h-3.5 text-slate-700" />
          <span>Implementation Specification</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Complete Feature Specification Matrix
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl mt-1 font-normal">
          Every capability is defined with rigid requirements engineering precision: Purpose, Inputs, Processing Logic, Outputs, and Verifiable Acceptance Criteria.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features, inputs, formulas..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Feature Cards / Accordion */}
      <div className="space-y-4">
        {filteredFeatures.map((feat) => {
          const isExpanded = expandedId === feat.id;

          return (
            <div
              key={feat.id}
              className={`bg-white rounded-xl border transition-all ${
                isExpanded ? 'border-slate-900 shadow-sm' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Feature Header */}
              <div
                onClick={() => toggleExpand(feat.id)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-3.5">
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {feat.id}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">
                        {feat.name}
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {feat.mvpStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 font-medium">
                      {feat.purpose}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
                    {feat.category}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Detailed Breakdown */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 rounded-b-xl">
                  
                  {/* Left Column: Purpose & Processing */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span>Purpose & Operational Role</span>
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-lg border border-slate-200">
                        {feat.purpose}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Processing & Algorithm Logic</span>
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-lg border border-slate-200">
                        {feat.processing}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                        Inputs Received
                      </h4>
                      <ul className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                        {feat.inputs.map((inp, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2 shrink-0" />
                            <span>{inp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Outputs & Acceptance Criteria */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Outputs & System State Changes</span>
                      </h4>
                      <ul className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                        {feat.outputs.map((out, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 mr-2 shrink-0" />
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verifiable Acceptance Criteria</span>
                      </h4>
                      <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                        {feat.acceptanceCriteria.map((crit, idx) => (
                          <div key={idx} className="flex items-start text-xs text-slate-800 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 mt-0.5 shrink-0" />
                            <span>{crit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
