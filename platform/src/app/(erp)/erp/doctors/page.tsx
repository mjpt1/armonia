"use client";

import { CrudModule } from "@/components/erp/CrudModule";
import { ErpHeader } from "@/components/erp/ErpHeader";
import { todayJalali, toFaDigits } from "@/lib/utils/jalali";
import { useEffect, useState } from "react";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  commissionPct: number;
  scheduleNote?: string | null;
  contractNote?: string | null;
  clinic?: { name: string } | null;
  branch?: { name: string } | null;
  active: boolean;
};

export default function DoctorsPage() {
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
  const [clinics, setClinics] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    void (async () => {
      const [b, c] = await Promise.all([
        fetch("/api/branches").then((r) => r.json()),
        fetch("/api/clinics").then((r) => r.json()),
      ]);
      setBranches(
        (b.data ?? []).map((x: { id: string; name: string }) => ({
          value: x.id,
          label: x.name,
        })),
      );
      setClinics(
        (c.data ?? []).map((x: { id: string; name: string }) => ({
          value: x.id,
          label: x.name,
        })),
      );
    })();
  }, []);

  return (
    <>
      <ErpHeader title="پزشکان" meta={<>پروفایل، برنامه، پورسانت · {todayJalali()}</>} />
      <main className="page-enter px-5 pb-12 pt-8 sm:px-10">
        <CrudModule<Doctor>
          module="doctors"
          title="فهرست پزشکان"
          endpoint="/api/doctors"
          emptyForm={{
            name: "",
            specialty: "",
            branchId: "",
            clinicId: "",
            experienceYears: "0",
            commissionPct: "30",
            scheduleNote: "",
            contractNote: "",
          }}
          fields={[
            { name: "name", label: "نام", required: true },
            { name: "specialty", label: "تخصص", required: true },
            { name: "branchId", label: "شعبه", type: "select", options: branches, required: true },
            { name: "clinicId", label: "کلینیک", type: "select", options: clinics },
            { name: "experienceYears", label: "سابقه (سال)", type: "number" },
            { name: "commissionPct", label: "درصد پورسانت", type: "number" },
            { name: "scheduleNote", label: "برنامه کاری", type: "textarea" },
            { name: "contractNote", label: "یادداشت قرارداد", type: "textarea" },
          ]}
          columns={[
            { key: "name", header: "نام", render: (r) => r.name },
            { key: "specialty", header: "تخصص", render: (r) => r.specialty },
            { key: "branch", header: "شعبه", render: (r) => r.branch?.name ?? "—" },
            { key: "clinic", header: "کلینیک", render: (r) => r.clinic?.name ?? "—" },
            {
              key: "commission",
              header: "پورسانت",
              render: (r) => `${toFaDigits(r.commissionPct)}٪`,
            },
            { key: "schedule", header: "برنامه", render: (r) => r.scheduleNote ?? "—" },
          ]}
        />
      </main>
    </>
  );
}
