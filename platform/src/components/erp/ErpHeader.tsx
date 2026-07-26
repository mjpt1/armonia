"use client";

import { BranchSwitcher } from "@/components/erp/BranchSwitcher";
import { RoleSwitcher } from "@/components/erp/RoleSwitcher";
import { useScope } from "@/lib/mock/session";

export function ErpHeader({
  title,
  meta,
}: {
  title: string;
  meta?: React.ReactNode;
}) {
  const { roleLabel, session } = useScope();

  return (
    <header className="flex flex-wrap items-end justify-between gap-5 bg-gradient-to-b from-porcelain/55 to-transparent px-5 pb-5 pt-6 sm:px-10">
      <div>
        <h1 className="font-display text-[1.45rem] font-semibold leading-tight tracking-tight text-ink-900">
          {title}
        </h1>
        <div className="mt-1.5 text-[0.8rem] font-normal text-ink-muted">
          {meta}
          {meta ? " · " : null}
          {session.name} · {roleLabel}
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <RoleSwitcher />
        <BranchSwitcher />
      </div>
    </header>
  );
}
