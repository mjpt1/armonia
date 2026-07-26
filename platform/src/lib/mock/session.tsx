"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { canAccess, accessLevel, canWrite } from "@/lib/rbac/matrix";
import { defaultRouteForRole } from "@/lib/rbac/home";
import { ROLE_LABELS_FA, type ModuleKey, type RoleCode } from "@/lib/types/rbac";

export type BranchOption = { id: string; name: string; city: string };
export type ClinicOption = { id: string; name: string; branchId: string };

type SessionUser = {
  userId: string;
  name: string;
  email: string;
  initials: string;
  role: RoleCode;
  branchId?: string | null;
};

interface ScopeState {
  session: SessionUser;
  branchId: string | "all";
  clinicId: string | "all";
  branchLabel: string;
  roleLabel: string;
  branches: BranchOption[];
  clinics: ClinicOption[];
  clinicsForBranch: ClinicOption[];
  loading: boolean;
  setBranchId: (id: string | "all") => void;
  setClinicId: (id: string | "all") => void;
  switchRole: (role: RoleCode) => Promise<void>;
  refresh: () => Promise<void>;
  hasModule: (module: ModuleKey) => boolean;
  moduleAccess: (module: ModuleKey) => ReturnType<typeof accessLevel>;
  canWriteModule: (module: ModuleKey) => boolean;
}

const ScopeContext = createContext<ScopeState | null>(null);

const fallbackSession: SessionUser = {
  userId: "demo",
  name: "کاربر دمو",
  email: "ceo@armonia.local",
  initials: "دم",
  role: "CEO",
  branchId: null,
};

export function ScopeProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUser>(fallbackSession);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [clinics, setClinics] = useState<ClinicOption[]>([]);
  const [branchId, setBranchIdState] = useState<string | "all">("all");
  const [clinicId, setClinicId] = useState<string | "all">("all");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [sessRes, branchRes, clinicRes] = await Promise.all([
        fetch("/api/auth/session"),
        fetch("/api/branches"),
        fetch("/api/clinics"),
      ]);
      const sessJson = await sessRes.json();
      const branchJson = await branchRes.json();
      const clinicJson = await clinicRes.json();
      if (sessJson.data) {
        setSession({
          userId: sessJson.data.userId,
          name: sessJson.data.name ?? "کاربر",
          email: sessJson.data.email ?? "",
          initials: sessJson.data.initials ?? "ک",
          role: sessJson.data.role as RoleCode,
          branchId: sessJson.data.branchId,
        });
        if (sessJson.data.branchId) setBranchIdState(sessJson.data.branchId);
      }
      setBranches(
        (branchJson.data ?? []).map((b: { id: string; name: string; city: string }) => ({
          id: b.id,
          name: b.name,
          city: b.city,
        })),
      );
      setClinics(
        (clinicJson.data ?? []).map(
          (c: { id: string; name: string; branchId: string }) => ({
            id: c.id,
            name: c.name,
            branchId: c.branchId,
          }),
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setBranchId = useCallback((id: string | "all") => {
    setBranchIdState(id);
    setClinicId("all");
  }, []);

  const switchRole = useCallback(
    async (role: RoleCode) => {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const json = await res.json();
      if (json.data) {
        setSession({
          userId: json.data.userId,
          name: json.data.name ?? "کاربر",
          email: json.data.email ?? "",
          initials: json.data.initials ?? "ک",
          role: json.data.role as RoleCode,
          branchId: json.data.branchId,
        });
        if (json.data.branchId) setBranchIdState(json.data.branchId);
      } else {
        await refresh();
      }
      window.location.href = defaultRouteForRole(role);
    },
    [refresh],
  );

  const value = useMemo<ScopeState>(() => {
    const branch =
      branchId === "all"
        ? null
        : branches.find((b) => b.id === branchId) ?? null;
    return {
      session,
      branchId,
      clinicId,
      branchLabel: branch ? branch.name : "همه شعب",
      roleLabel: ROLE_LABELS_FA[session.role] ?? session.role,
      branches,
      clinics,
      clinicsForBranch:
        branchId === "all"
          ? clinics
          : clinics.filter((c) => c.branchId === branchId),
      loading,
      setBranchId,
      setClinicId,
      switchRole,
      refresh,
      hasModule: (module) => canAccess(session.role, module),
      moduleAccess: (module) => accessLevel(session.role, module),
      canWriteModule: (module) => canWrite(session.role, module),
    };
  }, [
    session,
    branchId,
    clinicId,
    branches,
    clinics,
    loading,
    setBranchId,
    switchRole,
    refresh,
  ]);

  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
}

export function useScope() {
  const ctx = useContext(ScopeContext);
  if (!ctx) throw new Error("useScope must be used within ScopeProvider");
  return ctx;
}
