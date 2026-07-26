import { ButtonLink } from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { toFaDigits } from "@/lib/utils/jalali";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

const featuredServices = [
  {
    title: "پوست و جوان‌سازی",
    description: "بوتاکس، فیلر، مزوتراپی و مراقبت‌های تخصصی زیر نظر پزشک.",
  },
  {
    title: "لیزر موهای زائد",
    description: "دستگاه‌های به‌روز، پروتکل ایمن، برنامهٔ جلسات شفاف.",
  },
  {
    title: "مشاوره زیبایی",
    description: "ارزیابی اولیه و برنامهٔ درمان متناسب با هدف شما.",
  },
];

export const metadata: Metadata = {
  title: "خانه",
  description: "زیبایی، هماهنگ با استاندارد.",
};

export default async function HomePage() {
  const doctors = await prisma.doctor.findMany({
    where: { active: true },
    take: 3,
    orderBy: { name: "asc" },
  });

  return (
    <>
      <section className="relative grid min-h-[min(92vh,820px)] items-end overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(28_25_22_/_0.72)_0%,rgb(28_25_22_/_0.25)_45%,rgb(47_74_60_/_0.15)_100%),url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"
        />
        <div className="relative z-[1] mx-auto w-[min(1120px,calc(100%-2.5rem))] max-w-xl pb-[clamp(3rem,6vw,4.5rem)] pt-[clamp(4rem,10vw,7rem)] text-porcelain">
          <div className="mb-3 font-display text-[clamp(2.8rem,7vw,4.5rem)] font-bold leading-none tracking-tight">
            <span className="mb-2 block text-[0.35em] font-medium tracking-[0.28em] text-champagne-500">
              ARMONIA
            </span>
            آرمونیا
          </div>
          <h1 className="mb-3 text-[clamp(1.15rem,2.2vw,1.45rem)] font-medium leading-relaxed text-porcelain/95">
            زیبایی، هماهنگ با استاندارد.
          </h1>
          <p className="mb-6 text-base text-porcelain/78">
            شبکهٔ یکپارچهٔ کلینیک‌های زیبایی — از مشاوره تا پیگیری درمان، در یک
            تجربهٔ آرام و شفاف.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/booking" variant="accent">
              رزرو آنلاین
            </ButtonLink>
            <ButtonLink href="/services" variant="outlineLight">
              مشاهدهٔ خدمات
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1120px,calc(100%-2.5rem))]">
          <div className="mb-8 max-w-xl">
            <h2 className="mb-2 font-display text-2xl font-semibold text-olive-800">
              خدمات منتخب
            </h2>
            <p className="text-ink-muted">
              درمان‌های تخصصی پوست، لیزر و زیبایی چهره با استاندارد یکسان در تمام
              شعب.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredServices.map((svc) => (
              <article
                key={svc.title}
                className="border-t-2 border-olive-800 pt-5"
              >
                <h3 className="mb-1.5 text-[1.1rem] text-olive-800">
                  {svc.title}
                </h3>
                <p className="text-[0.95rem] text-ink-muted">{svc.description}</p>
              </article>
            ))}
          </div>
          <p className="mt-6">
            <ButtonLink href="/services" variant="ghost" size="sm">
              همهٔ خدمات
            </ButtonLink>
          </p>
        </div>
      </section>

      <section className="border-y border-stone-100 bg-porcelain py-16">
        <div className="mx-auto w-[min(1120px,calc(100%-2.5rem))]">
          <div className="mb-8 max-w-xl">
            <h2 className="mb-2 font-display text-2xl font-semibold text-olive-800">
              پزشکان شبکه
            </h2>
            <p className="text-ink-muted">
              تیم متخصصان طرف‌قرارداد آرمونیا در شعب منتخب.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {doctors.slice(0, 3).map((doc) => (
              <article
                key={doc.id}
                className="overflow-hidden border border-stone-100 bg-porcelain"
              >
                <div className="flex aspect-[4/5] items-center justify-center bg-olive-100 text-3xl font-semibold text-olive-800">
                  {doc.name.slice(0, 1)}
                </div>
                <div className="px-[1.15rem] pb-[1.35rem] pt-[1.1rem]">
                  <h3 className="text-[1.05rem] text-olive-800">{doc.name}</h3>
                  <div className="my-1 text-[0.85rem] font-semibold text-champagne-500">
                    {doc.specialty}
                  </div>
                  <p className="text-[0.88rem] text-ink-muted">
                    {toFaDigits(doc.experienceYears)} سال تجربه · {doc.scheduleNote}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6">
            <ButtonLink href="/doctors" variant="ghost" size="sm">
              همهٔ پزشکان
            </ButtonLink>
          </p>
        </div>
      </section>

      <section className="bg-olive-800 py-12 text-porcelain">
        <div className="mx-auto flex w-[min(1120px,calc(100%-2.5rem))] flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="mb-1.5 text-2xl font-semibold">
              نوبت خود را همین حالا رزرو کنید
            </h2>
            <p className="max-w-md text-porcelain/75">
              انتخاب شعبه، پزشک و خدمت در چند دقیقه — تأیید پیامکی پس از ثبت.
            </p>
          </div>
          <Link
            href="/booking"
            className="inline-flex rounded-md bg-champagne-500 px-5 py-3 font-semibold text-ink-900 transition hover:bg-champagne-700 hover:text-white"
          >
            شروع رزرو
          </Link>
        </div>
      </section>
    </>
  );
}
