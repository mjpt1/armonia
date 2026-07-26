"use client";

import { Sidebar } from "@/components/erp/Sidebar";
import { ScopeProvider, useScope } from "@/lib/mock/session";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { canAccess } from "@/lib/rbac/matrix";
import { defaultRouteForRole } from "@/lib/rbac/home";
import { moduleFromPath } from "@/lib/nav";

function Guard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useScope();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname.startsWith("/erp/login");

  useEffect(() => {
    if (loading || isLogin) return;
    const mod = moduleFromPath(pathname);
    if (mod && !canAccess(session.role, mod)) {
      router.replace(defaultRouteForRole(session.role));
    }
  }, [session, loading, pathname, router, isLogin]);

  if (isLogin) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-muted">
        در حال بارگذاری…
      </div>
    );
  }

  return (
    <div className="relative z-[1] grid min-h-screen lg:grid-cols-[var(--sidebar-width)_1fr]">
      <Sidebar />
      <div className="flex min-w-0 flex-col">{children}</div>
    </div>
  );
}

export function ErpShell({ children }: { children: React.ReactNode }) {
  return (
    <ScopeProvider>
      <Guard>{children}</Guard>
    </ScopeProvider>
  );
}
