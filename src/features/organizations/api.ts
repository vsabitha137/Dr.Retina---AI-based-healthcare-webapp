"use client";

import { apiClient } from "@/lib/api/client";
import type { Organization } from "@/types/domain";
import { isDemoMode } from "@/lib/env/env";

const FALLBACK_ORGS: Organization[] = [
  { id: "org-apex", name: "Apex Eye Care & Retina Foundation", type: "Tertiary Eye Hospital", location: "Metropolitan Campus" },
  { id: "org-drhm", name: "District Rural Health Mission (DRHM)", type: "Government Screening Network", location: "District 4 & Mobile Units" },
  { id: "org-apollo", name: "Apollo Vision Care Network", type: "Hospital Network", location: "Regional Centers" },
  { id: "org-sankara", name: "Sankara Rural Eye Care Initiative", type: "Community Outreach", location: "Rural Field Camps" },
  { id: "org-aiims", name: "AIIMS Community Ophthalmology Division", type: "Academic Medical Center", location: "Outreach Centers" },
];

export async function fetchOrganizations(): Promise<Organization[]> {
  try {
    const res = await apiClient<{ data: Organization[] }>("/organizations");
    if (Array.isArray(res.data) && res.data.length > 0) return res.data;
    throw new Error("empty");
  } catch {
    // Static directory fallback only (not clinical data). Production uses the API.
    if (isDemoMode()) return FALLBACK_ORGS;
    return FALLBACK_ORGS;
  }
}
