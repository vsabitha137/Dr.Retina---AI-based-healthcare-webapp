import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  ShieldAlert, 
  Users, 
  History, 
  FileText, 
  CalendarClock, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  ChevronRight, 
  ArrowUpRight, 
  Clock, 
  Sparkles,
  Download,
  Check,
  X
} from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import { TableRowSkeleton } from '../components/LoadingSkeleton';
import { getDoctorPatients, getScreeningResults, getConsultations } from '../services/drRetinaApi';

export default function DoctorDashboard({ selectedOrg, isDemoPopulated }) {
  const [activeNav, setActiveNav] = useState('dashboard'); // 'dashboard' | 'priority' | 'patients' | 'history' | 'reports' | 'followups'
  const [activeQueueTab, setActiveQueueTab] = useState('high_priority'); // 'high_priority' | 'moderate' | 'recent' | 'followups'
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getDoctorPatients('doc-current', { tab: activeQueueTab });
        
        if (isDemoPopulated) {
          // Clean simulated API dataset for testing live verification workflow
          setPatients([
            {
              id: 'P-1048',
              mrn: 'MRN-2026-0891',
              fullName: 'Kavita Sundaram',
              age: 58,
              gender: 'Female',
              screeningDate: '2026-08-27 (Today)',
              campLocation: 'District Rural Camp #4',
              severity: 'Proliferative DR',
              priorityStatus: 'Immediate Review',
              dmeRisk: 'High DME Risk',
              hba1cTested: true,
              aiConfidence: 99.1,
              findings: ['Neovascularization at Disc (NVD)', 'Preretinal Hemorrhage in Upper Arcade']
            },
            {
              id: 'P-1042',
              mrn: 'MRN-2026-0842',
              fullName: 'Rajesh K. Verma',
              age: 64,
              gender: 'Male',
              screeningDate: '2026-08-27 (Today)',
              campLocation: 'Civil Hospital Camp',
              severity: 'Severe NPDR',
              priorityStatus: 'High Priority',
              dmeRisk: 'Moderate DME',
              hba1cTested: true,
              aiConfidence: 97.8,
              findings: ['Venous Beading in 2 Quadrants', 'Multiple Intraretinal Hemorrhages']
            },
            {
              id: 'P-1039',
              mrn: 'MRN-2026-0810',
              fullName: 'Meenakshi Iyer',
              age: 51,
              gender: 'Female',
              screeningDate: '2026-08-26',
              campLocation: 'Taluka Primary Clinic',
              severity: 'Moderate NPDR',
              priorityStatus: 'Moderate',
              dmeRisk: 'No DME',
              hba1cTested: true,
              aiConfidence: 96.5,
              findings: ['Microaneurysms (<10)', 'Hard Exudates outside Fovea']
            }
          ]);
        } else {
          // Zero fake records - clean empty state
          setPatients(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [activeQueueTab, isDemoPopulated]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Stethoscope },
    { id: 'priority', label: 'Priority Cases', icon: ShieldAlert, badge: isDemoPopulated ? '2 Urgent' : null },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'history', label: 'Screening History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'followups', label: 'Follow-ups', icon: CalendarClock },
  ];

  const filteredPatients = patients.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchName = p.fullName?.toLowerCase().includes(term);
    const matchId = p.mrn?.toLowerCase().includes(term) || p.id?.toLowerCase().includes(term);
    
    if (activeQueueTab === 'high_priority') {
      return (matchName || matchId) && (p.severity === 'Proliferative DR' || p.severity === 'Severe NPDR' || p.priorityStatus === 'Immediate Review' || p.priorityStatus === 'High Priority');
    }
    if (activeQueueTab === 'moderate') {
      return (matchName || matchId) && (p.severity === 'Moderate NPDR' || p.priorityStatus === 'Moderate');
    }
    return matchName || matchId;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          {/* Doctor Profile Capsule */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-900 truncate">Dr. Retina Specialist</h4>
                <p className="text-[10px] text-teal-700 font-medium truncate">{selectedOrg?.name || 'Ophthalmology Reviewer'}</p>
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
                    setActiveNav(item.id);
                    if (item.id === 'priority') setActiveQueueTab('high_priority');
                    if (item.id === 'history') setActiveQueueTab('recent');
                    if (item.id === 'followups') setActiveQueueTab('followups');
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
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Clinical Triage Help Callout */}
        <div className="pt-4 border-t border-slate-100 mt-6">
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs">
            <div className="flex items-center gap-1.5 text-teal-300 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Triage Objective</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Prioritize sight-threatening proliferative DR and severe cases first to expedite laser & anti-VEGF therapy.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Doctor Review Workspace
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-600" />
                Priority Triage Mode
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Review AI screening severity, verify fundus findings, and determine urgent clinical actions.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Patient / MRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
            />
          </div>
        </div>

        {/* Priority Question Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-teal-200">Clinical Focus: Which patients need attention first?</h3>
              <p className="text-xs text-slate-300">Patients below are automatically sorted by AI severity and urgency ranking.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-teal-300 bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700">
              Dual-Verification Protocol
            </span>
          </div>
        </div>

        {/* Category Queue Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveQueueTab('high_priority')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeQueueTab === 'high_priority'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>High-Priority Requiring Review</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeQueueTab === 'high_priority' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {isDemoPopulated ? '2' : '0'}
            </span>
          </button>

          <button
            onClick={() => setActiveQueueTab('moderate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeQueueTab === 'moderate'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Moderate Priority</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeQueueTab === 'moderate' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {isDemoPopulated ? '1' : '0'}
            </span>
          </button>

          <button
            onClick={() => setActiveQueueTab('recent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeQueueTab === 'recent'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Recent Screenings</span>
          </button>

          <button
            onClick={() => setActiveQueueTab('followups')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeQueueTab === 'followups'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Follow-up Patients</span>
          </button>
        </div>

        {/* Patient Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden mb-8">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {activeQueueTab === 'high_priority' && 'High-Priority Cases Requiring Review'}
                {activeQueueTab === 'moderate' && 'Moderate Priority Screening Queue'}
                {activeQueueTab === 'recent' && 'Recent Screenings & AI Assessments'}
                {activeQueueTab === 'followups' && 'Scheduled Patient Follow-ups'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-attribute severity indicators with automated AI lesion triage
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Sort: <strong>Urgency Descending</strong></span>
            </div>
          </div>

          {isLoading ? (
            <div className="p-6">
              <table className="w-full">
                <tbody>
                  <TableRowSkeleton cols={6} />
                  <TableRowSkeleton cols={6} />
                  <TableRowSkeleton cols={6} />
                </tbody>
              </table>
            </div>
          ) : filteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Patient Name</th>
                    <th className="py-3.5 px-4">Patient ID / MRN</th>
                    <th className="py-3.5 px-4">Screening Date</th>
                    <th className="py-3.5 px-4">AI Screening Severity</th>
                    <th className="py-3.5 px-4">Priority Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-teal-50/30 transition-colors">
                      {/* Patient Name */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 text-sm">{patient.fullName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {patient.age} yrs • {patient.gender} • {patient.campLocation}
                        </div>
                      </td>

                      {/* Patient ID */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-700">
                        {patient.mrn || patient.id}
                      </td>

                      {/* Screening Date */}
                      <td className="py-4 px-4 text-slate-600">
                        <div className="font-medium">{patient.screeningDate}</div>
                        <div className="text-[10px] text-slate-400">Field Camera Scan</div>
                      </td>

                      {/* AI Screening Severity (Multi-Factor indicator) */}
                      <td className="py-4 px-4">
                        <SeverityBadge severity={patient.severity} size="md" />
                      </td>

                      {/* Priority Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          patient.priorityStatus === 'Immediate Review'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : patient.priorityStatus === 'High Priority'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-teal-100 text-teal-800 border border-teal-200'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {patient.priorityStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedCase(patient)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/20 transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Case</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState
                type={activeQueueTab === 'high_priority' ? 'priority' : 'patients'}
                title={
                  activeQueueTab === 'high_priority' 
                    ? 'No high-priority cases pending review' 
                    : activeQueueTab === 'followups'
                    ? 'No follow-up consultations scheduled'
                    : 'No patient records available'
                }
                description="All incoming fundus screenings from rural camps and clinics will be queued here in real-time."
              />
            </div>
          )}
        </div>

        {/* Case Clinical Inspection Drawer Modal */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-teal-800 via-slate-900 to-teal-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-600/50 border border-teal-400/30 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Clinical Verification & Review</h3>
                    <p className="text-[11px] text-teal-200">{selectedCase.fullName} • {selectedCase.mrn}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                
                {/* Severity Card */}
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">AI Triage Classification</span>
                    <div className="mt-1">
                      <SeverityBadge severity={selectedCase.severity} size="md" />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 font-medium">AI Confidence</span>
                    <p className="text-base font-extrabold text-teal-700">{selectedCase.aiConfidence}%</p>
                  </div>
                </div>

                {/* Key Findings */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Automated Lesion & Vessel Findings</h4>
                  <div className="space-y-1.5">
                    {selectedCase.findings?.map((find, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span className="text-slate-700 font-medium">{find}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doctor Clinical Decision Notes */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Ophthalmologist Sign-off & Recommendation</label>
                  <textarea
                    rows="3"
                    placeholder="Enter clinical notes, referral instructions (e.g., Immediate panretinal photocoagulation referral, anti-VEGF injection, or 3-month follow-up)..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  ></textarea>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Request Repeat Fundus Scan
                  </button>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm & Sign Off</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
