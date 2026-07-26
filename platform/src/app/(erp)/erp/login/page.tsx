"use client";

import { Button } from "@/components/ui/Button";
import { ROLE_LABELS_FA, type RoleCode } from "@/lib/types/rbac";
import { apiFetch } from "@/lib/client-api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const roles = Object.keys(ROLE_LABELS_FA) as RoleCode[];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ceo@armonia.local");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<RoleCode>("CEO");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function loginWithCredentials() {
    setBusy(true);
    setError("");
    const res = await apiFetch("/api/auth/session", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.replace("/erp");
    router.refresh();
  }

  async function loginWithRole() {
    setBusy(true);
    setError("");
    const res = await apiFetch("/api/auth/session", {
      method: "POST",
      body: JSON.stringify({ role }),
    });
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.replace("/erp");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen w-[min(440px,calc(100%-2rem))] flex-col justify-center py-12">
      <div className="rounded-lg border border-[var(--hairline)] bg-porcelain/90 p-6 shadow-depth backdrop-blur-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/armonia-mark.svg" alt="" width={44} height={44} />
          <div>
            <h1 className="font-display text-xl font-semibold text-olive-800">ورود به ERP</h1>
            <p className="text-sm text-ink-muted">آرمونیا · محیط عملیاتی</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-ink-muted">ایمیل</span>
            <input
              className="w-full rounded-md border border-stone-300 bg-porcelain px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-ink-muted">رمز عبور</span>
            <input
              type="password"
              className="w-full rounded-md border border-stone-300 bg-porcelain px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
            />
          </label>
          <Button className="w-full" disabled={busy} onClick={() => void loginWithCredentials()}>
            ورود با حساب
          </Button>
        </div>

        <div className="my-6 border-t border-[var(--hairline)] pt-6">
          <p className="mb-3 text-sm text-ink-muted">یا انتخاب سریع نقش (دادهٔ seed):</p>
          <select
            className="mb-3 w-full rounded-md border border-stone-300 bg-porcelain px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as RoleCode)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS_FA[r]} ({r})
              </option>
            ))}
          </select>
          <Button
            variant="accent"
            className="w-full"
            disabled={busy}
            onClick={() => void loginWithRole()}
          >
            ورود با نقش
          </Button>
        </div>

        {error ? <p className="text-sm text-error">{error}</p> : null}
        <p className="mt-4 text-xs leading-relaxed text-ink-muted">
          رمز پیش‌فرض: <span dir="ltr">demo1234</span> (یا ceo@armonia.ir / armonia123)
          <br />
          مثال: ceo@armonia.local
        </p>
      </div>
    </div>
  );
}
