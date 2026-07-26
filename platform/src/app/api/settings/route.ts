import { fail, ok, readJson } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const tab = new URL(request.url).searchParams.get("tab") || "overview";

  if (tab === "services") {
    return ok(await prisma.service.findMany({ orderBy: { name: "asc" } }));
  }
  if (tab === "tariffs") {
    return ok(
      await prisma.tariff.findMany({ include: { service: true }, orderBy: { name: "asc" } }),
    );
  }
  if (tab === "brands") {
    return ok(await prisma.brand.findMany());
  }
  if (tab === "languages") {
    return ok(await prisma.language.findMany());
  }
  if (tab === "geography") {
    const countries = await prisma.country.findMany({
      include: { provinces: true },
    });
    return ok(countries);
  }

  const [branches, clinics, services, brands, languages] = await Promise.all([
    prisma.branch.count(),
    prisma.clinic.count(),
    prisma.service.count(),
    prisma.brand.count(),
    prisma.language.count(),
  ]);

  return ok({ branches, clinics, services, brands, languages });
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{
      tab: string;
      name?: string;
      description?: string;
      category?: string;
      priceFrom?: number;
      amount?: number;
      serviceId?: string;
      code?: string;
      nameFa?: string;
      rtl?: boolean;
      countryId?: string;
    }>(request);

    if (body.tab === "services") {
      if (!body.name || !body.description || !body.category) return fail("فیلدهای خدمت ناقص است");
      return ok(
        await prisma.service.create({
          data: {
            name: body.name,
            description: body.description,
            category: body.category,
            priceFrom: Number(body.priceFrom) || 0,
          },
        }),
        undefined,
        201,
      );
    }
    if (body.tab === "tariffs") {
      if (!body.name || body.amount == null) return fail("نام و مبلغ تعرفه الزامی است");
      return ok(
        await prisma.tariff.create({
          data: {
            name: body.name,
            amount: Number(body.amount),
            serviceId: body.serviceId || null,
          },
        }),
        undefined,
        201,
      );
    }
    if (body.tab === "brands") {
      if (!body.name) return fail("نام برند الزامی است");
      return ok(await prisma.brand.create({ data: { name: body.name } }), undefined, 201);
    }
    if (body.tab === "languages") {
      if (!body.code || !body.nameFa) return fail("کد و نام زبان الزامی است");
      return ok(
        await prisma.language.create({
          data: { code: body.code, nameFa: body.nameFa, rtl: body.rtl ?? true },
        }),
        undefined,
        201,
      );
    }
    if (body.tab === "provinces") {
      if (!body.nameFa || !body.countryId) return fail("نام استان و کشور الزامی است");
      return ok(
        await prisma.province.create({
          data: { nameFa: body.nameFa, countryId: body.countryId },
        }),
        undefined,
        201,
      );
    }
    return fail("تب نامعتبر");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "خطا", 500);
  }
}
