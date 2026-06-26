export const siteConfig = {
  name: "Gary's Pipelining & Drain Cleaning",
  legalName: "Gary's Pipelining and Drain Cleaning, LLC",
  shortName: "Gary's Pipelining",
  tagline: "Seattle's trusted sewer & drain specialists",
  description:
    "Trenchless sewer repair, pipe lining, hydro jetting, and 24/7 emergency drain service across the greater Seattle area. Licensed, insured, and trusted by homeowners and contractors.",
  url: "https://www.garyspipelining.com",
  phone: "(206) 535-8460",
  phoneHref: "tel:+12065358460",
  email: "office@garyspipelining.com",
  emailHref: "mailto:office@garyspipelining.com",
  license: "WA License #GARYSPC881RE",
  address: {
    line1: "14101 Interurban Ave S, Unit 78-B",
    city: "Tukwila",
    state: "WA",
    zip: "98168",
    full: "14101 Interurban Ave S, Unit 78-B, Tukwila, WA 98168",
  },
  hours: "Open 24 hours, 7 days a week",
  mapEmbedSrc:
    "https://www.google.com/maps?q=14101+Interurban+Ave+S+Unit+78-B+Tukwila+WA+98168&output=embed",
  googleReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=Gary%27s+Pipelining+%26+Drain+Cleaning+14101+Interurban+Ave+S+Tukwila+WA+98168",
} as const;

export const trustStats = [
  { value: "24/7", label: "Emergency response" },
  { value: "100%", label: "Licensed & insured crew" },
  { value: "Trenchless", label: "Our default method" },
] as const;
