import { ok } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const type = new URL(request.url).searchParams.get("type") || "blog";
  if (type === "portfolio") {
    return ok(
      await prisma.portfolioItem.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      }),
    );
  }
  if (type === "faq") {
    return ok(
      await prisma.faqItem.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
    );
  }
  return ok(
    await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
  );
}
