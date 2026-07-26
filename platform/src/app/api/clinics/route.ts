import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const branchId = new URL(request.url).searchParams.get("branchId");
  const data = await prisma.clinic.findMany({
    where: branchId ? { branchId } : undefined,
    include: {
      branch: true,
      doctors: true,
      services: { include: { service: true } },
      _count: { select: { appointments: true } },
    },
    orderBy: { name: "asc" },
  });
  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      name: string;
      type: string;
      capacity?: number;
      branchId: string;
      serviceIds?: string[];
    }>(request);

    if (!body.name || !body.type || !body.branchId) {
      return fail("نام، نوع و شعبه الزامی است");
    }

    const clinic = await prisma.clinic.create({
      data: {
        name: body.name,
        type: body.type,
        capacity: body.capacity ?? 10,
        branchId: body.branchId,
        services: body.serviceIds?.length
          ? {
              create: body.serviceIds.map((serviceId) => ({ serviceId })),
            }
          : undefined,
      },
      include: { services: { include: { service: true } } },
    });

    return ok(clinic, undefined, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{
      id: string;
      name?: string;
      capacity?: number;
      active?: boolean;
    }>(request);
    if (!body.id) return fail("شناسه لازم است");
    const clinic = await prisma.clinic.update({
      where: { id: body.id },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.capacity !== undefined ? { capacity: body.capacity } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
      },
    });
    return ok(clinic);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return fail("شناسه لازم است");
  await prisma.clinic.delete({ where: { id } });
  return ok({ deleted: id });
}
