import React from 'react';
import { Eye, Shield, User, Building2, Stethoscope, Microscope, LayoutDashboard, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';

export default function Navigation({ currentScreen, setCurrentScreen, userRole, setUserRole, selectedOrg, setSelectedOrg, isDemoPopulated, setIsDemoPopulated }) {
  const screens = [
    { id: 'landing', label: '1. Landing Page', icon: Eye, badge: 'Public' },
    { id: 'org_select', label: '2. Org Selection', icon: Building2, badge: 'Auth Flow' },
    { id: 'login', label: '3. Role Login', icon: User, badge: 'Auth Flow' },
    { id: 'admin_dashboard', label: '4. Admin Dashboard', icon: LayoutDashboard, badge: 'Admin Role' },
    { id: 'doctor_dashboard', label: '5. Doctor Dashboard', icon: Stethoscope, badge: 'Doctor Role' },
    { id: 'lab_tech_dashboard', label: '6. Lab Tech Dashboard', icon: Microscope, badge: 'Lab Tech Role' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-sm">
      {/* Top Screen Selector Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Sparkles className="w-3 h-3 mr-1" /> SCREEN SELECTOR
            </span>
            <span className="text-slate-400 hidden sm:inline">Inspect separate high-fidelity screens:</span>
          </div>

          {/* Screen Switch Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {screens.map((screen) => {
              const Icon = screen.icon;
              const isActive = currentScreen === screen.id;
              return (
                <button
                  key={screen.id}
                  onClick={() => {
                    setCurrentScreen(screen.id);
                    if (screen.id === 'admin_dashboard') setUserRole('admin');
                    if (screen.id === 'doctor_dashboard') setUserRole('doctor');
                    if (screen.id === 'lab_tech_dashboard') setUserRole('lab_tech');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{screen.label}</span>
                </button>
              );
            })}
          </div>

          {/* Toggle for Empty State vs Live API Simulation */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
            <button
              onClick={() => setIsDemoPopulated(!isDemoPopulated)}
              title="Toggle to view empty state vs simulated backend responses"
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                isDemoPopulated
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isDemoPopulated ? 'API Simulated Data' : 'Clean Empty State'}</span>
            </button>
          </div>
        </div>
      </div>

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
              <a href="#clinical-safety" className="hover:text-teal-600 transition-colors">Clinical Safety</a>
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
