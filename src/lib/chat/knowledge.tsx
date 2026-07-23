import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services, type Service } from "@/lib/content/services";
import { locations, type Location } from "@/lib/content/locations";
import { siteConfig } from "@/lib/site-config";

// A lightweight, keyword-scored knowledge base built directly from the same
// content that drives the service and location pages, so the chatbot's
// answers can never drift out of sync with what the site actually says.
// No LLM involved: entries are matched by weighted keyword overlap, see
// findBestMatch() in engine.tsx.

export type KnowledgeEntry = {
  id: string;
  /** Used for conversation-context tracking, e.g. "service:trenchless-sewer-repair" */
  topic: string;
  keywords: string[];
  weight?: number;
  reply: () => ReactNode;
  /** Short plain-text summary of this answer, used in the lead email's transcript (bot replies are rich JSX, not plain strings). */
  logLabel: string;
};

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "do", "does", "did", "you", "your", "yours", "i", "im", "my", "me", "to", "for",
  "of", "in", "on", "at", "and", "or", "what", "whats", "how", "can", "could", "will", "would", "it", "its", "that",
  "this", "with", "about", "if", "have", "has", "had", "be", "been", "was", "were", "there", "here", "please",
]);

export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ");
}

export function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

// Handles cases where the site copy uses a different word than a visitor
// would ("hydro jetting" vs. "jet", "rooter service" vs. "roots"). Keyed by
// service slug so it stays attached to the right entry even as content changes.
const SERVICE_SYNONYMS: Record<string, string[]> = {
  "trenchless-sewer-repair": ["trenchless", "lining", "liner", "lined", "cipp", "reline"],
  "pipe-bursting": ["bursting", "burst", "upsize"],
  "sewer-replacement": ["replace", "replacement", "replacing"],
  "water-main-repair": ["water main", "water line", "waterline", "leak", "leaking", "pressure"],
  "sewer-inspection": ["camera", "inspection", "scope", "sonde", "footage"],
  "drain-cleaning": ["clog", "clogged", "backup", "backed up", "slow drain"],
  "hydro-jetting": ["jetting", "jet", "jetted", "grease", "scale"],
  "rooter-service": ["roots", "root", "rooter", "snake"],
  "sump-pump-installation": ["sump", "flooding", "flooded", "basement", "groundwater", "crawl space"],
};

function serviceKeywords(service: Service): string[] {
  return [
    service.name.toLowerCase(),
    ...service.slug.split("-"),
    service.category.toLowerCase(),
    ...(SERVICE_SYNONYMS[service.slug] ?? []),
  ];
}

function buildServiceEntries(): KnowledgeEntry[] {
  return services.map((service) => ({
    id: `service:${service.slug}`,
    topic: `service:${service.slug}`,
    keywords: serviceKeywords(service),
    weight: 2,
    logLabel: `Explained ${service.name}`,
    reply: () => (
      <>
        <p>{service.shortDescription}</p>
        {service.benefits[0] && (
          <p className="mt-2">
            <strong>{service.benefits[0].title}:</strong> {service.benefits[0].body}
          </p>
        )}
        <Link
          href={`/services/${service.slug}`}
          className="mt-2 inline-flex items-center gap-1 font-semibold text-primary link-underline"
        >
          More on {service.name} <ArrowUpRight className="h-3 w-3" />
        </Link>
      </>
    ),
  }));
}

function buildServiceFaqEntries(): KnowledgeEntry[] {
  const entries: KnowledgeEntry[] = [];
  for (const service of services) {
    const synonyms = SERVICE_SYNONYMS[service.slug] ?? [];
    for (const [index, faq] of service.faqs.entries()) {
      entries.push({
        id: `faq:${service.slug}:${index}`,
        topic: `service:${service.slug}`,
        keywords: [...tokenize(faq.q), ...synonyms],
        weight: 1,
        logLabel: `Answered: "${faq.q}"`,
        reply: () => (
          <>
            <p>{faq.a}</p>
            <Link
              href={`/services/${service.slug}`}
              className="mt-2 inline-flex items-center gap-1 font-semibold text-primary link-underline"
            >
              More on {service.name} <ArrowUpRight className="h-3 w-3" />
            </Link>
          </>
        ),
      });
    }
  }
  return entries;
}

function buildLocationEntries(): KnowledgeEntry[] {
  return locations.map((location: Location) => ({
    id: `location:${location.slug}`,
    topic: `location:${location.slug}`,
    keywords: [location.city.toLowerCase(), location.county.toLowerCase().replace(" county", "")],
    weight: 3,
    logLabel: `Confirmed service area: ${location.city}`,
    reply: () => (
      <>
        <p>
          Yes, we serve {location.city}
          {location.isHQ ? ", it's actually where our shop is based." : `, ${location.driveTime ?? "regularly"} from our Tukwila base.`}
        </p>
        {location.localNotes[0] && <p className="mt-2 text-muted-foreground">{location.localNotes[0]}</p>}
        <Link
          href={`/service-area/${location.slug}`}
          className="mt-2 inline-flex items-center gap-1 font-semibold text-primary link-underline"
        >
          {location.city} service details <ArrowUpRight className="h-3 w-3" />
        </Link>
      </>
    ),
  }));
}

