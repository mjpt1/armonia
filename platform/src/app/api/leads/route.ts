import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const branchId = searchParams.get("branchId");
  const q = searchParams.get("q");

  const data = await prisma.lead.findMany({
    where: {
      ...(status && status !== "all" ? { status } : {}),
      ...(branchId ? { branchId } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { mobile: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  const counts = await prisma.lead.groupBy({
    by: ["status"],
    _count: true,
  });

  return ok(data, {
    total: data.length,
    funnel: Object.fromEntries(counts.map((c) => [c.status, c._count])),
  });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      name: string;
      mobile: string;
      service?: string;
      source?: string;
      advisor?: string;
      status?: string;
      notes?: string;
      branchId?: string;
    }>(request);

    if (!body.name || !body.mobile) {
      return fail("نام و موبایل الزامی است");
    }

    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        mobile: body.mobile,
        service: body.service,
        source: body.source || "دستی",
        advisor: body.advisor,
        status: body.status || "lead",
        notes: body.notes,
        branchId: body.branchId || null,
      },
    });

    return ok(lead, undefined, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{
      id: string;
      status?: string;
      advisor?: string;
      notes?: string;
      service?: string;
    }>(request);

    if (!body.id) return fail("شناسه لازم است");

    const lead = await prisma.lead.update({
      where: { id: body.id },
      data: {
        ...(body.status ? { status: body.status, lastContact: new Date() } : {}),
        ...(body.advisor !== undefined ? { advisor: body.advisor } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        ...(body.service !== undefined ? { service: body.service } : {}),
      },
    });

    return ok(lead);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return fail("شناسه لازم است");
  await prisma.lead.delete({ where: { id } });
  return ok({ deleted: id });
}
