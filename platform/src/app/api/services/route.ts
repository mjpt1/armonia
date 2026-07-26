import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET() {
  const data = await prisma.service.findMany({ orderBy: { name: "asc" } });
  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      name: string;
      description: string;
      category: string;
      priceFrom: number;
    }>(request);
    if (!body.name || !body.description || !body.category) {
      return fail("نام، توضیح و دسته الزامی است");
    }
    const service = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        priceFrom: Number(body.priceFrom) || 0,
      },
    });
    return ok(service, undefined, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
