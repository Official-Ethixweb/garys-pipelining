import { ShieldCheck, Clock, Wrench, CircleCheck, Hammer, Award, Sparkle } from "lucide-react";

const items = [
  { Icon: ShieldCheck, label: "Licensed & Insured" },
  { Icon: Clock, label: "24/7 Emergency" },
  { Icon: Award, label: "Trenchless Specialists" },
  { Icon: Wrench, label: "Contractor Friendly" },
  { Icon: Hammer, label: "Trade Pricing Available" },
  { Icon: CircleCheck, label: "Written Warranty" },
];

const sparkles = [
  { top: "22%", left: "6%", size: "h-2 w-2", delay: "0s" },
  { top: "68%", left: "18%", size: "h-2.5 w-2.5", delay: "0.7s" },
  { top: "30%", left: "34%", size: "h-2 w-2", delay: "1.4s" },
  { top: "65%", left: "50%", size: "h-2.5 w-2.5", delay: "0.3s" },
  { top: "25%", left: "66%", size: "h-2 w-2", delay: "1.7s" },
  { top: "70%", left: "82%", size: "h-2.5 w-2.5", delay: "1s" },
  { top: "35%", left: "94%", size: "h-2 w-2", delay: "0.5s" },
];

function SparkleField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      {sparkles.map((s, i) => (
        <span
          key={i}
          className="header-twinkle absolute"
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        >
          <Sparkle className={`${s.size} fill-white/70 text-white/70`} />
        </span>
      ))}
    </div>
  );
}

function TrustItems() {
  return (
    <>
      {items.map(({ Icon, label }) => (
        <div key={label} className="flex shrink-0 items-center gap-2.5 px-8 text-[19px] text-white">
          <Icon className="h-4 w-4 shrink-0 text-white" />
          <span className="whitespace-nowrap font-medium text-white">{label}</span>
        </div>
      ))}
    </>
  );
}

export function TrustStrip() {
  return (
    <section aria-label="Trust signals" className="relative flex items-center overflow-hidden border-y border-border bg-primary py-[29px]">
      <SparkleField />
      <div className="marquee-track-rtl flex w-max shrink-0 items-center">
        <TrustItems />
        <TrustItems />
      </div>
    </section>
  );
}
