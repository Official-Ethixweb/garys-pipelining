"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { reviews, type Review } from "@/lib/content/reviews";
import { StarRow, GoogleMark } from "@/components/ui/google-rating";

const INTERVAL_MS = 4000;
const EASE = [0.22, 1, 0.36, 1] as const;

function ReviewCard({ review, compact = false }: { review: Review; compact?: boolean }) {
  return (
    <div
      className={`flex h-full flex-col rounded-[1.75rem] border border-white/15 bg-white/[0.07] shadow-[var(--shadow-elevated)] backdrop-blur-sm ${
        compact ? "gap-3 p-4" : "gap-4 p-6"
      }`}
    >
      <div className="flex items-center justify-between">
        <StarRow rating={5} sizeClass={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        <GoogleMark className={compact ? "h-4 w-4 shrink-0" : "h-5 w-5 shrink-0"} />
      </div>
      <blockquote
        className={`flex-1 text-pretty leading-relaxed text-white/90 ${compact ? "text-[13px]" : "text-[15px]"}`}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: compact ? 5 : 6,
          overflow: "hidden",
        }}
      >
        &ldquo;{review.body}&rdquo;
      </blockquote>
      <div className={`flex items-center gap-3 border-t border-white/10 ${compact ? "pt-3" : "pt-4"}`}>
        <span
          className={`grid shrink-0 place-items-center rounded-full bg-yellow font-semibold text-yellow-foreground ${
            compact ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"
          }`}
        >
          {review.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <div className={`truncate font-semibold text-white ${compact ? "text-xs" : "text-sm"}`}>{review.name}</div>
          <div className={`text-white/55 ${compact ? "text-[10px]" : "text-xs"}`}>Verified Google review</div>
        </div>
      </div>
    </div>
  );
}

function Dots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Show review ${i + 1} of ${count}`}
          aria-current={i === active}
          onClick={() => onSelect(i)}
          className="grid h-5 w-5 place-items-center"
        >
          <span className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-5 bg-yellow" : "w-1.5 bg-white/30"}`} />
        </button>
      ))}
    </div>
  );
}

/**
 * Auto-advancing testimonial carousel. `orientation` controls the slide axis,
 * vertical for the dark estimate panel (desktop), horizontal for the stacked
 * mobile/tablet layout, both sharing the same data, timing, and controls.
 */
export function TestimonialCarousel({
  className = "",
  orientation = "vertical",
}: {
  className?: string;
  orientation?: "vertical" | "horizontal";
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % reviews.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, index]);

  const axis = orientation === "vertical" ? "y" : "x";
  const offset = 28;
  const variants = {
    enter: { opacity: 0, [axis]: offset },
    center: { opacity: 1, [axis]: 0 },
    exit: { opacity: 0, [axis]: -offset },
  };

  const isHorizontal = orientation === "horizontal";
  const visibleReviews = isHorizontal
    ? [reviews[index], reviews[(index + 1) % reviews.length]]
    : [reviews[index]];

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={isHorizontal ? "relative h-[260px] overflow-hidden" : "relative h-[340px] overflow-hidden sm:h-[320px]"}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={reducedMotion ? { opacity: 0 } : variants.enter}
            animate={reducedMotion ? { opacity: 1 } : variants.center}
            exit={reducedMotion ? { opacity: 0 } : variants.exit}
            transition={{ duration: reducedMotion ? 0.15 : 0.45, ease: EASE }}
            className={isHorizontal ? "absolute inset-0 grid grid-cols-2 gap-4" : "absolute inset-0"}
          >
            {visibleReviews.map((r, i) => (
              <ReviewCard key={`${r.name}-${i}`} review={r} compact={isHorizontal} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-5">
        <Dots count={reviews.length} active={index} onSelect={setIndex} />
      </div>
    </div>
  );
}
