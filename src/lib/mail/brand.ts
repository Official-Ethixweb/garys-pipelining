import { siteConfig } from "@/lib/site-config";

// Everything the email templates need to look "on brand." For this project it's
// sourced from site-config.ts (the repo's existing single source of truth for
// contact details), with optional env var overrides so this same mail library
// can be dropped into a future client project and re-skinned without touching code:
// just point MAIL_BRAND_* at the new company's name/logo/colors.

// Content-ID the logo is attached under when embedded directly in the email
// (see send.ts). Embedding beats linking to a remote URL: it renders in every
// client, including Outlook desktop, and never depends on the site's domain
// being live or reachable.
export const LOGO_CID = "brand-logo";

const logoUrlOverride = process.env.MAIL_BRAND_LOGO_URL;

export const mailBrand = {
  companyName: process.env.MAIL_BRAND_NAME || siteConfig.name,
  shortName: process.env.MAIL_BRAND_SHORT_NAME || siteConfig.shortName,
  // If MAIL_BRAND_LOGO_URL is set, link to it directly. Otherwise the bytes
  // baked into logo-asset.ts (source: public/brand/logo-email.png) are
  // embedded as a cid: attachment, see send.ts. That PNG is a rasterized copy
  // of the site's source SVG (public/brand/Logo without mascot.svg), not the
  // SVG itself: SVG support in email clients (Outlook in particular) is
  // unreliable. Regenerate logo-asset.ts with sharp if the source SVG changes.
  logoSrc: logoUrlOverride || `cid:${LOGO_CID}`,
  siteUrl: siteConfig.url,
  primaryColor: process.env.MAIL_BRAND_PRIMARY_COLOR || "#00219e",
  primaryDeepColor: process.env.MAIL_BRAND_PRIMARY_DEEP_COLOR || "#001b82",
  accentColor: process.env.MAIL_BRAND_ACCENT_COLOR || "#ffff4b",
  phone: siteConfig.phone,
  phoneHref: siteConfig.phoneHref,
  email: siteConfig.email,
  address: siteConfig.address.full,
  hours: siteConfig.hours,
} as const;
