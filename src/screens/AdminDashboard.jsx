import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Tent, 
  FileText, 
  BarChart3, 
  Settings, 
  Building2, 
  ShieldAlert, 
  Microscope, 
  Stethoscope, 
  Plus, 
  TrendingUp, 
  Calendar, 
  Download, 
  Activity, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { CardSkeleton, TableRowSkeleton, ChartSkeleton } from '../components/LoadingSkeleton';
import { getDashboardStats, getCampOverview } from '../services/drRetinaApi';

export default function AdminDashboard({ selectedOrg, isDemoPopulated }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [camps, setCamps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const statsData = await getDashboardStats(selectedOrg?.id, 'admin');
        const campsData = await getCampOverview(selectedOrg?.id);

        if (isDemoPopulated) {
          // Simulated API response for live testing
          setStats({
            totalPatients: 1420,
            totalScreenings: 1890,
            highPriorityCases: 148,
            activeDoctors: 12,
            activeLabTechnicians: 28,
            activeCamps: 4,
            screeningVolume: [120, 180, 240, 310, 420, 580],
            severityDistribution: {
              noDR: 980,
              mildNPDR: 420,
              moderateNPDR: 342,
              severeNPDR: 104,
              proliferativeDR: 44
            },
            recentActivity: [
              { id: '1', time: '10 mins ago', action: 'Camp Unit #4 (Rural District North) started screening session', user: 'Technician Lead' },
              { id: '2', time: '25 mins ago', action: 'Dr. Anita Desai verified 14 high-priority screening reports', user: 'Dr. Anita Desai' },
              { id: '3', time: '1 hour ago', action: 'AI Model v2.4 recalibrated for non-mydriatic camera profiles', user: 'System Service' }
            ]
          });
          setCamps([
            { id: 'c1', name: 'North District Community Camp #1', location: 'Primary Health Centre, Bhor', activeWorkers: 6, screenedCount: 142, status: 'Active' },
            { id: 'c2', name: 'Mobile Retinal Screening Van #2', location: 'Sector 7 Rural Outreach', activeWorkers: 4, screenedCount: 88, status: 'Active' },
            { id: 'c3', name: 'Taluka Diabetic Clinic Camp', location: 'Civil Hospital Annex', activeWorkers: 8, screenedCount: 210, status: 'Active' }
          ]);
        } else {
          // Real clean empty state defaults (Zero fake data)
          setStats(statsData || {
            totalPatients: 0,
            totalScreenings: 0,
            highPriorityCases: 0,
            activeDoctors: 0,
            activeLabTechnicians: 0,
            activeCamps: 0,
            recentActivity: [],
            screeningVolume: [],
            severityDistribution: { noDR: 0, mildNPDR: 0, moderateNPDR: 0, severeNPDR: 0, proliferativeDR: 0 }
          });
          setCamps(campsData || []);
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
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'workers', label: 'Healthcare Workers', icon: UserCheck },
    { id: 'camps', label: 'Screening Camps', icon: Tent },
    { id: 'patients', label: 'Patients', icon: FileText },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          {/* Organization Badge */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {selectedOrg?.name || 'Main Hospital Org'}
                </h4>
                <p className="text-[10px] text-teal-700 font-medium">Administrator Console</p>
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
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Health Status */}
        <div className="pt-4 border-t border-slate-100 mt-6">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-700">AI Screening Server</span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Operational
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Dr.Retina Core Engine v2.4</p>
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
                Administrator Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                Live Overview
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              System monitoring, screening camp oversight, and healthcare worker management.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex items-center gap-2.5">
            <button className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              <span>Add Healthcare Worker</span>
            </button>
            <button className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/20 transition-all flex items-center gap-1.5">
              <Tent className="w-3.5 h-3.5" />
              <span>Create Screening Camp</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Patients"
            value={stats?.totalPatients?.toLocaleString() || '0'}
            subtitle="Registered in system"
            icon={Users}
            color="teal"
            isLoading={isLoading}
          />
          <StatCard
            title="Total Screenings"
            value={stats?.totalScreenings?.toLocaleString() || '0'}
            subtitle="Fundus scans analyzed"
            icon={Eye}
            color="cyan"
            isLoading={isLoading}
          />
          <StatCard
            title="High-Priority Cases"
            value={stats?.highPriorityCases?.toLocaleString() || '0'}
            subtitle="Urgent clinical review"
            icon={ShieldAlert}
            color="rose"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Doctors"
            value={stats?.activeDoctors?.toLocaleString() || '0'}
            subtitle="Ophthalmologist roster"
            icon={Stethoscope}
            color="emerald"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Lab Techs"
            value={stats?.activeLabTechnicians?.toLocaleString() || '0'}
            subtitle="Camp screener staff"
            icon={Microscope}
            color="slate"
            isLoading={isLoading}
          />
        </div>

        {/* Middle Section: Screening Statistics & Active Camps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Screening Statistics Chart Card */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Screening Statistics & AI Volume</h3>
                <p className="text-xs text-slate-500 mt-0.5">Aggregate screening intake across field camps</p>
              </div>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Monthly Trend
              </span>
            </div>

            {isLoading ? (
              <ChartSkeleton />
            ) : stats?.screeningVolume && stats.screeningVolume.length > 0 ? (
              <div className="space-y-4">
                <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100">
                  {stats.screeningVolume.map((vol, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-700">{vol}</span>
                      <div
                        style={{ height: `${Math.min(100, (vol / 600) * 100)}%` }}
                        className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-teal-700 to-teal-500 hover:to-cyan-400 transition-all cursor-pointer"
                      ></div>
                      <span className="text-[10px] text-slate-400 font-medium mt-1">M{idx + 1}</span>
                    </div>
                  ))}
                </div>

                {/* Severity Breakdown Bar */}
                <div className="grid grid-cols-5 gap-2 text-center text-xs pt-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                    <span className="block text-[10px] font-medium text-emerald-600">No DR</span>
                    <strong className="text-xs">{stats.severityDistribution.noDR}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-100">
                    <span className="block text-[10px] font-medium text-teal-600">Mild NPDR</span>
                    <strong className="text-xs">{stats.severityDistribution.mildNPDR}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-100">
                    <span className="block text-[10px] font-medium text-yellow-600">Mod NPDR</span>
                    <strong className="text-xs">{stats.severityDistribution.moderateNPDR}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
                    <span className="block text-[10px] font-medium text-amber-600">Severe NPDR</span>
                    <strong className="text-xs">{stats.severityDistribution.severeNPDR}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-100">
                    <span className="block text-[10px] font-medium text-rose-600">PDR (Critical)</span>
                    <strong className="text-xs">{stats.severityDistribution.proliferativeDR}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                type="screenings"
                title="No screening records available"
                description="When healthcare workers screen patients at camps, longitudinal volume metrics will render here."
                compact={true}
              />
            )}
          </div>

          {/* User Management & Quick Actions Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">User Management Shortcuts</h3>
              <p className="text-xs text-slate-500 mb-4">Quick actions for administrators</p>
              
              <div className="space-y-2.5">
                <button className="w-full p-3 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Assign Ophthalmologists</h4>
                      <p className="text-[10px] text-slate-500">Route priority cases to doctor queues</p>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                </button>

                <button className="w-full p-3 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                      <Microscope className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Provision Field Screener</h4>
                      <p className="text-[10px] text-slate-500">Grant camp tablet & camera access</p>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                </button>

                <button className="w-full p-3 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Export Audit & Camp Reports</h4>
                      <p className="text-[10px] text-slate-500">Download CSV/PDF summary</p>
                    </div>
                  </div>
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400 font-medium">All user accounts authenticated via organization SSO</span>
            </div>
          </div>

        </div>

        {/* Bottom Section: Screening Camps Overview & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Active Camps Table */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Screening Camp Overview</h3>
                <p className="text-xs text-slate-500 mt-0.5">Active field units and rural outreach centers</p>
              </div>
              <button className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>New Camp</span>
              </button>
            </div>

            {camps.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                      <th className="pb-2">Camp Name</th>
                      <th className="pb-2">Location</th>
                      <th className="pb-2 text-center">Screened</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {camps.map((camp) => (
                      <tr key={camp.id} className="hover:bg-slate-50">
                        <td className="py-3 font-bold text-slate-800 flex items-center gap-2">
                          <Tent className="w-3.5 h-3.5 text-teal-600" />
                          <span>{camp.name}</span>
                        </td>
                        <td className="py-3 text-slate-500">{camp.location}</td>
                        <td className="py-3 text-center font-semibold text-slate-700">{camp.screenedCount}</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                            {camp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                type="search"
                title="No active screening camps recorded"
                description="Set up your first rural screening camp or mobile clinic unit to start capturing patient records."
                actionLabel="Create Screening Camp"
                onAction={() => {}}
                compact={true}
              />
            )}
          </div>

          {/* Recent Activity Log */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
                <p className="text-xs text-slate-500 mt-0.5">System audit log & camp operational events</p>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((act) => (
                  <div key={act.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-800">{act.action}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                        <span>{act.user}</span>
                        <span>•</span>
                        <span>{act.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                type="default"
                title="No recent administrative activity"
                description="Administrative events, camp launches, and doctor validations will appear in this real-time log."
                compact={true}
              />
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
