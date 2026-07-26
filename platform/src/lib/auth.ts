import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { RoleCode } from "@/lib/types/rbac";

export const SESSION_COOKIE = "armonia_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  initials: string;
  role: RoleCode;
  branchId: string | null;
  clinicId: string | null;
  exp: number;
}

function secret() {
  return process.env.AUTH_SECRET || "armonia-dev-secret-change-me";
}

function sign(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function encodeSession(payload: Omit<SessionPayload, "exp">, ttlHours = 24 * 7) {
  const full: SessionPayload = {
    ...payload,
    exp: Date.now() + ttlHours * 60 * 60 * 1000,
  };
  const body = Buffer.from(JSON.stringify(full)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeSession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return decodeSession(jar.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  };
}
