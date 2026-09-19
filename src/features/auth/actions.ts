"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginSchema } from "@/lib/validation/schemas";
import { defaultRouteForRole, normalizeRole } from "@/lib/auth/permissions";
import { encodeSession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDemoMode } from "@/lib/env/env";

/**
 * Login Server Action. Validates input with Zod, authenticates against the
 * FastAPI backend (or Supabase), and sets a secure httpOnly session cookie.
 * In DEMO_MODE the credential check is skipped so the UI can be evaluated
 * without a backend — production must set DEMO_MODE=false.
 */
export async function loginAction(formData: FormData) {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    orgId: formData.get("orgId"),
  });
  if (!parsed.success) {
    return { ok: false as const, error: "Please check your entries and try again." };
  }

  const { email, role, orgId } = parsed.data;

  if (!isDemoMode()) {
    // Production path: verify credentials + membership server-side.
    // const res = await apiServer<{...}>("/auth/login", { method: "POST", body: ... });
    return {
      ok: false as const,
      error: "Authentication service is not configured. Set backend credentials.",
    };
  }

  const roleNorm = normalizeRole(role);
  if (!roleNorm) return { ok: false as const, error: "Unknown role." };

  (await cookies()).set(SESSION_COOKIE, encodeSession({
    userId: `demo-${roleNorm.toLowerCase()}`,
    email,
    role: roleNorm,
    orgId,
    orgName: String(formData.get("orgName") ?? ""),
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(defaultRouteForRole(roleNorm));
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
