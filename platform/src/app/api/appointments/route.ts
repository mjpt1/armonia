import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const branchId = searchParams.get("branchId");

  const data = await prisma.appointment.findMany({
    where: {
      ...(status && status !== "all" ? { status } : {}),
      ...(branchId ? { branchId } : {}),
    },
    include: { doctor: true, patient: true, clinic: true },
    orderBy: { startsAt: "asc" },
  });

  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      startsAt: string;
      service?: string;
      notes?: string;
      kind?: string;
      branchId?: string;
      clinicId?: string;
      doctorId?: string;
      patientId?: string;
      patientName?: string;
      mobile?: string;
      status?: string;
    }>(request);

    if (!body.startsAt) return fail("زمان نوبت الزامی است");

    const appt = await prisma.appointment.create({
      data: {
        startsAt: new Date(body.startsAt),
        service: body.service,
        notes: body.notes,
        kind: body.kind || "default",
        status: body.status || "booked",
        branchId: body.branchId || null,
        clinicId: body.clinicId || null,
        doctorId: body.doctorId || null,
        patientId: body.patientId || null,
        patientName: body.patientName,
        mobile: body.mobile,
      },
      include: { doctor: true },
    });

    return ok(appt, undefined, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{ id: string; status?: string; notes?: string }>(request);
    if (!body.id) return fail("شناسه لازم است");

    const appt = await prisma.appointment.update({
      where: { id: body.id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
      },
    });

    return ok(appt);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return fail("شناسه لازم است");
  await prisma.appointment.delete({ where: { id } });
  return ok({ deleted: id });
}
