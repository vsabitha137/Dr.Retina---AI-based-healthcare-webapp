import { NextResponse, type NextRequest } from "next/server";

/**
 * Lightweight network-boundary checks only (Next.js 16 `proxy.ts`).
 * Authoritative authorization lives in Server Components / Server Actions /
 * the FastAPI backend — never here.
 */
const PROTECTED: Array<{ prefix: string; roles: string[] }> = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/doctor", roles: ["DOCTOR", "ADMIN"] },
  { prefix: "/lab", roles: ["LAB_TECH", "ADMIN"] },
];

function readRole(request: NextRequest): string | null {
  const raw = request.cookies.get("dr_retina_session")?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    const r = String(parsed.role ?? "").toUpperCase();
    return r === "LAB_TECH" || r === "ADMIN" || r === "DOCTOR" ? r : null;
  } catch {
    return null;
  }
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rule = PROTECTED.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`));
  if (!rule) return NextResponse.next();

  const role = readRole(request);
  if (!role) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (!rule.roles.includes(role)) {
    const url = request.nextUrl.clone();
    url.pathname = role === "ADMIN" ? "/admin" : role === "DOCTOR" ? "/doctor" : "/lab";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/lab/:path*"],
};
