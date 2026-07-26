"use client";

import { CrudModule } from "@/components/erp/CrudModule";
import { ErpHeader } from "@/components/erp/ErpHeader";
import { Badge } from "@/components/ui/Badge";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { ROLE_LABELS_FA, type RoleCode } from "@/lib/types/rbac";
import { todayJalali, toJalaliDateTime } from "@/lib/utils/jalali";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  branch?: { name: string } | null;
};

export default function UsersPage() {
  const [logs, setLogs] = useState<
    {
      id: string;
      action: string;
      module: string;
      detail?: string | null;
      createdAt: string;
      user?: { name: string } | null;
    }[]
  >([]);

  useEffect(() => {
    void fetch("/api/users?tab=logs")
      .then((r) => r.json())
      .then((j) => setLogs(j.data ?? []));
  }, []);

  const roleOptions = Object.entries(ROLE_LABELS_FA).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <>
      <ErpHeader title="کاربران و RBAC" meta={<>نقش‌ها و لاگ فعالیت · {todayJalali()}</>} />
      <main className="page-enter space-y-8 px-5 pb-12 pt-8 sm:px-10">
        <CrudModule<User>
          module="users"
          title="کاربران"
          endpoint="/api/users"
          emptyForm={{ name: "", email: "", role: "REC", initials: "" }}
          fields={[
            { name: "name", label: "نام", required: true },
            { name: "email", label: "ایمیل", type: "email", required: true },
            { name: "role", label: "نقش", type: "select", options: roleOptions, required: true },
            { name: "initials", label: "حروف اختصاری" },
          ]}
          columns={[
            { key: "name", header: "نام", render: (r) => r.name },
            { key: "email", header: "ایمیل", render: (r) => <span dir="ltr">{r.email}</span> },
            {
              key: "role",
              header: "نقش",
              render: (r) => ROLE_LABELS_FA[r.role as RoleCode] ?? r.role,
            },
            { key: "branch", header: "شعبه", render: (r) => r.branch?.name ?? "—" },
            {
              key: "active",
              header: "وضعیت",
              render: (r) => (
                <Badge tone={r.active ? "success" : "danger"}>
                  {r.active ? "فعال" : "غیرفعال"}
                </Badge>
              ),
            },
          ]}
        />

        <Panel labelledBy="log">
          <PanelHead titleId="log" title="لاگ فعالیت" description="تغییرات حساس و ورود" />
          <ul className="max-h-80 space-y-2 overflow-y-auto text-sm">
            {logs.map((l) => (
              <li key={l.id} className="flex justify-between border-b border-stone-100 py-2">
                <span>
                  {l.user?.name ?? "سیستم"} · {l.action} · {l.module}
                  {l.detail ? ` — ${l.detail}` : ""}
                </span>
                <span className="text-xs text-ink-muted">{toJalaliDateTime(l.createdAt)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </main>
    </>
  );
}
