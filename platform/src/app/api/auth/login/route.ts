import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { encodeSession, sessionCookieOptions } from "@/lib/auth";
import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";
import type { RoleCode } from "@/lib/types/rbac";

/** Compatibility login endpoint — prefers /api/auth/session */
export async function POST(request: Request) {
  try {
    const body = await readJson<{
      email?: string;
      password?: string;
      role?: RoleCode;
    }>(request);

    let user =
      body.email
        ? await prisma.user.findUnique({ where: { email: body.email } })
        : null;

    if (!user && body.role) {
      user = await prisma.user.findFirst({ where: { role: body.role, active: true } });
    }

    if (!user || !user.active) return fail("کاربر یافت نشد", 401);
    if (body.password && body.password !== user.password) {
      return fail("رمز عبور نادرست است", 401);
    }

    const token = encodeSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      initials: user.initials,
      role: user.role as RoleCode,
      branchId: user.branchId,
      clinicId: user.clinicId,
    });

    const res = ok({
      id: user.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      initials: user.initials,
      branchId: user.branchId,
      clinicId: user.clinicId,
    });
    res.cookies.set(sessionCookieOptions(token));

    // Also set simple session cookie used by ScopeProvider
    const jar = await cookies();
    jar.set(
      "armonia_session",
      encodeURIComponent(
        JSON.stringify({
          userId: user.id,
          role: user.role,
          branchId: user.branchId,
        }),
      ),
      { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 },
    );

    return res;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطای ورود", 500);
  }
}

export async function DELETE() {
  const res = NextResponse.json({ data: { ok: true } });
  res.cookies.set({ name: "armonia_session", value: "", httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

export async function GET() {
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();
  if (!session) return fail("وارد نشده‌اید", 401);
  return ok(session);
}
