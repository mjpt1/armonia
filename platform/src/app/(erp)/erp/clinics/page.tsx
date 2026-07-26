"use client";

import { ErpHeader } from "@/components/erp/ErpHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { useScope } from "@/lib/auth-session";
import { apiFetch, useToast } from "@/lib/client-api";
import { toFaDigits } from "@/lib/utils/digits";
import { useEffect, useState } from "react";

interface Clinic {
  id: string;
  name: string;
  type: string;
  capacity: number;
  active: boolean;
  branch?: { name: string };
  doctors?: { id: string }[];
  services?: { service: { name: string } }[];
  _count?: { appointments: number };
}

export default function ClinicsPage() {
  const { show, node } = useToast();
  const { branchId, branches } = useScope();
  const [rows, setRows] = useState<Clinic[]>([]);
  const [form, setForm] = useState({ name: "", type: "پوست و زیبایی", capacity: "10", branchId: "" });

  async function load() {
    const params = new URLSearchParams();
    if (branchId !== "all") params.set("branchId", branchId);
    const res = await apiFetch<Clinic[]>(`/api/clinics?${params}`);
    if (res.error) show(res.error, "err");
    else setRows(res.data || []);
  }

  useEffect(() => {
    void load();
  }, [branchId]);

  async function create() {
    const res = await apiFetch("/api/clinics", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        capacity: Number(form.capacity),
        branchId: form.branchId || (branchId !== "all" ? branchId : branches[0]?.id),
      }),
    });
    if (res.error) show(res.error, "err");
    else {
      show("کلینیک ایجاد شد");
      void load();
    }
  }

  const cols: Column<Clinic>[] = [
    { key: "name", header: "کلینیک", render: (r) => r.name },
    { key: "type", header: "نوع", render: (r) => r.type },
    { key: "branch", header: "شعبه", render: (r) => r.branch?.name || "—" },
    {
      key: "cap",
      header: "ظرفیت",
      numeric: true,
      render: (r) => toFaDigits(String(r.capacity)),
    },
    {
      key: "docs",
      header: "پزشک",
      numeric: true,
      render: (r) => toFaDigits(String(r.doctors?.length || 0)),
    },
    {
      key: "svc",
      header: "خدمات",
      render: (r) => r.services?.map((s) => s.service.name).join("، ") || "—",
    },
    {
      key: "appt",
      header: "نوبت",
      numeric: true,
      render: (r) => toFaDigits(String(r._count?.appointments || 0)),
    },
  ];

  return (
    <>
      {node}
      <ErpHeader title="کلینیک‌ها" meta="اطلاعات · ظرفیت · خدمات · عملکرد" />
      <main className="page-enter px-5 pb-12 pt-8 sm:px-10">
        <Panel labelledBy="clinics">
          <PanelHead titleId="clinics" title="فهرست کلینیک‌ها" />
          <div className="mb-4 grid gap-2 sm:grid-cols-5">
            <input
              placeholder="نام"
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="نوع"
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <input
              placeholder="ظرفیت"
              type="number"
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
            <select
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: e.target.value })}
            >
              <option value="">شعبه</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <Button onClick={() => void create()}>ایجاد کلینیک</Button>
          </div>
          <DataTable columns={cols} rows={rows} emptyMessage="کلینیکی نیست." />
        </Panel>
      </main>
    </>
  );
}
