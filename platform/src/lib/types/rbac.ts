/** RBAC role codes — aligned with docs/rbac-matrix.md */
export type RoleCode =
  | "CEO"
  | "OPS"
  | "SM"
  | "SA"
  | "MM"
  | "ME"
  | "SOC"
  | "DES"
  | "VID"
  | "CFO"
  | "ACC"
  | "HR"
  | "BM"
  | "CM"
  | "DOC"
  | "AST"
  | "REC"
  | "PAT";

export type AccessLevel = "F" | "R" | "O" | "S" | "—";

export type ModuleKey =
  | "dashboard"
  | "crm"
  | "patients"
  | "appointments"
  | "doctors"
  | "branches"
  | "marketing"
  | "finance"
  | "contracts"
  | "hr"
  | "tickets"
  | "notifications"
  | "users"
  | "settings"
  | "patientPortal";

export const ROLE_LABELS_FA: Record<RoleCode, string> = {
  CEO: "مدیرعامل",
  OPS: "مدیر عملیات",
  SM: "مدیر فروش",
  SA: "مشاور فروش",
  MM: "مدیر تبلیغات",
  ME: "کارشناس تبلیغات",
  SOC: "ادمین شبکه‌های اجتماعی",
  DES: "طراح گرافیک",
  VID: "فیلمبردار / تدوینگر",
  CFO: "مدیر مالی",
  ACC: "حسابدار",
  HR: "مدیر منابع انسانی",
  BM: "مدیر شعبه",
  CM: "مدیر کلینیک",
  DOC: "پزشک",
  AST: "دستیار پزشک",
  REC: "پذیرش",
  PAT: "بیمار",
};
