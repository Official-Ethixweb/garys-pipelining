"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { FaqItem } from "@/lib/content/services";

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-6 py-7 text-left"
      >
        <h3 className="text-xl font-medium tracking-tight text-ink md:text-2xl" style={{ fontFamily: "var(--font-sans)" }}>
          {q}
        </h3>
        <span
          aria-hidden
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-foreground transition-colors ${
            open ? "bg-primary text-primary-foreground border-primary" : ""
          }`}
        >
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div className="grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="min-h-0 overflow-hidden">
          <p className="max-w-3xl pb-7 text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-base">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="rounded-[2rem] border border-border bg-surface-elevated px-6 md:px-10">
      {items.map((f, i) => (
        <Item
          key={f.q}
          q={f.q}
          a={f.a}
          open={openIndex === i}
          onToggle={() => setOpenIndex((current) => (current === i ? null : i))}
        />
      ))}
    </div>
  );
}
