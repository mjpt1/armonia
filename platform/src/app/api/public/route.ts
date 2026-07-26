import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";
import { queueNotification } from "@/lib/notifications/service";

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      kind?: "contact" | "consultation" | "booking_lead";
      name?: string;
      mobile?: string;
      email?: string;
      subject?: string;
      message?: string;
      service?: string;
      body?: string;
    }>(request);

    if (!body.name) return fail("نام الزامی است");

    if (body.kind === "consultation") {
      if (!body.mobile) return fail("موبایل الزامی است");
      const lead = await prisma.lead.create({
        data: {
          name: body.name,
          mobile: body.mobile,
          service: body.service,
          source: "consultation",
          status: "lead",
          notes: body.message,
        },
      });
      await queueNotification({
        channel: "sms",
        toAddress: body.mobile,
        title: "درخواست مشاوره",
        body: "درخواست مشاوره شما ثبت شد. مشاوران آرمونیا به‌زودی تماس می‌گیرند.",
      });
      return ok(lead, undefined, 201);
    }

    if (body.kind === "booking_lead") {
      if (!body.mobile) return fail("موبایل الزامی است");
      const lead = await prisma.lead.create({
        data: {
          name: body.name,
          mobile: body.mobile,
          source: "booking",
          status: "lead",
          notes: body.message,
        },
      });
      await queueNotification({
        channel: "sms",
        toAddress: body.mobile,
        title: "رزرو",
        body: "درخواست رزرو شما دریافت شد.",
      });
      return ok(lead, undefined, 201);
    }

    // contact
    const text = body.body || body.message || "";
    if (!text) return fail("پیام الزامی است");
    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        mobile: body.mobile || "—",
        source: "contact",
        status: "lead",
        notes: [body.subject, text, body.email].filter(Boolean).join(" | "),
      },
    });
    return ok(lead, undefined, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
