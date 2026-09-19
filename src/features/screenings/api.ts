"use client";

import { apiClient } from "@/lib/api/client";
import type { ScreeningResult } from "@/types/domain";

/** Screening job lifecycle: request → job created → processing → result. */
export interface ScreeningJob {
  jobId: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
}

export async function requestScreeningAnalysis(payload: {
  patientId: string;
  eye: "OD" | "OS" | "OU";
  image: File;
}): Promise<ScreeningJob> {
  const form = new FormData();
  form.append("patientId", payload.patientId);
  form.append("eye", payload.eye);
  form.append("image", payload.image);
  return apiClient<ScreeningJob>("/screenings/analyze", {
    method: "POST",
    body: form,
    timeoutMs: 60000,
  });
}

export async function fetchScreeningStatus(jobId: string): Promise<ScreeningJob> {
  return apiClient<ScreeningJob>(`/screenings/jobs/${jobId}`, { timeoutMs: 10000 });
}

export async function fetchScreenings(params: Record<string, string> = {}): Promise<ScreeningResult[]> {
  const query = new URLSearchParams(params).toString();
  const res = await apiClient<{ data: ScreeningResult[] }>(
    `/screenings${query ? `?${query}` : ""}`,
  );
  return res.data ?? [];
}

export async function submitDoctorReview(payload: {
  screeningId: string;
  verdict: "CONFIRMED" | "AMENDED" | "REJECTED";
  notes?: string;
}): Promise<void> {
  await apiClient(`/screenings/${payload.screeningId}/reviews`, {
    method: "POST",
    body: payload,
    idempotencyKey: crypto.randomUUID(),
  });
}
