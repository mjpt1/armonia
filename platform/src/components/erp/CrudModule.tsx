"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { useScope } from "@/lib/mock/session";
import type { ModuleKey } from "@/lib/types/rbac";
import { cn } from "@/lib/utils/cn";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "datetime-local" | "date" | "email" | "tel";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
};

type Props<T extends { id: string }> = {
  title: string;
  description?: ReactNode;
  endpoint: string;
  fields: FieldDef[];
  columns: { key: string; header: string; render: (row: T) => ReactNode }[];
  mapRowToForm?: (row: T) => Record<string, string>;
  emptyForm?: Record<string, string>;
  transformBody?: (form: Record<string, string>) => Record<string, unknown>;
  canWrite?: boolean;
  module?: ModuleKey;
  extraActions?: (row: T, reload: () => void) => ReactNode;
  query?: string;
  /** When true, PATCH/DELETE send id in body/query on collection URL (no /[id] routes) */
  collectionMutations?: boolean;
};

export function CrudModule<T extends { id: string }>({
  title,
  description,
  endpoint,
  fields,
  columns,
  mapRowToForm,
  emptyForm,
  transformBody,
  canWrite: canWriteProp = true,
  module,
  extraActions,
  query = "",
  collectionMutations = true,
}: Props<T>) {
  const { canWriteModule, moduleAccess } = useScope();
  const canWrite = module ? canWriteModule(module) : canWriteProp;
  const accessLabel = module ? moduleAccess(module) : null;
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>(emptyForm ?? {});
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${endpoint}${query}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "خطا در دریافت داده");
      setRows(json.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }, [endpoint, query]);

  useEffect(() => {
    void reload();
  }, [reload]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm ?? Object.fromEntries(fields.map((f) => [f.name, ""])));
    setOpen(true);
  }

  function openEdit(row: T) {
    setEditingId(row.id);
    const mapped =
      mapRowToForm?.(row) ??
      Object.fromEntries(
        fields.map((f) => [f.name, String((row as Record<string, unknown>)[f.name] ?? "")]),
      );
    setForm(mapped);
    setOpen(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const base = transformBody
        ? transformBody(form)
        : Object.fromEntries(
            Object.entries(form).map(([k, v]) => {
              const field = fields.find((f) => f.name === k);
              if (field?.type === "number") return [k, v === "" ? null : Number(v)];
              return [k, v === "" ? null : v];
            }),
          );

      let res: Response;
      if (editingId) {
        const body = collectionMutations ? { ...base, id: editingId } : base;
        const url = collectionMutations ? endpoint : `${endpoint}/${editingId}`;
        res = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(base),
        });
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "ذخیره ناموفق بود");
      setOpen(false);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("حذف شود؟")) return;
    const url = collectionMutations
      ? `${endpoint}?id=${encodeURIComponent(id)}`
      : `${endpoint}/${id}`;
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError((json as { error?: string }).error || "حذف ناموفق");
      return;
    }
    await reload();
  }

  return (
    <Panel labelledBy="crud-heading">
      <PanelHead
        titleId="crud-heading"
        title={title}
        description={
          <>
            {description}
            {accessLabel && accessLabel !== "F" ? (
              <span className="ms-2 rounded bg-stone-100 px-2 py-0.5 text-[0.68rem] text-ink-muted">
                {accessLabel === "R" ? "فقط مشاهده" : accessLabel === "O" ? "محدود به شعبه" : "دادهٔ خود"}
              </span>
            ) : null}
          </>
        }
        actions={
          canWrite ? (
            <Button type="button" size="sm" onClick={openCreate}>
              ایجاد
            </Button>
          ) : null
        }
      />
      {error && (
        <p className="mb-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}
      {loading ? (
        <p className="text-sm text-ink-muted">در حال بارگذاری…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.9rem]">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className="border-b border-stone-100 px-2 py-3 text-start text-xs text-ink-muted"
                  >
                    {c.header}
                  </th>
                ))}
                {canWrite && (
                  <th className="border-b border-stone-100 px-2 py-3 text-start text-xs text-ink-muted">
                    عملیات
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (canWrite ? 1 : 0)}
                    className="px-2 py-6 text-center text-ink-muted"
                  >
                    موردی ثبت نشده است.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-olive-50/60">
                    {columns.map((c) => (
                      <td key={c.key} className="border-b border-stone-100 px-2 py-3">
                        {c.render(row)}
                      </td>
                    ))}
                    {canWrite && (
                      <td className="border-b border-stone-100 px-2 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="text-sm font-medium text-olive-800 underline"
                            onClick={() => openEdit(row)}
                          >
                            ویرایش
                          </button>
                          <button
                            type="button"
                            className="text-sm font-medium text-danger underline"
                            onClick={() => void onDelete(row.id)}
                          >
                            حذف
                          </button>
                          {extraActions?.(row, () => void reload())}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4"
          role="dialog"
          aria-modal
        >
          <form
            onSubmit={onSubmit}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-stone-100 bg-porcelain p-5 shadow-depth"
          >
            <h3 className="font-display text-lg font-semibold text-ink-900">
              {editingId ? "ویرایش" : "ایجاد"} — {title}
            </h3>
            <div className="mt-4 space-y-3">
              {fields.map((f) => (
                <label key={f.name} className="block text-sm">
                  <span className="mb-1 block font-medium text-ink-700">{f.label}</span>
                  {f.type === "textarea" ? (
                    <textarea
                      className={inputCls}
                      value={form[f.name] ?? ""}
                      required={f.required}
                      placeholder={f.placeholder}
                      rows={3}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    />
                  ) : f.type === "select" ? (
                    <select
                      className={inputCls}
                      value={form[f.name] ?? ""}
                      required={f.required}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    >
                      <option value="">انتخاب…</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className={inputCls}
                      type={f.type ?? "text"}
                      value={form[f.name] ?? ""}
                      required={f.required}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "در حال ذخیره…" : "ذخیره"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Panel>
  );
}

const inputCls = cn(
  "w-full rounded-md border border-stone-100 bg-ivory px-3 py-2 text-sm outline-none",
  "focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500/40",
);
