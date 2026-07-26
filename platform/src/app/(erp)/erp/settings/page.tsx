"use client";

import { CrudModule } from "@/components/erp/CrudModule";
import { ErpHeader } from "@/components/erp/ErpHeader";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { formatMoneyFa, todayJalali, toFaDigits } from "@/lib/utils/jalali";
import { useEffect, useState } from "react";

type Service = {
  id: string;
  name: string;
  category: string;
  priceFrom: number;
  description: string;
  active: boolean;
};

export default function SettingsPage() {
  const [tariffs, setTariffs] = useState<
    { id: string; name: string; amount: number; service?: { name: string } | null }[]
  >([]);
  const [langs, setLangs] = useState<{ id: string; code: string; nameFa: string; rtl: boolean }[]>(
    [],
  );
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [overview, setOverview] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    void (async () => {
      const [t, l, b, o] = await Promise.all([
        fetch("/api/settings?tab=tariffs").then((r) => r.json()),
        fetch("/api/settings?tab=languages").then((r) => r.json()),
        fetch("/api/settings?tab=brands").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
      ]);
      setTariffs(t.data ?? []);
      setLangs(l.data ?? []);
      setBrands(b.data ?? []);
      setOverview(o.data ?? null);
    })();
  }, []);

  return (
    <>
      <ErpHeader
        title="تنظیمات"
        meta={<>خدمات، تعرفه، برند، جغرافیا، زبان · {todayJalali()}</>}
      />
      <main className="page-enter space-y-8 px-5 pb-12 pt-8 sm:px-10">
        {overview && (
          <div className="grid gap-3 sm:grid-cols-5">
            {Object.entries(overview).map(([k, v]) => (
              <div key={k} className="rounded-md border border-stone-100 bg-ivory px-3 py-3 text-center">
                <div className="text-xs text-ink-muted">{k}</div>
                <div className="font-display text-xl font-semibold text-olive-800">
                  {toFaDigits(v)}
                </div>
              </div>
            ))}
          </div>
        )}

        <CrudModule<Service>
          module="settings"
          title="خدمات"
          endpoint="/api/settings"
          query="?tab=services"
          emptyForm={{ name: "", category: "", priceFrom: "0", description: "", tab: "services" }}
          transformBody={(form) => ({
            tab: "services",
            name: form.name,
            category: form.category,
            description: form.description || form.name,
            priceFrom: Number(form.priceFrom || 0),
          })}
          fields={[
            { name: "name", label: "نام خدمت", required: true },
            { name: "category", label: "دسته", required: true },
            { name: "priceFrom", label: "قیمت از", type: "number" },
            { name: "description", label: "توضیح", type: "textarea" },
          ]}
          columns={[
            { key: "name", header: "نام", render: (r) => r.name },
            { key: "cat", header: "دسته", render: (r) => r.category },
            { key: "price", header: "از", render: (r) => formatMoneyFa(r.priceFrom) },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel labelledBy="tariff">
            <PanelHead titleId="tariff" title="تعرفه‌ها" />
            <ul className="space-y-2 text-sm">
              {tariffs.map((t) => (
                <li key={t.id} className="flex justify-between border-b border-stone-100 py-2">
                  <span>
                    {t.name} · {t.service?.name}
                  </span>
                  <span>{formatMoneyFa(t.amount)}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel labelledBy="meta">
            <PanelHead titleId="meta" title="برند · زبان" />
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs font-semibold text-ink-muted">برندها</div>
                {brands.map((b) => (
                  <div key={b.id}>{b.name}</div>
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold text-ink-muted">زبان‌ها</div>
                {langs.map((l) => (
                  <div key={l.id}>
                    {l.nameFa} ({l.code}) · {l.rtl ? "RTL" : "LTR"}
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>
      </main>
    </>
  );
}
