import type { AccessLevel, ModuleKey, RoleCode } from "@/lib/types/rbac";

/** Module × role access — aligned with docs/rbac-matrix.md */
export const RBAC_MATRIX: Record<ModuleKey, Partial<Record<RoleCode, AccessLevel>>> = {
  dashboard: {
    CEO: "F", OPS: "F", SM: "R", SA: "R", MM: "R", ME: "R", SOC: "R", DES: "R", VID: "R",
    CFO: "R", ACC: "R", HR: "R", BM: "O", CM: "O",
  },
  crm: {
    CEO: "F", OPS: "F", SM: "F", SA: "F", MM: "R", ME: "R", SOC: "R", DES: "R", VID: "R",
    BM: "O", CM: "O", REC: "O",
  },
  patients: {
    CEO: "F", OPS: "F", SM: "R", SA: "R", CFO: "R", ACC: "R",
    BM: "O", CM: "O", DOC: "O", AST: "S", REC: "O", PAT: "S",
  },
  appointments: {
    CEO: "F", OPS: "F", SM: "R", SA: "R", BM: "O", CM: "O",
    DOC: "O", AST: "O", REC: "F", PAT: "S",
  },
  doctors: {
    CEO: "F", OPS: "F", SM: "R", SA: "R", CFO: "R", ACC: "R", HR: "R",
    BM: "O", CM: "O", DOC: "S", AST: "S", REC: "R", PAT: "R",
  },
  branches: {
    CEO: "F", OPS: "F", SM: "R", SA: "R", CFO: "R", ACC: "R", BM: "O", CM: "O",
  },
  marketing: {
    CEO: "F", OPS: "R", SM: "R", SA: "R", MM: "F", ME: "F", SOC: "F", DES: "F", VID: "F",
    CFO: "R", ACC: "R", BM: "R",
  },
  finance: {
    CEO: "F", OPS: "R", CFO: "F", ACC: "F", BM: "O", CM: "O", DOC: "S", AST: "S", REC: "R", PAT: "S",
  },
  contracts: {
    CEO: "F", OPS: "F", SM: "F", SA: "F", CFO: "F", ACC: "F", HR: "R",
    BM: "O", CM: "O", DOC: "S", AST: "S", REC: "R", PAT: "S",
  },
  hr: {
    CEO: "F", OPS: "R", CFO: "R", ACC: "R", HR: "F", BM: "O", CM: "O", DOC: "S", AST: "S",
  },
  tickets: {
    CEO: "F", OPS: "F", SM: "F", SA: "F", MM: "F", ME: "F", SOC: "F", DES: "F", VID: "F",
    CFO: "F", ACC: "F", HR: "F", BM: "F", CM: "F", DOC: "F", AST: "F", REC: "F", PAT: "F",
  },
  notifications: {
    CEO: "F", OPS: "F", SM: "O", SA: "O", MM: "O", ME: "O", SOC: "O", DES: "O", VID: "O",
    CFO: "O", ACC: "O", HR: "O", BM: "O", CM: "O", REC: "O",
  },
  users: {
    CEO: "F", OPS: "F", HR: "R",
  },
  settings: {
    CEO: "F", OPS: "F", CFO: "R", ACC: "R", BM: "R", CM: "R",
  },
  patientPortal: {
    PAT: "F",
  },
};

export function canAccess(role: RoleCode, module: ModuleKey): boolean {
  const level = RBAC_MATRIX[module]?.[role];
  return Boolean(level && level !== "—");
}

export function accessLevel(role: RoleCode, module: ModuleKey): AccessLevel {
  return RBAC_MATRIX[module]?.[role] ?? "—";
}

export function canWrite(role: RoleCode, module: ModuleKey): boolean {
  const level = accessLevel(role, module);
  return level === "F" || level === "O" || level === "S";
}
