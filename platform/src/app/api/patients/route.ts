import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const branchId = searchParams.get("branchId");
  const q = searchParams.get("q");

  if (id) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        documents: { orderBy: { createdAt: "desc" } },
        treatments: { orderBy: { createdAt: "desc" } },
        prescriptions: { include: { doctor: true }, orderBy: { createdAt: "desc" } },
        appointments: { orderBy: { startsAt: "desc" }, take: 10 },
      },
    });
    if (!patient) return fail("بیمار یافت نشد", 404);
    return ok(patient);
  }

  const data = await prisma.patient.findMany({
    where: {
      ...(branchId ? { branchId } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { mobile: { contains: q } },
              { fileCode: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      name: string;
      mobile: string;
      nationalId?: string;
      birthJalali?: string;
      branchId?: string;
      fileCode?: string;
    }>(request);

    if (!body.name || !body.mobile) return fail("نام و موبایل الزامی است");

    const count = await prisma.patient.count();
    const fileCode = body.fileCode || `P-${1000 + count + 1}`;

    const patient = await prisma.patient.create({
      data: {
        name: body.name,
        mobile: body.mobile,
        nationalId: body.nationalId,
        birthJalali: body.birthJalali,
        branchId: body.branchId || null,
        fileCode,
      },
    });

    return ok(patient, undefined, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{
      id: string;
      name?: string;
      mobile?: string;
      nationalId?: string;
      birthJalali?: string;
      addDocument?: { title: string; kind?: string; meta?: string; url?: string };
      addTreatment?: { title: string; notes?: string; dateJalali?: string };
      addPrescription?: { content: string; doctorId?: string };
    }>(request);

    if (!body.id) return fail("شناسه لازم است");

    if (body.addDocument) {
      const doc = await prisma.patientDocument.create({
        data: {
          patientId: body.id,
          title: body.addDocument.title,
          kind: body.addDocument.kind || "file",
          meta: body.addDocument.meta,
          url: body.addDocument.url,
        },
      });
      return ok(doc, undefined, 201);
    }

    if (body.addTreatment) {
      const t = await prisma.treatmentHistory.create({
        data: {
          patientId: body.id,
          title: body.addTreatment.title,
          notes: body.addTreatment.notes,
          dateJalali: body.addTreatment.dateJalali,
        },
      });
      return ok(t, undefined, 201);
    }

    if (body.addPrescription) {
      const p = await prisma.prescription.create({
        data: {
          patientId: body.id,
          content: body.addPrescription.content,
          doctorId: body.addPrescription.doctorId || null,
        },
      });
      return ok(p, undefined, 201);
    }

    const patient = await prisma.patient.update({
      where: { id: body.id },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.mobile ? { mobile: body.mobile } : {}),
        ...(body.nationalId !== undefined ? { nationalId: body.nationalId } : {}),
        ...(body.birthJalali !== undefined ? { birthJalali: body.birthJalali } : {}),
      },
    });

    return ok(patient);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
