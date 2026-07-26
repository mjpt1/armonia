import { ok } from "@/lib/api";
import { prisma } from "@/lib/db";
import { formatMoneyFa, toFaDigits } from "@/lib/utils/jalali";

export async function GET() {
  const [
    leadCount,
    winLeads,
    patientCount,
    apptCount,
    bookedAppts,
    paymentsIn,
    paymentsOut,
    branches,
    doctors,
    campaigns,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "win" } }),
    prisma.patient.count(),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: { in: ["booked", "confirmed"] } } }),
    prisma.payment.aggregate({
      where: { kind: "in" },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { kind: "out" },
      _sum: { amount: true },
    }),
    prisma.branch.findMany({
      include: {
        _count: { select: { appointments: true, patients: true, leads: true } },
      },
    }),
    prisma.doctor.findMany({
      include: { _count: { select: { appointments: true } } },
      take: 8,
    }),
    prisma.campaign.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  const sales = paymentsIn._sum.amount ?? 0;
  const costs = paymentsOut._sum.amount ?? 0;
  const profit = sales - costs;
  const conversion = leadCount ? Math.round((winLeads / leadCount) * 100) : 0;

  return ok({
    kpis: [
      {
        label: "فروش ثبت‌شده",
        value: formatMoneyFa(sales),
        delta: "ورود نقدی ثبت‌شده",
        tone: "up" as const,
      },
      {
        label: "سود تقریبی",
        value: formatMoneyFa(profit),
        delta: costs ? `خروج ${formatMoneyFa(costs)}` : "بدون هزینه",
        tone: profit >= 0 ? ("up" as const) : ("down" as const),
      },
      {
        label: "نوبت فعال",
        value: toFaDigits(bookedAppts),
        delta: `از ${toFaDigits(apptCount)} کل`,
        tone: "neutral" as const,
      },
      {
        label: "نرخ تبدیل لید",
        value: `${toFaDigits(conversion)}٪`,
        delta: `${toFaDigits(winLeads)} از ${toFaDigits(leadCount)}`,
        tone: conversion >= 20 ? ("up" as const) : ("neutral" as const),
      },
      {
        label: "بیماران",
        value: toFaDigits(patientCount),
        delta: "پرونده فعال",
        tone: "neutral" as const,
      },
    ],
    branches: branches.map((b) => ({
      id: b.id,
      name: b.name,
      appointments: b._count.appointments,
      patients: b._count.patients,
      leads: b._count.leads,
    })),
    doctors: doctors.map((d) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      appointments: d._count.appointments,
      commissionPct: d.commissionPct,
    })),
    campaigns: campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      budget: c.budget,
      spend: c.spent,
      roiHint: c.spent ? Math.round(((c.budget - c.spent) / c.spent) * 100) : 0,
      status: c.status,
    })),
    live: {
      leads: leadCount,
      patients: patientCount,
      appointments: apptCount,
      updatedAt: new Date().toISOString(),
    },
  });
}
