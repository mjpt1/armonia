import type { RoleCode } from "./rbac";

export type LeadStatus = "lead" | "follow" | "wait" | "win" | "lost";

export interface SessionUser {
  id: string;
  name: string;
  initials: string;
  role: RoleCode;
  branchId?: string | null;
}

export interface KpiItem {
  label: string;
  value: string;
  delta: string;
  tone: "up" | "down" | "neutral";
}
