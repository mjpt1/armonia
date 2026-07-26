import { cn } from "@/lib/utils/cn";

export function Panel({
  children,
  className,
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(
        "rounded-lg border border-[var(--hairline)] bg-porcelain/85 p-5 shadow-depth backdrop-blur-sm sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PanelHead({
  title,
  description,
  actions,
  titleId,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  titleId?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2
          id={titleId}
          className="font-display text-lg font-semibold text-ink-900"
        >
          {title}
        </h2>
        {description ? (
          <div className="mt-1 text-[0.8rem] text-ink-muted">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
