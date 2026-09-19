import React, { useState } from 'react';
import { databaseTables, apiEndpoints } from '../data/schemasAndApis';
import { 
  Database, 
  Send, 
  Copy, 
  Check, 
  Table2, 
  Key, 
  Code2, 
  ArrowRight, 
  Hash 
} from 'lucide-react';

export const SchemaAndApiExplorer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'database' | 'apis'>('database');
  const [selectedTable, setSelectedTable] = useState<string>('telemetry');
  const [selectedEndpointPath, setSelectedEndpointPath] = useState<string>('/api/telemetry/ingest');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const currentTable = databaseTables.find((t) => t.name === selectedTable) || databaseTables[3];
  const currentEndpoint = apiEndpoints.find((e) => e.path === selectedEndpointPath) || apiEndpoints[0];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 mb-2">
          <Database className="w-3.5 h-3.5 text-slate-700" />
          <span>Data Plane & Integration Contracts</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Database Schema (SQLite DDL) & REST API Specification
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl mt-1 font-normal">
          Designed for high-frequency time-series telemetry ingestion, relational audit trails, and zero-configuration embedded deployment with WAL-mode concurrency.
        </p>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex space-x-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('database')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'database'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Table2 className="w-4 h-4" />
          <span>SQLite Database Tables ({databaseTables.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('apis')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'apis'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>FastAPI REST Endpoints ({apiEndpoints.length})</span>
        </button>
      </div>

      {/* 1. Database Schema Mode */}
      {activeSubTab === 'database' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Table List */}
          <div className="lg:col-span-4 space-y-2">
            {databaseTables.map((table) => {
              const isSelected = table.name === selectedTable;
              return (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table.name)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-sm tracking-tight">{table.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {table.columns.length} cols
                    </span>
                  </div>
                  <div
                    className={`text-xs line-clamp-1 font-normal ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {table.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Table Details */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono">
                    Table: {currentTable.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {currentTable.description}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(JSON.stringify(currentTable.sampleRow, null, 2))}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied Sample</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Sample JSON</span>
                    </>
                  )}
                </button>
              </div>

              {/* Column Definitions Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Column Definitions
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2.5">Column</th>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Constraints</th>
                        <th className="p-2.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {currentTable.columns.map((col, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-mono font-bold text-slate-900">{col.name}</td>
                          <td className="p-2.5 font-mono text-indigo-700">{col.type}</td>
                          <td className="p-2.5">
                            {col.constraints ? (
                              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                {col.constraints}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="p-2.5 text-slate-600">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Indexes & Sample Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                    <span>Performance Indexes</span>
                  </h4>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {currentTable.indexes.map((idx, i) => (
                      <div key={i} className="text-xs font-mono text-slate-700">
                        {idx}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <Code2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sample Ingested Record</span>
                  </h4>
                  <pre className="bg-slate-950 text-slate-200 p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-40 border border-slate-800">
                    {JSON.stringify(currentTable.sampleRow, null, 2)}
                  </pre>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. REST API Mode */}
      {activeSubTab === 'apis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Endpoint List */}
          <div className="lg:col-span-4 space-y-2">
            {apiEndpoints.map((ep) => {
              const isSelected = ep.path === selectedEndpointPath;
              const isPost = ep.method === 'POST';
              return (
                <button
                  key={ep.path}
                  onClick={() => setSelectedEndpointPath(ep.path)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isPost ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-bold truncate">{ep.path}</span>
                  </div>
                  <div
                    className={`text-xs line-clamp-1 font-normal ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {ep.summary}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Endpoint Details */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                <span
                  className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                    currentEndpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentEndpoint.method}
                </span>
                <span className="font-mono text-base font-bold text-slate-900">
                  {currentEndpoint.path}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {currentEndpoint.summary}
              </p>

              {currentEndpoint.requestBody && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Request Body (application/json)
                  </h4>
                  <pre className="bg-slate-950 text-slate-100 p-3.5 rounded-lg text-xs font-mono overflow-x-auto max-h-48 border border-slate-800">
                    {currentEndpoint.requestBody}
                  </pre>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 text-emerald-700">
                  Response 200/201 (application/json)
                </h4>
                <pre className="bg-slate-950 text-emerald-400 p-3.5 rounded-lg text-xs font-mono overflow-x-auto max-h-48 border border-slate-800">
                  {currentEndpoint.responseBody}
                </pre>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 text-amber-700">
                  Error Responses
                </h4>
                <div className="space-y-1.5">
                  {currentEndpoint.errorResponses.map((err, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs bg-amber-50 text-amber-900 p-2 rounded border border-amber-200 font-mono">
                      <span className="font-bold">{err.status}</span>
                      <span>— {err.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
