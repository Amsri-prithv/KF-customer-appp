import React from 'react';
import { Wind, Droplets, CheckCircle2 } from 'lucide-react';
import { Machine } from '../types';

interface MistOverlayProps {
  machine: Machine | null;
  sprayCount: number;
}

export const MistOverlay: React.FC<MistOverlayProps> = ({
  machine,
  sprayCount,
}) => {
  const countLabel = sprayCount === 1 ? '1 time spray' : `${sprayCount} times spray`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative max-w-sm w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl shadow-emerald-500/10 text-center overflow-hidden">
        {/* Animated Mist Fog Waves */}
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          <div className="absolute -inset-10 bg-gradient-to-t from-emerald-500/20 via-teal-400/10 to-transparent blur-2xl animate-pulse" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-ping" />
        </div>

        {/* Icon & Mist Cloud Burst */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center mb-4 relative shadow-lg shadow-emerald-500/20">
            <Wind className="w-10 h-10 text-emerald-400 animate-bounce" />
            <Droplets className="w-5 h-5 text-teal-300 absolute -bottom-1 -right-1 animate-pulse" />
          </div>

          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs font-mono font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>DISPENSING FRAGRANCE</span>
          </span>

          <h3 className="text-xl font-bold text-white tracking-tight mb-1 font-['Outfit']">
            {machine?.customName || 'ESP32 Unit'}
          </h3>

          <p className="text-sm text-slate-400 font-mono mb-4">
            Cycle: <strong className="text-emerald-400">{countLabel}</strong> • IP: {machine?.ipAddress}
          </p>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-4 border border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: '100%' }}
            />
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Micro-nozzle solenoid energized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
