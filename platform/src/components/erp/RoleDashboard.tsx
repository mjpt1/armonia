"use client";

import { Badge, leadStatusLabel, leadStatusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiStrip } from "@/components/ui/KpiStrip";
import { Panel, PanelHead } from "@/components/ui/Panel";
import type { DashboardKind } from "@/lib/rbac/home";
import { formatMoneyFa, toFaDigits, toJalali } from "@/lib/utils/jalali";
import Link from "next/link";

type Dash = {
  kpis: { label: string; value: string; delta: string; tone: "up" | "down" | "neutral" }[];
  branches: { id: string; name: string; appointments: number; patients: number; leads: number }[];
  doctors: { id: string; name: string; specialty: string; appointments: number; commissionPct: number }[];
  campaigns: { id: string; name: string; budget: number; spend: number; status: string }[];
  live: { leads: number; patients: number; appointments: number; updatedAt: string };
};

type Lead = {
  id: string;
  name: string;
  status: string;
  source: string;
  updatedAt: string;
};

type Appt = {
  id: string;
  status: string;
  startsAt: string;
  patient?: { name: string };
  doctor?: { name: string };
};

export function RoleDashboard({
  kind,
  data,
  leads,
  appointments,
}: {
  kind: DashboardKind;
  data: Dash | null;
  leads: Lead[];
  appointments: Appt[];
}) {
  switch (kind) {
    case "executive":
      return <ExecutiveView data={data} leads={leads} />;
    case "sales":
      return <SalesView data={data} leads={leads} />;
    case "marketing":
      return <MarketingView data={data} />;
    case "finance":
      return <FinanceView data={data} />;
    case "hr":
      return <HrView data={data} />;
    case "branch":
      return <BranchView data={data} />;
    case "clinical":
      return <ClinicalView appointments={appointments} />;
    case "reception":
      return <ReceptionView appointments={appointments} leads={leads} />;
    case "patient":
      return <PatientView appointments={appointments} />;
  }
}

function ExecutiveView({ data, leads }: { data: Dash | null; leads: Lead[] }) {
  return (
    <>
      <KpiStrip items={data?.kpis ?? []} />
      <Panel labelledBy="leads-heading" className="mb-8">
        <PanelHead
          titleId="leads-heading"
          title="آخرین لیدها"
          description={
            <>
              نمای مدیرعامل ·{" "}
              <Link href="/erp/crm" className="text-olive-800 underline">
                CRM
              </Link>
            </>
          }
        />
        <LeadTable leads={leads} />
      </Panel>
      <div className="grid gap-6 lg:grid-cols-2">
        <BranchTable branches={data?.branches ?? []} />
        <DoctorList doctors={data?.doctors ?? []} campaigns={data?.campaigns ?? []} />
      </div>
    </>
  );
}

