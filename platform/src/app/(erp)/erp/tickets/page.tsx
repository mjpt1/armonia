"use client";

import { ErpHeader } from "@/components/erp/ErpHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { apiFetch, useToast } from "@/lib/client-api";
import { useEffect, useState } from "react";

interface Ticket {
  id: string;
  subject: string;
  body: string | null;
  status: string;
  priority: string;
  requester: string | null;
}

export default function TicketsPage() {
  const { show, node } = useToast();
  const [rows, setRows] = useState<Ticket[]>([]);
  const [form, setForm] = useState({ subject: "", body: "", priority: "normal", requester: "" });

  async function load() {
    const res = await apiFetch<Ticket[]>("/api/tickets");
    if (res.error) show(res.error, "err");
    else setRows(res.data || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function create() {
    const res = await apiFetch("/api/tickets", { method: "POST", body: JSON.stringify(form) });
    if (res.error) show(res.error, "err");
    else {
      show("تیکت ثبت شد");
      setForm({ subject: "", body: "", priority: "normal", requester: "" });
      void load();
    }
  }

  async function close(id: string) {
    const res = await apiFetch("/api/tickets", {
      method: "PATCH",
      body: JSON.stringify({ id, status: "closed" }),
    });
    if (res.error) show(res.error, "err");
    else {
      show("تیکت بسته شد");
      void load();
    }
  }

  const cols: Column<Ticket>[] = [
    { key: "subject", header: "موضوع", render: (r) => r.subject },
    { key: "req", header: "درخواست‌کننده", render: (r) => r.requester || "—" },
    { key: "pri", header: "اولویت", render: (r) => r.priority },
    { key: "st", header: "وضعیت", render: (r) => r.status },
    {
      key: "act",
      header: "",
      render: (r) =>
        r.status !== "closed" ? (
          <Button size="sm" variant="ghost" onClick={() => void close(r.id)}>
            بستن
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      {node}
      <ErpHeader title="تیکت‌ها" meta="پشتیبانی داخلی" />
      <main className="page-enter px-5 pb-12 pt-8 sm:px-10">
        <Panel labelledBy="tickets">
          <PanelHead titleId="tickets" title="فهرست تیکت‌ها" />
          <div className="mb-4 grid gap-2 sm:grid-cols-4">
            <input className="rounded-md border border-stone-300 px-3 py-2 text-sm" placeholder="موضوع" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <input className="rounded-md border border-stone-300 px-3 py-2 text-sm" placeholder="توضیح" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <input className="rounded-md border border-stone-300 px-3 py-2 text-sm" placeholder="درخواست‌کننده" value={form.requester} onChange={(e) => setForm({ ...form, requester: e.target.value })} />
            <Button onClick={() => void create()}>ثبت تیکت</Button>
          </div>
          <DataTable columns={cols} rows={rows} emptyMessage="تیکتی نیست." />
        </Panel>
      </main>
    </>
  );
}
