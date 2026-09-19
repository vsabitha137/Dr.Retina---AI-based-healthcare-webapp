"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, CheckCircle2, ChevronRight, MapPin, Search, ShieldCheck } from "lucide-react";
import { fetchOrganizations } from "@/features/organizations/api";
import type { Organization } from "@/types/domain";
import { cn } from "@/lib/utils/cn";

export function OrgSelectForm() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = React.useState<Organization | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchOrganizations();
        if (cancelled) return;
        setOrganizations(data);
        if (data.length > 0) setSelectedOrg(data[0] ?? null);
      } catch {
        if (!cancelled) setError("Could not load organizations. Please try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredOrgs = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg && !searchTerm) return;
    const org = selectedOrg ?? { id: "org-custom", name: searchTerm, type: "Custom Institution", location: "" };
    const params = new URLSearchParams({ orgId: org.id, orgName: org.name });
    router.push(`/login?${params.toString()}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-teal-50/70 via-slate-50 to-cyan-50/50">
      <div className="absolute w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="w-full max-w-lg">
        <button onClick={() => router.push("/")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Landing Page</span>
        </button>
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200/80 shadow-sm flex items-center justify-center mx-auto mb-3.5">
              <Building2 className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Select Your Organization</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">Please identify your hospital, eye center, or rural screening camp network to access the portal.</p>
          </div>
          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <label htmlFor="org-search" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Organization / Hospital Name</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input
                  id="org-search"
                  type="text"
                  placeholder="Search or select hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1" role="listbox" aria-label="Organizations">
              {isLoading ? (
                <div className="p-4 text-center text-xs text-slate-400" aria-busy="true">Loading authorized organizations...</div>
              ) : error ? (
                <div role="alert" className="p-4 text-center rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">{error}</div>
              ) : filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => {
                  const isSelected = selectedOrg?.id === org.id;
                  return (
                    <div
                      key={org.id}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={0}
                      onClick={() => setSelectedOrg(org)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedOrg(org);
                        }
                      }}
                      className={cn("p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between", isSelected ? "bg-teal-50/80 border-teal-500 shadow-sm ring-1 ring-teal-400" : "bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300")}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", isSelected ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600")}>
                          <Building2 className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{org.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            <span>{org.type}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" aria-hidden="true" />
                              {org.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" aria-hidden="true" />}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">No matching organization found. You can enter a custom institution name above.</div>
              )}
            </div>
            <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-100 flex items-center gap-2.5 text-[11px] text-teal-800">
              <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" aria-hidden="true" />
              <span>You will access patient records and screening queues assigned to this organization.</span>
            </div>
            <button type="submit" disabled={!selectedOrg && !searchTerm} className="w-full py-3.5 rounded-full text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-md shadow-teal-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <span>Continue to Login</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">Need to onboard a new hospital network or screening camp? Contact System Admin</p>
      </div>
    </div>
  );
}
