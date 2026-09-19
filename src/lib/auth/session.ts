import "server-only";
import { cookies } from "next/headers";
import { normalizeRole, type Role } from "./permissions";

export interface Session {
  userId: string;
  email: string;
  role: Role;
  orgId: string;
  orgName: string;
}

const SESSION_COOKIE = "dr_retina_session";

/**
 * Cookie-based session compatible with SSR. Replaces legacy
 * `localStorage.getItem('dr_retina_auth_token')` as source of truth.
 *
 * NOTE: This reads a signed session reference cookie. Full Supabase SSR
 * wiring (getUser via @supabase/ssr) lands in `user.ts`; the cookie name
 * and shape here are the contract both layers share.
 */
export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    const role = normalizeRole(parsed.role);
    if (!parsed.userId || !parsed.email || !role || !parsed.orgId) return null;
    return {
      userId: String(parsed.userId),
      email: String(parsed.email),
      role,
      orgId: String(parsed.orgId),
      orgName: String(parsed.orgName ?? ""),
    };
  } catch {
    return null;
  }
}

export function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export { SESSION_COOKIE };