function joinWithAnd(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return items.join(" and ");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

const STATIC_ENTRIES: KnowledgeEntry[] = [
  {
    id: "services-overview",
    topic: "services-overview",
    keywords: ["service", "services", "offer", "offerings", "provide", "help with"],
    weight: 2,
    logLabel: "Listed all services",
    reply: () => (
      <>
        We handle {joinWithAnd(services.map((s) => s.name))}.{" "}
        <Link href="/services" className="inline-flex items-center gap-1 font-semibold text-primary link-underline">
          See all services <ArrowUpRight className="h-3 w-3" />
        </Link>
      </>
    ),
  },
  {
    id: "areas-overview",
    topic: "areas-overview",
    keywords: ["area", "areas", "location", "locations", "city", "cities", "region", "where", "serve"],
    weight: 2,
    logLabel: "Listed service area coverage",
    reply: () => (
      <>
        We&apos;re based in {locations.find((l) => l.isHQ)?.city ?? "Tukwila"} and serve{" "}
        {joinWithAnd(locations.map((l) => l.city))}, plus much of the greater Puget Sound region.{" "}
        <Link href="/service-area" className="inline-flex items-center gap-1 font-semibold text-primary link-underline">
          Check your city <ArrowUpRight className="h-3 w-3" />
        </Link>
      </>
    ),
  },
  {
    id: "hours",
    topic: "hours",
    keywords: ["hour", "hours", "open", "24", "247", "time", "weekend", "sunday", "holiday"],
    weight: 2,
    logLabel: "Answered a question about hours",
    reply: () => <>We&apos;re answered 24 hours a day, 7 days a week, including the emergency line, weekends and holidays included.</>,
  },
  {
    id: "warranty",
    topic: "warranty",
    keywords: ["warrant", "warranty", "guarantee", "guaranteed"],
    weight: 2,
    logLabel: "Answered a question about the warranty",
    reply: () => (
      <>Trenchless work carries a written workmanship warranty. Ask your technician for the specifics on your job.</>
    ),
  },
  {
    id: "pricing-philosophy",
    topic: "pricing",
    keywords: ["price", "prices", "pricing", "cost", "costs", "expensive", "cheap", "afford", "budget"],
    weight: 2,
    logLabel: "Explained pricing philosophy",
    reply: () => (
      <>
        Every job starts with a camera inspection, then a written, flat-rate estimate before any work begins. The
        number we quote is the number you pay, no surprise change orders.
      </>
    ),
  },
  {
    id: "insurance-permits",
    topic: "permits",
    keywords: ["permit", "permits", "licensed", "insured", "insurance", "bonded"],
    weight: 2,
    logLabel: "Answered a question about licensing/permits",
    reply: () => (
      <>
        We&apos;re fully licensed and insured ({siteConfig.license}), and we pull and manage permits for sewer
        lateral work as part of the job.
      </>
    ),
  },
];

let cachedKnowledgeBase: KnowledgeEntry[] | null = null;

export function getKnowledgeBase(): KnowledgeEntry[] {
  if (!cachedKnowledgeBase) {
    cachedKnowledgeBase = [...STATIC_ENTRIES, ...buildServiceEntries(), ...buildServiceFaqEntries(), ...buildLocationEntries()];
  }
  return cachedKnowledgeBase;
}

/** Turns a "service:hydro-jetting" / "location:tacoma-wa" topic id back into a human label for lead emails. */
export function topicLabel(topic: string): string {
  if (topic.startsWith("service:")) {
    const slug = topic.slice("service:".length);
    return services.find((s) => s.slug === slug)?.name ?? slug;
  }
  if (topic.startsWith("location:")) {
    const slug = topic.slice("location:".length);
    return locations.find((l) => l.slug === slug)?.city ?? slug;
  }
  return topic.replace(/-/g, " ");
}

export function findBestMatch(input: string, entries: KnowledgeEntry[] = getKnowledgeBase()): KnowledgeEntry | null {
  const normalizedInput = normalizeText(input);
  const tokens = new Set(tokenize(input));
  if (tokens.size === 0) return null;

  let best: { entry: KnowledgeEntry; score: number } | null = null;
  for (const entry of entries) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (keyword.includes(" ")) {
        if (normalizedInput.includes(keyword)) score += 3 * (entry.weight ?? 1);
      } else if (tokens.has(keyword)) {
        score += (entry.weight ?? 1);
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }

  return best && best.score >= 2 ? best.entry : null;
}
