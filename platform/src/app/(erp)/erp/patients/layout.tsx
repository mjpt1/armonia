import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "بیماران",
};

export default function PatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
