import React from 'react';
import { ArrowLeft, Plus, ShieldAlert, CheckCircle2, Wind, Droplet, Clock, Settings, Pencil, Trash2, Wifi, TimerReset } from 'lucide-react';
import { CustomerUser, Machine } from '../types';

interface AdminCustomerDevicesProps {
  user: CustomerUser;
  machines: Machine[];
  onBack: () => void;
  onOpenAddMachine: () => void;
  onOpenRenameMachine: (machine: Machine) => void;
  onOpenDeleteMachine: (machine: Machine) => void;
  onOpenMachineControl: (machine: Machine) => void;
  onToggleMasterLock: (machineId: string, newLockState: boolean) => void;
}

export const AdminCustomerDevices: React.FC<AdminCustomerDevicesProps> = ({
  user,
  machines,
  onBack,
  onOpenAddMachine,
  onOpenRenameMachine,
  onOpenDeleteMachine,
  onOpenMachineControl,
  onToggleMasterLock,
}) => {
  const assignedIds = user.assignedMachines || [];
  const clientMachines = machines.filter((m) => assignedIds.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <button
          type="button"
          onClick={onOpenAddMachine}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-950 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Link New ESP32 Unit</span>
        </button>
      </div>

      {/* Client Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                CLIENT ID: {user.customerId}
              </span>
              <span className="text-xs text-slate-500">Screen A2: Device Hub & Master Stop</span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight font-['Outfit']">
              {user.officeName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Contact: <strong className="text-slate-200">{user.customerName}</strong> • Phone: {user.phone || 'N/A'} • Assigned Units: {clientMachines.length}
            </p>
          </div>

          <div className="bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Active Security Status
            </div>
            <div className="flex items-center space-x-2 text-sm font-bold">
              {clientMachines.some((m) => m.isMasterLocked) ? (
                <span className="text-rose-400 flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span>Emergency Stop Active</span>
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>All Systems Nominal</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Machine Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-['Outfit']">
            Assigned Hardware Units ({clientMachines.length})
          </h3>
        </div>

        {clientMachines.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
            <Wind className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">No ESP32 Units Linked</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              This client does not have any fragrance dispensers linked yet.
            </p>
            <button
              type="button"
              onClick={onOpenAddMachine}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Link First Machine</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {clientMachines.map((machine) => {
              const isLocked = !!machine.isMasterLocked;

              return (
                <div
                  key={machine.id}
                  className={`bg-slate-900 rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between ${
                    isLocked
                      ? 'border-rose-500/50 bg-gradient-to-b from-rose-950/20 to-slate-900 shadow-xl shadow-rose-950/20'
                      : 'border-slate-800 hover:border-slate-700 shadow-xl shadow-slate-950/40'
                  }`}
                >
                  <div>
                    {/* Top Row: Machine name, ID, and edit tools */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                            {machine.id}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                            <Wifi className="w-3 h-3" />
                            <span>{machine.ipAddress}</span>
                          </span>
                        </div>

                        <h4 className="text-lg font-bold text-white font-['Outfit'] truncate">
                          {machine.customName}
                        </h4>

                        {machine.scentType && (
                          <div className="text-xs text-slate-400 mt-0.5">
                            Scent: <span className="text-slate-200 font-medium">{machine.scentType}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onOpenRenameMachine(machine)}
                          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Rename Machine"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenDeleteMachine(machine)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Unlink / Delete Machine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Schedule specs */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs mb-4">
                      <div className="flex items-center space-x-2">
                        <Droplet className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-slate-500 block text-[10px]">Spray Count</span>
                          <span className="font-mono font-bold text-slate-200">
                            {machine.sprayCount === 1 ? '1 time spray' : `${machine.sprayCount || 2} times spray`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                        <div>
                          <span className="text-slate-500 block text-[10px]">Interval</span>
                          <span className="font-mono font-bold text-slate-200">Every {machine.intervalMinutes}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center space-x-1.5">
                        <TimerReset className="w-4 h-4 text-violet-400" />
                        <span>Live countdown</span>
                      </span>
                      <span className="font-mono font-bold text-violet-400">
                        {typeof machine.nextSpraySec === 'number' ? `${Math.max(0, Math.ceil(machine.nextSpraySec / 60))} min` : 'Syncing...'}
                      </span>
                    </div>

                    {/* PROMINENT EMERGENCY MASTER STOP BANNER / BUTTON */}
                    <div className="mb-4">
                      {isLocked ? (
                        <div className="bg-rose-950/60 border border-rose-600/60 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                          <div className="flex items-center space-x-2 text-rose-300 text-xs">
                            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                            <div>
                              <span className="font-bold block">EMERGENCY STOP ENGAGED</span>
                              <span className="text-[11px] text-rose-300/80">Client cannot spray or update timers</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onToggleMasterLock(machine.id, false)}
                            className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-950 shrink-0 transition-all active:scale-[0.98]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Release Stop</span>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                          <div className="flex items-center space-x-2 text-slate-300 text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                            <div>
                              <span className="font-bold block text-emerald-400">Unit Active & Armed</span>
                              <span className="text-[11px] text-slate-500">Normal customer schedule running</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onToggleMasterLock(machine.id, true)}
                            className="py-2 px-3.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-rose-950 shrink-0 transition-all active:scale-[0.98]"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Emergency Master Stop</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card bottom bar: Test & Mirror Configure */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Signal: <span className="font-mono text-slate-400">HTTP REST</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => onOpenMachineControl(machine)}
                      className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
                    >
                      <Settings className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Configure & Test Pulse</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
