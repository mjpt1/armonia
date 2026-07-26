"use client";

import { CrudModule } from "@/components/erp/CrudModule";
import { ErpHeader } from "@/components/erp/ErpHeader";
import { Badge, leadStatusLabel, leadStatusTone } from "@/components/ui/Badge";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { todayJalali, toJalali } from "@/lib/utils/jalali";
import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  mobile: string;
  source?: string | null;
  status: string;
  service?: string | null;
  advisor?: string | null;
  notes?: string | null;
  updatedAt: string;
  lastContact?: string;
};

const statuses = [
  { value: "lead", label: "لید" },
  { value: "follow", label: "پیگیری" },
  { value: "wait", label: "انتظار" },
  { value: "win", label: "موفق" },
  { value: "lost", label: "ازدست‌رفته" },
];

export default function CrmPage() {
  const [funnel, setFunnel] = useState<Record<string, number>>({});

  useEffect(() => {
    void fetch("/api/leads")
      .then((r) => r.json())
      .then((json) => {
        setFunnel(json.meta?.funnel ?? {});
      });
  }, []);

  return (
    <>
      <ErpHeader title="لیدها و CRM" meta={<>قیف فروش · {todayJalali()}</>} />
      <main className="page-enter space-y-8 px-5 pb-12 pt-8 sm:px-10">
        <Panel labelledBy="funnel">
          <PanelHead titleId="funnel" title="قیف فروش" description="تعداد لید در هر مرحله" />
          <div className="grid gap-3 sm:grid-cols-5">
            {statuses.map((s) => (
              <div
                key={s.value}
                className="rounded-md border border-stone-100 bg-ivory px-3 py-4 text-center"
              >
                <div className="text-xs text-ink-muted">{s.label}</div>
                <div className="mt-1 font-display text-2xl font-semibold text-olive-800">
                  {funnel[s.value] ?? 0}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <CrudModule<Lead>
          module="crm"
          title="فهرست لیدها"
          description="ایجاد، تغییر مرحله قیف — داده در SQLite ذخیره می‌شود"
          endpoint="/api/leads"
          emptyForm={{ name: "", mobile: "", source: "دستی", status: "lead", service: "", notes: "" }}
          fields={[
            { name: "name", label: "نام", required: true },
            { name: "mobile", label: "موبایل", type: "tel", required: true },
            { name: "service", label: "خدمت" },
            { name: "source", label: "منبع" },
            {
              name: "status",
              label: "وضعیت قیف",
              type: "select",
              options: statuses,
              required: true,
            },
            { name: "notes", label: "یادداشت", type: "textarea" },
          ]}
          columns={[
            { key: "name", header: "نام", render: (r) => r.name },
            { key: "mobile", header: "موبایل", render: (r) => <span dir="ltr">{r.mobile}</span> },
            { key: "service", header: "خدمت", render: (r) => r.service ?? "—" },
            { key: "source", header: "منبع", render: (r) => r.source ?? "—" },
            { key: "advisor", header: "مشاور", render: (r) => r.advisor ?? "—" },
            {
              key: "status",
              header: "وضعیت",
              render: (r) => (
                <Badge tone={leadStatusTone[r.status as keyof typeof leadStatusTone] ?? "info"}>
                  {leadStatusLabel[r.status as keyof typeof leadStatusLabel] ?? r.status}
                </Badge>
              ),
            },
            {
              key: "updated",
              header: "آخرین تماس",
              render: (r) => toJalali(r.lastContact ?? r.updatedAt),
            },
          ]}
          extraActions={(row, reload) => (
            <button
              type="button"
              className="text-sm font-medium text-champagne-700 underline"
              onClick={async () => {
                const next =
                  row.status === "lead"
                    ? "follow"
                    : row.status === "follow"
                      ? "wait"
                      : row.status === "wait"
                        ? "win"
                        : "lead";
                await fetch("/api/leads", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: row.id, status: next }),
                });
                reload();
                const j = await fetch("/api/leads").then((r) => r.json());
                setFunnel(j.meta?.funnel ?? {});
              }}
            >
              مرحله بعد
            </button>
          )}
        />
      </main>
    </>
  );
}
