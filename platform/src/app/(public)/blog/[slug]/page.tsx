import { prisma } from "@/lib/db";
import { toJalali } from "@/lib/utils/jalali";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  return { title: post?.title ?? "بلاگ" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) notFound();

  return (
    <main className="mx-auto w-[min(720px,calc(100%-2.5rem))] py-12">
      <div className="text-xs text-ink-muted">{toJalali(post.createdAt)}</div>
      <h1 className="mt-2 font-display text-3xl font-semibold text-olive-800">{post.title}</h1>
      <p className="mt-6 leading-relaxed text-ink-700">{post.body}</p>
    </main>
  );
}
