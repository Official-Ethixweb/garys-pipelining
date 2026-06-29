"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { CoverageMapVisual } from "./coverage-map-visual";
import type { Location } from "@/lib/content/locations";
import { siteConfig } from "@/lib/site-config";

export function HomeCoverageSection({ locations }: { locations: Location[] }) {
  const defaultSlug = locations.find((l) => l.isHQ)?.slug ?? locations[0]?.slug ?? null;
  const [activeSlug, setActiveSlug] = useState<string | null>(defaultSlug);
  const countyCount = new Set(locations.map((l) => l.county)).size;

  return (
    <section className="relative py-24 md:py-32">
      <div className="container-px mx-auto max-w-[1400px]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <CoverageMapVisual locations={locations} activeSlug={activeSlug} onActivate={setActiveSlug} />

          <div>
            <span className="chip">Service area</span>
            <h2 className="mt-5 text-balance text-4xl leading-[1.05] md:text-5xl">
              Proudly covering the <span className="italic text-primary">greater Seattle area.</span>
            </h2>
            <p className="mt-6 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground">
              Based in Tukwila, our crews run regular routes across King and Pierce counties, with the same
              trenchless-first approach and 24/7 emergency dispatch in every city we serve.
            </p>

            <div className="mt-9 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { k: String(locations.length), v: "Cities served" },
                { k: String(countyCount), v: "Counties covered" },
                { k: "24/7", v: "Emergency dispatch" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="break-words font-display text-2xl text-ink sm:text-3xl">{s.k}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-2">
              {locations.map((l) => (
                <Link
                  key={l.slug}
                  href={`/service-area/${l.slug}`}
                  onMouseEnter={() => setActiveSlug(l.slug)}
                  onFocus={() => setActiveSlug(l.slug)}
                  className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
                    l.slug === activeSlug ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  {l.city}
                </Link>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/service-area" className="btn-primary">
                Explore all service areas <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={siteConfig.phoneHref} className="btn-ghost">
                <Phone className="h-4 w-4" /> {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
