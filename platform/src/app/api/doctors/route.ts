import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const branchId = new URL(request.url).searchParams.get("branchId");
  const data = await prisma.doctor.findMany({
    where: branchId ? { branchId } : undefined,
    include: { branch: true, clinic: true },
    orderBy: { name: "asc" },
  });
  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      name: string;
      specialty: string;
      branchId: string;
      clinicId?: string;
      experienceYears?: number;
      scheduleNote?: string;
      commissionPct?: number;
      contractNote?: string;
      photoUrl?: string;
    }>(request);

    if (!body.name || !body.specialty || !body.branchId) {
      return fail("نام، تخصص و شعبه الزامی است");
    }

    const doctor = await prisma.doctor.create({
      data: {
        name: body.name,
        specialty: body.specialty,
        branchId: body.branchId,
        clinicId: body.clinicId || null,
        experienceYears: body.experienceYears ?? 1,
        scheduleNote: body.scheduleNote,
        commissionPct: body.commissionPct ?? 30,
        contractNote: body.contractNote,
        photoUrl: body.photoUrl,
      },
    });

    return ok(doctor, undefined, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{
      id: string;
      scheduleNote?: string;
      commissionPct?: number;
      contractNote?: string;
      active?: boolean;
    }>(request);
    if (!body.id) return fail("شناسه لازم است");
    const doctor = await prisma.doctor.update({
      where: { id: body.id },
      data: {
        ...(body.scheduleNote !== undefined ? { scheduleNote: body.scheduleNote } : {}),
        ...(body.commissionPct !== undefined ? { commissionPct: body.commissionPct } : {}),
        ...(body.contractNote !== undefined ? { contractNote: body.contractNote } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
      },
    });
    return ok(doctor);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
