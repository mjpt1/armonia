import { cn } from "@/lib/utils/cn";

type BadgeTone =
  | "lead"
  | "follow"
  | "wait"
  | "win"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

const tones: Record<BadgeTone, string> = {
  lead: "bg-olive-100 text-olive-800",
  follow: "bg-champagne-100 text-champagne-700",
  wait: "bg-stone-100 text-ink-700",
  win: "bg-olive-50 text-success",
  neutral: "bg-olive-100 text-olive-800",
  info: "bg-olive-50 text-info",
  success: "bg-olive-50 text-success",
  warning: "bg-champagne-100 text-warning",
  danger: "bg-stone-100 text-danger",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm px-2 py-0.5 text-[0.72rem] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const leadStatusTone = {
  lead: "lead",
  follow: "follow",
  wait: "wait",
  win: "win",
} as const;

export const leadStatusLabel = {
  lead: "لید جدید",
  follow: "پیگیری",
  wait: "در انتظار",
  win: "قرارداد",
} as const;
