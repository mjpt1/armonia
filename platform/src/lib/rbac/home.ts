import { navForRole } from "@/lib/nav";
import { canAccess } from "@/lib/rbac/matrix";
import type { RoleCode } from "@/lib/types/rbac";

export type DashboardKind =
  | "executive"
  | "sales"
  | "marketing"
  | "finance"
  | "hr"
  | "branch"
  | "clinical"
  | "reception"
  | "patient";

const DASHBOARD_KIND: Partial<Record<RoleCode, DashboardKind>> = {
  CEO: "executive",
  OPS: "executive",
  SM: "sales",
  SA: "sales",
  MM: "marketing",
  ME: "marketing",
  SOC: "marketing",
  DES: "marketing",
  VID: "marketing",
  CFO: "finance",
  ACC: "finance",
  HR: "hr",
  BM: "branch",
  CM: "branch",
  DOC: "clinical",
  AST: "clinical",
  REC: "reception",
  PAT: "patient",
};

export function dashboardKindForRole(role: RoleCode): DashboardKind | null {
  if (!canAccess(role, "dashboard")) return null;
  return DASHBOARD_KIND[role] ?? "executive";
}

/** First allowed ERP route for a role (used after role switch / guard). */
export function defaultRouteForRole(role: RoleCode): string {
  if (canAccess(role, "dashboard")) return "/erp";
  const first = navForRole(role).flatMap((g) => g.items)[0];
  return first?.href ?? "/erp/tickets";
}

export function dashboardTitleForKind(kind: DashboardKind): string {
  switch (kind) {
    case "executive":
      return "داشبورد مدیریتی";
    case "sales":
      return "داشبورد فروش";
    case "marketing":
      return "داشبورد بازاریابی";
    case "finance":
      return "داشبورد مالی";
    case "hr":
      return "داشبورد منابع انسانی";
    case "branch":
      return "داشبورد شعبه";
    case "clinical":
      return "داشبورد پزشکی";
    case "reception":
      return "داشبورد پذیرش";
    case "patient":
      return "پنل بیمار";
  }
}
