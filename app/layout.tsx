import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ACADEMY } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: `${ACADEMY.tagline} | ${ACADEMY.name}`,
  description: "Find out your English level (CEFR) in a few minutes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jakarta.variable} flex min-h-screen flex-col bg-white font-sans`}
      >
        <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-2">
            <Image
              src="/logo.png"
              alt={ACADEMY.name}
              width={240}
              height={192}
              priority
              className="h-14 w-auto sm:h-16"
            />
            <span className="rounded-full bg-aqua-soft px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-navy sm:text-xs">
              English Placement Test
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:py-14">
          {children}
        </main>

        <footer className="py-6 text-center text-sm text-slate-400">
          © {ACADEMY.name}
        </footer>
      </body>
    </html>
  );
}