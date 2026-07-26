import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const tab = new URL(request.url).searchParams.get("tab") || "staff";
  if (tab === "attendance") {
    return ok(
      await prisma.attendance.findMany({
        include: { staff: true },
        orderBy: { date: "desc" },
        take: 50,
      }),
    );
  }
  if (tab === "leaves") {
    return ok(
      await prisma.leaveRequest.findMany({
        include: { staff: true },
        orderBy: { fromDate: "desc" },
      }),
    );
  }
  if (tab === "payroll") {
    return ok(
      await prisma.payroll.findMany({
        include: { staff: true },
        orderBy: { period: "desc" },
      }),
    );
  }
  return ok(
    await prisma.staff.findMany({
      include: { branch: true },
      orderBy: { name: "asc" },
    }),
  );
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      tab?: string;
      name?: string;
      roleTitle?: string;
      mobile?: string;
      branchId?: string;
      staffId?: string;
      status?: string;
      reason?: string;
      fromDate?: string;
      toDate?: string;
      period?: string;
      amount?: number;
    }>(request);

    if (body.tab === "attendance") {
      if (!body.staffId) return fail("پرسنل الزامی است");
      return ok(
        await prisma.attendance.create({
          data: {
            staffId: body.staffId,
            date: new Date(),
            status: body.status || "present",
          },
        }),
        undefined,
        201,
      );
    }

    if (body.tab === "leaves") {
      if (!body.staffId || !body.fromDate || !body.toDate) {
        return fail("پرسنل و بازه تاریخ الزامی است");
      }
      return ok(
        await prisma.leaveRequest.create({
          data: {
            staffId: body.staffId,
            fromDate: new Date(body.fromDate),
            toDate: new Date(body.toDate),
            reason: body.reason,
          },
        }),
        undefined,
        201,
      );
    }

    if (body.tab === "payroll") {
      if (!body.staffId || !body.period || body.amount == null) {
        return fail("پرسنل، دوره و مبلغ الزامی است");
      }
      return ok(
        await prisma.payroll.create({
          data: {
            staffId: body.staffId,
            period: body.period,
            amount: Number(body.amount),
          },
        }),
        undefined,
        201,
      );
    }

    if (!body.name || !body.roleTitle) return fail("نام و سمت الزامی است");
    return ok(
      await prisma.staff.create({
        data: {
          name: body.name,
          roleTitle: body.roleTitle,
          mobile: body.mobile,
          branchId: body.branchId || null,
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
    const body = await readJson<{ id: string; tab?: string; status?: string; active?: boolean }>(
      request,
    );
    if (!body.id) return fail("شناسه لازم است");
    if (body.tab === "leaves") {
      return ok(
        await prisma.leaveRequest.update({
          where: { id: body.id },
          data: { status: body.status || "approved" },
        }),
      );
    }
    if (body.tab === "payroll") {
      return ok(
        await prisma.payroll.update({
          where: { id: body.id },
          data: { status: body.status || "paid" },
        }),
      );
    }
    return ok(
      await prisma.staff.update({
        where: { id: body.id },
        data: {
          ...(body.active !== undefined ? { active: body.active } : {}),
        },
      }),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
