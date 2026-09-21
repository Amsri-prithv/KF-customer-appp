import React, { useState } from 'react';
import { X, Droplet, Clock, Wind, Save, ShieldAlert, Wifi, Terminal, CheckCircle2, Plus, Minus } from 'lucide-react';
import { Machine, AuthRole } from '../types';

interface MachineControlModalProps {
  machine: Machine | null;
  currentRole: AuthRole;
  onClose: () => void;
  onSaveSchedule: (machineId: string, sprayCount: number, interval: string) => void;
  onTriggerSpray: (machine: Machine, sprayCount: number) => void;
  onToggleMasterLock?: (machineId: string, newLockState: boolean) => void;
}

export const MachineControlModal: React.FC<MachineControlModalProps> = ({
  machine,
  currentRole,
  onClose,
  onSaveSchedule,
  onTriggerSpray,
  onToggleMasterLock,
}) => {
  if (!machine) return null;

  // Extract initial spray count (times)
  const initialSprayCount =
    typeof machine.sprayCount === 'number'
      ? machine.sprayCount
      : parseInt(String(machine.sprayDuration || '2').replace('s', '')) || 2;
  const [sprayCount, setSprayCount] = useState<number>(initialSprayCount);

  // Interval state
  const isHours = machine.intervalMinutes.endsWith('h');
  const initialIntervalValue = parseInt(machine.intervalMinutes.replace(/[mh]/g, '')) || 30;
  const [intervalVal, setIntervalVal] = useState<number>(initialIntervalValue);
  const [intervalUnit, setIntervalUnit] = useState<'m' | 'h'>(isHours ? 'h' : 'm');

  const isLocked = !!machine.isMasterLocked;
  const isAdmin = currentRole === 'admin';

  const computedIntervalStr = `${intervalVal}${intervalUnit}`;
  const sprayCountLabel = sprayCount === 1 ? '1 time spray' : `${sprayCount} times spray`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked && !isAdmin) return;
    onSaveSchedule(machine.id, Math.max(1, sprayCount), computedIntervalStr);
  };

  const handleSprayClick = () => {
    if (isLocked && !isAdmin) return;
    onTriggerSpray(machine, Math.max(1, sprayCount));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl my-auto animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-3.5 mb-5 pr-8">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isLocked
                ? 'bg-amber-950/90 text-amber-400 border-amber-800'
                : 'bg-emerald-950/90 text-emerald-400 border-emerald-800'
            }`}
          >
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-['Outfit'] truncate">
                {machine.customName}
              </h3>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                {machine.id}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                <Wifi className="w-3 h-3" />
                <span>{machine.ipAddress}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Maintenance Lock Notice */}
        {isLocked && (
          <div className="mb-5 bg-amber-950/60 border border-amber-600/60 rounded-2xl p-4 text-xs text-amber-200">
            <div className="flex items-center space-x-2 font-bold mb-1 text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>EMERGENCY MASTER STOP ENGAGED</span>
            </div>
            <p className="leading-relaxed text-amber-200/90">
              This unit has been safely suspended by Master Admin oversight. Fluid pumps and timer relays are shut down.
            </p>

            {isAdmin && onToggleMasterLock && (
              <button
                type="button"
                onClick={() => onToggleMasterLock(machine.id, false)}
                className="mt-3 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Release Master Stop & Re-enable Unit</span>
              </button>
            )}
          </div>
        )}

        {/* Admin Emergency Toggle strip */}
        {isAdmin && !isLocked && onToggleMasterLock && (
          <div className="mb-5 bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-semibold text-slate-300 block">Master Safety Kill-Switch</span>
              <span className="text-[11px] text-slate-500">Instantly locks out client control</span>
            </div>
            <button
              type="button"
              onClick={() => onToggleMasterLock(machine.id, true)}
              className="py-1.5 px-3 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-semibold text-xs flex items-center space-x-1 shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Engage Emergency Stop</span>
            </button>
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* SPRAY COUNT CONTROL (Manual Keyboard Input + Steppers & Presets) */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <Droplet className="w-4 h-4 text-emerald-400" />
                <span>Spray Count (Times)</span>
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {sprayCountLabel}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Type the exact number of sprays using your keyboard, or use the controls below:
            </p>

            <div className="flex items-center space-x-3">
              {/* Stepper Down */}
              <button
                type="button"
                disabled={isLocked && !isAdmin || sprayCount <= 1}
                onClick={() => setSprayCount((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Decrease spray count"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* Direct Keyboard Number Input */}
              <div className="flex-1 relative">
                <input
                  type="number"
                  min="1"
                  max="50"
                  disabled={isLocked && !isAdmin}
                  value={sprayCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setSprayCount(isNaN(val) ? 1 : Math.max(1, Math.min(val, 50)));
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center text-base font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none disabled:opacity-40"
                  placeholder="e.g. 2"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 pointer-events-none">
                  {sprayCount === 1 ? 'time' : 'times'}
                </span>
              </div>

              {/* Stepper Up */}
              <button
                type="button"
                disabled={isLocked && !isAdmin || sprayCount >= 50}
                onClick={() => setSprayCount((prev) => prev + 1)}
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Increase spray count"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets for Spray Count */}
            <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-slate-900">
              <span className="text-[10px] text-slate-500 font-medium mr-1">Quick Select:</span>
              {[1, 2, 3, 5, 8].map((count) => (
                <button
                  key={count}
                  type="button"
                  disabled={isLocked && !isAdmin}
                  onClick={() => setSprayCount(count)}
                  className={`py-1 px-2.5 rounded-lg text-xs font-medium transition-all ${
                    sprayCount === count
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {count} {count === 1 ? 'time' : 'times'}
                </button>
              ))}
            </div>
          </div>

          {/* REPEAT SPRAY FREQUENCY (Manual Keyboard Input + Unit Selector) */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Repeat Spray Frequency</span>
              </label>
              <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                Every {intervalVal} {intervalUnit === 'm' ? (intervalVal === 1 ? 'minute' : 'minutes') : (intervalVal === 1 ? 'hour' : 'hours')}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Type any repeat interval with your keyboard and select minutes or hours:
            </p>

            <div className="flex items-center space-x-3">
              {/* Direct Keyboard Number Input */}
              <div className="flex-1 relative">
                <input
                  type="number"
                  min="1"
                  max={intervalUnit === 'h' ? 24 : 720}
                  disabled={isLocked && !isAdmin}
                  value={intervalVal}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setIntervalVal(isNaN(val) ? 1 : Math.max(1, val));
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center text-base font-bold focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none disabled:opacity-40"
                  placeholder="e.g. 30"
                />
              </div>

              {/* Unit Toggle: Minutes / Hours */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 shrink-0">
                <button
                  type="button"
                  disabled={isLocked && !isAdmin}
                  onClick={() => setIntervalUnit('m')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    intervalUnit === 'm'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Minutes
                </button>
                <button
                  type="button"
                  disabled={isLocked && !isAdmin}
                  onClick={() => setIntervalUnit('h')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    intervalUnit === 'h'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Hours
                </button>
              </div>
            </div>

            {/* Quick Interval Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-900">
              <span className="text-[10px] text-slate-500 font-medium mr-1">Presets:</span>
              {[
                { label: '15 min', val: 15, unit: 'm' as const },
                { label: '30 min', val: 30, unit: 'm' as const },
                { label: '45 min', val: 45, unit: 'm' as const },
                { label: '60 min', val: 60, unit: 'm' as const },
                { label: '1 hour', val: 1, unit: 'h' as const },
                { label: '2 hours', val: 2, unit: 'h' as const },
                { label: '4 hours', val: 4, unit: 'h' as const },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  disabled={isLocked && !isAdmin}
                  onClick={() => {
                    setIntervalVal(preset.val);
                    setIntervalUnit(preset.unit);
                  }}
                  className={`py-1 px-2.5 rounded-lg text-xs font-medium transition-all ${
                    intervalVal === preset.val && intervalUnit === preset.unit
                      ? 'bg-teal-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hardware API Endpoint Preview */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80">
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-500 mb-1">
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span>ESP32 REST WIRE SIGNAL PREVIEW</span>
            </div>
            <div className="font-mono text-[11px] text-emerald-400 truncate">
              POST http://{machine.ipAddress}/configure?count={sprayCount}&interval={computedIntervalStr}
            </div>
          </div>

          {/* Action Buttons: Test Spray & Save Schedule */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isLocked && !isAdmin}
              onClick={handleSprayClick}
              className={`py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                isLocked && !isAdmin
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-800'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-700/60 shadow-lg active:scale-[0.98]'
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>Test Spray ({sprayCountLabel})</span>
            </button>

            <button
              type="submit"
              disabled={isLocked && !isAdmin}
              className={`py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                isLocked && !isAdmin
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 active:scale-[0.98]'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

