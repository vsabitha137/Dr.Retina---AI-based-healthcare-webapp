"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  Check,
  CheckCircle2,
  Eye,
  FileText,
  History,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { TableRowSkeleton } from "@/components/ui/Feedback";
import { EmptyState } from "@/components/shared/EmptyState";
import { Dialog } from "@/components/ui/Dialog";
import { DoctorReviewSchema } from "@/lib/validation/schemas";
import { submitDoctorReview } from "@/features/screenings/api";
import { isDemoMode } from "@/lib/env/env";
import { DEMO_DOCTOR_PATIENTS, type DemoDoctorPatient } from "@/features/demo/demoData";
import { cn } from "@/lib/utils/cn";

type QueueTab = "high_priority" | "moderate" | "recent" | "followups";

const NAV = [
  { id: "dashboard", label: "Dashboard", Icon: Stethoscope, href: "/doctor" },
  { id: "priority", label: "Priority Cases", Icon: ShieldAlert, href: "/doctor/queue" },
  { id: "patients", label: "Patients", Icon: Users, href: "/doctor/patients" },
  { id: "history", label: "Screening History", Icon: History, href: "/doctor/screenings" },
  { id: "reports", label: "Reports", Icon: FileText, href: "/doctor/reports" },
  { id: "followups", label: "Follow-ups", Icon: CalendarClock, href: "/doctor/queue" },
] as const;

