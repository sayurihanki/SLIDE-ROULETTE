"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Mic2, X } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { href: "/how-to-play", label: "How to Play" },
  { href: "/hosting", label: "Hosting" },
  { href: "/slide-making", label: "Slide Tips" },
  { href: "/examples", label: "Examples" },
];

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
        <nav
          id="primary-nav"
          className={`nav-links${menuOpen ? " is-open" : ""}`}
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="nav-menu-button"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <>
              <X size={20} aria-hidden="true" />
              <span className="sr-only">Close menu</span>
            </>
          ) : (
            <>
              <Menu size={20} aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </>
          )}
        </button>
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
