import React from 'react';
import { ShieldAlert, Droplet, Clock, ChevronRight, Wind, AlertCircle, Building, Phone, Sparkles, TimerReset } from 'lucide-react';
import { CustomerUser, Machine } from '../types';

interface CustomerDashboardProps {
  user: CustomerUser;
  machines: Machine[];
  onOpenMachineControl: (machine: Machine) => void;
  onQuickSpray: (machine: Machine) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  machines,
  onOpenMachineControl,
  onQuickSpray,
}) => {
  const isMatchingMachine = (machine: Machine, targetId?: string) => {
    if (!targetId || !machine) return false;
    const mClientId = (machine.clientId || (machine as any).client_id || '').trim().toUpperCase();
    const cId = targetId.trim().toUpperCase();
    return mClientId === cId;
  };

  const clientMachines = machines.filter((m) => isMatchingMachine(m, user.customerId));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Customer Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CLIENT ID: {user.customerId}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit']">
              {user.officeName}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-400">
              <span className="flex items-center space-x-1.5 text-slate-300">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>Contact: <strong className="text-white">{user.customerName}</strong></span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{user.phone || 'No phone recorded'}</span>
              </span>
            </div>
          </div>

          {/* Quick metric counter */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-center">
              <div className="text-xl font-bold text-emerald-400 font-['Outfit']">
                {clientMachines.length}
              </div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Assigned Units
              </div>
            </div>

            <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-center">
              <div className="text-xl font-bold text-teal-400 font-['Outfit']">
                {clientMachines.filter((m) => !m.isMasterLocked).length}
              </div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Operational
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
            Fragrance Dispensers
          </h3>
          <p className="text-xs text-slate-400">
            Configure spray cycle durations, schedule intervals, or trigger immediate scent diffusion.
          </p>
        </div>
      </div>

      {/* Machine Cards Grid */}
      {clientMachines.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No Machines Assigned</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Your facility does not currently have any active ESP32 fragrance dispensers assigned. Please contact the Master Admin to link a device.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {clientMachines.map((machine) => {
            const isLocked = !!machine.isMasterLocked;

            return (
              <div
                key={machine.id}
                className={`bg-slate-900 rounded-3xl p-5 sm:p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isLocked
                    ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-slate-900 shadow-lg shadow-amber-950/20'
                    : 'border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-slate-950/50'
                }`}
              >
                {/* Master Stop Warning Strip if locked */}
                {isLocked && (
                  <div className="mb-4 bg-amber-950/60 border border-amber-600/50 text-amber-200 rounded-2xl p-3 flex items-start space-x-2.5 text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Maintenance Lock Active</span>
                      <p className="text-amber-300/80 text-[11px] mt-0.5 leading-relaxed">
                        Dispenser paused by Support Team. Manual spray and scheduled intervals are temporarily suspended.
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  {/* Top card bar: Icon + Title + Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                          isLocked
                            ? 'bg-amber-950/80 text-amber-400 border-amber-800/80'
                            : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                        }`}
                      >
                        <Wind className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-base truncate font-['Outfit']">
                          {machine.customName}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                            {machine.id}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {machine.ipAddress}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                        isLocked
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isLocked ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'
                        }`}
                      />
                      <span>{isLocked ? 'Master Stopped' : 'Active'}</span>
                    </span>
                  </div>

                  {/* Scent & Settings Summary */}
                  <div className="bg-slate-950/70 rounded-2xl p-3 border border-slate-800/80 space-y-2 mb-4">
                    {machine.scentType && (
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/60">
                        <span className="text-slate-400 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Fragrance Note:</span>
                        </span>
                        <span className="font-medium text-slate-200">{machine.scentType}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center space-x-1.5">
                        <Droplet className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Spray Count:</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
                        {machine.sprayCount === 1 ? '1 time spray' : `${machine.sprayCount || 2} times spray`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        <span>Repeat Frequency:</span>
                      </span>
                      <span className="font-mono font-bold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-900/60">
                        Every {machine.intervalMinutes}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center space-x-1.5">
                        <TimerReset className="w-3.5 h-3.5 text-violet-400" />
                        <span>Next Spray:</span>
                      </span>
                      <span className="font-mono font-bold text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-900/60">
                        {typeof machine.nextSpraySec === 'number' ? `${Math.max(0, Math.ceil(machine.nextSpraySec / 60))} min` : 'Syncing...'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => onQuickSpray(machine)}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                      isLocked
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 active:scale-[0.98]'
                    }`}
                    title={isLocked ? 'Machine locked by Master Admin' : 'Spray immediate pulse'}
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>{isLocked ? 'Disabled' : 'Spray Now'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenMachineControl(machine)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition-colors"
                  >
                    <span>{isLocked ? 'Details' : 'Configure'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
