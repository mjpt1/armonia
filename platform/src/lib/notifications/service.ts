import { prisma } from "@/lib/db";

type Channel = "sms" | "whatsapp" | "email" | "inapp" | "in_app";

export async function queueNotification(input: {
  channel: Channel;
  toAddress: string;
  title?: string;
  subject?: string;
  body: string;
  userId?: string;
  autoSend?: boolean;
}) {
  const row = await prisma.notification.create({
    data: {
      channel: input.channel === "in_app" ? "inapp" : input.channel,
      toAddress: input.toAddress,
      title: input.title || input.subject || "اعلان",
      body: input.body,
      userId: input.userId,
      status: "queued",
    },
  });

  if (input.autoSend !== false) {
    return sendNotification(row.id);
  }
  return row;
}

/** Stub send: marks as sent — hook for SMS/WhatsApp/email providers */
export async function sendNotification(id: string) {
  const n = await prisma.notification.findUnique({ where: { id } });
  if (!n) return null;
  console.info(`[notify:${n.channel}] → ${n.toAddress} | ${n.title} | ${(n.body || "").slice(0, 80)}`);
  return prisma.notification.update({
    where: { id },
    data: { status: "sent" },
  });
}

export async function logActivity(input: {
  userId?: string;
  action: string;
  module?: string;
  entity?: string;
  entityId?: string;
  detail?: string;
  meta?: Record<string, unknown>;
}) {
  return prisma.activityLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      module: input.module || input.entity || "system",
      detail:
        input.detail ||
        (input.meta ? JSON.stringify(input.meta) : input.entityId || null),
    },
  });
}
