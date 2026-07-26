import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const tab = new URL(request.url).searchParams.get("tab") || "payments";
  if (tab === "installments") {
    return ok(await prisma.installment.findMany({ orderBy: { createdAt: "desc" } }));
  }
  if (tab === "commissions") {
    return ok(await prisma.commission.findMany({ orderBy: { createdAt: "desc" } }));
  }
  if (tab === "settlements") {
    return ok(await prisma.settlement.findMany({ orderBy: { createdAt: "desc" } }));
  }
  const data = await prisma.payment.findMany({
    include: { patient: true, branch: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      tab?: string;
      kind?: string;
      amount?: number;
      method?: string;
      note?: string;
      branchId?: string;
      patientId?: string;
      title?: string;
      totalAmount?: number;
      patientName?: string;
      doctorName?: string;
      percent?: number;
      period?: string;
      party?: string;
    }>(request);

    if (body.tab === "installments") {
      if (!body.title || !body.totalAmount) return fail("عنوان و مبلغ الزامی است");
      return ok(
        await prisma.installment.create({
          data: {
            title: body.title,
            totalAmount: Number(body.totalAmount),
            patientName: body.patientName,
          },
        }),
        undefined,
        201,
      );
    }

    if (body.tab === "commissions") {
      if (!body.doctorName || body.amount == null) return fail("پزشک و مبلغ الزامی است");
      return ok(
        await prisma.commission.create({
          data: {
            doctorName: body.doctorName,
            amount: Number(body.amount),
            percent: Number(body.percent) || 0,
            period: body.period || "جاری",
          },
        }),
        undefined,
        201,
      );
    }

    if (body.tab === "settlements") {
      if (!body.party || body.amount == null || !body.kind) {
        return fail("طرف، نوع و مبلغ الزامی است");
      }
      return ok(
        await prisma.settlement.create({
          data: {
            party: body.party,
            kind: body.kind,
            amount: Number(body.amount),
            period: body.period,
          },
        }),
        undefined,
        201,
      );
    }

    if (!body.kind || body.amount == null) return fail("نوع و مبلغ الزامی است");
    return ok(
      await prisma.payment.create({
        data: {
          kind: body.kind,
          amount: Number(body.amount),
          method: body.method,
          note: body.note,
          status: "paid",
          branchId: body.branchId || null,
          patientId: body.patientId || null,
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
    const body = await readJson<{
      id: string;
      tab?: string;
      status?: string;
      paidAmount?: number;
    }>(request);
    if (!body.id) return fail("شناسه لازم است");

    if (body.tab === "installments") {
      return ok(
        await prisma.installment.update({
          where: { id: body.id },
          data: {
            ...(body.status ? { status: body.status } : {}),
            ...(body.paidAmount !== undefined ? { paidAmount: body.paidAmount } : {}),
          },
        }),
      );
    }
    if (body.tab === "commissions") {
      return ok(
        await prisma.commission.update({
          where: { id: body.id },
          data: { ...(body.status ? { status: body.status } : {}) },
        }),
      );
    }
    if (body.tab === "settlements") {
      return ok(
        await prisma.settlement.update({
          where: { id: body.id },
          data: { ...(body.status ? { status: body.status } : {}) },
        }),
      );
    }
    return ok(
      await prisma.payment.update({
        where: { id: body.id },
        data: { ...(body.status ? { status: body.status } : {}) },
      }),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
