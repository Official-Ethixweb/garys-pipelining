import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone, Search } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden py-32 md:py-40">
        <div aria-hidden className="absolute inset-0 -z-10 grid-bg" />
        <div className="container-px mx-auto max-w-[1400px] text-center">
          <span className="chip mx-auto">404</span>
          <h1 className="mx-auto mt-5 max-w-2xl text-balance text-[40px] leading-[1.05] tracking-tight md:text-6xl">
            That pipe doesn&rsquo;t lead anywhere.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            The page you&rsquo;re looking for has moved or never existed. Head back home, browse our services, or
            call us directly.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="btn-primary">
              Back to home <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/services" className="btn-ghost">
              <Search className="h-4 w-4" /> Browse services
            </Link>
            <a href={siteConfig.phoneHref} className="btn-ghost">
              <Phone className="h-4 w-4" /> {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
