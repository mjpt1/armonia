import type { AccessLevel, ModuleKey, RoleCode } from "@/lib/types/rbac";

export {
  RBAC_MATRIX as MODULE_ACCESS,
  canAccess,
  canWrite,
  accessLevel,
} from "@/lib/rbac/matrix";
export type { AccessLevel, ModuleKey, RoleCode };
