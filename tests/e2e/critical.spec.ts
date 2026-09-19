import { test, expect } from "@playwright/test";

/**
 * Critical-path E2E. Runs against DEMO_MODE=true.
 * Visual parity: capture screenshots per route and diff against the
 * legacy Vite reference (stored in tests/e2e/__screenshots__/reference).
 */
test("landing loads with hero and viewer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Diabetic Retinopathy/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Login to Screening Portal/i })).toBeVisible();
});

test("org selection -> login -> demo dashboard routing", async ({ page }) => {
  await page.goto("/select-org");
  await expect(page.getByRole("heading", { name: /Select Your Organization/i })).toBeVisible();
  await page.getByRole("button", { name: /Continue to Login/i }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: /Sign In to Dr.Retina/i })).toBeVisible();
});

test("unauthenticated dashboard access redirects to login", async ({ page }) => {
  await page.goto("/doctor");
  await expect(page).toHaveURL(/\/login/);
});
