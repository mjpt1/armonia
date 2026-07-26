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
import { apiFetch } from "@/lib/client-api";
import { ROLE_LABELS_FA, type RoleCode } from "@/lib/types/rbac";

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  initials: string;
  role: RoleCode;
  branchId: string | null;
  clinicId: string | null;
}

interface BranchRow {
  id: string;
  name: string;
  code: string;
}

interface ClinicRow {
  id: string;
  name: string;
  branchId: string;
}

interface ScopeState {
  session: AuthUser | null;
  loading: boolean;
  branchId: string | "all";
  clinicId: string | "all";
  branchLabel: string;
  roleLabel: string;
  branches: BranchRow[];
  clinicsForBranch: ClinicRow[];
  setBranchId: (id: string | "all") => void;
  setClinicId: (id: string | "all") => void;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const ScopeContext = createContext<ScopeState | null>(null);

export function ScopeProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [branchId, setBranchIdState] = useState<string | "all">("all");
  const [clinicId, setClinicId] = useState<string | "all">("all");
  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [clinics, setClinics] = useState<ClinicRow[]>([]);

  const refreshSession = useCallback(async () => {
    const res = await apiFetch<AuthUser>("/api/auth/login");
    if (res.data) {
      setSession(res.data);
      if (res.data.branchId) setBranchIdState(res.data.branchId);
    } else {
      setSession(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refreshSession();
      const [b, c] = await Promise.all([
        apiFetch<BranchRow[]>("/api/branches"),
        apiFetch<ClinicRow[]>("/api/clinics"),
      ]);
      if (b.data) setBranches(b.data);
      if (c.data) setClinics(c.data);
      setLoading(false);
    })();
  }, [refreshSession]);

  const setBranchId = useCallback((id: string | "all") => {
    setBranchIdState(id);
    setClinicId("all");
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/login", { method: "DELETE" });
    setSession(null);
    window.location.href = "/erp/login";
  }, []);

  const value = useMemo<ScopeState>(() => {
    const branch = branches.find((b) => b.id === branchId);
    return {
      session,
      loading,
      branchId,
      clinicId,
      branchLabel: branch?.name || "همه شعب",
      roleLabel: session ? ROLE_LABELS_FA[session.role] || session.role : "—",
      branches,
      clinicsForBranch:
        branchId === "all" ? clinics : clinics.filter((c) => c.branchId === branchId),
      setBranchId,
      setClinicId,
      refreshSession,
      logout,
    };
  }, [
    session,
    loading,
    branchId,
    clinicId,
    branches,
    clinics,
    setBranchId,
    refreshSession,
    logout,
  ]);

  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
}

export function useScope() {
  const ctx = useContext(ScopeContext);
  if (!ctx) throw new Error("useScope must be used within ScopeProvider");
  return ctx;
}
