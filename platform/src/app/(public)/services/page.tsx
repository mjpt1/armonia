import { ButtonLink } from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { formatMoneyFa } from "@/lib/utils/jalali";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "خدمات",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2.5rem))] pb-16 pt-12">
      <h1 className="mb-2 font-display text-[clamp(1.8rem,3vw,2.4rem)] font-semibold text-olive-800">
        خدمات
      </h1>
      <p className="max-w-xl text-ink-muted">
        تعرفه‌ها نمونه هستند؛ قیمت نهایی پس از مشاوره اعلام می‌شود.
      </p>

      <div className="mt-8 border-t border-stone-100">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="grid items-center gap-2 border-b border-stone-100 py-6 md:grid-cols-[1.2fr_2fr_auto] md:gap-6"
          >
            <h2 className="text-[1.15rem] text-olive-800">{svc.name}</h2>
            <p className="text-[0.95rem] text-ink-muted">{svc.description}</p>
            <span className="whitespace-nowrap font-bold text-champagne-500">
              از {formatMoneyFa(svc.priceFrom)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-8">
        <ButtonLink href="/booking">رزرو نوبت برای این خدمات</ButtonLink>
      </p>
    </main>
  );
}
