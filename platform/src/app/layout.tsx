import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "آرمونیا",
    template: "%s | آرمونیا",
  },
  description:
    "شبکهٔ یکپارچهٔ کلینیک‌های زیبایی — زیبایی، هماهنگ با استاندارد.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource-variable/estedad@5.0.0/index.css"
        />
        <style>{`:root { --font-estedad: "Estedad Variable", "Estedad", var(--font-vazirmatn), Tahoma, sans-serif; }`}</style>
      </head>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
