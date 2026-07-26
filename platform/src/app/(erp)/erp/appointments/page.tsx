"use client";

import { CrudModule } from "@/components/erp/CrudModule";
import { ErpHeader } from "@/components/erp/ErpHeader";
import { Badge } from "@/components/ui/Badge";
import { todayJalali, toJalaliDateTime } from "@/lib/utils/jalali";
import { useEffect, useState } from "react";

type Appt = {
  id: string;
  startsAt: string;
  status: string;
  kind: string;
  service?: string | null;
  notes?: string | null;
  patientName?: string | null;
  mobile?: string | null;
  doctor?: { id: string; name: string } | null;
  patient?: { id: string; name: string } | null;
};

type Wait = {
  id: string;
  name: string;
  mobile: string;
  service?: string | null;
  status: string;
  notes?: string | null;
};

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState<{ value: string; label: string }[]>([]);
  const [patients, setPatients] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    void (async () => {
      const [d, p] = await Promise.all([
        fetch("/api/doctors").then((r) => r.json()),
        fetch("/api/patients").then((r) => r.json()),
      ]);
      setDoctors(
        (d.data ?? []).map((x: { id: string; name: string }) => ({
          value: x.id,
          label: x.name,
        })),
      );
      setPatients(
        (p.data ?? []).map((x: { id: string; name: string }) => ({
          value: x.id,
          label: x.name,
        })),
      );
    })();
  }, []);

  return (
    <>
      <ErpHeader title="نوبت‌دهی" meta={<>تقویم و لیست انتظار · {todayJalali()}</>} />
      <main className="page-enter space-y-8 px-5 pb-12 pt-8 sm:px-10">
        <CrudModule<Appt>
          title="نوبت‌ها"
          description="رزرو، تأیید، لغو"
          endpoint="/api/appointments"
          emptyForm={{
            startsAt: "",
            doctorId: "",
            patientId: "",
            patientName: "",
            mobile: "",
            service: "",
            status: "booked",
            kind: "default",
            notes: "",
          }}
          fields={[
            { name: "startsAt", label: "زمان شروع", type: "datetime-local", required: true },
            { name: "doctorId", label: "پزشک", type: "select", options: doctors },
            { name: "patientId", label: "بیمار (از پرونده)", type: "select", options: patients },
            { name: "patientName", label: "نام بیمار (اگر پرونده نیست)" },
            { name: "mobile", label: "موبایل", type: "tel" },
            { name: "service", label: "خدمت" },
            {
              name: "status",
              label: "وضعیت",
              type: "select",
              options: [
                { value: "booked", label: "رزرو" },
                { value: "confirmed", label: "تأیید" },
                { value: "cancelled", label: "لغو" },
                { value: "done", label: "انجام‌شده" },
              ],
            },
            { name: "notes", label: "یادداشت", type: "textarea" },
          ]}
          mapRowToForm={(r) => ({
            startsAt: r.startsAt ? new Date(r.startsAt).toISOString().slice(0, 16) : "",
            doctorId: r.doctor?.id ?? "",
            patientId: r.patient?.id ?? "",
            patientName: r.patientName ?? r.patient?.name ?? "",
            mobile: r.mobile ?? "",
            service: r.service ?? "",
            status: r.status,
            kind: r.kind,
            notes: r.notes ?? "",
          })}
          columns={[
            { key: "time", header: "زمان", render: (r) => toJalaliDateTime(r.startsAt) },
            { key: "doctor", header: "پزشک", render: (r) => r.doctor?.name ?? "—" },
            {
              key: "patient",
              header: "بیمار",
              render: (r) => r.patient?.name ?? r.patientName ?? "—",
            },
            { key: "service", header: "خدمت", render: (r) => r.service ?? "—" },
            {
              key: "status",
              header: "وضعیت",
              render: (r) => (
                <Badge tone={r.status === "cancelled" ? "danger" : "info"}>{r.status}</Badge>
              ),
            },
          ]}
          extraActions={(row, reload) =>
            row.status !== "cancelled" ? (
              <button
                type="button"
                className="text-sm font-medium text-danger underline"
                onClick={async () => {
                  await fetch("/api/appointments", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: row.id, status: "cancelled" }),
                  });
                  reload();
                }}
              >
                لغو
              </button>
            ) : null
          }
        />

        <CrudModule<Wait>
          title="لیست انتظار"
          description="افزودن به صف انتظار"
          endpoint="/api/waitlist"
          emptyForm={{ name: "", mobile: "", service: "", notes: "", status: "waiting" }}
          fields={[
            { name: "name", label: "نام", required: true },
            { name: "mobile", label: "موبایل", type: "tel", required: true },
            { name: "service", label: "خدمت" },
            { name: "notes", label: "ترجیح / یادداشت", type: "textarea" },
          ]}
          columns={[
            { key: "name", header: "نام", render: (r) => r.name },
            { key: "mobile", header: "موبایل", render: (r) => <span dir="ltr">{r.mobile}</span> },
            { key: "service", header: "خدمت", render: (r) => r.service ?? "—" },
            {
              key: "status",
              header: "وضعیت",
              render: (r) => <Badge tone="wait">{r.status}</Badge>,
            },
          ]}
        />
      </main>
    </>
  );
}
