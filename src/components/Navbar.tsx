import React from 'react';
import { LogOut, ShieldCheck, UserCheck, Wifi, Sparkles } from 'lucide-react';
import { AuthRole, CustomerUser } from '../types';

interface NavbarProps {
  currentRole: AuthRole;
  currentUser: CustomerUser | null;
  onLogout: () => void;
  onSwitchRole?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-900/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-white font-['Outfit']">
                AuraMist <span className="text-emerald-400 text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 ml-1">ESP32 IoT</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {currentRole === 'admin'
                ? 'Master Admin Hardware Controller'
                : currentRole === 'customer'
                ? `${currentUser?.officeName || 'Client Portal'}`
                : 'Smart Fragrance Dispenser Gateway'}
            </p>
          </div>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center space-x-3">
          {/* Online Hardware indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono text-emerald-400">
            <Wifi className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>ESP32 Grid: Online</span>
          </div>

          {currentRole && (
            <>
              {/* Role badge */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
                {currentRole === 'admin' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-slate-200 hidden md:inline">Master Admin</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-slate-200 hidden md:inline">{currentUser?.customerName}</span>
                  </>
                )}
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/30 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-800 text-xs font-semibold transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
