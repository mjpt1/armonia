import { cn } from "@/lib/utils/cn";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  numeric?: boolean;
  render: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyMessage = "موردی یافت نشد.",
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-[0.9rem]">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "border-b border-stone-100 px-2 py-3 text-start text-xs font-semibold text-ink-muted",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-2 py-8 text-center text-sm text-ink-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors duration-armonia ease-armonia hover:bg-olive-50/60"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "border-b border-stone-100 px-2 py-3 text-start text-ink-700",
                      col.numeric && "font-variant-numeric tabular-nums",
                      col.className,
                    )}
                    dir={col.numeric ? "ltr" : undefined}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
