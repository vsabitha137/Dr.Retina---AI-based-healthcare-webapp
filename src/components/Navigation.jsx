import React from 'react';
import { Eye, Shield, Building2, ChevronRight } from 'lucide-react';

export default function Navigation({ currentScreen, setCurrentScreen, userRole, selectedOrg }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-sm">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentScreen('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-500 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="relative flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
                <span className="absolute w-2 h-2 rounded-full bg-cyan-200 top-0 right-0 animate-ping"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                  Dr.<span className="text-teal-600">Retina</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  AI Screening
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 font-medium">Diabetic Retinopathy Screening Portal</p>
            </div>
          </div>

          {/* Center Links (Landing Mode vs Dashboard Mode) */}
          {currentScreen === 'landing' ? (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How It Works</a>
              <a href="#benefits" className="hover:text-teal-600 transition-colors">Camp Benefits</a>
              <a href="#disclaimer" className="hover:text-teal-600 transition-colors">Medical Disclaimer</a>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-3 text-xs">
              {selectedOrg && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>{selectedOrg.name}</span>
                </div>
              )}
              {userRole && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-medium">
                  <Shield className="w-3.5 h-3.5 text-teal-600" />
                  <span className="capitalize">{userRole.replace('_', ' ')} Mode</span>
                </div>
              )}
            </div>
          )}

          {/* Right Action CTA */}
          <div className="flex items-center gap-3">
            {currentScreen === 'landing' ? (
              <button
                onClick={() => setCurrentScreen('org_select')}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-md shadow-teal-600/20 transition-all hover:shadow-lg hover:scale-[1.02] gap-2"
              >
                <span>Login</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentScreen('landing')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Exit to Home
                </button>
                <button
                  onClick={() => setCurrentScreen('org_select')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
                >
                  Switch Org / Role
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
