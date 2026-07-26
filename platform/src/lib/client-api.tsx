"use client";

import { useCallback, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState<{ message: string; tone: "ok" | "err" } | null>(null);

  const show = useCallback((message: string, tone: "ok" | "err" = "ok") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const node = toast ? (
    <div
      role="status"
      className={`fixed bottom-5 start-5 z-[100] max-w-sm rounded-md border px-4 py-3 text-sm shadow-depth ${
        toast.tone === "ok"
          ? "border-olive-100 bg-porcelain text-olive-800"
          : "border-error/30 bg-porcelain text-error"
      }`}
    >
      {toast.message}
    </div>
  ) : null;

  return { show, node };
}

export async function apiFetch<T = unknown>(
  url: string,
  init?: RequestInit,
): Promise<{ data?: T; error?: string; meta?: Record<string, unknown> }> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: (json as { error?: string }).error || "خطای سرور" };
  }
  return json as { data?: T; meta?: Record<string, unknown> };
}
