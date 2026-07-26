const FA = "۰۱۲۳۴۵۶۷۸۹";

/** Convert ASCII digits to Persian digits for display. */
export function toFaDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA[Number(d)]);
}
