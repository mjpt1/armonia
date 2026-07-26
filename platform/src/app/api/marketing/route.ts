import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const tab = new URL(request.url).searchParams.get("tab") || "campaigns";
  if (tab === "content") {
    return ok(await prisma.contentItem.findMany({ orderBy: { createdAt: "desc" } }));
  }
  if (tab === "social") {
    return ok(await prisma.socialAccount.findMany({ orderBy: { createdAt: "desc" } }));
  }
  const data = await prisma.campaign.findMany({
    include: { branch: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(data, { total: data.length });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      tab?: string;
      name?: string;
      channel?: string;
      budget?: number;
      title?: string;
      platform?: string;
      handle?: string;
      status?: string;
      branchId?: string;
    }>(request);

    if (body.tab === "content") {
      if (!body.title || !body.channel) return fail("عنوان و کانال الزامی است");
      return ok(
        await prisma.contentItem.create({
          data: {
            title: body.title,
            channel: body.channel,
            status: body.status || "planned",
          },
        }),
        undefined,
        201,
      );
    }

    if (body.tab === "social") {
      if (!body.platform || !body.handle) return fail("پلتفرم و هندل الزامی است");
      return ok(
        await prisma.socialAccount.create({
          data: { platform: body.platform, handle: body.handle },
        }),
        undefined,
        201,
      );
    }

    if (!body.name || !body.channel) return fail("نام و کانال کمپین الزامی است");
    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        channel: body.channel,
        budget: Number(body.budget) || 0,
        status: body.status || "draft",
        branchId: body.branchId || null,
      },
    });
    return ok(campaign, undefined, 201);
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
      spent?: number;
      leads?: number;
    }>(request);
    if (!body.id) return fail("شناسه لازم است");

    if (body.tab === "content") {
      return ok(
        await prisma.contentItem.update({
          where: { id: body.id },
          data: { ...(body.status ? { status: body.status } : {}) },
        }),
      );
    }

    return ok(
      await prisma.campaign.update({
        where: { id: body.id },
        data: {
          ...(body.status ? { status: body.status } : {}),
          ...(body.spent !== undefined ? { spent: body.spent } : {}),
          ...(body.leads !== undefined ? { leads: body.leads } : {}),
        },
      }),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
