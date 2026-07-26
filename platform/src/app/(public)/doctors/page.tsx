import { ButtonLink } from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { toFaDigits } from "@/lib/utils/jalali";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پزشکان",
};

export const dynamic = "force-dynamic";

export default async function DoctorsPublicPage() {
  const doctors = await prisma.doctor.findMany({
    where: { active: true },
    include: { clinic: { include: { branch: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2.5rem))]">
      <div className="pb-6 pt-12">
        <h1 className="mb-2 font-display text-[clamp(1.8rem,3vw,2.4rem)] font-semibold text-olive-800">
          پزشکان
        </h1>
        <p className="text-ink-muted">
          متخصصان طرف‌قرارداد شبکهٔ آرمونیا در شعب مختلف.
        </p>
      </div>

      <div className="grid gap-5 pb-16 md:grid-cols-2">
        {doctors.map((doc) => (
          <article
            key={doc.id}
            className="grid items-center gap-4 border border-stone-100 bg-porcelain p-4 sm:grid-cols-[140px_1fr]"
          >
            <div className="flex aspect-square items-center justify-center rounded-md bg-olive-100 text-2xl font-semibold text-olive-800">
              {doc.name.slice(0, 1)}
            </div>
            <div>
              <h2 className="text-[1.1rem] text-olive-800">{doc.name}</h2>
              <div className="my-1 text-[0.85rem] font-semibold text-champagne-500">
                {doc.specialty}
              </div>
              <p className="text-[0.88rem] text-ink-muted">
                {doc.clinic?.branch?.name ?? ""} · {doc.scheduleNote} ·{" "}
                {toFaDigits(doc.experienceYears)} سال سابقه
              </p>
              <ButtonLink href="/booking" size="sm" className="mt-3">
                رزرو نوبت
              </ButtonLink>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
