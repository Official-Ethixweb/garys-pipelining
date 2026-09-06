import { Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { specials, specialsFootnotes, type Special } from "@/lib/content/specials";
import { ServiceIcon } from "@/components/ui/service-icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

function footnoteMark(footnote: Special["footnote"]) {
  return footnote === "cleanout" ? "**" : "*";
}

export function SpecialsGrid() {
  const usedFootnotes = [...new Set(specials.map((s) => s.footnote).filter((f): f is NonNullable<Special["footnote"]> => Boolean(f)))];

  return (
    <>
      <RevealGroup className="grid gap-6 md:grid-cols-3" stagger={0.08}>
        {specials.map((s) => {
          const card = (
            <div className="surface-card surface-card-hover group relative flex h-full flex-col overflow-hidden">
              <div className="relative overflow-hidden px-7 pb-8 pt-7" style={{ background: "var(--gradient-hero)" }}>
                <div aria-hidden className="absolute inset-0 mesh-overlay opacity-25" />
                <div className="relative flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-yellow text-yellow-foreground">
                    <ServiceIcon name={s.icon} className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-yellow">Limited time</span>
                </div>
                <div className="relative mt-6 flex items-start font-display text-5xl leading-none text-white">
                  {s.price}
                  {s.footnote && <sup className="ml-0.5 mt-1 text-lg font-semibold text-white/60">{footnoteMark(s.footnote)}</sup>}
                </div>
              </div>

              <div aria-hidden className="relative border-t-2 border-dashed" style={{ borderColor: "color-mix(in oklab, white 20%, transparent)" }}>
                <span className="absolute -top-[9px] left-6 h-[18px] w-[18px] rounded-full" style={{ background: "var(--color-surface-elevated)" }} />
                <span className="absolute -top-[9px] right-6 h-[18px] w-[18px] rounded-full" style={{ background: "var(--color-surface-elevated)" }} />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-2xl tracking-tight text-ink">{s.title}</h3>
                <p className="mt-3 flex-1 text-pretty text-[15px] leading-relaxed text-muted-foreground">{s.description}</p>
                {s.href && (
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary link-underline">
                    {s.ctaLabel ?? "Learn more"} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          );

          return (
            <RevealItem key={s.id}>
              {s.href ? (
                <Link href={s.href} className="block h-full">
                  {card}
                </Link>
              ) : (
                card
              )}
            </RevealItem>
          );
        })}
      </RevealGroup>

      <Reveal className="mt-12 flex flex-col items-center gap-4 text-center">
        <a href={siteConfig.phoneHref} className="btn-yellow w-fit">
          <Phone className="h-4 w-4" /> Call {siteConfig.phone} to claim
        </a>
        <ul className="max-w-2xl text-xs text-muted-foreground">
          {usedFootnotes.map((f) => (
            <li key={f}>
              {footnoteMark(f)} {specialsFootnotes[f]}
            </li>
          ))}
        </ul>
      </Reveal>
    </>
  );
}

export function SpecialsSection() {
  return (
    <section aria-labelledby="specials-heading" className="relative overflow-hidden py-20 md:py-24" style={{ background: "var(--color-surface)" }}>
      <div className="container-px mx-auto max-w-[1400px]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="chip" style={{ background: "var(--color-yellow)", color: "var(--color-yellow-foreground)", border: "none" }}>
            This month&rsquo;s coupons
          </span>
          <h2 id="specials-heading" className="mt-5 text-balance text-4xl leading-[1.05] md:text-6xl">
            Monthly savings, no paper coupon to dig up.
          </h2>
          <p className="mt-6 text-pretty text-lg text-muted-foreground">
            Mention it when you call or book online, coupons refresh every month.
          </p>
          <Link href="/coupons" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary link-underline">
            View all coupons <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>

        <div className="mt-14">
          <SpecialsGrid />
        </div>
      </div>
    </section>
  );
}
