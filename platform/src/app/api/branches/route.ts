import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET() {
  const data = await prisma.branch.findMany({
    include: {
      clinics: true,
      _count: { select: { users: true, doctors: true, patients: true } },
    },
    orderBy: { name: "asc" },
  });
  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      code: string;
      name: string;
      city: string;
      address: string;
      managerName?: string;
      provinceId?: string;
    }>(request);

    if (!body.code || !body.name || !body.city || !body.address) {
      return fail("کد، نام، شهر و آدرس الزامی است");
    }

    const branch = await prisma.branch.create({
      data: {
        code: body.code,
        name: body.name,
        city: body.city,
        address: body.address,
        managerName: body.managerName,
        provinceId: body.provinceId || null,
      },
    });

    return ok(branch, undefined, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{
      id: string;
      name?: string;
      address?: string;
      managerName?: string;
      active?: boolean;
    }>(request);
    if (!body.id) return fail("شناسه لازم است");

    const branch = await prisma.branch.update({
      where: { id: body.id },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.address ? { address: body.address } : {}),
        ...(body.managerName !== undefined ? { managerName: body.managerName } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
      },
    });
    return ok(branch);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return fail("شناسه لازم است");
  await prisma.branch.delete({ where: { id } });
  return ok({ deleted: id });
}
