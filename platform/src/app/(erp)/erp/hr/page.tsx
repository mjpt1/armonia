"use client";

import { CrudModule } from "@/components/erp/CrudModule";
import { ErpHeader } from "@/components/erp/ErpHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { formatMoneyFa, todayJalali, toJalali } from "@/lib/utils/jalali";
import { useCallback, useEffect, useState } from "react";

type Staff = {
  id: string;
  name: string;
  roleTitle: string;
  mobile?: string | null;
  active: boolean;
  branch?: { name: string } | null;
};

export default function HrPage() {
  const [leaves, setLeaves] = useState<
    {
      id: string;
      status: string;
      reason?: string | null;
      fromDate: string;
      toDate: string;
      staff?: { name: string };
    }[]
  >([]);
  const [payroll, setPayroll] = useState<
    { id: string; period: string; amount: number; status: string; staff?: { name: string } }[]
  >([]);
  const [attendance, setAttendance] = useState<
    { id: string; date: string; status: string; staff?: { name: string } }[]
  >([]);
  const [staffId, setStaffId] = useState("");
  const [staffList, setStaffList] = useState<Staff[]>([]);

  const reloadExtra = useCallback(async () => {
    const [l, p, a, s] = await Promise.all([
      fetch("/api/hr?tab=leaves").then((r) => r.json()),
      fetch("/api/hr?tab=payroll").then((r) => r.json()),
      fetch("/api/hr?tab=attendance").then((r) => r.json()),
      fetch("/api/hr").then((r) => r.json()),
    ]);
    setLeaves(l.data ?? []);
    setPayroll(p.data ?? []);
    setAttendance(a.data ?? []);
    setStaffList(s.data ?? []);
  }, []);

  useEffect(() => {
    void reloadExtra();
  }, [reloadExtra]);

  return (
    <>
      <ErpHeader title="منابع انسانی" meta={<>پرسنل، حضور، مرخصی، حقوق · {todayJalali()}</>} />
      <main className="page-enter space-y-8 px-5 pb-12 pt-8 sm:px-10">
        <CrudModule<Staff>
          title="پرسنل"
          endpoint="/api/hr"
          emptyForm={{ name: "", roleTitle: "", mobile: "" }}
          fields={[
            { name: "name", label: "نام", required: true },
            { name: "roleTitle", label: "سمت", required: true },
            { name: "mobile", label: "موبایل", type: "tel" },
          ]}
          columns={[
            { key: "name", header: "نام", render: (r) => r.name },
            { key: "job", header: "سمت", render: (r) => r.roleTitle },
            { key: "mobile", header: "موبایل", render: (r) => r.mobile ?? "—" },
            { key: "branch", header: "شعبه", render: (r) => r.branch?.name ?? "—" },
          ]}
        />

        <Panel labelledBy="att">
          <PanelHead titleId="att" title="حضور امروز" />
          <form
            className="mb-3 flex flex-wrap gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!staffId) return;
              await fetch("/api/hr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tab: "attendance", staffId, status: "present" }),
              });
              await reloadExtra();
            }}
          >
            <select
              className="rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            >
              <option value="">انتخاب پرسنل…</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm">
              ثبت حضور
            </Button>
          </form>
          <ul className="space-y-1 text-sm">
            {attendance.slice(0, 10).map((a) => (
              <li key={a.id}>
                {a.staff?.name} · {toJalali(a.date)} · <Badge tone="success">{a.status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel labelledBy="leave">
            <PanelHead titleId="leave" title="مرخصی‌ها" />
            <ul className="space-y-2 text-sm">
              {leaves.map((l) => (
                <li key={l.id} className="flex justify-between gap-2 border-b border-stone-100 py-2">
                  <span>
                    {l.staff?.name} · {toJalali(l.fromDate)} تا {toJalali(l.toDate)}
                    <br />
                    <span className="text-xs text-ink-muted">{l.reason}</span>
                  </span>
                  <button
                    type="button"
                    className="underline"
                    onClick={async () => {
                      await fetch("/api/hr", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: l.id, tab: "leaves", status: "approved" }),
                      });
                      await reloadExtra();
                    }}
                  >
                    {l.status}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel labelledBy="pay">
            <PanelHead titleId="pay" title="حقوق" />
            <ul className="space-y-2 text-sm">
              {payroll.map((p) => (
                <li key={p.id} className="flex justify-between border-b border-stone-100 py-2">
                  <span>
                    {p.staff?.name} · {p.period} · {formatMoneyFa(p.amount)}
                  </span>
                  <Badge tone="info">{p.status}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </main>
    </>
  );
}
