import React, { useState, useEffect } from 'react';
import { 
  Microscope, 
  UserPlus, 
  Camera, 
  Users, 
  FileCheck2, 
  History, 
  LayoutDashboard, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Wifi, 
  Battery, 
  Plus, 
  ArrowRight,
  Search
} from 'lucide-react';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import SeverityBadge from '../components/SeverityBadge';
import QuickPatientModal from '../components/QuickPatientModal';
import ScreeningUploadModal from '../components/ScreeningUploadModal';
import { getPatients, getScreeningResults, getDashboardStats } from '../services/drRetinaApi';

export default function LabTechDashboard({ selectedOrg, isDemoPopulated }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isScreeningOpen, setIsScreeningOpen] = useState(false);
  const [recentScreenings, setRecentScreenings] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const statsData = await getDashboardStats(selectedOrg?.id, 'lab_tech');
        const screeningsData = await getScreeningResults({ limit: 10 });

        if (isDemoPopulated) {
          // Simulated API dataset for live demonstration
          setStats({
            screenedToday: 38,
            pendingAnalysis: 2,
            completedScreenings: 36,
            recentPatientsCount: 38
          });
          setRecentScreenings([
            {
              id: 'SC-809',
              patientName: 'Devendra Patel',
              mrn: 'MRN-2026-0902',
              time: '8 mins ago',
              eye: 'OD (Right)',
              severity: 'Mild NPDR',
              status: 'Completed'
            },
            {
              id: 'SC-808',
              patientName: 'Sunita Rao',
              mrn: 'MRN-2026-0901',
              time: '22 mins ago',
              eye: 'OU (Both)',
              severity: 'Severe NPDR',
              status: 'Queued to Doctor'
            },
            {
              id: 'SC-807',
              patientName: 'Govind Swamy',
              mrn: 'MRN-2026-0900',
              time: '45 mins ago',
              eye: 'OS (Left)',
              severity: 'No DR Detected',
              status: 'Completed'
            }
          ]);
        } else {
          // Zero fake data - clean empty state
          setStats(statsData || {
            screenedToday: 0,
            pendingAnalysis: 0,
            completedScreenings: 0,
            recentPatientsCount: 0
          });
          setRecentScreenings(screeningsData || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedOrg, isDemoPopulated]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'register', label: 'Register Patient', icon: UserPlus, action: () => setIsRegisterOpen(true) },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'screening', label: 'New Screening', icon: Camera, action: () => setIsScreeningOpen(true) },
    { id: 'history', label: 'Screening History', icon: History },
  ];

  const handlePatientRegistered = (newPatient) => {
    // Open screening modal immediately after registering
    setTimeout(() => {
      setIsScreeningOpen(true);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          {/* Camp Screener Capsule */}
          <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <Microscope className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-900 truncate">Camp Technician</h4>
                <p className="text-[10px] text-cyan-700 font-medium truncate">{selectedOrg?.name || 'Rural Camp Unit #1'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveNav(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.action && (
                    <Plus className="w-3.5 h-3.5 opacity-60" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Camp Field Connectivity & Battery Status */}
        <div className="pt-4 border-t border-slate-100 mt-6 space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-700 font-bold mb-1 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-teal-600" />
                Camp Network
              </span>
              <span className="text-emerald-600 text-[10px]">4G Connected</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 text-[10px]">
              <span>Camera Hardware</span>
              <span className="font-semibold text-slate-700">Portable Non-Mydriatic</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Lab Technician Workspace
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold">
                Rapid Camp Intake
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              High-throughput screening console engineered for field health camps and mobile eye vans.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>Active Camp Shift</span>
          </div>
        </div>

        {/* TWO PROMINENT PRIMARY ACTIONS (High-speed buttons as requested) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          
          {/* Action 1: Register New Patient */}
          <div
            onClick={() => setIsRegisterOpen(true)}
            className="p-6 rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white shadow-xl shadow-teal-600/20 hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none transform translate-x-8 -translate-y-8"></div>
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase mb-3">
                  Step 1 • Intake
                </span>
                <h3 className="text-2xl font-black tracking-tight">
                  + Register New Patient
                </h3>
                <p className="text-xs text-teal-100 mt-2 max-w-sm leading-relaxed">
                  Fast demographic registration and diabetes duration recording for incoming camp attendees.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white text-teal-700 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <UserPlus className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-teal-500/50 flex items-center justify-between text-xs font-bold text-teal-100 group-hover:text-white">
              <span>Launch Intake Form</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 2: Start New Screening */}
          <div
            onClick={() => setIsScreeningOpen(true)}
            className="p-6 rounded-3xl bg-gradient-to-br from-cyan-600 via-cyan-700 to-teal-700 text-white shadow-xl shadow-cyan-600/20 hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none transform translate-x-8 -translate-y-8"></div>
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase mb-3">
                  Step 2 • Fundus Capture
                </span>
                <h3 className="text-2xl font-black tracking-tight">
                  Start New Screening
                </h3>
                <p className="text-xs text-cyan-100 mt-2 max-w-sm leading-relaxed">
                  Capture fundus photography, execute instant AI quality checks, and compute ICDR severity.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white text-cyan-700 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-cyan-500/50 flex items-center justify-between text-xs font-bold text-cyan-100 group-hover:text-white">
              <span>Open Fundus Camera AI Pipeline</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Shift Metrics Cards (Screened today, Pending, Completed, Recent Patients) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Screened Today"
            value={stats?.screenedToday?.toString() || '0'}
            subtitle="Camp daily throughput"
            icon={Eye}
            color="teal"
            isLoading={isLoading}
          />
          <StatCard
            title="Pending Analyses"
            value={stats?.pendingAnalysis?.toString() || '0'}
            subtitle="Processing in AI queue"
            icon={Clock}
            color="amber"
            isLoading={isLoading}
          />
          <StatCard
            title="Completed Screenings"
            value={stats?.completedScreenings?.toString() || '0'}
            subtitle="Sent to doctor triage"
            icon={CheckCircle2}
            color="emerald"
            isLoading={isLoading}
          />
          <StatCard
            title="Recent Patients"
            value={stats?.recentPatientsCount?.toString() || '0'}
            subtitle="Logged in camp shift"
            icon={Users}
            color="cyan"
            isLoading={isLoading}
          />
        </div>

        {/* Recent Patients Screenings Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Camp Patients</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time status of fundus captures during this screening camp</p>
            </div>
            <button
              onClick={() => setIsScreeningOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Screen Next Patient</span>
            </button>
          </div>

          {recentScreenings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Patient Name</th>
                    <th className="py-3.5 px-4">Patient MRN</th>
                    <th className="py-3.5 px-4">Eye Lateral</th>
                    <th className="py-3.5 px-4">AI Screening Severity</th>
                    <th className="py-3.5 px-4">Time</th>
                    <th className="py-3.5 px-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentScreenings.map((sc) => (
                    <tr key={sc.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-5 font-bold text-slate-800">{sc.patientName}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{sc.mrn}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{sc.eye}</td>
                      <td className="py-3.5 px-4">
                        <SeverityBadge severity={sc.severity} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{sc.time}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold text-[11px]">
                          {sc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState
                type="screenings"
                title="No patients screened today in current camp"
                description="Click '+ Register New Patient' or 'Start New Screening' to process your first camp attendee."
                actionLabel="+ Register Patient"
                onAction={() => setIsRegisterOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Interactive Modals */}
        <QuickPatientModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onPatientRegistered={handlePatientRegistered}
          selectedOrg={selectedOrg}
        />

        <ScreeningUploadModal
          isOpen={isScreeningOpen}
          onClose={() => setIsScreeningOpen(false)}
          onScreeningCompleted={(result) => {
            console.log('Screening completed:', result);
          }}
        />

      </main>
    </div>
  );
}
