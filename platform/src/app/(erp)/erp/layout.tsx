import { ErpShell } from "@/components/erp/ErpShell";

export default function ErpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="erp-mesh relative min-h-screen">
      <ErpShell>{children}</ErpShell>
    </div>
  );
}
