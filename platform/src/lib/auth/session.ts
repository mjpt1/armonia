import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import type { RoleCode } from "@/lib/types/rbac";

export const SESSION_COOKIE = "armonia_session";

export type SessionPayload = {
  userId: string;
  role: RoleCode;
  branchId?: string | null;
};

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as SessionPayload;
    if (!parsed?.userId || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (session) return session;
  // Demo fallback: CEO
  const ceo = await prisma.user.findFirst({ where: { role: "CEO" } });
  if (ceo) {
    return { userId: ceo.id, role: "CEO" as RoleCode, branchId: ceo.branchId };
  }
  return { userId: "demo", role: "CEO", branchId: null };
}

export async function getSessionUser() {
  const session = await requireSession();
  if (session.userId === "demo") {
    return {
      id: "demo",
      name: "کاربر دمو",
      initials: "دم",
      role: session.role,
      branchId: session.branchId,
      email: "demo@armonia.local",
    };
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return {
      id: session.userId,
      name: "کاربر",
      initials: "ک",
      role: session.role,
      branchId: session.branchId,
      email: "",
    };
  }
  return {
    id: user.id,
    name: user.name,
    initials: user.initials,
    role: user.role as RoleCode,
    branchId: user.branchId,
    email: user.email,
  };
}

export function encodeSession(payload: SessionPayload): string {
  return encodeURIComponent(JSON.stringify(payload));
}
