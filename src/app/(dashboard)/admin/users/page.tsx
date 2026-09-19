import { requireRole } from "@/lib/auth/guards";
import { AdminDashboard } from "@/features/admin/AdminDashboard";

export const metadata = { title: "Users | Admin | Dr.Retina" };

export default async function AdminUsersPage() {
  const session = await requireRole("ADMIN");
  return <AdminDashboard orgName={session.orgName} section="users" />;
}
