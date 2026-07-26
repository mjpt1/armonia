import { cn } from "@/lib/utils/cn";
import type { KpiItem } from "@/lib/types/domain";

const toneClass = {
  up: "text-success",
  down: "text-danger",
  neutral: "text-ink-muted font-medium",
} as const;

export function KpiStrip({
  items,
  label,
}: {
  items: KpiItem[];
  label?: string;
}) {
  return (
    <section
      aria-label={label ?? "شاخص‌های کلیدی"}
      className="mb-10 grid grid-cols-1 border-y border-[var(--hairline)] bg-gradient-to-l from-transparent via-champagne-500/10 to-transparent py-6 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn(
            "px-6 py-4 xl:py-0",
            i < items.length - 1 && "xl:border-l xl:border-[var(--hairline)]",
            i === 0 && "xl:ps-0",
            i === items.length - 1 && "xl:pe-0",
            i % 2 === 0 && "sm:border-l sm:border-[var(--hairline)] xl:border-l",
            i >= 2 && "sm:border-t sm:border-[var(--hairline)] sm:pt-5 xl:border-t-0 xl:pt-0",
          )}
        >
          <div className="text-[0.78rem] font-medium text-ink-muted">
            {item.label}
          </div>
          <div
            className="mt-1.5 font-display text-[clamp(1.65rem,2.4vw,2.05rem)] font-semibold leading-tight tracking-tight text-olive-800 animate-[kpiFade_700ms_var(--ease)_both]"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            {item.value}
            <span className="mt-2 block h-0.5 w-7 rounded-sm bg-gradient-to-l from-transparent to-champagne-500" />
          </div>
          <div className={cn("mt-1 text-xs font-semibold", toneClass[item.tone])}>
            {item.delta}
          </div>
        </div>
      ))}
    </section>
  );
}
