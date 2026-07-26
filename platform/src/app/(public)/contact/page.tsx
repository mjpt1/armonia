"use client";

import { Button } from "@/components/ui/Button";
import { apiFetch, useToast } from "@/lib/client-api";
import { useState } from "react";

export default function ContactPage() {
  const { show, node } = useToast();
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await apiFetch("/api/tickets", {
      method: "POST",
      body: JSON.stringify({
        subject: String(fd.get("subject") || "تماس وب‌سایت"),
        body: String(fd.get("message") || ""),
        requester: `${fd.get("name")} / ${fd.get("mobile")}`,
        priority: "normal",
      }),
    });
    if (res.error) show(res.error, "err");
    else {
      setDone(true);
      show("پیام ثبت شد");
    }
  }

  return (
    <main className="mx-auto w-[min(720px,calc(100%-2.5rem))] pb-16 pt-12">
      {node}
      <h1 className="mb-2 font-display text-3xl font-semibold text-olive-800">تماس با ما</h1>
      <p className="mb-8 text-ink-muted">تهران · شعب ونک و سعادت‌آباد · پشتیبانی: ۰۲۱-۹۱۰۰۰۰۰۰</p>
      {done ? (
        <div className="rounded-md bg-olive-50 p-6">پیام شما به‌عنوان تیکت پشتیبانی ثبت شد.</div>
      ) : (
        <form className="grid gap-3 border border-stone-100 bg-porcelain p-7" onSubmit={(e) => void onSubmit(e)}>
          <input name="name" required placeholder="نام" className="rounded-md border border-stone-300 px-3 py-2.5" />
          <input name="mobile" required dir="ltr" placeholder="موبایل" className="rounded-md border border-stone-300 px-3 py-2.5" />
          <input name="subject" required placeholder="موضوع" className="rounded-md border border-stone-300 px-3 py-2.5" />
          <textarea name="message" required rows={5} placeholder="پیام" className="rounded-md border border-stone-300 px-3 py-2.5" />
          <Button type="submit">ارسال پیام</Button>
        </form>
      )}
    </main>
  );
}
