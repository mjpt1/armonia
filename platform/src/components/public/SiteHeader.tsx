"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "خانه" },
  { href: "/services", label: "خدمات" },
  { href: "/doctors", label: "پزشکان" },
  { href: "/portfolio", label: "نمونه‌کارها" },
  { href: "/blog", label: "بلاگ" },
  { href: "/booking", label: "رزرو نوبت" },
  { href: "/consultation", label: "مشاوره" },
  { href: "/faq", label: "سوالات" },
  { href: "/contact", label: "تماس" },
  { href: "/patient", label: "پنل بیمار" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-100 bg-ivory/92 backdrop-blur-[10px]">
      <div className="mx-auto flex w-[min(1120px,calc(100%-2.5rem))] items-center justify-between gap-4 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[1.15rem] font-bold text-olive-800"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/armonia-mark.svg" alt="" width={36} height={36} />
          آرمونیا
        </Link>
        <ul className="hidden items-center gap-3.5 text-[0.85rem] font-medium text-ink-700 xl:flex">
          {links.map((link) => {
            const current =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "hover:text-olive-800",
                    current &&
                      "pb-0.5 text-olive-800 shadow-[inset_0_-2px_0_#C4A574]",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/consultation"
              className="inline-flex items-center rounded-md bg-olive-800 px-4 py-2 text-[0.85rem] font-semibold text-porcelain transition duration-armonia ease-armonia hover:bg-olive-700"
            >
              مشاوره رایگان
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
