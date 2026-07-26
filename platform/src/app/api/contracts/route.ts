import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET() {
  const data = await prisma.contract.findMany({
    include: { branch: true, patient: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      title: string;
      partyType: string;
      partyName: string;
      content?: string;
      branchId?: string;
      patientId?: string;
    }>(request);
    if (!body.title || !body.partyType || !body.partyName) {
      return fail("عنوان، نوع طرف و نام الزامی است");
    }
    const contract = await prisma.contract.create({
      data: {
        title: body.title,
        partyType: body.partyType,
        partyName: body.partyName,
        content: body.content,
        branchId: body.branchId || null,
        patientId: body.patientId || null,
        status: "draft",
      },
    });
    return ok(contract, undefined, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{ id: string; status?: string; sign?: boolean }>(request);
    if (!body.id) return fail("شناسه لازم است");
    const contract = await prisma.contract.update({
      where: { id: body.id },
      data: {
        ...(body.sign
          ? { status: "signed", signedAt: new Date() }
          : body.status
            ? { status: body.status }
            : {}),
      },
    });
    return ok(contract);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
