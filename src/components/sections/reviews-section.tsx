import { Star, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/lib/site-config";

const reviews = [
  {
    name: "Alicia Vermaele",
    body: "We had an outstanding experience with this pipeline and drain services team, and I highly recommend them. From the moment they arrived, Jason, Desmond, Ishmael, and Enrique were incredibly professional, fast, and communicative. They walked us through every step so we always knew what was happening. Their pricing was competitive, and the quality of their work was great. What impressed us most was how thoroughly they cleaned up afterward, you truly couldn't even tell they had been here.",
  },
  {
    name: "Kylie Barrett",
    body: "Couldn't recommend Gary's enough! We just moved into our first house two months ago and had our main sewer line clog, it ended up being an emergency situation. They were able to get out to us the next day, and finish the project within 6 hours. The supervisor, Jason, was so kind, knowledgable, and walked us through the entire process. His crew, Desmond and Ishmael, were so diligent and kept us updated throughout. Just great people!",
  },
  {
    name: "Ronald Imbert",
    body: "Had an awesome experience with Gary's Pipelining and can't recommend them enough! We needed sewer line replacement, and from start to finish, the whole team was fantastic. Jason came out first to scope the work and go over pricing, straightforward and very competitive. The digging crew went above and beyond, handling the work with great care and finding creative solutions for unexpected issues. Great people, great work, and no surprises.",
  },
  {
    name: "Brody",
    body: "Very happy with the job these guys got done around our house. It was a big one, over 120 feet of french drains at the foot of a retaining wall. Jason was transparent, real, and fair about the work that needed to be done, and the crew acted fast and found solutions. After completion, Jason reminded me the job is under warranty, simply great peace of mind. Overall, super happy with the job quality and would 100% recommend these guys.",
  },
  {
    name: "Bob Blumenthal",
    body: "A representative came out, assessed our drainage situation, and made recommendations on how to fix it. They sent a crew of 4 guys who finished the entire job in less than 5 hours, rerouting water from our gutter and resetting the pavers they'd lifted along the way. All workers were very courteous and respectful of our property, and the man in charge came out to inspect the work. We highly recommend this company.",
  },
];

const RATING = 4.5;
const REVIEW_COUNT = 10;
const MARQUEE_DURATION = "90s";

function StarRow({ rating, sizeClass = "h-4 w-4" }: { rating: number; sizeClass?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className={`relative inline-block ${sizeClass}`}>
            <Star className={`absolute inset-0 ${sizeClass} text-border-strong`} strokeWidth={1.5} />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={`${sizeClass} fill-yellow`} stroke="#001B82" strokeWidth={1.5} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="overflow-hidden py-24 md:py-32">
      <div className="container-px mx-auto max-w-[1400px]">
        <Reveal>
          <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <span className="chip">
                <Star className="h-3.5 w-3.5 fill-yellow" stroke="#001B82" strokeWidth={1.5} /> Verified Google reviews
              </span>
              <h2 className="mt-5 max-w-3xl text-balance text-4xl leading-[1.05] md:text-6xl">
                The work speaks. <span className="italic text-muted-foreground">So do our customers.</span>
              </h2>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="flex items-center gap-3">
                <GoogleMark className="h-8 w-8" />
                <StarRow rating={RATING} sizeClass="h-[25.6px] w-[25.6px]" />
              </div>
              <p className="text-[22.4px] text-muted-foreground">
                Based on <span className="font-semibold text-ink">{REVIEW_COUNT} reviews</span>
              </p>
              <a
                href={siteConfig.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[22.4px] font-medium text-primary link-underline"
              >
                Read reviews <ArrowUpRight className="h-[25.6px] w-[25.6px]" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="group relative mt-14 overflow-hidden">
          <div
            className="marquee-track-rtl flex w-max shrink-0 gap-6 group-hover:[animation-play-state:paused]"
            style={{ animationDuration: MARQUEE_DURATION }}
          >
            {[...reviews, ...reviews].map((r, i) => (
              <figure
                key={`${r.name}-${i}`}
                className="surface-card flex w-[360px] shrink-0 flex-col gap-5 p-6 sm:w-[410px]"
                style={{ border: "1px solid #001B82" }}
              >
                <StarRow rating={5} sizeClass="h-4 w-4" />
                <blockquote className="line-clamp-5 text-pretty text-base leading-relaxed text-foreground">
                  &ldquo;{r.body}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft text-base font-semibold text-primary">
                    {r.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-ink">{r.name}</div>
                    <div className="text-xs text-muted-foreground">Google review</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
