import Link from "next/link";
import { Ticket, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function StickyContactTab() {
  return (
    <div className="fixed right-0 top-28 z-40 hidden flex-col gap-2 lg:flex">
      <Link
        href="/contact"
        className="group flex flex-col items-center gap-1.5 rounded-l-2xl border-y-2 border-l-2 border-dashed border-yellow-foreground/20 bg-yellow px-3 py-3.5 text-yellow-foreground shadow-[var(--shadow-elevated)] transition-transform duration-300 hover:-translate-x-1"
      >
        <Ticket className="h-4 w-4" />
        <span className="text-center text-[11px] font-bold uppercase leading-tight tracking-wider">
          Get A
          <br />
          Free
          <br />
          Estimate
        </span>
      </Link>
      <a
        href={siteConfig.phoneHref}
        className="group flex flex-col items-center gap-1.5 rounded-l-2xl border-y-2 border-l-2 border-dashed border-white/25 bg-emergency px-3 py-4 text-white shadow-[var(--shadow-elevated)] transition-transform duration-300 hover:-translate-x-1"
      >
        <Phone className="h-4 w-4" />
        <span className="text-center text-[11px] font-bold uppercase leading-tight tracking-wider">
          Call
          <br />
          Now
        </span>
      </a>
    </div>
  );
}
