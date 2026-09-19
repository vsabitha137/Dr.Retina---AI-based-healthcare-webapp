import "server-only";
import { cookies } from "next/headers";
import { ApiError } from "./errors";

/**
 * Server-side API helper for Server Components / Server Actions / Route Handlers.
 * Forwards the session cookie; never touches localStorage.
 */
const API_BASE =
  process.env.API_INTERNAL_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000/api/v1";

export async function apiServer<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const cookieHeader = (await cookies()).toString();
  const requestId = crypto.randomUUID();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        Cookie: cookieHeader,
        ...init.headers,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError({
        message: typeof body?.message === "string" ? body.message : `Request failed (${res.status})`,
        status: res.status,
        requestId,
      });
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}
