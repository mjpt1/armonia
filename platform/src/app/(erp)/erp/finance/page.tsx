"use client";

import { ErpHeader } from "@/components/erp/ErpHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { formatMoneyFa, todayJalali, toJalali } from "@/lib/utils/jalali";
import { useCallback, useEffect, useState } from "react";

export default function FinancePage() {
  const [payments, setPayments] = useState<
    { id: string; kind: string; amount: number; note?: string | null; createdAt: string; status: string }[]
  >([]);
  const [plans, setPlans] = useState<
    {
      id: string;
      title: string;
      totalAmount: number;
      paidAmount: number;
      status: string;
      patientName?: string | null;
      dueDate?: string | null;
    }[]
  >([]);
  const [commissions, setCommissions] = useState<
    { id: string; doctorName: string; period: string; amount: number; status: string; percent: number }[]
  >([]);
  const [settlements, setSettlements] = useState<
    { id: string; kind: string; party: string; amount: number; status: string; period?: string | null }[]
  >([]);
  const [form, setForm] = useState({ amount: "", kind: "in", note: "" });
  const [planForm, setPlanForm] = useState({ patientName: "", title: "", totalAmount: "" });

  const reload = useCallback(async () => {
    const [p, i, c, s] = await Promise.all([
      fetch("/api/finance").then((r) => r.json()),
      fetch("/api/finance?tab=installments").then((r) => r.json()),
      fetch("/api/finance?tab=commissions").then((r) => r.json()),
      fetch("/api/finance?tab=settlements").then((r) => r.json()),
    ]);
    setPayments(p.data ?? []);
    setPlans(i.data ?? []);
    setCommissions(c.data ?? []);
    setSettlements(s.data ?? []);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <>
      <ErpHeader title="مالی" meta={<>اقساط، دریافت/پرداخت، تسویه · {todayJalali()}</>} />
      <main className="page-enter space-y-8 px-5 pb-12 pt-8 sm:px-10">
        <Panel labelledBy="pay">
          <PanelHead titleId="pay" title="ثبت دریافت / پرداخت" />
          <form
            className="grid gap-3 sm:grid-cols-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await fetch("/api/finance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  kind: form.kind,
                  amount: Number(form.amount),
                  note: form.note,
                  method: "cash",
                }),
              });
              setForm({ amount: "", kind: "in", note: "" });
              await reload();
            }}
          >
            <input
              className="rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
              placeholder="مبلغ"
              value={form.amount}
              onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
              required
            />
            <select
              className="rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
              value={form.kind}
              onChange={(e) => setForm((s) => ({ ...s, kind: e.target.value }))}
            >
              <option value="in">دریافت</option>
              <option value="out">پرداخت</option>
            </select>
            <input
              className="rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
              placeholder="یادداشت"
              value={form.note}
              onChange={(e) => setForm((s) => ({ ...s, note: e.target.value }))}
            />
            <Button type="submit" size="sm">
              ثبت
            </Button>
          </form>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr>
                {["جهت", "مبلغ", "وضعیت", "تاریخ", "یادداشت"].map((h) => (
                  <th key={h} className="border-b border-stone-100 px-2 py-2 text-start text-xs text-ink-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 15).map((p) => (
                <tr key={p.id}>
                  <td className="border-b border-stone-100 px-2 py-2">
                    <Badge tone={p.kind === "in" ? "success" : "warning"}>
                      {p.kind === "in" ? "ورود" : "خروج"}
                    </Badge>
                  </td>
                  <td className="border-b border-stone-100 px-2 py-2">{formatMoneyFa(p.amount)}</td>
                  <td className="border-b border-stone-100 px-2 py-2">{p.status}</td>
                  <td className="border-b border-stone-100 px-2 py-2">{toJalali(p.createdAt)}</td>
                  <td className="border-b border-stone-100 px-2 py-2">{p.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel labelledBy="inst">
          <PanelHead titleId="inst" title="اقساط" description="ایجاد طرح و ثبت پرداخت جزئی" />
          <form
            className="mb-4 grid gap-3 sm:grid-cols-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await fetch("/api/finance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  tab: "installments",
                  patientName: planForm.patientName,
                  title: planForm.title,
                  totalAmount: Number(planForm.totalAmount),
                }),
              });
              setPlanForm({ patientName: "", title: "", totalAmount: "" });
              await reload();
            }}
          >
            <input
              className="rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
              placeholder="نام بیمار"
              value={planForm.patientName}
              onChange={(e) => setPlanForm((s) => ({ ...s, patientName: e.target.value }))}
            />
            <input
              className="rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
              placeholder="عنوان"
              value={planForm.title}
              required
              onChange={(e) => setPlanForm((s) => ({ ...s, title: e.target.value }))}
            />
            <input
              className="rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
              placeholder="مبلغ کل"
              value={planForm.totalAmount}
              required
              onChange={(e) => setPlanForm((s) => ({ ...s, totalAmount: e.target.value }))}
            />
            <Button type="submit" size="sm">
              ایجاد طرح
            </Button>
          </form>
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-md border border-stone-100 bg-ivory p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium text-olive-800">{plan.title}</div>
                    <div className="text-xs text-ink-muted">
                      {plan.patientName} · {formatMoneyFa(plan.paidAmount)} از{" "}
                      {formatMoneyFa(plan.totalAmount)}
                      {plan.dueDate ? ` · سررسید ${toJalali(plan.dueDate)}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={plan.status === "paid" ? "success" : "info"}>{plan.status}</Badge>
                    {plan.paidAmount < plan.totalAmount && (
                      <button
                        type="button"
                        className="text-sm text-olive-800 underline"
                        onClick={async () => {
                          const chunk = Math.round(
                            (plan.totalAmount - plan.paidAmount) /
                              Math.max(1, Math.ceil((plan.totalAmount - plan.paidAmount) / (plan.totalAmount / 3))),
                          );
                          const pay = Math.min(chunk || Math.round(plan.totalAmount / 3), plan.totalAmount - plan.paidAmount);
                          await fetch("/api/finance", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id: plan.id,
                              tab: "installments",
                              paidAmount: plan.paidAmount + pay,
                              status:
                                plan.paidAmount + pay >= plan.totalAmount ? "paid" : "open",
                            }),
                          });
                          await fetch("/api/finance", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              kind: "in",
                              amount: pay,
                              note: `قسط ${plan.title}`,
                              method: "card",
                            }),
                          });
                          await reload();
                        }}
                      >
                        ثبت قسط
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel labelledBy="comm">
            <PanelHead titleId="comm" title="پورسانت پزشکان" />
            <ul className="space-y-2 text-sm">
              {commissions.map((c) => (
                <li key={c.id} className="flex justify-between border-b border-stone-100 py-2">
                  <span>
                    {c.doctorName} · {c.period} · {formatMoneyFa(c.amount)}
                  </span>
                  <button
                    type="button"
                    className="underline"
                    onClick={async () => {
                      await fetch("/api/finance", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: c.id,
                          tab: "commissions",
                          status: "paid",
                        }),
                      });
                      await reload();
                    }}
                  >
                    {c.status}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel labelledBy="set">
            <PanelHead titleId="set" title="تسویه کلینیک / پزشک" />
            <ul className="space-y-2 text-sm">
              {settlements.map((s) => (
                <li key={s.id} className="flex justify-between border-b border-stone-100 py-2">
                  <span>
                    {s.kind}: {s.party} · {formatMoneyFa(s.amount)}
                  </span>
                  <button
                    type="button"
                    className="underline"
                    onClick={async () => {
                      await fetch("/api/finance", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: s.id,
                          tab: "settlements",
                          status: "settled",
                        }),
                      });
                      await reload();
                    }}
                  >
                    {s.status}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </main>
    </>
  );
}
