"use client";

import Link from "next/link";
import { Home as HomeIcon, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Location } from "@/lib/content/locations";

const EASE = [0.22, 1, 0.36, 1] as const;

const PIN_GLOW_YELLOW =
  "0 0 0 1px color-mix(in oklab, var(--color-yellow) 65%, transparent), 0 0 28px -2px color-mix(in oklab, var(--color-yellow) 80%, transparent)";
const PIN_GLOW_BLUE =
  "0 0 0 1px color-mix(in oklab, white 55%, transparent), 0 0 22px -2px color-mix(in oklab, var(--color-primary) 75%, white 25%)";

/** Presentational layout positions only (percent of panel), not real coordinates. */
const PIN_POSITIONS: Record<string, { x: number; y: number }> = {
  "seattle-wa": { x: 40, y: 10 },
  "bellevue-wa": { x: 70, y: 20 },
  "renton-wa": { x: 58, y: 44 },
  "tukwila-wa": { x: 44, y: 50 },
  "federal-way-wa": { x: 40, y: 70 },
  "tacoma-wa": { x: 26, y: 88 },
};

/** Fastest-response cluster vs the wider coverage region, derived from driveTime. */
function tierOf(location: Location): "primary" | "coverage" {
  if (location.isHQ) return "primary";
  const minutes = parseInt(location.driveTime?.match(/\d+/)?.[0] ?? "99", 10);
  return minutes <= 15 ? "primary" : "coverage";
}

function LandShape() {
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-[0.08]">
      <path
        d="M20,6 C8,16 3,36 11,52 C3,66 13,86 33,93 C50,99 66,94 76,80 C92,76 97,58 87,44 C95,30 83,12 64,9 C49,1 30,-3 20,6 Z"
        fill="white"
      />
    </svg>
  );
}

function Ripple({ color }: { color: string }) {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-0 rounded-full"
      style={{ border: `1.5px solid ${color}` }}
      initial={{ opacity: 0.6, scale: 0.85 }}
      animate={{ opacity: 0, scale: 2 }}
      transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity }}
    />
  );
}

export function CoverageMapVisual({
  locations,
  activeSlug,
  onActivate,
  className = "",
}: {
  locations: Location[];
  activeSlug: string | null;
  onActivate: (slug: string) => void;
  className?: string;
}) {
  const positioned = locations.filter((l) => PIN_POSITIONS[l.slug]);
  const primary = positioned.filter((l) => tierOf(l) === "primary");

  const centroid = (set: Location[]) => {
    if (set.length === 0) return null;
    const sum = set.reduce(
      (acc, l) => ({ x: acc.x + PIN_POSITIONS[l.slug].x, y: acc.y + PIN_POSITIONS[l.slug].y }),
      { x: 0, y: 0 }
    );
    return { x: sum.x / set.length, y: sum.y / set.length };
  };
  const coverageCenter = centroid(positioned);
  const primaryCenter = centroid(primary);

  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] p-7 sm:p-10 ${className}`}
      style={{ background: "var(--gradient-hero)" }}
    >
      <LandShape />
      <div aria-hidden className="absolute inset-0 grid-bg opacity-40" />
      <div aria-hidden className="absolute inset-0 mesh-overlay opacity-60" />

      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <span className="glass-dark inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-medium text-white/85">
          <MapPin className="h-3.5 w-3.5" style={{ color: "var(--color-yellow)" }} />
          {positioned.length} cities &middot; greater Seattle area
        </span>
        <span className="glass-dark inline-flex items-center gap-3 rounded-full px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white/70">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "var(--color-yellow)" }} /> Fastest response
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-2 rounded-full border border-white/60" /> Coverage area
          </span>
        </span>
      </div>

      <div className="relative mt-7 aspect-[6/5] w-full sm:mt-9">
        {coverageCenter && (
          <div
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: `${coverageCenter.x}%`,
              top: `${coverageCenter.y}%`,
              width: "112%",
              height: "112%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 30%, transparent) 0%, transparent 68%)",
            }}
          />
        )}
        {primaryCenter && (
          <div
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: `${primaryCenter.x}%`,
              top: `${primaryCenter.y}%`,
              width: "56%",
              height: "56%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--color-yellow) 30%, transparent) 0%, transparent 72%)",
              border: "1px dashed color-mix(in oklab, var(--color-yellow) 35%, transparent)",
            }}
          />
        )}

        {positioned.map((location) => {
          const pos = PIN_POSITIONS[location.slug];
          const isActive = location.slug === activeSlug;
          const isHQ = !!location.isHQ;
          const tier = tierOf(location);
          const tierColor = tier === "primary" ? "var(--color-yellow)" : "white";
          return (
            <Link
              key={location.slug}
              href={`/service-area/${location.slug}`}
              aria-label={`View service area details for ${location.city}, WA${isHQ ? ", home base" : ""}`}
              onMouseEnter={() => onActivate(location.slug)}
              onFocus={() => onActivate(location.slug)}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            >
              <span className="relative grid h-9 w-9 place-items-center sm:h-10 sm:w-10">
                <AnimatePresence>
                  {(isActive || isHQ) && (
                    <Ripple color={isHQ ? "var(--color-yellow)" : tier === "primary" ? "var(--color-yellow)" : "rgba(255,255,255,0.55)"} />
                  )}
                </AnimatePresence>
                <motion.span
                  animate={{ scale: isActive ? 1.18 : 1 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="relative grid h-full w-full place-items-center rounded-full"
                  style={{
                    border: isHQ ? "none" : `1.5px solid color-mix(in oklab, ${tierColor} 55%, transparent)`,
                    background: isHQ ? "var(--color-yellow)" : isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                    color: isHQ ? "var(--color-yellow-foreground)" : "white",
                    boxShadow: isActive ? (isHQ || tier === "primary" ? PIN_GLOW_YELLOW : PIN_GLOW_BLUE) : "none",
                  }}
                >
                  {isHQ ? (
                    <HomeIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </motion.span>
              </span>
              <span
                className="pointer-events-none whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider transition-all duration-200 sm:text-[10px]"
                style={{
                  background: isActive ? "rgba(8, 14, 40, 0.9)" : "rgba(8, 14, 40, 0.55)",
                  color: isActive ? "var(--color-yellow)" : "rgba(255,255,255,0.8)",
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                }}
              >
                {location.city}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
