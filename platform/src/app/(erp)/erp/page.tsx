"use client";

import { ErpHeader } from "@/components/erp/ErpHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiStrip } from "@/components/ui/KpiStrip";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { todayJalali, toFaDigits, toJalali, formatMoneyFa } from "@/lib/utils/jalali";
import Link from "next/link";
import { useEffect, useState } from "react";

type Dash = {
  kpis: { label: string; value: string; delta: string; tone: "up" | "down" | "neutral" }[];
  branches: { id: string; name: string; appointments: number; patients: number; leads: number }[];
  doctors: { id: string; name: string; specialty: string; appointments: number; commissionPct: number }[];
  campaigns: { id: string; name: string; budget: number; spend: number; status: string }[];
  live: { leads: number; patients: number; appointments: number; updatedAt: string };
};

export default function ErpDashboardPage() {
  const [data, setData] = useState<Dash | null>(null);
  const [leads, setLeads] = useState<
    { id: string; name: string; status: string; source: string; updatedAt: string }[]
  >([]);

  useEffect(() => {
    void (async () => {
      const [d, l] = await Promise.all([
        fetch("/api/dashboard").then((r) => r.json()),
        fetch("/api/leads").then((r) => r.json()),
      ]);
      setData(d.data);
      setLeads((l.data ?? []).slice(0, 5));
    })();
  }, []);

  return (
    <>
      <ErpHeader
        title="داشبورد مدیریتی"
        meta={
          <>
            امروز · {todayJalali()}
            {data?.live ? ` · به‌روز ${toJalali(data.live.updatedAt)}` : null}
          </>
        }
      />
      <main className="page-enter px-5 pb-12 pt-8 sm:px-10">
        <KpiStrip items={data?.kpis ?? []} />

        <Panel labelledBy="leads-heading" className="mb-8">
          <PanelHead
            titleId="leads-heading"
            title="آخرین لیدها"
            description={
              <>
                از دیتابیس پایدار ·{" "}
                <Link href="/erp/crm" className="text-olive-800 underline">
                  مشاهدهٔ همه
                </Link>
              </>
            }
            actions={
              <Button type="button" variant="ghost" size="sm" onClick={() => (window.location.href = "/erp/crm")}>
                مدیریت لیدها
              </Button>
            }
          />
          <table className="w-full border-collapse text-[0.9rem]">
            <thead>
              <tr>
                {["نام", "منبع", "وضعیت", "به‌روزرسانی"].map((h) => (
                  <th key={h} className="border-b border-stone-100 px-2 py-3 text-start text-xs text-ink-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((row) => (
                <tr key={row.id} className="hover:bg-olive-50/60">
                  <td className="border-b border-stone-100 px-2 py-3">{row.name}</td>
                  <td className="border-b border-stone-100 px-2 py-3">{row.source}</td>
                  <td className="border-b border-stone-100 px-2 py-3">
                    <Badge tone="info">{row.status}</Badge>
                  </td>
                  <td className="border-b border-stone-100 px-2 py-3" dir="ltr">
                    {toJalali(row.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel labelledBy="branches-heading">
            <PanelHead titleId="branches-heading" title="عملکرد شعب" description="نوبت · بیمار · لید" />
            <table className="w-full border-collapse text-[0.9rem]">
              <thead>
                <tr>
                  {["شعبه", "نوبت", "بیمار", "لید"].map((h) => (
                    <th key={h} className="border-b border-stone-100 px-2 py-3 text-start text-xs text-ink-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.branches ?? []).map((row) => (
                  <tr key={row.id} className="hover:bg-olive-50/60">
                    <td className="border-b border-stone-100 px-2 py-3">{row.name}</td>
                    <td className="border-b border-stone-100 px-2 py-3" dir="ltr">
                      {toFaDigits(row.appointments)}
                    </td>
                    <td className="border-b border-stone-100 px-2 py-3" dir="ltr">
                      {toFaDigits(row.patients)}
                    </td>
                    <td className="border-b border-stone-100 px-2 py-3" dir="ltr">
                      {toFaDigits(row.leads)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel labelledBy="docs-heading">
            <PanelHead titleId="docs-heading" title="عملکرد پزشکان" description="نوبت و درصد پورسانت" />
            <ul className="space-y-3">
              {(data?.doctors ?? []).map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium text-olive-800">{d.name}</div>
                    <div className="text-xs text-ink-muted">{d.specialty}</div>
                  </div>
                  <div className="text-end text-xs text-ink-muted" dir="ltr">
                    {toFaDigits(d.appointments)} نوبت
                    <br />
                    {toFaDigits(d.commissionPct)}٪
                  </div>
                </li>
              ))}
            </ul>
            {(data?.campaigns?.length ?? 0) > 0 && (
              <div className="mt-4 border-t border-stone-100 pt-4">
                <div className="mb-2 text-xs font-semibold text-ink-muted">کمپین‌های اخیر</div>
                {(data?.campaigns ?? []).map((c) => (
                  <div key={c.id} className="mb-2 flex justify-between text-sm">
                    <span>{c.name}</span>
                    <span className="text-ink-muted" dir="ltr">
                      {formatMoneyFa(c.spend)} / {formatMoneyFa(c.budget)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </main>
    </>
  );
}
