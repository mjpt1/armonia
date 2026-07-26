import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { formatMoneyFa, toFaDigits, toJalali, toJalaliDateTime } from "@/lib/utils/jalali";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "پنل بیمار" };
export const dynamic = "force-dynamic";

export default async function PatientPortalPage() {
  const patient = await prisma.patient.findFirst({
    where: { fileCode: "P-1405-001" },
    include: {
      appointments: {
        include: { doctor: true, branch: true },
        orderBy: { startsAt: "desc" },
        take: 10,
      },
      documents: true,
      prescriptions: true,
      contracts: true,
      treatments: true,
    },
  });

  const installments = await prisma.installment.findMany({
    where: patient ? { patientName: patient.name } : undefined,
    orderBy: { createdAt: "desc" },
  });

  if (!patient) {
    return (
      <main className="mx-auto w-[min(640px,calc(100%-2.5rem))] py-16 text-center">
        <p>هنوز پرونده‌ای در دیتابیس نیست. ابتدا seed را اجرا کنید.</p>
        <Link href="/booking" className="mt-4 inline-block text-olive-800 underline">
          رزرو نوبت
        </Link>
      </main>
    );
  }

  const nextAppt = patient.appointments.find((a) =>
    ["booked", "confirmed"].includes(a.status),
  );
  const openPlans = installments.filter((p) => p.status === "open");

  return (
    <main className="mx-auto grid w-[min(1120px,calc(100%-2.5rem))] gap-6 py-8 pb-16 md:grid-cols-[220px_1fr]">
      <aside className="border border-stone-100 bg-porcelain p-5">
        <h1 className="mb-1 text-[1.1rem] text-olive-800">{patient.name}</h1>
        <div className="mb-5 text-[0.8rem] text-ink-muted">کد پرونده: {patient.fileCode}</div>
        <nav className="grid gap-1 text-[0.9rem]">
          {["خلاصه", "نوبت‌ها", "مدارک", "نسخه‌ها", "اقساط", "قراردادها"].map((item, i) => (
            <span
              key={item}
              className={
                i === 0
                  ? "rounded-md bg-olive-100 px-2.5 py-2 font-medium text-olive-800"
                  : "rounded-md px-2.5 py-2 font-medium text-ink-700"
              }
            >
              {item}
            </span>
          ))}
        </nav>
      </aside>

      <section className="border border-stone-100 bg-porcelain p-6">
        <h2 className="mb-4 text-[1.2rem] text-olive-800">خلاصه پرونده</h2>
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="border border-stone-100 bg-ivory p-4">
            <span className="block text-xs text-ink-muted">نوبت بعدی</span>
            <strong className="text-[1.1rem] text-olive-800">
              {nextAppt ? toJalaliDateTime(nextAppt.startsAt) : "—"}
            </strong>
          </div>
          <div className="border border-stone-100 bg-ivory p-4">
            <span className="block text-xs text-ink-muted">پزشک</span>
            <strong className="text-[1.1rem] text-olive-800">
              {nextAppt?.doctor?.name ?? "—"}
            </strong>
          </div>
          <div className="border border-stone-100 bg-ivory p-4">
            <span className="block text-xs text-ink-muted">اقساط باز</span>
            <strong className="text-[1.1rem] text-olive-800">
              {toFaDigits(openPlans.length)} طرح
            </strong>
          </div>
        </div>

        <h3 className="mb-2 font-semibold text-olive-800">نوبت‌ها</h3>
        <table className="mb-6 w-full border-collapse text-[0.9rem]">
          <thead>
            <tr>
              {["تاریخ", "خدمت", "شعبه", "وضعیت"].map((h) => (
                <th
                  key={h}
                  className="border-b border-stone-100 px-2 py-3 text-start text-xs text-ink-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patient.appointments.map((row) => (
              <tr key={row.id}>
                <td className="border-b border-stone-100 px-2 py-3">
                  {toJalaliDateTime(row.startsAt)}
                </td>
                <td className="border-b border-stone-100 px-2 py-3">{row.service ?? "—"}</td>
                <td className="border-b border-stone-100 px-2 py-3">
                  {row.branch?.name ?? "—"}
                </td>
                <td className="border-b border-stone-100 px-2 py-3">
                  <Badge>{row.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold text-olive-800">مدارک</h3>
            <ul className="space-y-1 text-sm">
              {patient.documents.map((d) => (
                <li key={d.id}>· {d.title}</li>
              ))}
            </ul>
            <h3 className="mb-2 mt-4 font-semibold text-olive-800">نسخه‌ها</h3>
            <ul className="space-y-1 text-sm">
              {patient.prescriptions.map((p) => (
                <li key={p.id}>
                  · {toJalali(p.createdAt)} — {p.content}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-olive-800">اقساط</h3>
            {installments.map((plan) => (
              <div key={plan.id} className="mb-3 text-sm">
                <div className="font-medium">
                  {plan.title} · {formatMoneyFa(plan.paidAmount)} /{" "}
                  {formatMoneyFa(plan.totalAmount)}
                </div>
              </div>
            ))}
            <h3 className="mb-2 mt-4 font-semibold text-olive-800">قراردادها</h3>
            <ul className="space-y-1 text-sm">
              {patient.contracts.map((c) => (
                <li key={c.id}>
                  · {c.title} —{" "}
                  <Badge tone={c.status === "signed" ? "success" : "info"}>{c.status}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
