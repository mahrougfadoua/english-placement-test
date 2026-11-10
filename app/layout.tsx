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

function UKFlag() {
  return (
    <svg
      viewBox="0 0 60 30"
      className="h-4 w-6 flex-none rounded-[3px] shadow-sm ring-1 ring-black/10"
      aria-hidden="true"
    >
      <clipPath id="uk-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="uk-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#uk-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jakarta.variable} flex min-h-screen flex-col bg-white font-sans`}
      >
        <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur">
          {/* UK-flag accent stripe */}
          <div className="flex h-1 w-full" aria-hidden="true">
            <span className="flex-1 bg-[#012169]" />
            <span className="flex-1 bg-white" />
            <span className="flex-1 bg-[#C8102E]" />
          </div>

          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-2">
            <Image
              src="/logo.png"
              alt={ACADEMY.name}
              width={240}
              height={192}
              priority
              className="h-14 w-auto sm:h-16"
            />
            <span className="flex items-center gap-2 rounded-full bg-aqua-soft py-1.5 pe-3.5 ps-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-navy sm:text-xs">
              <UKFlag />
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