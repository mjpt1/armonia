import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "سوالات متداول" };
export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const items = await prisma.faqItem.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <main className="mx-auto w-[min(800px,calc(100%-2.5rem))] py-12">
      <h1 className="font-display text-3xl font-semibold text-olive-800">سوالات متداول</h1>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <details
            key={item.id}
            className="rounded-md border border-stone-100 bg-porcelain px-4 py-3"
          >
            <summary className="cursor-pointer font-semibold text-olive-800">
              {item.question}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
