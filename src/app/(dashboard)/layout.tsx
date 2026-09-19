import { requireSession } from "@/lib/auth/guards";
import { SiteHeader } from "@/components/layout/SiteHeader";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  DOCTOR: "Doctor",
  LAB_TECH: "Lab Tech",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SiteHeader
        mode="app"
        orgName={session.orgName || undefined}
        roleLabel={ROLE_LABEL[session.role]}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
