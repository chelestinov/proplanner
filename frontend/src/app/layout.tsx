import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProPlanner AI",
  description: "AI Tools Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}