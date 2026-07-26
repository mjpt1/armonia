import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET() {
  const data = await prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "asc" },
  });
  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      name: string;
      mobile: string;
      service?: string;
      notes?: string;
      preferredAt?: string;
    }>(request);
    if (!body.name || !body.mobile) return fail("نام و موبایل الزامی است");
    return ok(
      await prisma.waitlistEntry.create({
        data: {
          name: body.name,
          mobile: body.mobile,
          service: body.service,
          notes: body.notes,
          preferredAt: body.preferredAt ? new Date(body.preferredAt) : null,
        },
      }),
      undefined,
      201,
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{ id: string; status?: string }>(request);
    if (!body.id) return fail("شناسه لازم است");
    return ok(
      await prisma.waitlistEntry.update({
        where: { id: body.id },
        data: { status: body.status || "contacted" },
      }),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
