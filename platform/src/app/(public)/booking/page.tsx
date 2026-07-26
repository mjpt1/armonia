"use client";

import { Button } from "@/components/ui/Button";
import { apiFetch, useToast } from "@/lib/client-api";
import { useEffect, useState } from "react";

const slots = ["09:00", "10:30", "12:00", "14:00", "16:30", "18:00", "19:30", "20:30"];

interface Branch {
  id: string;
  name: string;
}
interface Service {
  id: string;
  name: string;
}
interface Doctor {
  id: string;
  name: string;
}

export default function BookingPage() {
  const { show, node } = useToast();
  const [slot, setSlot] = useState("10:30");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    void (async () => {
      const [b, s, d] = await Promise.all([
        apiFetch<Branch[]>("/api/branches"),
        apiFetch<Service[]>("/api/services"),
        apiFetch<Doctor[]>("/api/doctors"),
      ]);
      if (b.data) setBranches(b.data);
      if (s.data) setServices(s.data);
      if (d.data) setDoctors(d.data);
    })();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const mobile = String(fd.get("mobile") || "");
    const branchId = String(fd.get("branch") || "") || undefined;
    const serviceId = String(fd.get("service") || "");
    const doctorId = String(fd.get("doctor") || "") || undefined;
    const note = String(fd.get("note") || "");
    const serviceName = services.find((s) => s.id === serviceId)?.name || serviceId;

    const day = new Date();
    day.setDate(day.getDate() + 1);
    const [hh, mm] = slot.split(":");
    day.setHours(Number(hh), Number(mm), 0, 0);

    const res = await apiFetch("/api/appointments", {
      method: "POST",
      body: JSON.stringify({
        patientName: name,
        mobile,
        branchId,
        doctorId,
        service: serviceName,
        notes: note,
        startsAt: day.toISOString(),
        kind: "consult",
      }),
    });

    // Also create CRM lead for funnel tracking
    await apiFetch("/api/leads", {
      method: "POST",
      body: JSON.stringify({
        name,
        mobile,
        service: serviceName,
        source: "رزرو آنلاین",
        status: "lead",
        branchId,
        notes: note,
      }),
    });

    setBusy(false);
    if (res.error) {
      show(res.error, "err");
      return;
    }
    setSubmitted(true);
    show("نوبت ثبت شد");
  }

  return (
    <main className="mx-auto w-[min(640px,calc(100%-2.5rem))] pb-16 pt-12">
      {node}
      <h1 className="mb-2 font-display text-[clamp(1.8rem,3vw,2.2rem)] font-semibold text-olive-800">
        رزرو آنلاین
      </h1>
      <p className="mb-8 text-ink-muted">
        شعبه، خدمت و زمان را انتخاب کنید. درخواست در سیستم نوبت و CRM ذخیره می‌شود.
      </p>

      {submitted ? (
        <div className="rounded-md border border-olive-100 bg-olive-50 p-6 text-olive-800">
          <h2 className="mb-2 font-semibold">درخواست ثبت شد</h2>
          <p className="text-sm text-ink-muted">
            نوبت و لید در پایگاه داده ذخیره شد. پذیرش شعبه پیگیری می‌کند.
          </p>
          <Button className="mt-4" onClick={() => setSubmitted(false)}>
            ثبت درخواست دیگر
          </Button>
        </div>
      ) : (
        <form className="grid gap-[1.1rem] border border-stone-100 bg-porcelain p-7" onSubmit={(e) => void onSubmit(e)}>
          <label className="grid gap-1.5 text-[0.9rem] font-semibold text-ink-700">
            نام و نام خانوادگی
            <input name="name" required className="rounded-md border border-stone-300 bg-ivory px-3.5 py-2.5 font-normal" />
          </label>
          <label className="grid gap-1.5 text-[0.9rem] font-semibold text-ink-700">
            موبایل
            <input name="mobile" type="tel" dir="ltr" required className="rounded-md border border-stone-300 bg-ivory px-3.5 py-2.5 font-normal" />
          </label>
          <label className="grid gap-1.5 text-[0.9rem] font-semibold text-ink-700">
            شعبه
            <select name="branch" required defaultValue="" className="rounded-md border border-stone-300 bg-ivory px-3.5 py-2.5 font-normal">
              <option value="" disabled>
                انتخاب کنید
              </option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-[0.9rem] font-semibold text-ink-700">
            خدمت
            <select name="service" required defaultValue="" className="rounded-md border border-stone-300 bg-ivory px-3.5 py-2.5 font-normal">
              <option value="" disabled>
                انتخاب کنید
              </option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-[0.9rem] font-semibold text-ink-700">
            پزشک (اختیاری)
            <select name="doctor" defaultValue="" className="rounded-md border border-stone-300 bg-ivory px-3.5 py-2.5 font-normal">
              <option value="">اولین زمان آزاد</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="mb-2 text-[0.9rem] font-semibold text-ink-700">زمان پیشنهادی (فردا)</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={slot === s}
                  onClick={() => setSlot(s)}
                  className={
                    slot === s
                      ? "rounded-md border border-olive-800 bg-olive-800 py-2 text-center text-[0.85rem] text-porcelain"
                      : "rounded-md border border-stone-300 bg-ivory py-2 text-center text-[0.85rem]"
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="grid gap-1.5 text-[0.9rem] font-semibold text-ink-700">
            توضیح (اختیاری)
            <textarea name="note" rows={3} className="rounded-md border border-stone-300 bg-ivory px-3.5 py-2.5 font-normal" />
          </label>
          <Button type="submit" disabled={busy}>
            {busy ? "در حال ثبت…" : "ثبت درخواست نوبت"}
          </Button>
        </form>
      )}
    </main>
  );
}
