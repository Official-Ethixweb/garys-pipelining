"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, ArrowUpRight, Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./logo";
import { services } from "@/lib/content/services";
import { locations } from "@/lib/content/locations";
import { siteConfig } from "@/lib/site-config";

const navGroups = [
  {
    label: "Services",
    href: "/services",
    items: services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
  },
  {
    label: "Service Areas",
    href: "/service-area",
    items: locations.map((l) => ({ label: `${l.city}, WA`, href: `/service-area/${l.slug}` })),
  },
];

const homeLink = { label: "Home", href: "/" };

const simpleLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function NavDropdown({ label, href, items }: { label: string; href: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-2xl border border-border bg-surface-elevated p-2 shadow-[var(--shadow-elevated)]"
        >
          <Link
            href={href}
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-primary hover:bg-secondary"
          >
            View all {label.toLowerCase()}
          </Link>
          <div className="mt-1 grid max-h-80 gap-0.5 overflow-y-auto">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3.5 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      setShowBadge(scrollPercent < 5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-4"}`}>
      <div className="container-px mx-auto max-w-[1400px]">
        <div
          className={`glass grid grid-cols-[auto_1fr_auto] items-center gap-6 rounded-[1.75rem] px-4 py-3 transition-all duration-500 ${
            scrolled ? "shadow-[var(--shadow-elevated)]" : "shadow-[var(--shadow-soft)]"
          }`}
        >
          <div onDoubleClick={() => router.push("/")}>
            <Logo />
          </div>

          <nav aria-label="Primary" className="hidden items-center justify-center gap-1 lg:flex">
            <Link
              href={homeLink.href}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {homeLink.label}
            </Link>
            {navGroups.map((g) => (
              <NavDropdown key={g.href} {...g} />
            ))}
            {simpleLinks.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="relative flex items-center gap-2">
            <a
              href={siteConfig.phoneHref}
              className="hidden items-center gap-2 rounded-full border border-border-strong px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:inline-flex"
            >
              <Phone className="h-4 w-4" />
              <span>{siteConfig.phone}</span>
            </a>
            <Link href="/contact" className="btn-primary hidden sm:inline-flex">
              Free estimate
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <span
              className={`pointer-events-none absolute right-0 top-full mt-2 hidden whitespace-nowrap rounded-lg bg-primary-deep px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow shadow-[var(--shadow-soft)] transition-all duration-300 sm:block ${
                showBadge ? "opacity-100 translate-y-0" : "-translate-y-1 opacity-0"
              }`}
            >
              Contractor partnership welcome
            </span>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-foreground lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-2 max-h-[80vh] overflow-y-auto rounded-2xl bg-surface-elevated p-3 shadow-[var(--shadow-elevated)] lg:hidden">
            <nav className="flex flex-col">
              <Link href={homeLink.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-secondary">
                {homeLink.label}
              </Link>
              <Link href="/services" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-secondary">
                Services
              </Link>
              <Link href="/service-area" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-secondary">
                Service Areas
              </Link>
              {simpleLinks.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-secondary">
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a href={siteConfig.phoneHref} className="btn-ghost justify-center">
                <Phone className="h-4 w-4" /> Call
              </a>
              <Link href="/contact" className="btn-primary justify-center">
                Estimate <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
