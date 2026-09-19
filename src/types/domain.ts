/** Domain types shared across features. Mirrors the FastAPI OpenAPI contract. */

export interface Organization {
  id: string;
  name: string;
  type: string;
  location: string;
}

export type Role = "ADMIN" | "DOCTOR" | "LAB_TECH";

export interface Patient {
  id: string;
  mrn: string;
  fullName: string;
  age: number;
  gender: string;
  campLocation?: string;
  severity?: string;
  priorityStatus?: string;
  screeningDate?: string;
}

export type ScreeningStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REVIEWED";

export interface ScreeningResult {
  id: string;
  patientId: string;
  patientName?: string;
  mrn?: string;
  eye: "OD" | "OS" | "OU";
  /** AI-generated classification. Never presented as final diagnosis. */
  aiSeverity: string;
  aiConfidence: number;
  status: ScreeningStatus;
  /** Set only after human review — stored separately from the AI prediction. */
  reviewerVerdict?: "CONFIRMED" | "AMENDED" | "REJECTED" | null;
  createdAt: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalScreenings: number;
  highPriorityCases: number;
  moderatePriorityCases?: number;
  screenedToday?: number;
  pendingAnalysis?: number;
  completedScreenings?: number;
  activeDoctors?: number;
  activeLabTechnicians?: number;
  activeCamps?: number;
}

export interface Camp {
  id: string;
  name: string;
  location: string;
  activeWorkers: number;
  screenedCount: number;
  status: string;
}

export interface AuditEvent {
  id: string;
  time: string;
  action: string;
  user: string;
}
