import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "نمونه‌کارها" };
export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2.5rem))] py-12">
      <h1 className="font-display text-3xl font-semibold text-olive-800">نمونه‌کارها</h1>
      <p className="mt-2 text-ink-muted">نتایج واقعی درمان در شبکهٔ آرمونیا</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-md border border-stone-100 bg-porcelain"
          >
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-olive-50 to-champagne-100 text-sm text-ink-muted">
              {item.imageUrl ?? "تصویر نمونه"}
            </div>
            <div className="p-4">
              <div className="text-xs font-semibold text-champagne-700">{item.category}</div>
              <h2 className="mt-1 font-display text-lg font-semibold text-olive-800">
                {item.title}
              </h2>
              <p className="mt-1 text-sm text-ink-muted">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
