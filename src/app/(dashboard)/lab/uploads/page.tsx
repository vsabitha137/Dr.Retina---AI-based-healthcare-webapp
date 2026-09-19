import { requireRole } from "@/lib/auth/guards";
import { LabTechDashboard } from "@/features/lab/LabTechDashboard";

export const metadata = { title: "Uploads | Lab | Dr.Retina" };

export default async function LabUploadsPage() {
  const session = await requireRole("LAB_TECH", "ADMIN");
  return <LabTechDashboard orgName={session.orgName} />;
}
