import { siteConfig } from "@/lib/site-config";

// Everything the email templates need to look "on brand." For this project it's
// sourced from site-config.ts (the repo's existing single source of truth for
// contact details), with optional env var overrides so this same mail library
// can be dropped into a future client project and re-skinned without touching code:
// just point MAIL_BRAND_* at the new company's name/logo/colors.
export const mailBrand = {
  companyName: process.env.MAIL_BRAND_NAME || siteConfig.name,
  shortName: process.env.MAIL_BRAND_SHORT_NAME || siteConfig.shortName,
  logoUrl: process.env.MAIL_BRAND_LOGO_URL || `${siteConfig.url}/brand/logo.png`,
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
