import React from 'react';
import { motion } from 'motion/react';
import { Facility, Zone } from '../../types';
import { Building2, Plane, GraduationCap, MapPin, AlertTriangle, Droplets, Sparkles } from 'lucide-react';

interface Props {
  facilities: Facility[];
  selectedFacility: Facility;
  selectedZone: Zone;
  onSelectFacility: (facility: Facility) => void;
  onSelectZone: (zone: Zone) => void;
  activeLeaksCount: number;
  activeWastageLpm: number;
}

export const FacilityZoneSelector: React.FC<Props> = ({
  facilities,
  selectedFacility,
  selectedZone,
  onSelectFacility,
  onSelectZone,
  activeLeaksCount,
  activeWastageLpm,
}) => {
  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'AIRPORT_TERMINAL':
        return <Plane className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'HOSPITAL':
        return <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'UNIVERSITY_CAMPUS':
        return <GraduationCap className="w-4 h-4 text-amber-600 dark:text-[#d4af37]" />;
      default:
        return <Building2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      id="facility-zone-selector"
      className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs transition-colors"
    >
      {/* Top Header: Facility switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c29b38]" />
            Active Facility Deployment
          </div>
          <div className="flex items-center space-x-2">
            {getFacilityIcon(selectedFacility.type)}
            <h2 className="text-base font-bold text-zinc-900 dark:text-white font-sans">{selectedFacility.name}</h2>
          </div>
          <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 space-x-2">
            <MapPin className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            <span>{selectedFacility.location}</span>
            <span>•</span>
            <span>{selectedFacility.totalRestrooms} Restrooms</span>
            <span>•</span>
            <span>{selectedFacility.totalFixtures} Smart Fixtures</span>
          </div>
        </div>

        {/* Facility Dropdown / Tabs */}
        <div className="flex items-center gap-2">
          <label htmlFor="facility-dropdown" className="text-xs font-medium text-zinc-500 dark:text-zinc-400 sr-only">
            Switch Facility
          </label>
          <select
            id="facility-dropdown"
            className="text-xs font-medium bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#c29b38] transition-colors cursor-pointer"
            value={selectedFacility.id}
            onChange={(e) => {
              const fac = facilities.find((f) => f.id === e.target.value);
              if (fac) onSelectFacility(fac);
            }}
          >
            {facilities.map((fac) => (
              <option key={fac.id} value={fac.id} className="dark:bg-zinc-900 dark:text-zinc-200">
                {fac.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zone selection buttons */}
      <div className="mt-3">
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 flex items-center justify-between">
          <span>Restroom Zones in {selectedFacility.name.split('(')[0]}</span>
          {activeLeaksCount > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/60"
            >
              <AlertTriangle className="w-3 h-3" />
              {activeLeaksCount} Active Leak{activeLeaksCount > 1 ? 's' : ''} ({activeWastageLpm.toFixed(1)} L/min)
            </motion.span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {selectedFacility.zones.map((zone) => {
            const isSelected = zone.id === selectedZone.id;
            const hdiColor =
              zone.currentHdi >= 85
                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                : zone.currentHdi >= 65
                ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-[#d4af37] border-amber-300 dark:border-amber-800'
                : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';

            return (
              <motion.button
                key={zone.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                id={`zone-btn-${zone.id}`}
                onClick={() => onSelectZone(zone)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-black dark:border-[#c29b38] bg-black dark:bg-zinc-900 text-white shadow-md dark:ring-1 dark:ring-[#c29b38]/50'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="zoneIndicator"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-[#c29b38]"
                  />
                )}
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-xs truncate font-sans">{zone.name}</div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm border shrink-0 ${
                      isSelected ? 'bg-white/20 text-white border-white/30' : hdiColor
                    }`}
                  >
                    HDI {zone.currentHdi}%
                  </span>
                </div>
                <div
                  className={`text-[11px] mt-1 ${
                    isSelected ? 'text-zinc-300 dark:text-zinc-300' : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {zone.floor} • {zone.deviceIds.length} Fixtures
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px]">
                  <span
                    className={`flex items-center gap-1 ${
                      isSelected ? 'text-zinc-300 dark:text-zinc-300' : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <Droplets className="w-2.5 h-2.5 text-sky-500" />
                    {zone.stallFlushesToday} Flushes
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      isSelected ? 'text-zinc-300 dark:text-zinc-300' : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5 text-[#c29b38]" />
                    Cleaned {zone.minutesSinceClean}m ago
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
