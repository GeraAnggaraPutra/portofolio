import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadingScreen } from "@/components/loading-screen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gera Anggara Putra - Backend Engineer",
  description:
    "Gera Anggara Putra — Go backend engineer building reliable, production-grade systems across HRIS, payments, logistics, and distributed services.",
  openGraph: {
    title: "Gera Anggara Putra - Backend Engineer",
    description:
      "Go backend engineer. 3+ years shipping production systems across HRIS, payments, and distributed services.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Film-grain texture overlay — subtle premium feel */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0"
          style={{
            zIndex: 9990,
            backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.035'/></svg>")`,
            opacity: 0.6,
          }}
        />
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
