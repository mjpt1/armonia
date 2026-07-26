import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "ghost" | "accent" | "outlineLight";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-olive-800 text-porcelain hover:bg-olive-700 border-transparent",
  ghost:
    "bg-transparent text-olive-800 border-stone-300 hover:bg-olive-50",
  accent:
    "bg-champagne-500 text-ink-900 hover:bg-champagne-700 hover:text-white border-transparent",
  outlineLight:
    "bg-transparent text-porcelain border-porcelain/45 hover:bg-porcelain/10",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-[0.95rem]",
  sm: "px-3.5 py-2 text-[0.85rem]",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md border font-semibold transition duration-armonia ease-armonia hover:-translate-y-px disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md border font-semibold transition duration-armonia ease-armonia hover:-translate-y-px",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
