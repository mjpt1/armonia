import { cookies } from "next/headers";
import { fail, ok, readJson } from "@/lib/api/helpers";
import { encodeSession, SESSION_COOKIE, type SessionPayload } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/notifications/service";
import type { RoleCode } from "@/lib/types/rbac";

export async function GET() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) {
    const ceo = await prisma.user.findFirst({ where: { role: "CEO", active: true } });
    return ok(
      ceo
        ? {
            userId: ceo.id,
            role: ceo.role,
            branchId: ceo.branchId,
            name: ceo.name,
            email: ceo.email,
            initials: ceo.initials,
          }
        : null,
    );
  }
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as SessionPayload;
    const user = await prisma.user.findUnique({ where: { id: parsed.userId } });
    return ok(
      user
        ? {
            userId: user.id,
            role: parsed.role || user.role,
            branchId: user.branchId,
            name: user.name,
            email: user.email,
            initials: user.initials,
          }
        : parsed,
    );
  } catch {
    return ok(null);
  }
}

export async function POST(request: Request) {
  const body = await readJson<{
    email?: string;
    password?: string;
    userId?: string;
    role?: RoleCode;
  }>(request);

  let user =
    body.userId
      ? await prisma.user.findUnique({ where: { id: body.userId } })
      : body.email
        ? await prisma.user.findUnique({ where: { email: body.email } })
        : null;

  if (body.email && body.password) {
    if (!user || user.password !== body.password) {
      return fail("ایمیل یا رمز عبور نادرست است", 401);
    }
  }

  if (!user && body.role) {
    user = await prisma.user.findFirst({ where: { role: body.role, active: true } });
  }

  if (!user) return fail("کاربر یافت نشد", 404);

  const payload: SessionPayload = {
    userId: user.id,
    role: (body.role ?? user.role) as RoleCode,
    branchId: user.branchId,
  };

  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeSession(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  await logActivity({
    userId: user.id,
    action: "auth.login",
    module: "users",
    detail: `ورود با نقش ${payload.role}`,
  });

  return ok({
    userId: user.id,
    role: payload.role,
    branchId: user.branchId,
    name: user.name,
    email: user.email,
    initials: user.initials,
  });
}

export async function DELETE() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return ok({ ok: true });
}