export function DoctorDashboard({ orgName, queue = "high_priority" }: { orgName: string; queue?: QueueTab }) {
  const [activeQueueTab, setActiveQueueTab] = React.useState<QueueTab>(queue);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [patients, setPatients] = React.useState<DemoDoctorPatient[]>([]);
  const [selectedCase, setSelectedCase] = React.useState<DemoDoctorPatient | null>(null);
  const [notes, setNotes] = React.useState("");
  const [signing, setSigning] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const demo = isDemoMode();

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        if (demo) {
          await new Promise((r) => setTimeout(r, 400));
          if (!cancelled) setPatients(DEMO_DOCTOR_PATIENTS);
          return;
        }
        // Production: fetch triage queue from backend (typed, no silent null).
        const { apiClient } = await import("@/lib/api/client");
        const res = await apiClient<{ data: DemoDoctorPatient[] }>(
          `/doctor/patients?tab=${activeQueueTab}`,
        );
        if (!cancelled) setPatients(res.data ?? []);
      } catch {
        if (!cancelled) setPatients([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeQueueTab, demo]);

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchName = p.fullName?.toLowerCase().includes(term);
    const matchId = p.mrn?.toLowerCase().includes(term) || p.id?.toLowerCase().includes(term);
    if (activeQueueTab === "high_priority") {
      return (matchName || matchId) && (p.severity === "Proliferative DR" || p.severity === "Severe NPDR" || p.priorityStatus === "Immediate Review" || p.priorityStatus === "High Priority");
    }
    if (activeQueueTab === "moderate") {
      return (matchName || matchId) && (p.severity === "Moderate NPDR" || p.priorityStatus === "Moderate");
    }
    return matchName || matchId;
  });

  const handleSignOff = async () => {
    if (!selectedCase) return;
    const parsed = DoctorReviewSchema.safeParse({
      screeningId: selectedCase.id,
      verdict: "CONFIRMED",
      notes,
    });
    if (!parsed.success) return;
    setSigning(true);
    try {
      if (!demo) await submitDoctorReview(parsed.data);
      setSelectedCase(null);
      setNotes("");
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <Stethoscope className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-900 truncate">Dr. Retina Specialist</h4>
                <p className="text-[10px] text-teal-700 font-medium truncate">{orgName || "Ophthalmology Reviewer"}</p>
              </div>
            </div>
          </div>
          <nav className="space-y-1" aria-label="Doctor">
            {NAV.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <div className="flex items-center gap-3">
                  <item.Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </div>
                {item.id === "priority" && demo && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">2 Urgent</span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="pt-4 border-t border-slate-100 mt-6">
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs">
            <div className="flex items-center gap-1.5 text-teal-300 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>AI Triage Objective</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">Prioritize sight-threatening proliferative DR and severe cases first to expedite laser &amp; anti-VEGF therapy.</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Doctor Review Workspace</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-600" aria-hidden="true" />
                Priority Triage Mode
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Review AI screening severity, verify fundus findings, and determine urgent clinical actions.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input type="text" placeholder="Search by Patient / MRN..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search patients" className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 outline-none bg-white" />
          </div>
        </div>

        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-teal-200">Clinical Focus: Which patients need attention first?</h3>
              <p className="text-xs text-slate-300">Patients below are automatically sorted by AI severity and urgency ranking.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-teal-300 bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700">Dual-Verification Protocol</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1" role="tablist" aria-label="Triage queue">
          <QueueTabButton active={activeQueueTab === "high_priority"} onClick={() => setActiveQueueTab("high_priority")} icon={<ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />} label="High-Priority Requiring Review" count={demo ? "2" : "0"} activeClass="bg-rose-600 text-white shadow-sm shadow-rose-600/20" />
          <QueueTabButton active={activeQueueTab === "moderate"} onClick={() => setActiveQueueTab("moderate")} icon={<AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />} label="Moderate Priority" count={demo ? "1" : "0"} activeClass="bg-amber-600 text-white shadow-sm" />
          <QueueTabButton active={activeQueueTab === "recent"} onClick={() => setActiveQueueTab("recent")} icon={<History className="w-3.5 h-3.5" aria-hidden="true" />} label="Recent Screenings" activeClass="bg-teal-600 text-white shadow-sm" />
          <QueueTabButton active={activeQueueTab === "followups"} onClick={() => setActiveQueueTab("followups")} icon={<CalendarClock className="w-3.5 h-3.5" aria-hidden="true" />} label="Follow-up Patients" activeClass="bg-cyan-600 text-white shadow-sm" />
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {activeQueueTab === "high_priority" && "High-Priority Cases Requiring Review"}
                {activeQueueTab === "moderate" && "Moderate Priority Screening Queue"}
                {activeQueueTab === "recent" && "Recent Screenings & AI Assessments"}
                {activeQueueTab === "followups" && "Scheduled Patient Follow-ups"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Multi-attribute severity indicators with automated AI lesion triage</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Sort: <strong>Urgency Descending</strong></span>
            </div>
          </div>

          {isLoading ? (
            <div className="p-6" aria-busy="true" aria-label="Loading queue">
              <TableRowSkeleton cols={6} />
              <TableRowSkeleton cols={6} />
              <TableRowSkeleton cols={6} />
            </div>
          ) : filteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5" scope="col">Patient Name</th>
                    <th className="py-3.5 px-4" scope="col">Patient ID / MRN</th>
                    <th className="py-3.5 px-4" scope="col">Screening Date</th>
                    <th className="py-3.5 px-4" scope="col">AI Screening Severity</th>
                    <th className="py-3.5 px-4" scope="col">Priority Status</th>
                    <th className="py-3.5 px-5 text-right" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-teal-50/30 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 text-sm">{patient.fullName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{patient.age} yrs • {patient.gender} • {patient.campLocation}</div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-700">{patient.mrn || patient.id}</td>
                      <td className="py-4 px-4 text-slate-600">
                        <div className="font-medium">{patient.screeningDate}</div>
                        <div className="text-[10px] text-slate-400">Field Camera Scan</div>
                      </td>
                      <td className="py-4 px-4"><SeverityBadge severity={patient.severity} size="md" /></td>
                      <td className="py-4 px-4">
                        <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold", patient.priorityStatus === "Immediate Review" ? "bg-rose-100 text-rose-800 border border-rose-200" : patient.priorityStatus === "High Priority" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-teal-100 text-teal-800 border border-teal-200")}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {patient.priorityStatus}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button onClick={() => { setSelectedCase(patient); setNotes(""); }} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/20 transition-all inline-flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
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
                type={activeQueueTab === "high_priority" ? "priority" : "patients"}
                title={activeQueueTab === "high_priority" ? "No high-priority cases pending review" : activeQueueTab === "followups" ? "No follow-up consultations scheduled" : "No patient records available"}
                description="All incoming fundus screenings from rural camps and clinics will be queued here in real-time."
              />
            </div>
          )}
        </div>

        <Dialog open={!!selectedCase} onClose={() => setSelectedCase(null)} labelledBy="case-title" maxWidth="max-w-2xl">
          {selectedCase && (
            <>
              <div className="px-6 py-4 bg-gradient-to-r from-teal-800 via-slate-900 to-teal-900 text-white flex items-center justify-between">
                <div>
                  <h3 id="case-title" className="font-bold text-sm">Clinical Verification &amp; Review</h3>
                  <p className="text-[11px] text-teal-200">{selectedCase.fullName} • {selectedCase.mrn}</p>
                </div>
                <button onClick={() => setSelectedCase(null)} aria-label="Close case review" className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white">
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-5 text-xs max-h-[60vh]">
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">AI Triage Classification</span>
                    <div className="mt-1"><SeverityBadge severity={selectedCase.severity} size="md" /></div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 font-medium">AI Confidence</span>
                    <p className="text-base font-extrabold text-teal-700">{selectedCase.aiConfidence}%</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Automated Lesion &amp; Vessel Findings</h4>
                  <div className="space-y-1.5">
                    {selectedCase.findings?.map((find, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" aria-hidden="true" />
                        <span className="text-slate-700 font-medium">{find}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="review-notes" className="block font-bold text-slate-800 mb-1.5">Ophthalmologist Sign-off &amp; Recommendation</label>
                  <textarea
                    id="review-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter clinical notes, referral instructions (e.g., Immediate panretinal photocoagulation referral, anti-VEGF injection, or 3-month follow-up)..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => setSelectedCase(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70">Cancel</button>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedCase(null)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">Request Repeat Fundus Scan</button>
                  <button onClick={handleSignOff} disabled={signing} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 flex items-center gap-1.5 disabled:opacity-60">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>{signing ? "Signing off..." : "Confirm & Sign Off"}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </Dialog>
      </main>
    </div>
  );
}

function QueueTabButton({ active, onClick, icon, label, count, activeClass }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count?: string; activeClass: string }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap", active ? activeClass : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50")}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span className={cn("px-1.5 py-0.2 rounded-full text-[10px]", active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600")}>{count}</span>
      )}
    </button>
  );
}
