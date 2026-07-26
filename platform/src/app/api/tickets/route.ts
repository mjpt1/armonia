import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET() {
  const data = await prisma.ticket.findMany({
    include: { branch: true, assignee: true },
    orderBy: { updatedAt: "desc" },
  });
  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      subject: string;
      body?: string;
      priority?: string;
      requester?: string;
      branchId?: string;
    }>(request);
    if (!body.subject) return fail("موضوع الزامی است");
    const ticket = await prisma.ticket.create({
      data: {
        subject: body.subject,
        body: body.body,
        priority: body.priority || "normal",
        requester: body.requester,
        branchId: body.branchId || null,
      },
    });
    return ok(ticket, undefined, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{ id: string; status?: string; priority?: string }>(request);
    if (!body.id) return fail("شناسه لازم است");
    return ok(
      await prisma.ticket.update({
        where: { id: body.id },
        data: {
          ...(body.status ? { status: body.status } : {}),
          ...(body.priority ? { priority: body.priority } : {}),
        },
      }),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
