import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrdSection } from '../types';
import { allPrdSections, prdCategories } from '../data/prdSections';
import { 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  Check, 
  Clock, 
  Sparkles, 
  Hash, 
  Filter
} from 'lucide-react';

export const PrdReader: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Sections');
  const [copiedSection, setCopiedSection] = useState<boolean>(false);

  // Filter sections by search and category
  const filteredSections = useMemo(() => {
    return allPrdSections.filter((section) => {
      const matchesSearch = 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All Sections' || section.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const currentSection = useMemo(() => {
    return allPrdSections.find((s) => s.id === selectedSectionId) || allPrdSections[0];
  }, [selectedSectionId]);

  const currentIndex = allPrdSections.findIndex((s) => s.id === selectedSectionId);
  const prevSection = currentIndex > 0 ? allPrdSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allPrdSections.length - 1 ? allPrdSections[currentIndex + 1] : null;

  const handleCopySection = () => {
    navigator.clipboard.writeText(currentSection.content);
    setCopiedSection(true);
    setTimeout(() => setCopiedSection(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: 39-Section Navigation */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs sticky top-28">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-1.5">
                <Hash className="w-4 h-4 text-slate-500" />
                <span>PRD Sections (39 Total)</span>
              </h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {filteredSections.length} found
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requirements, math, APIs..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            {/* Category Filter Dropdown */}
            <div className="mb-3">
              <div className="flex items-center space-x-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                <Filter className="w-3 h-3" />
                <span>Filter Category</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {prdCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Scrollable Section List */}
            <div className="overflow-y-auto max-h-[calc(100vh-280px)] space-y-1 pr-1">
              {filteredSections.map((section) => {
                const isSelected = section.id === selectedSectionId;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setSelectedSectionId(section.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-start justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="line-clamp-1">{section.title}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          isSelected ? 'text-slate-300' : 'text-slate-400'
                        }`}
                      >
                        {section.category}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 mt-0.5 transition-transform ${
                        isSelected ? 'text-white translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                      }`}
                    />
                  </button>
                );
              })}

              {filteredSections.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  No sections match your search criteria.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Main Content: Section Document */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {/* Header Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {currentSection.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{currentSection.readTimeMinutes} min read</span>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {currentSection.title}
                </h1>
                <p className="text-sm text-slate-600 mt-1 font-normal">
                  {currentSection.summary}
                </p>
              </div>

              {/* Copy Section Button */}
              <button
                onClick={handleCopySection}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                title="Copy current section markdown"
              >
                {copiedSection ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied Section</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Section</span>
                  </>
                )}
              </button>
            </div>

            {/* Key Takeaways Callout */}
            {currentSection.keyTakeaways && currentSection.keyTakeaways.length > 0 && (
              <div className="my-6 bg-slate-50/80 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Strategic Takeaways & Architecture Principles</span>
                </div>
                <ul className="space-y-1.5">
                  {currentSection.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start text-xs text-slate-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 mr-2 shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Markdown Body */}
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-table:text-xs prose-th:bg-slate-100 prose-th:p-2.5 prose-td:p-2.5 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-lg">
              <ReactMarkdown>{currentSection.content}</ReactMarkdown>
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              {prevSection ? (
                <button
                  onClick={() => {
                    setSelectedSectionId(prevSection.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous: {prevSection.title.slice(0, 24)}...</span>
                </button>
              ) : <div />}

              {nextSection ? (
                <button
                  onClick={() => {
                    setSelectedSectionId(nextSection.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <span>Next: {nextSection.title.slice(0, 24)}...</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : <div />}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
