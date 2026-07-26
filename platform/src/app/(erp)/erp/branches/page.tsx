"use client";

import { CrudModule } from "@/components/erp/CrudModule";
import { ErpHeader } from "@/components/erp/ErpHeader";
import { todayJalali, toFaDigits } from "@/lib/utils/jalali";

type Branch = {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  active: boolean;
  managerName?: string | null;
  _count?: { patients: number; doctors: number; users: number };
  clinics?: { id: string }[];
};

export default function BranchesPage() {
  return (
    <>
      <ErpHeader title="شعب" meta={<>ایجاد شعبه و گزارش · {todayJalali()}</>} />
      <main className="page-enter px-5 pb-12 pt-8 sm:px-10">
        <CrudModule<Branch>
          title="فهرست شعب"
          endpoint="/api/branches"
          emptyForm={{ name: "", code: "", city: "", address: "", managerName: "" }}
          fields={[
            { name: "name", label: "نام شعبه", required: true },
            { name: "code", label: "کد", required: true },
            { name: "city", label: "شهر", required: true },
            { name: "address", label: "آدرس", required: true },
            { name: "managerName", label: "مدیر شعبه" },
          ]}
          columns={[
            { key: "name", header: "نام", render: (r) => r.name },
            { key: "code", header: "کد", render: (r) => r.code },
            { key: "city", header: "شهر", render: (r) => r.city },
            { key: "manager", header: "مدیر", render: (r) => r.managerName ?? "—" },
            {
              key: "clinics",
              header: "کلینیک",
              render: (r) => toFaDigits(r.clinics?.length ?? 0),
            },
            {
              key: "patients",
              header: "بیمار",
              render: (r) => toFaDigits(r._count?.patients ?? 0),
            },
            {
              key: "doctors",
              header: "پزشک",
              render: (r) => toFaDigits(r._count?.doctors ?? 0),
            },
          ]}
        />
      </main>
    </>
  );
}
