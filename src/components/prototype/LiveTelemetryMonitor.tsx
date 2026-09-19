import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Device, Zone, TelemetryFrame } from '../../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Activity,
  Droplets,
  Gauge,
  Battery,
  Users,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Waves,
} from 'lucide-react';

interface Props {
  selectedZone: Zone;
  devices: Device[];
  telemetryHistory: (TelemetryFrame & { timeLabel: string })[];
  isStreamActive: boolean;
  isDarkMode?: boolean;
  onToggleStream: () => void;
  onSimulateActuation: (deviceId: string, type: 'FLUSH' | 'FAUCET') => void;
  onInjectFault: (deviceId: string, faultType: 'MICRO_LEAK' | 'RUNAWAY_LEAK' | 'LOW_BATTERY' | 'RESET') => void;
  onTriggerCleanEvent: (zoneId: string) => void;
  activeWastageLpm: number;
}

export const LiveTelemetryMonitor: React.FC<Props> = ({
  selectedZone,
  devices,
  telemetryHistory,
  isStreamActive,
  isDarkMode = false,
  onToggleStream,
  onSimulateActuation,
  onInjectFault,
  onTriggerCleanEvent,
  activeWastageLpm,
}) => {
  const [selectedDeviceFilter, setSelectedDeviceFilter] = useState<string>('ALL');
  const [historyWindow, setHistoryWindow] = useState<number>(30); // 15, 30, or all

  const filteredDevices =
    selectedDeviceFilter === 'ALL'
      ? devices
      : devices.filter((d) => d.type === selectedDeviceFilter);

  // Compute aggregate flow in this zone
  const aggregateFlow = devices.reduce((sum, d) => sum + d.currentFlowRateLpm, 0);

  // Sliced history for the chart view
  const displayHistory =
    historyWindow === 0 ? telemetryHistory : telemetryHistory.slice(-historyWindow);

  return (
    <div id="live-telemetry-monitor" className="space-y-4">
      {/* Control Banner & Stream Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            {isStreamActive && (
              <span className="absolute w-5 h-5 rounded-full bg-emerald-500/30 animate-ping" />
            )}
            <span
              className={`w-3 h-3 rounded-full relative ${
                isStreamActive ? 'bg-emerald-500' : 'bg-zinc-400 dark:bg-zinc-600'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-zinc-900 dark:text-white font-sans flex items-center gap-1.5">
                High-Frequency IoT Telemetry Bus
              </span>
              <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full font-mono border border-zinc-200 dark:border-zinc-700">
                1000ms Ingestion
              </span>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Zone: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedZone.name}</span> •{' '}
              {selectedZone.occupancyDetected ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                  <Users className="w-3 h-3" /> Occupied ({selectedZone.occupancyCount} present)
                </span>
              ) : (
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Idle (0 occupants detected)</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            id="toggle-stream-btn"
            onClick={onToggleStream}
            className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
              isStreamActive
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-[#d4af37] border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
            }`}
          >
            <Play className={`w-3.5 h-3.5 transition-transform ${isStreamActive ? 'rotate-90' : ''}`} />
            {isStreamActive ? 'Pause Stream' : 'Resume Live Ingestion'}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            id="clean-zone-btn"
            onClick={() => onTriggerCleanEvent(selectedZone.id)}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Log verified custodial sanitation event"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c29b38]" />
            Verify Cleaning (Reset HDI)
          </motion.button>
        </div>
      </motion.div>

      {/* Primary Telemetry Metrics & Real-time Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Recharts Real-time Flow & Pressure Time Series */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-2 bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-2 border-b border-zinc-100 dark:border-zinc-800 gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-sky-500/15 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
                Continuous Telemetry Waveform
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-2 text-[11px] bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-400">Window:</span>
                {[15, 30, 0].map((win) => (
                  <button
                    key={win}
                    onClick={() => setHistoryWindow(win)}
                    className={`px-1.5 py-0.2 rounded font-mono text-[10px] transition-colors cursor-pointer ${
                      historyWindow === win
                        ? 'bg-black dark:bg-[#c29b38] text-white dark:text-black font-bold'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {win === 0 ? 'Full' : `${win}s`}
                  </button>
                ))}
              </div>

              <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block animate-pulse" />
                Flow (L/min)
              </span>
              <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 font-medium text-[11px]">
                <span className="w-2 h-2 rounded-xs bg-zinc-400 dark:bg-zinc-600 inline-block" />
                Pressure (bar)
              </span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayHistory}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? '#27272a' : '#f4f4f5'}
                  vertical={false}
                />
                <XAxis
                  dataKey="timeLabel"
                  tick={{ fontSize: 10, fill: isDarkMode ? '#a1a1aa' : '#71717a' }}
                  stroke={isDarkMode ? '#3f3f46' : '#d4d4d8'}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, 'dataMax + 2']}
                  tick={{ fontSize: 10, fill: isDarkMode ? '#38bdf8' : '#0284c7' }}
                  stroke={isDarkMode ? '#38bdf8' : '#0284c7'}
                  label={{
                    value: 'L/min',
                    angle: -90,
                    position: 'insideLeft',
                    fontSize: 10,
                    fill: isDarkMode ? '#38bdf8' : '#0284c7',
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 8]}
                  tick={{ fontSize: 10, fill: isDarkMode ? '#a1a1aa' : '#71717a' }}
                  stroke={isDarkMode ? '#52525b' : '#a1a1aa'}
                  label={{
                    value: 'bar',
                    angle: 90,
                    position: 'insideRight',
                    fontSize: 10,
                    fill: isDarkMode ? '#a1a1aa' : '#71717a',
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    border: '1px solid #c29b38',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="flowRateLpm"
                  name="Flow Rate (L/min)"
                  stroke={isDarkMode ? '#38bdf8' : '#0284c7'}
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="right"
                  type="stepAfter"
                  dataKey="pressureBar"
                  name="Line Pressure (bar)"
                  stroke={isDarkMode ? '#a1a1aa' : '#71717a'}
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Real-time Telemetry Stats Footnote */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <div className="bg-zinc-50 dark:bg-zinc-900/90 p-2 rounded-lg transition-colors border border-zinc-100 dark:border-zinc-800/80">
              <div className="text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500">Current Flow</div>
              <div className="text-base font-extrabold text-zinc-900 dark:text-white font-mono">
                {aggregateFlow.toFixed(2)} <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">L/min</span>
              </div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/90 p-2 rounded-lg transition-colors border border-zinc-100 dark:border-zinc-800/80">
              <div className="text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500">Line Pressure</div>
              <div className="text-base font-extrabold text-zinc-900 dark:text-white font-mono">
                {(devices[0]?.currentPressureBar || 4.1).toFixed(1)} <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">bar</span>
              </div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/90 p-2 rounded-lg transition-colors border border-zinc-100 dark:border-zinc-800/80">
              <div className="text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500">Active Leak Rate</div>
              <div className={`text-base font-extrabold font-mono ${activeWastageLpm > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {activeWastageLpm.toFixed(2)} <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">L/min</span>
              </div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/90 p-2 rounded-lg transition-colors border border-zinc-100 dark:border-zinc-800/80">
              <div className="text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500">Hygiene Demand</div>
              <div className={`text-base font-extrabold font-mono ${selectedZone.currentHdi >= 85 ? 'text-rose-600 dark:text-rose-400' : selectedZone.currentHdi >= 65 ? 'text-amber-600 dark:text-[#d4af37]' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {selectedZone.currentHdi}%
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right 1 Col: Hygiene Demand Index (HDI) Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs flex flex-col justify-between transition-colors"
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 font-sans">
                <Gauge className="w-4 h-4 text-[#c29b38]" />
                Hygiene Demand Index (HDI)
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedZone.currentHdi >= 85
                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                    : selectedZone.currentHdi >= 65
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-[#d4af37]'
                    : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {selectedZone.status}
              </span>
            </div>

            {/* Gauge visual progress with animated width */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-300 mb-1">
                <span>Sanitation Traffic Index</span>
                <span className="font-bold font-mono">{selectedZone.currentHdi} / 100</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden relative">
                <motion.div
                  initial={false}
                  animate={{ width: `${selectedZone.currentHdi}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  className={`h-full rounded-full ${
                    selectedZone.currentHdi >= 85
                      ? 'bg-rose-500'
                      : selectedZone.currentHdi >= 65
                      ? 'bg-[#c29b38]'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono">
                <span>0% Optimal</span>
                <span>65% Alert</span>
                <span>85% Dispatch Auto</span>
              </div>
            </div>

            {/* Sub-signals weighting breakdown */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-300">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" /> Stall Flushes (40% weight)
                </span>
                <span className="font-semibold text-zinc-900 dark:text-white font-mono">{selectedZone.stallFlushesToday}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-300">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#c29b38]" /> Faucet Cycles (30% weight)
                </span>
                <span className="font-semibold text-zinc-900 dark:text-white font-mono">{selectedZone.faucetActivationsToday}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-300">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-500" /> Footfall Count (20% weight)
                </span>
                <span className="font-semibold text-zinc-900 dark:text-white font-mono">{selectedZone.footfallCountToday}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-300">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#c29b38]" /> Minutes Since Sanitized (10%)
                </span>
                <span className="font-semibold text-zinc-900 dark:text-white font-mono">{selectedZone.minutesSinceClean}m</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-2.5 rounded-lg transition-colors border border-zinc-100 dark:border-zinc-800/80">
            <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-200 flex items-center justify-between">
              <span>Automatic Janitorial Dispatch</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">Autonomous SLA: 15m</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {selectedZone.currentHdi >= 85
                ? 'Threshold exceeded. Custodial dispatch ticket created and routed to cleaning crew.'
                : 'Traffic index within nominal boundaries. Next scheduled turnaround in 35 mins.'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Smart Fixture Array & Fault Injection Board */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
              Zone Fixture Telemetry & Actuation Array ({filteredDevices.length} Fixtures)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Interactive physical fixture controls: trigger real-time hydraulic flushes or simulate component failures.
            </p>
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'FLUSHOMETER', 'URINAL', 'FAUCET', 'MAIN_METER'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedDeviceFilter(filter)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  selectedDeviceFilter === filter
                    ? 'bg-black dark:bg-[#c29b38] text-white dark:text-black font-bold shadow-2xs'
                    : 'bg-zinc-100 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {filter === 'ALL' ? 'All' : filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Fixture Grid Cards with animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDevices.map((device) => {
            const isLeaking = device.currentFlowRateLpm > 0.15;
            const isCriticalLeak = device.currentFlowRateLpm > 8.0;
            const isActuating = device.currentFlowRateLpm > 0.5 && !isLeaking;

            return (
              <motion.div
                key={device.id}
                layout
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                id={`fixture-card-${device.id}`}
                className={`border rounded-xl p-3.5 transition-all relative overflow-hidden ${
                  isCriticalLeak
                    ? 'border-rose-400 dark:border-rose-700/80 bg-rose-50/70 dark:bg-rose-950/30 shadow-xs ring-2 ring-rose-400/50'
                    : isLeaking
                    ? 'border-amber-300 dark:border-amber-700/80 bg-amber-50/50 dark:bg-amber-950/30 shadow-xs ring-1 ring-amber-400/40'
                    : isActuating
                    ? 'border-sky-400 dark:border-sky-600 bg-sky-50/40 dark:bg-sky-950/30 ring-1 ring-sky-400/40'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* Active fluid animation bar */}
                {device.currentFlowRateLpm > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 animate-pulse"
                  />
                )}

                {/* Top Row: Device Name & Type Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {device.type}
                    </span>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight flex items-center gap-1.5">
                      {device.name}
                      {device.currentFlowRateLpm > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping inline-block" />
                      )}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs shrink-0 ${
                      device.status === 'CRITICAL'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : device.status === 'WARNING'
                        ? 'bg-[#c29b38] text-black font-extrabold'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {device.status}
                  </span>
                </div>

                {/* Subtitle: Model SKU */}
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono truncate">
                  {device.model}
                </div>

                {/* Telemetry Metrics Row */}
                <div className="grid grid-cols-3 gap-1.5 my-2.5 bg-zinc-50 dark:bg-zinc-900/80 p-2 rounded-lg text-[10px] border border-zinc-100 dark:border-zinc-800/60 font-mono">
                  <div>
                    <span className="text-zinc-400 dark:text-zinc-500 block font-sans">Flow</span>
                    <span
                      className={`font-bold ${
                        isCriticalLeak
                          ? 'text-rose-700 dark:text-rose-400'
                          : isLeaking
                          ? 'text-amber-700 dark:text-[#d4af37]'
                          : device.currentFlowRateLpm > 0
                          ? 'text-sky-600 dark:text-sky-400'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {device.currentFlowRateLpm.toFixed(2)} L/m
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 dark:text-zinc-500 block font-sans">Pressure</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {device.currentPressureBar.toFixed(1)} bar
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 dark:text-zinc-500 block font-sans">Battery</span>
                    <span
                      className={`font-bold inline-flex items-center gap-0.5 ${
                        device.batteryVoltage < 2.4
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      <Battery className="w-2.5 h-2.5" />
                      {device.batteryVoltage.toFixed(2)}V
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                {isLeaking && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-2 text-[10px] text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-1 bg-rose-100/80 dark:bg-rose-950/60 px-2 py-0.5 rounded-sm border border-rose-200 dark:border-rose-900/60"
                  >
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>
                      Continuous Flow: {device.idleContinuousFlowSeconds}s idle ({device.currentFlowRateLpm.toFixed(2)}{' '}
                      L/min)
                    </span>
                  </motion.div>
                )}

                {/* Action Buttons with spring tap animations */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-1.5">
                  {device.type === 'FLUSHOMETER' || device.type === 'URINAL' ? (
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onSimulateActuation(device.id, 'FLUSH')}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Droplets className="w-2.5 h-2.5 text-sky-600 dark:text-sky-400" /> Flush Stall
                    </motion.button>
                  ) : device.type === 'FAUCET' ? (
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onSimulateActuation(device.id, 'FAUCET')}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Droplets className="w-2.5 h-2.5 text-sky-600 dark:text-sky-400" /> Wash Hands
                    </motion.button>
                  ) : null}

                  {/* Inject Fault buttons */}
                  {!isLeaking ? (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => onInjectFault(device.id, 'MICRO_LEAK')}
                        className="text-[10px] font-medium px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
                        title="Simulate 0.75 L/min continuous diaphragm weep"
                      >
                        + Micro-Leak
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => onInjectFault(device.id, 'RUNAWAY_LEAK')}
                        className="text-[10px] font-medium px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                        title="Simulate 18.0 L/min stuck solenoid"
                      >
                        + Stuck Solenoid
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onInjectFault(device.id, 'RESET')}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> Stop Leak / Fix
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
