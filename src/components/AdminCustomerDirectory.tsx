import React, { useState } from 'react';
import { Search, UserPlus, Building, HardDrive, Key, Eye, EyeOff, Copy, ArrowRight, Pencil, Trash2, ShieldAlert, Sparkles, Phone } from 'lucide-react';
import { CustomerUser, Machine } from '../types';

interface AdminCustomerDirectoryProps {
  users: CustomerUser[];
  machines: Machine[];
  onSelectCustomer: (customerId: string) => void;
  onOpenAddCustomer: () => void;
  onOpenEditCustomer: (user: CustomerUser) => void;
  onOpenDeleteCustomer: (user: CustomerUser) => void;
  onCopyText: (text: string, label: string) => void;
}

export const AdminCustomerDirectory: React.FC<AdminCustomerDirectoryProps> = ({
  users,
  machines,
  onSelectCustomer,
  onOpenAddCustomer,
  onOpenEditCustomer,
  onOpenDeleteCustomer,
  onCopyText,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  const togglePassword = (customerId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [customerId]: !prev[customerId],
    }));
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.officeName.toLowerCase().includes(q) ||
      u.customerName.toLowerCase().includes(q) ||
      u.customerId.toLowerCase().includes(q) ||
      (u.phone && u.phone.toLowerCase().includes(q))
    );
  });

  const totalMachinesCount = machines.length;
  const lockedMachinesCount = machines.filter((m) => m.isMasterLocked).length;
  const activeMachinesCount = totalMachinesCount - lockedMachinesCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Stats Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-mono font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>SCREEN A1: MASTER DIRECTORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit']">
              Client & Facility Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
              Oversee multi-tenant accounts, manage client access credentials, and monitor ESP32 hardware assignments.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="bg-slate-950/80 p-3 sm:p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                {users.length}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Clients
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 sm:p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-['Outfit']">
                {activeMachinesCount}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Units
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 sm:p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-xl sm:text-2xl font-bold text-rose-400 font-['Outfit']">
                {lockedMachinesCount}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Stopped
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip: Search Filter + Add Client Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients by office, contact, or ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 text-sm outline-none transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={onOpenAddCustomer}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-950 transition-all active:scale-[0.98] shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Client</span>
        </button>
      </div>

      {/* Client Cards Grid */}
      {filteredUsers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">
            {users.length === 0 ? 'No Clients Registered Yet' : 'No Matching Clients Found'}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-5">
            {users.length === 0
              ? 'Get started by creating your first client account with a Customer ID, secure password, and assigned ESP32 units.'
              : 'Try adjusting your search criteria or register a new facility client.'}
          </p>
          {users.length === 0 && (
            <button
              type="button"
              onClick={onOpenAddCustomer}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-950 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register First Client</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
          {filteredUsers.map((user) => {
            const assignedIds = user.assignedMachines || [];
            const userMachines = machines.filter((m) => assignedIds.includes(m.id));
            const lockedCount = userMachines.filter((m) => m.isMasterLocked).length;
            const isRevealed = !!revealedPasswords[user.customerId];

            return (
              <div
                key={user.customerId}
                className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 hover:border-slate-700/80 shadow-xl shadow-slate-950/40 flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Card Header: Office name & action tools */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {user.customerId}
                        </span>
                        <h3 className="font-bold text-lg text-white font-['Outfit'] truncate">
                          {user.officeName}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-400">
                        <span>Contact: <strong className="text-slate-200">{user.customerName}</strong></span>
                        {user.phone && (
                          <span className="flex items-center space-x-1 text-slate-500">
                            <Phone className="w-3 h-3" />
                            <span>{user.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenEditCustomer(user)}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                        title="Edit Client"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDeleteCustomer(user)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Password reveal & copy bar */}
                  <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 flex items-center justify-between text-xs mb-4">
                    <div className="flex items-center space-x-2 min-w-0">
                      <Key className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-400">Client Access Key:</span>
                      <span className="font-mono font-bold text-slate-200 truncate">
                        {isRevealed ? user.password : '••••••••'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => togglePassword(user.customerId)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white"
                        title={isRevealed ? 'Hide Password' : 'Show Password'}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onCopyText(user.password, 'Client Password')}
                        className="p-1 rounded-lg text-emerald-400 hover:text-emerald-300"
                        title="Copy Password"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer: Machine count + Manage Devices Drilldown */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium">
                      <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                      <span>{userMachines.length} Units</span>
                    </span>

                    {lockedCount > 0 ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                        <span>{lockedCount} Stopped</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>All Normal</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCustomer(user.customerId)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-950 transition-all active:scale-[0.98]"
                  >
                    <span>Manage Devices</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
