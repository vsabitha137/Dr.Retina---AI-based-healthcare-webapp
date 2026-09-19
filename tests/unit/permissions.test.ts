import { describe, expect, it } from "vitest";
import { normalizeRole, hasPermission, defaultRouteForRole } from "@/lib/auth/permissions";

describe("permissions", () => {
  it("normalizes legacy UI role ids", () => {
    expect(normalizeRole("doctor")).toBe("DOCTOR");
    expect(normalizeRole("lab_tech")).toBe("LAB_TECH");
    expect(normalizeRole("admin")).toBe("ADMIN");
    expect(normalizeRole("nope")).toBeNull();
  });

  it("grants role-scoped permissions", () => {
    expect(hasPermission("DOCTOR", "reviews:write")).toBe(true);
    expect(hasPermission("DOCTOR", "users:manage")).toBe(false);
    expect(hasPermission("LAB_TECH", "screenings:write")).toBe(true);
    expect(hasPermission("ADMIN", "users:manage")).toBe(true);
  });

  it("routes each role home", () => {
    expect(defaultRouteForRole("ADMIN")).toBe("/admin");
    expect(defaultRouteForRole("DOCTOR")).toBe("/doctor");
    expect(defaultRouteForRole("LAB_TECH")).toBe("/lab");
  });
});
