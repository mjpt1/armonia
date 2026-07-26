"use client";

import { useScope } from "@/lib/mock/session";
import { ROLE_LABELS_FA, type RoleCode } from "@/lib/types/rbac";

const DEMO_ROLES = Object.keys(ROLE_LABELS_FA) as RoleCode[];

export function RoleSwitcher() {
  const { session, switchRole, roleLabel } = useScope();

  return (
    <label className="flex flex-col gap-1 text-[0.72rem] text-ink-muted">
      <span>نقش دمو</span>
      <select
        className="min-w-[10rem] rounded-md border border-stone-100 bg-porcelain px-2 py-1.5 text-sm text-ink-900"
        value={session.role}
        aria-label="سوییچ نقش"
        onChange={(e) => void switchRole(e.target.value as RoleCode)}
      >
        {DEMO_ROLES.map((code) => (
          <option key={code} value={code}>
            {ROLE_LABELS_FA[code]}
          </option>
        ))}
      </select>
      <span className="sr-only">نقش فعلی: {roleLabel}</span>
    </label>
  );
}
