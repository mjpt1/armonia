"use client";

import { Button } from "@/components/ui/Button";
import { apiFetch, useToast } from "@/lib/client-api";
import { useState } from "react";

export default function ConsultationPage() {
  const { show, node } = useToast();
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await apiFetch("/api/leads", {
      method: "POST",
      body: JSON.stringify({
        name: String(fd.get("name") || ""),
        mobile: String(fd.get("mobile") || ""),
        service: String(fd.get("interest") || "مشاوره"),
        source: "فرم مشاوره",
        status: "lead",
        notes: String(fd.get("message") || ""),
      }),
    });
    setBusy(false);
    if (res.error) {
      show(res.error, "err");
      return;
    }
    setDone(true);
    show("درخواست مشاوره ثبت شد");
  }

  return (
    <main className="mx-auto w-[min(640px,calc(100%-2.5rem))] pb-16 pt-12">
      {node}
      <h1 className="mb-2 font-display text-[clamp(1.8rem,3vw,2.2rem)] font-semibold text-olive-800">
        درخواست مشاوره رایگان
      </h1>
      <p className="mb-8 text-ink-muted">مشاوران فروش ظرف یک روز کاری تماس می‌گیرند.</p>
      {done ? (
        <div className="rounded-md border border-olive-100 bg-olive-50 p-6">درخواست شما به‌عنوان لید در CRM ثبت شد.</div>
      ) : (
        <form className="grid gap-4 border border-stone-100 bg-porcelain p-7" onSubmit={(e) => void onSubmit(e)}>
          <input name="name" required placeholder="نام" className="rounded-md border border-stone-300 px-3.5 py-2.5" />
          <input name="mobile" required dir="ltr" placeholder="موبایل" className="rounded-md border border-stone-300 px-3.5 py-2.5" />
          <input name="interest" placeholder="خدمت مورد علاقه" className="rounded-md border border-stone-300 px-3.5 py-2.5" />
          <textarea name="message" rows={4} placeholder="توضیح کوتاه" className="rounded-md border border-stone-300 px-3.5 py-2.5" />
          <Button type="submit" disabled={busy}>
            ارسال
          </Button>
        </form>
      )}
    </main>
  );
}
