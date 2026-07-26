"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { navForRole } from "@/lib/nav";
import { useScope } from "@/lib/mock/session";

export function Sidebar() {
  const pathname = usePathname();
  const { branchLabel, session } = useScope();
  const groups = navForRole(session.role);

  return (
    <aside
      className="hidden min-h-screen flex-col gap-8 border-l border-[var(--hairline)] bg-porcelain/70 px-4 pb-6 pt-8 backdrop-blur-md lg:flex"
      aria-label="ناوبری اصلی"
      style={{ width: "var(--sidebar-width)" }}
    >
      <Link href="/erp" className="flex items-center gap-3 px-3 text-inherit no-underline">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/armonia-mark.svg" alt="" width={40} height={40} />
        <div>
          <div className="font-display text-[1.2rem] font-semibold leading-tight tracking-tight text-olive-800">
            آرمونیا
          </div>
          <div className="mt-0.5 text-[0.7rem] font-medium text-ink-muted">
            پنل مدیریت
          </div>
        </div>
      </Link>

      <nav className="flex flex-col gap-6 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="mb-2 px-3 text-[0.68rem] font-semibold tracking-wide text-ink-muted">
              {group.label}
            </div>
            <div className="flex flex-col">
              {group.items.map((item) => {
                const active =
                  item.href === "/erp"
                    ? pathname === "/erp" || pathname === "/erp/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative my-px flex items-center gap-3 rounded-md px-3 py-[0.62rem] text-[0.9rem] font-medium text-ink-700 transition duration-armonia ease-armonia hover:bg-olive-50/70 hover:text-olive-800",
                      active && "bg-olive-50 font-semibold text-olive-800",
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-y-[18%] start-0 w-[3px] rounded-sm bg-gradient-to-b from-champagne-500 to-champagne-700 shadow-[0_0_12px_rgb(196_165_116_/_0.45)]"
                      />
                    )}
                    <span
                      aria-hidden
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300 transition duration-armonia",
                        active && "scale-110 bg-champagne-500",
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-[var(--hairline)] px-3 pt-4 text-[0.72rem] leading-relaxed text-ink-muted">
        شعبه فعال:{" "}
        <span className="font-semibold text-olive-800">{branchLabel}</span>
      </div>
    </aside>
  );
}
