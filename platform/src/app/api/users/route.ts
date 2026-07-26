import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";
import { ROLE_LABELS_FA, type RoleCode } from "@/lib/types/rbac";

export async function GET(request: Request) {
  const tab = new URL(request.url).searchParams.get("tab") || "users";
  if (tab === "logs") {
    return ok(
      await prisma.activityLog.findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    );
  }
  if (tab === "roles") {
    return ok(
      Object.entries(ROLE_LABELS_FA).map(([code, label]) => ({
        id: code,
        code,
        label,
      })),
    );
  }
  const data = await prisma.user.findMany({
    include: { branch: true },
    orderBy: { name: "asc" },
  });
  return ok(
    data.map((u) => ({
      ...u,
      password: undefined,
      roleLabel: ROLE_LABELS_FA[u.role as RoleCode] || u.role,
    })),
  );
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      email: string;
      name: string;
      role: string;
      password?: string;
      branchId?: string;
      initials?: string;
    }>(request);
    if (!body.email || !body.name || !body.role) {
      return fail("ایمیل، نام و نقش الزامی است");
    }
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        role: body.role,
        password: body.password || "armonia123",
        initials: body.initials || body.name.slice(0, 2),
        branchId: body.branchId || null,
      },
    });
    await prisma.activityLog.create({
      data: {
        action: "user.create",
        module: "users",
        detail: `ایجاد کاربر ${user.email}`,
        userId: user.id,
      },
    });
    return ok({ ...user, password: undefined }, undefined, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readJson<{ id: string; role?: string; active?: boolean }>(request);
    if (!body.id) return fail("شناسه لازم است");
    const user = await prisma.user.update({
      where: { id: body.id },
      data: {
        ...(body.role ? { role: body.role } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
      },
    });
    await prisma.activityLog.create({
      data: {
        action: "user.update",
        module: "users",
        detail: `به‌روزرسانی ${user.email}`,
        userId: user.id,
      },
    });
    return ok({ ...user, password: undefined });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
