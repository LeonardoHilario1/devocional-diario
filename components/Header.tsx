"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/devocionais", label: "Devocionais Diários" },
  { href: "/teologia", label: "Teologia & Doutrina" },
  { href: "/vida-sociedade", label: "Vida & Sociedade" },
  { href: "/sobre", label: "Sobre" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-paper-light/90 backdrop-blur dark:border-brand-900/40 dark:bg-paper-dark/90">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold text-brand-700 dark:text-brand-200">
          {siteConfig.nome}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-300 ${
                  active
                    ? "text-brand-700 dark:text-brand-300"
                    : "text-ink-light/80 dark:text-ink-dark/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 text-brand-700 md:hidden dark:border-brand-800 dark:text-brand-200"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-brand-100 px-4 pb-4 md:hidden dark:border-brand-900/40">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-ink-light/90 hover:bg-brand-50 dark:text-ink-dark/90 dark:hover:bg-brand-900/30"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
