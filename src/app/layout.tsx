import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
