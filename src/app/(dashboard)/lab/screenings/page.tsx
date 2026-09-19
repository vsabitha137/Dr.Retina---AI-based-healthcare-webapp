import { requireRole } from "@/lib/auth/guards";
import { LabTechDashboard } from "@/features/lab/LabTechDashboard";

export const metadata = { title: "Screenings | Lab | Dr.Retina" };

export default async function LabScreeningsPage() {
  const session = await requireRole("LAB_TECH", "ADMIN");
  return <LabTechDashboard orgName={session.orgName} />;
}
