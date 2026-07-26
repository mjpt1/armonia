"use client";

import { ErpHeader } from "@/components/erp/ErpHeader";
import { RoleDashboard } from "@/components/erp/RoleDashboard";
import { useScope } from "@/lib/mock/session";
import {
  dashboardKindForRole,
  dashboardTitleForKind,
  defaultRouteForRole,
} from "@/lib/rbac/home";
import { todayJalali, toJalali } from "@/lib/utils/jalali";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Dash = {
  kpis: { label: string; value: string; delta: string; tone: "up" | "down" | "neutral" }[];
  branches: { id: string; name: string; appointments: number; patients: number; leads: number }[];
  doctors: { id: string; name: string; specialty: string; appointments: number; commissionPct: number }[];
  campaigns: { id: string; name: string; budget: number; spend: number; status: string }[];
  live: { leads: number; patients: number; appointments: number; updatedAt: string };
};

export default function ErpDashboardPage() {
  const router = useRouter();
  const { session, loading } = useScope();
  const kind = dashboardKindForRole(session.role);
  const [data, setData] = useState<Dash | null>(null);
  const [leads, setLeads] = useState<
    { id: string; name: string; status: string; source: string; updatedAt: string }[]
  >([]);
  const [appointments, setAppointments] = useState<
    {
      id: string;
      status: string;
      startsAt: string;
      patient?: { name: string };
      doctor?: { name: string };
    }[]
  >([]);

  useEffect(() => {
    if (loading) return;
    if (!kind) {
      router.replace(defaultRouteForRole(session.role));
    }
  }, [loading, kind, session.role, router]);

  useEffect(() => {
    void (async () => {
      const [d, l, a] = await Promise.all([
        fetch("/api/dashboard").then((r) => r.json()),
        fetch("/api/leads").then((r) => r.json()),
        fetch("/api/appointments").then((r) => r.json()),
      ]);
      setData(d.data);
      setLeads((l.data ?? []).slice(0, 8));
      setAppointments(a.data ?? []);
    })();
  }, []);

  if (!kind) return null;

  return (
    <>
      <ErpHeader
        title={dashboardTitleForKind(kind)}
        meta={
          <>
            {todayJalali()}
            {data?.live ? ` · به‌روز ${toJalali(data.live.updatedAt)}` : null}
          </>
        }
      />
      <main className="page-enter px-5 pb-12 pt-8 sm:px-10">
        <RoleDashboard kind={kind} data={data} leads={leads} appointments={appointments} />
      </main>
    </>
  );
}
