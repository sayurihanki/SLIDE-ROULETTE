"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic2 } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { href: "/how-to-play", label: "How to Play" },
  { href: "/hosting", label: "Hosting" },
  { href: "/slide-making", label: "Slide Tips" },
  { href: "/examples", label: "Examples" },
];

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/play")) {
    return children;
  }

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Slide Roulette home">
          <span className="brand-mark">
            <Mic2 size={18} aria-hidden="true" />
          </span>
          <span>Slide Roulette</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="nav-cta" href="/generate">
          Generate Deck
        </Link>
      </header>
      {children}
      <footer className="footer">
        <div>
          <strong>Slide Roulette</strong>
          <span>Original event tool for surprise slides and brave presenters.</span>
        </div>
        <Link href="/generate">Make a deck</Link>
      </footer>
    </>
  );
}
