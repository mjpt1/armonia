"use client";

import { CrudModule } from "@/components/erp/CrudModule";
import { ErpHeader } from "@/components/erp/ErpHeader";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { todayJalali } from "@/lib/utils/jalali";
import { useState } from "react";

type Patient = {
  id: string;
  name: string;
  mobile: string;
  fileCode: string;
  nationalId?: string | null;
  birthJalali?: string | null;
};

export default function PatientsPage() {
  const [selected, setSelected] = useState<{
    id: string;
    name: string;
    fileCode: string;
    documents?: { id: string; title: string }[];
    treatments?: { id: string; title: string }[];
    prescriptions?: { id: string; content: string }[];
  } | null>(null);
  const [docTitle, setDocTitle] = useState("");
  const [treatmentTitle, setTreatmentTitle] = useState("");

  async function loadDetail(id: string) {
    const res = await fetch(`/api/patients?id=${encodeURIComponent(id)}`);
    const json = await res.json();
    setSelected(json.data);
  }

  return (
    <>
      <ErpHeader title="بیماران" meta={<>پرونده و مدارک · {todayJalali()}</>} />
      <main className="page-enter space-y-8 px-5 pb-12 pt-8 sm:px-10">
        <CrudModule<Patient>
          title="فهرست بیماران"
          description="ایجاد پرونده و باز کردن جزئیات"
          endpoint="/api/patients"
          emptyForm={{ name: "", mobile: "", nationalId: "", birthJalali: "" }}
          fields={[
            { name: "name", label: "نام", required: true },
            { name: "mobile", label: "موبایل", type: "tel", required: true },
            { name: "nationalId", label: "کد ملی" },
            { name: "birthJalali", label: "تاریخ تولد (شمسی)" },
          ]}
          columns={[
            { key: "file", header: "کد پرونده", render: (r) => r.fileCode },
            { key: "name", header: "نام", render: (r) => r.name },
            { key: "mobile", header: "موبایل", render: (r) => <span dir="ltr">{r.mobile}</span> },
          ]}
          extraActions={(row) => (
            <button
              type="button"
              className="text-sm font-medium text-olive-800 underline"
              onClick={() => void loadDetail(row.id)}
            >
              پرونده
            </button>
          )}
        />

        {selected && (
          <Panel labelledBy="file">
            <PanelHead
              titleId="file"
              title={`پرونده ${selected.name}`}
              description={`کد ${selected.fileCode}`}
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-semibold">افزودن مدرک (متادیتا)</h4>
                <input
                  className="w-full rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
                  placeholder="عنوان مدرک"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                />
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={async () => {
                    if (!docTitle.trim()) return;
                    await fetch("/api/patients", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: selected.id,
                        addDocument: { title: docTitle, meta: "meta://upload" },
                      }),
                    });
                    setDocTitle("");
                    await loadDetail(selected.id);
                  }}
                >
                  ثبت مدرک
                </Button>
                <ul className="mt-3 space-y-1 text-sm">
                  {(selected.documents ?? []).map((d) => (
                    <li key={d.id}>· {d.title}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold">افزودن درمان</h4>
                <input
                  className="w-full rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm"
                  placeholder="عنوان درمان"
                  value={treatmentTitle}
                  onChange={(e) => setTreatmentTitle(e.target.value)}
                />
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={async () => {
                    if (!treatmentTitle.trim()) return;
                    await fetch("/api/patients", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: selected.id,
                        addTreatment: { title: treatmentTitle },
                      }),
                    });
                    setTreatmentTitle("");
                    await loadDetail(selected.id);
                  }}
                >
                  ثبت درمان
                </Button>
                <ul className="mt-3 space-y-1 text-sm">
                  {(selected.treatments ?? []).map((t) => (
                    <li key={t.id}>· {t.title}</li>
                  ))}
                </ul>
                <h4 className="mb-2 mt-4 text-sm font-semibold">نسخه‌ها</h4>
                <ul className="space-y-1 text-sm">
                  {(selected.prescriptions ?? []).map((p) => (
                    <li key={p.id}>· {p.content}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
        )}
      </main>
    </>
  );
}
