import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET() {
  const data = await prisma.notification.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      channel: string;
      title: string;
      body?: string;
      toAddress?: string;
      userId?: string;
    }>(request);
    if (!body.channel || !body.title) return fail("کانال و عنوان الزامی است");

    // Hook-ready: SMS / WhatsApp / email providers can plug in here later.
    const notification = await prisma.notification.create({
      data: {
        channel: body.channel,
        title: body.title,
        body: body.body,
        toAddress: body.toAddress,
        userId: body.userId || null,
        status: body.channel === "inapp" ? "queued" : "queued",
      },
    });

    return ok(notification, { providerHook: "ready" }, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{ id: string; status?: string }>(request);
    if (!body.id) return fail("شناسه لازم است");
    return ok(
      await prisma.notification.update({
        where: { id: body.id },
        data: { status: body.status || "sent" },
      }),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
