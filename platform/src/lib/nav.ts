import type { ModuleKey, RoleCode } from "@/lib/types/rbac";
import { canAccess } from "@/lib/permissions";

export interface NavItem {
  href: string;
  label: string;
  module: ModuleKey;
  match?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const ERP_NAV: NavGroup[] = [
  {
    label: "اجرایی",
    items: [{ href: "/erp", label: "داشبورد", module: "dashboard", match: "dashboard" }],
  },
  {
    label: "فروش و CRM",
    items: [
      { href: "/erp/crm", label: "لیدها و قیف", module: "crm", match: "crm" },
      { href: "/erp/contracts", label: "قراردادها", module: "contracts", match: "contracts" },
    ],
  },
  {
    label: "عملیات کلینیک",
    items: [
      { href: "/erp/appointments", label: "نوبت‌دهی", module: "appointments", match: "appointments" },
      { href: "/erp/patients", label: "بیماران", module: "patients", match: "patients" },
      { href: "/erp/doctors", label: "پزشکان", module: "doctors", match: "doctors" },
      { href: "/erp/clinics", label: "کلینیک‌ها", module: "branches", match: "clinics" },
      { href: "/erp/branches", label: "شعب", module: "branches", match: "branches" },
    ],
  },
  {
    label: "بازاریابی",
    items: [{ href: "/erp/marketing", label: "کمپین و محتوا", module: "marketing", match: "marketing" }],
  },
  {
    label: "مالی",
    items: [{ href: "/erp/finance", label: "مالی و تسویه", module: "finance", match: "finance" }],
  },
  {
    label: "منابع انسانی",
    items: [{ href: "/erp/hr", label: "پرسنل و حقوق", module: "hr", match: "hr" }],
  },
  {
    label: "پشتیبانی",
    items: [
      { href: "/erp/tickets", label: "تیکت‌ها", module: "tickets", match: "tickets" },
      { href: "/erp/notifications", label: "اعلان‌ها", module: "notifications", match: "notifications" },
    ],
  },
  {
    label: "سیستم",
    items: [
      { href: "/erp/users", label: "کاربران و نقش‌ها", module: "users", match: "users" },
      { href: "/erp/settings", label: "تنظیمات", module: "settings", match: "settings" },
    ],
  },
];

export function navForRole(role: RoleCode): NavGroup[] {
  return ERP_NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => canAccess(role, i.module)),
  })).filter((g) => g.items.length > 0);
}

export function moduleFromPath(pathname: string): ModuleKey | null {
  if (pathname === "/erp" || pathname === "/erp/") return "dashboard";
  if (pathname.startsWith("/erp/crm")) return "crm";
  if (pathname.startsWith("/erp/contracts")) return "contracts";
  if (pathname.startsWith("/erp/appointments")) return "appointments";
  if (pathname.startsWith("/erp/patients")) return "patients";
  if (pathname.startsWith("/erp/doctors")) return "doctors";
  if (pathname.startsWith("/erp/clinics")) return "branches";
  if (pathname.startsWith("/erp/branches")) return "branches";
  if (pathname.startsWith("/erp/marketing")) return "marketing";
  if (pathname.startsWith("/erp/finance")) return "finance";
  if (pathname.startsWith("/erp/hr")) return "hr";
  if (pathname.startsWith("/erp/tickets")) return "tickets";
  if (pathname.startsWith("/erp/notifications")) return "notifications";
  if (pathname.startsWith("/erp/users")) return "users";
  if (pathname.startsWith("/erp/settings")) return "settings";
  return null;
}
