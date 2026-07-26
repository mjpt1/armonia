"use client";

import { CrudModule } from "@/components/erp/CrudModule";
import { ErpHeader } from "@/components/erp/ErpHeader";
import { Badge } from "@/components/ui/Badge";
import { formatMoneyFa, todayJalali, toFaDigits } from "@/lib/utils/jalali";
import { useEffect, useState } from "react";

type Campaign = {
  id: string;
  name: string;
  channel: string;
  budget: number;
  spent: number;
  leads: number;
  status: string;
};

export default function MarketingPage() {
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    void fetch("/api/branches")
      .then((r) => r.json())
      .then((j) =>
        setBranches(
          (j.data ?? []).map((b: { id: string; name: string }) => ({
            value: b.id,
            label: b.name,
          })),
        ),
      );
  }, []);

  return (
    <>
      <ErpHeader title="بازاریابی" meta={<>کمپین، بودجه، ROI · {todayJalali()}</>} />
      <main className="page-enter px-5 pb-12 pt-8 sm:px-10">
        <CrudModule<Campaign>
          module="marketing"
          title="کمپین‌ها"
          endpoint="/api/marketing"
          emptyForm={{
            name: "",
            channel: "ads",
            budget: "0",
            status: "draft",
            branchId: "",
          }}
          fields={[
            { name: "name", label: "نام کمپین", required: true },
            {
              name: "channel",
              label: "کانال",
              type: "select",
              options: [
                { value: "ads", label: "تبلیغات" },
                { value: "social", label: "سوشال" },
                { value: "email", label: "ایمیل" },
                { value: "sms", label: "پیامک" },
              ],
              required: true,
            },
            { name: "budget", label: "بودجه", type: "number" },
            {
              name: "status",
              label: "وضعیت",
              type: "select",
              options: [
                { value: "draft", label: "پیش‌نویس" },
                { value: "active", label: "فعال" },
                { value: "paused", label: "متوقف" },
                { value: "done", label: "پایان" },
              ],
            },
            { name: "branchId", label: "شعبه", type: "select", options: branches },
          ]}
          columns={[
            { key: "name", header: "نام", render: (r) => r.name },
            { key: "channel", header: "کانال", render: (r) => r.channel },
            { key: "budget", header: "بودجه", render: (r) => formatMoneyFa(r.budget) },
            { key: "spent", header: "هزینه", render: (r) => formatMoneyFa(r.spent) },
            {
              key: "roi",
              header: "باقی‌مانده",
              render: (r) => formatMoneyFa(r.budget - r.spent),
            },
            { key: "leads", header: "لید", render: (r) => toFaDigits(r.leads) },
            {
              key: "status",
              header: "وضعیت",
              render: (r) => <Badge tone="info">{r.status}</Badge>,
            },
          ]}
        />
      </main>
    </>
  );
}
