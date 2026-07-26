"use client";

import { CrudModule } from "@/components/erp/CrudModule";
import { ErpHeader } from "@/components/erp/ErpHeader";
import { Badge } from "@/components/ui/Badge";
import { todayJalali, toJalali } from "@/lib/utils/jalali";

type Contract = {
  id: string;
  partyType: string;
  title: string;
  partyName: string;
  status: string;
  signedAt?: string | null;
};

export default function ContractsPage() {
  return (
    <>
      <ErpHeader
        title="قراردادها"
        meta={<>بیمار / پزشک / کلینیک · امضای دیجیتال mock · {todayJalali()}</>}
      />
      <main className="page-enter px-5 pb-12 pt-8 sm:px-10">
        <CrudModule<Contract>
          module="contracts"
          title="فهرست قراردادها"
          endpoint="/api/contracts"
          emptyForm={{
            partyType: "patient",
            title: "",
            partyName: "",
            content: "",
          }}
          fields={[
            {
              name: "partyType",
              label: "نوع",
              type: "select",
              options: [
                { value: "patient", label: "بیمار" },
                { value: "doctor", label: "پزشک" },
                { value: "clinic", label: "کلینیک" },
              ],
              required: true,
            },
            { name: "title", label: "عنوان", required: true },
            { name: "partyName", label: "طرف قرارداد", required: true },
            { name: "content", label: "متن", type: "textarea" },
          ]}
          columns={[
            { key: "type", header: "نوع", render: (r) => r.partyType },
            { key: "title", header: "عنوان", render: (r) => r.title },
            { key: "party", header: "طرف", render: (r) => r.partyName },
            {
              key: "status",
              header: "وضعیت",
              render: (r) => (
                <Badge tone={r.status === "signed" ? "success" : "info"}>{r.status}</Badge>
              ),
            },
            {
              key: "signed",
              header: "امضا",
              render: (r) => (r.signedAt ? toJalali(r.signedAt) : "—"),
            },
          ]}
          extraActions={(row, reload) =>
            row.status !== "signed" ? (
              <button
                type="button"
                className="text-sm font-medium text-olive-800 underline"
                onClick={async () => {
                  await fetch("/api/contracts", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: row.id, sign: true }),
                  });
                  reload();
                }}
              >
                امضای دیجیتال
              </button>
            ) : null
          }
        />
      </main>
    </>
  );
}
