import { prisma } from "@/lib/db";
import { toJalali } from "@/lib/utils/jalali";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "بلاگ" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-[min(800px,calc(100%-2.5rem))] py-12">
      <h1 className="font-display text-3xl font-semibold text-olive-800">بلاگ آرمونیا</h1>
      <div className="mt-8 space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="border-b border-stone-100 pb-6">
            <div className="text-xs text-ink-muted">{toJalali(post.createdAt)}</div>
            <h2 className="mt-1 font-display text-xl font-semibold text-olive-800">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mt-2 text-sm text-ink-700">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
