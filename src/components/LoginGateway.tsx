import React, { useState } from 'react';
import { Shield, User, Key, Building2, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { CustomerUser } from '../types';

interface LoginGatewayProps {
  users: CustomerUser[];
  onCustomerLogin: (customerId: string, password: string) => void;
  onAdminLogin: (username: string, password: string) => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  users,
  onCustomerLogin,
  onAdminLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');

  // Customer form inputs
  const [customerId, setCustomerId] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [showCustPassword, setShowCustPassword] = useState(false);

  // Admin form inputs
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCustomerLogin(customerId.trim().toUpperCase(), customerPassword.trim());
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdminLogin(adminUsername.trim(), adminPassword.trim());
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/80 relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Branding */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-900/40 mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-['Outfit']">
            AuraMist Gateway
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dual-Role ESP32 Fragrance & Scent Machine Controller
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center mb-6 relative z-10">
          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'customer'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Master Admin Hub</span>
          </button>
        </div>

        {/* CUSTOMER LOGIN FORM */}
        {activeTab === 'customer' && (
          <form autoComplete="off" onSubmit={handleCustomerSubmit} className="space-y-4 relative z-10 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Customer Identifier (ID)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="e.g. CUST-101"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-600 text-sm font-mono tracking-wider transition-colors outline-none uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Client Access Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showCustPassword ? 'text' : 'password'}
                  required
                  value={customerPassword}
                  onChange={(e) => setCustomerPassword(e.target.value)}
                  placeholder="Enter access password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-600 text-sm transition-colors outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCustPassword(!showCustPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showCustPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <span>Access Client Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-3 text-center">
              <p className="text-[11px] text-slate-500">
                Facility credentials are created and managed by the Master Administrator.
              </p>
            </div>
          </form>
        )}

        {/* MASTER ADMIN LOGIN FORM */}
        {activeTab === 'admin' && (
          <form autoComplete="off" onSubmit={handleAdminSubmit} className="space-y-4 relative z-10 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Master Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Shield className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-600 text-sm font-mono transition-colors outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Master Security Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-600 text-sm transition-colors outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-950 transition-all"
            >
              <span>Authenticate Master Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

        {/* Feature Highlights */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-around text-[11px] text-slate-400">
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>ESP32 HTTP Mesh</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Emergency Kill-Switch</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-Tenant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