function SalesView({ data, leads }: { data: Dash | null; leads: Lead[] }) {
  const funnel = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <KpiStrip
        items={[
          {
            label: "کل لیدها",
            value: toFaDigits(String(data?.live.leads ?? 0)),
            delta: "در قیف فروش",
            tone: "neutral",
          },
          {
            label: "نرخ تبدیل",
            value: data?.kpis.find((k) => k.label.includes("تبدیل"))?.value ?? "—",
            delta: "لید به قرارداد",
            tone: "up",
          },
          {
            label: "قرارداد فعال",
            value: toFaDigits(String(leads.filter((l) => l.status === "win").length)),
            delta: "موفق",
            tone: "up",
          },
        ]}
      />
      <Panel labelledBy="funnel" className="mb-8">
        <PanelHead titleId="funnel" title="قیف فروش" description="تمرکز نقش فروش" />
        <div className="grid gap-3 sm:grid-cols-5">
          {["lead", "follow", "wait", "win", "lost"].map((s) => (
            <div key={s} className="rounded-md border border-stone-100 bg-ivory px-3 py-4 text-center">
              <div className="text-xs text-ink-muted">
                {leadStatusLabel[s as keyof typeof leadStatusLabel] ?? s}
              </div>
              <div className="mt-1 font-display text-2xl font-semibold text-olive-800">
                {toFaDigits(String(funnel[s] ?? 0))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel labelledBy="sales-leads">
        <PanelHead
          titleId="sales-leads"
          title="لیدهای اخیر"
          actions={
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/erp/crm")}>
              مدیریت CRM
            </Button>
          }
        />
        <LeadTable leads={leads} />
      </Panel>
    </>
  );
}

function MarketingView({ data }: { data: Dash | null }) {
  return (
    <>
      <KpiStrip
        items={[
          {
            label: "کمپین فعال",
            value: toFaDigits(String(data?.campaigns.length ?? 0)),
            delta: "در حال اجرا",
            tone: "neutral",
          },
          {
            label: "بودجه کل",
            value: formatMoneyFa(data?.campaigns.reduce((s, c) => s + c.budget, 0) ?? 0),
            delta: "تخصیص‌شده",
            tone: "neutral",
          },
          {
            label: "هزینه‌شده",
            value: formatMoneyFa(data?.campaigns.reduce((s, c) => s + c.spend, 0) ?? 0),
            delta: "تا امروز",
            tone: "down",
          },
        ]}
      />
      <Panel labelledBy="campaigns">
        <PanelHead
          titleId="campaigns"
          title="کمپین‌های بازاریابی"
          description="نمای MM / ME / SOC / DES / VID"
          actions={
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/erp/marketing")}>
              مدیریت کمپین
            </Button>
          }
        />
        <ul className="space-y-3">
          {(data?.campaigns ?? []).map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-md border border-stone-100 bg-ivory px-4 py-3 text-sm"
            >
              <div>
                <div className="font-medium text-olive-800">{c.name}</div>
                <div className="text-xs text-ink-muted">{c.status}</div>
              </div>
              <div className="text-end text-xs" dir="ltr">
                {formatMoneyFa(c.spend)} / {formatMoneyFa(c.budget)}
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

function FinanceView({ data }: { data: Dash | null }) {
  const sales = data?.kpis.find((k) => k.label.includes("فروش"));
  const profit = data?.kpis.find((k) => k.label.includes("سود"));

  return (
    <>
      <KpiStrip
        items={[
          sales ?? { label: "دریافت", value: "—", delta: "", tone: "neutral" },
          profit ?? { label: "سود", value: "—", delta: "", tone: "neutral" },
          {
            label: "بیماران",
            value: toFaDigits(String(data?.live.patients ?? 0)),
            delta: "پرونده مالی",
            tone: "neutral",
          },
        ]}
      />
      <Panel labelledBy="finance">
        <PanelHead
          titleId="finance"
          title="خلاصه مالی"
          description="نمای CFO / حسابدار — بدون CRM و بازاریابی"
          actions={
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/erp/finance")}>
              جزئیات مالی
            </Button>
          }
        />
        <p className="text-sm text-ink-muted">
          تسویه پزشکان، اقساط بیماران و گردش نقدی در ماژول مالی قابل پیگیری است.
        </p>
      </Panel>
    </>
  );
}

function HrView({ data }: { data: Dash | null }) {
  return (
    <>
      <KpiStrip
        items={[
          {
            label: "پزشکان",
            value: toFaDigits(String(data?.doctors.length ?? 0)),
            delta: "در شبکه",
            tone: "neutral",
          },
          {
            label: "شعب",
            value: toFaDigits(String(data?.branches.length ?? 0)),
            delta: "فعال",
            tone: "neutral",
          },
          {
            label: "پرسنل",
            value: "—",
            delta: "از ماژول HR",
            tone: "neutral",
          },
        ]}
      />
      <Panel labelledBy="hr">
        <PanelHead
          titleId="hr"
          title="منابع انسانی"
          description="حضور، حقوق و پرونده پرسنل"
          actions={
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/erp/hr")}>
              مدیریت پرسنل
            </Button>
          }
        />
        <DoctorList doctors={data?.doctors ?? []} campaigns={[]} />
      </Panel>
    </>
  );
}

function BranchView({ data }: { data: Dash | null }) {
  return (
    <>
      <KpiStrip
        items={[
          {
            label: "نوبت شعبه",
            value: toFaDigits(String(data?.live.appointments ?? 0)),
            delta: "کل",
            tone: "neutral",
          },
          {
            label: "بیماران",
            value: toFaDigits(String(data?.live.patients ?? 0)),
            delta: "پرونده",
            tone: "neutral",
          },
          {
            label: "لید",
            value: toFaDigits(String(data?.live.leads ?? 0)),
            delta: "محلی",
            tone: "neutral",
          },
        ]}
      />
      <Panel labelledBy="branch">
        <PanelHead titleId="branch" title="عملکرد شعبه" description="نمای مدیر شعبه / کلینیک" />
        <BranchTable branches={data?.branches ?? []} />
      </Panel>
    </>
  );
}

function ClinicalView({ appointments }: { appointments: Appt[] }) {
  const today = appointments.filter((a) => a.status !== "cancelled").slice(0, 8);

  return (
    <>
      <KpiStrip
        items={[
          {
            label: "نوبت امروز",
            value: toFaDigits(String(today.length)),
            delta: "برنامه کاری",
            tone: "neutral",
          },
          {
            label: "تأییدشده",
            value: toFaDigits(String(today.filter((a) => a.status === "confirmed").length)),
            delta: "آماده ویزیت",
            tone: "up",
          },
          {
            label: "در انتظار",
            value: toFaDigits(String(today.filter((a) => a.status === "booked").length)),
            delta: "نیاز به تأیید",
            tone: "neutral",
          },
        ]}
      />
      <Panel labelledBy="clinical">
        <PanelHead
          titleId="clinical"
          title="برنامه امروز پزشک"
          description="نمای DOC / AST — فقط نوبت و بیمار"
          actions={
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/erp/appointments")}>
              نوبت‌دهی
            </Button>
          }
        />
        <ApptTable appointments={today} />
      </Panel>
    </>
  );
}

function ReceptionView({ appointments, leads }: { appointments: Appt[]; leads: Lead[] }) {
  return (
    <>
      <KpiStrip
        items={[
          {
            label: "نوبت امروز",
            value: toFaDigits(String(appointments.length)),
            delta: "پذیرش",
            tone: "neutral",
          },
          {
            label: "لید جدید",
            value: toFaDigits(String(leads.filter((l) => l.status === "lead").length)),
            delta: "نیاز تماس",
            tone: "up",
          },
          {
            label: "در انتظار",
            value: toFaDigits(String(appointments.filter((a) => a.status === "booked").length)),
            delta: "چک‌این",
            tone: "neutral",
          },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel labelledBy="rec-appt">
          <PanelHead titleId="rec-appt" title="صف نوبت" description="نمای پذیرش" />
          <ApptTable appointments={appointments.slice(0, 6)} />
        </Panel>
        <Panel labelledBy="rec-lead">
          <PanelHead titleId="rec-lead" title="لیدهای تازه" />
          <LeadTable leads={leads.slice(0, 5)} />
        </Panel>
      </div>
    </>
  );
}

function PatientView({ appointments }: { appointments: Appt[] }) {
  return (
    <>
      <KpiStrip
        items={[
          {
            label: "نوبت‌های من",
            value: toFaDigits(String(appointments.length)),
            delta: "پرونده شخصی",
            tone: "neutral",
          },
          {
            label: "بعدی",
            value: appointments[0] ? toJalali(appointments[0].startsAt) : "—",
            delta: "تاریخ",
            tone: "up",
          },
          {
            label: "تیکت",
            value: "۱",
            delta: "پشتیبانی",
            tone: "neutral",
          },
        ]}
      />
      <Panel labelledBy="patient">
        <PanelHead
          titleId="patient"
          title="نوبت‌های من"
          description="نمای بیمار — فقط دادهٔ خود"
          actions={
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/erp/tickets")}>
              درخواست پشتیبانی
            </Button>
          }
        />
        <ApptTable appointments={appointments} />
      </Panel>
    </>
  );
}

function LeadTable({ leads }: { leads: Lead[] }) {
  return (
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
              <Badge tone={leadStatusTone[row.status as keyof typeof leadStatusTone] ?? "neutral"}>
                {leadStatusLabel[row.status as keyof typeof leadStatusLabel] ?? row.status}
              </Badge>
            </td>
            <td className="border-b border-stone-100 px-2 py-3" dir="ltr">
              {toJalali(row.updatedAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BranchTable({
  branches,
}: {
  branches: { id: string; name: string; appointments: number; patients: number; leads: number }[];
}) {
  return (
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
          {branches.map((row) => (
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
  );
}

function DoctorList({
  doctors,
  campaigns,
}: {
  doctors: { id: string; name: string; specialty: string; appointments: number; commissionPct: number }[];
  campaigns: { id: string; name: string; budget: number; spend: number; status: string }[];
}) {
  return (
    <Panel labelledBy="docs-heading">
      <PanelHead titleId="docs-heading" title="عملکرد پزشکان" description="نوبت و پورسانت" />
      <ul className="space-y-3">
        {doctors.map((d) => (
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
      {campaigns.length > 0 && (
        <div className="mt-4 border-t border-stone-100 pt-4">
          <div className="mb-2 text-xs font-semibold text-ink-muted">کمپین‌های اخیر</div>
          {campaigns.map((c) => (
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
  );
}

function ApptTable({ appointments }: { appointments: Appt[] }) {
  return (
    <table className="w-full border-collapse text-[0.9rem]">
      <thead>
        <tr>
          {["بیمار", "پزشک", "وضعیت", "زمان"].map((h) => (
            <th key={h} className="border-b border-stone-100 px-2 py-3 text-start text-xs text-ink-muted">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {appointments.map((row) => (
          <tr key={row.id} className="hover:bg-olive-50/60">
            <td className="border-b border-stone-100 px-2 py-3">{row.patient?.name ?? "—"}</td>
            <td className="border-b border-stone-100 px-2 py-3">{row.doctor?.name ?? "—"}</td>
            <td className="border-b border-stone-100 px-2 py-3">{row.status}</td>
            <td className="border-b border-stone-100 px-2 py-3" dir="ltr">
              {toJalali(row.startsAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
