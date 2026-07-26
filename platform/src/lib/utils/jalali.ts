/** Lightweight Jalali helpers without heavy deps (fallback if date-fns-jalali fails). */

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toFaDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatMoneyFa(amount: number): string {
  return toFaDigits(amount.toLocaleString("en-US")) + " تومان";
}

/** Approximate Jalali from Gregorian for demo display */
export function toJalali(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return toFaDigits(
      new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d),
    );
  } catch {
    return toFaDigits(d.toISOString().slice(0, 10));
  }
}

export function toJalaliDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return toFaDigits(
      new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d),
    );
  } catch {
    return toFaDigits(d.toISOString());
  }
}

export function todayJalali(): string {
  return toJalali(new Date());
}
