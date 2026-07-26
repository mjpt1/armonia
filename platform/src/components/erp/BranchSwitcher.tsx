"use client";

import { useScope } from "@/lib/mock/session";

export function BranchSwitcher() {
  const { branches, branchId, setBranchId, clinicsForBranch, clinicId, setClinicId } =
    useScope();

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-[0.72rem] text-ink-muted">
        <span>شعبه</span>
        <select
          className="min-w-[9rem] rounded-md border border-stone-100 bg-porcelain px-2 py-1.5 text-sm text-ink-900"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value as string | "all")}
        >
          <option value="all">همه شعب</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} · {b.city}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[0.72rem] text-ink-muted">
        <span>کلینیک</span>
        <select
          className="min-w-[9rem] rounded-md border border-stone-100 bg-porcelain px-2 py-1.5 text-sm text-ink-900"
          value={clinicId}
          onChange={(e) => setClinicId(e.target.value as string | "all")}
        >
          <option value="all">همه</option>
          {clinicsForBranch.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
