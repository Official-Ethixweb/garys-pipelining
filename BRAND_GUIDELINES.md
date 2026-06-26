# Gary's Pipelining & Drain Cleaning — Brand Guidelines

This document is the **authoritative reference** for brand and creative
direction on this project. If anything elsewhere (a brief, a chat
message, a code comment) appears to conflict with this document, stop
and confirm with the user before acting. The rules below exist because
an earlier attempt to apply a creative-direction brief was misread as
license to redesign the logo; that change was reverted immediately and
this document was written to make sure it never happens again.

## 1. The Logo Is Not Up For Redesign

The existing Gary's Pipelining logo (the Space Ghost-style superhero
mark, navy/yellow/red/white) **is the official brand identity**. It must
never be removed, replaced, redesigned, or hidden without explicit
approval from the user, in this conversation, at the time the change is
made. Approval given for a different change, on a different day, does
not carry over.

Files this covers:

- `public/brand/logo.png`
- `public/brand/icon-circle.png`
- `src/app/icon.png`
- `src/app/apple-icon.png`
- `src/components/layout/logo.tsx` (the component that renders the mark)

## 2. The Space Ghost Reference Is Conceptual Only

Any creative brief that invokes Space Ghost (or a similar character) as
inspiration is talking about **tone, not assets**. It informs:

- Copy voice: confident, declarative, no filler.
- Visual hierarchy and contrast: clean, bold, uncluttered layouts.
- Motion: purposeful, subtle reveal/fade animation, nothing gimmicky.
- Storytelling: the "invisible expert" positioning (see section 6).

It does **not** inform the logo, a mascot, or any literal character art,
space imagery, or comic styling anywhere on the site. Build the visual
identity **around** the existing logo, never instead of it.

## 3. Secondary Marks Are Optional and Subordinate

A future geometric badge, favicon variant, or watermark may be developed
as a *supporting* asset if the user explicitly asks for one. If it ever
exists, it must:

- Complement the existing logo, never replace it.
- Be usable as a favicon, truck decal, watermark, or social icon.
- Be geometric, structured, and authoritative in style.
- Never appear more prominently than the primary Gary's logo.

Until the user asks for this, don't build one speculatively.

## 4. Color Palette

Preserve the current brand colors (defined in `src/app/globals.css`)
unless explicitly instructed otherwise:

- **Primary blue** (navy): main brand color, used for primary actions,
  headings accents, and dark gradient sections.
- **White / off-white**: dominant background, generous space.
- **Brand yellow**: highlight accent, used for the logo background,
  "Popular"/"Home base" badges, and a subset of CTAs.
- **Emergency red**: reserved strictly for the 24/7 emergency CTA, never
  used decoratively.

Do not introduce new brand hues, swap which color anchors which role, or
rebalance the palette without explicit instruction.

## 5. Typography

**Source Sans 3** is the global typography system across the entire
project, for both headings and body text. It is self-hosted via
`next/font/google` in `src/app/layout.tsx` and wired through the
`--font-display` / `--font-sans` CSS variables in `src/app/globals.css`.
Do not introduce a second typeface (display, serif, or otherwise)
without explicit instruction. Earlier pairings (Poppins + Open Sans,
and before that Inter + Instrument Serif) are retired; don't revert to
either.

## 6. Creative Direction: "Invisible Experts"

The underlying creative idea: Gary's crew works underground, unseen,
until something goes wrong, and they're the ones who find it and fix it.
Express this through:

- **Copy**: short, declarative, confident. Lead with the underground or
  problem-finding angle where it fits naturally (see the homepage's
  "Most of what we do happens underground, out of sight" section for a
  reference example). No corporate padding ("we are committed to...").
- **Layout**: clean, high-contrast, generous white space. No clutter,
  no busy textures.
- **Motion**: subtle scroll-triggered fade/rise reveals (see
  `src/components/ui/reveal.tsx`), fast and clean hover states. Nothing
  bouncy, elastic, or attention-grabbing for its own sake.
- **Spacing**: let sections breathe; the existing section rhythm
  (`py-24 md:py-32` and similar) is intentional.
- **Photography**: real job-site photos first, consistent treatment
  (dark gradient overlays where text sits on top of images).

What to actively avoid: cartoon or space-themed visual elements (beyond
the existing, approved logo), generic stock iconography, grimy
pipe-and-sewer visual cliches, overly casual copy, and any animation
heavy enough to hurt load time or feel gimmicky.

## 7. Future Work Principle

All future UI/UX work should improve quality and execution while
**maintaining brand consistency**. Prefer refinement over redesign.
Don't introduce new patterns, colors, fonts, or brand assets to solve a
problem that a smaller, consistent-with-existing-system change would
also solve.

## 8. Do Not Change Without Approval

The following must not be changed without the user's explicit, in-the-
moment approval:

- **Primary logo** (`public/brand/logo.png` and everywhere it's used)
- **Brand name** ("Gary's Pipelining & Drain Cleaning", `siteConfig.name`
  and related fields in `src/lib/site-config.ts`)
- **Company identity** (legal name, license number, address, phone,
  email; all sourced from `src/lib/site-config.ts`)
- **Core color palette** (`src/app/globals.css` theme tokens)
- **SEO metadata and business information** (titles, descriptions,
  structured data in `src/lib/schema.ts`, canonical URLs)
- **Existing trust signals and licensing information** (license number,
  "Licensed & Insured" claims, review content, real job-site photo
  attributions)

If a task seems to require changing one of these, stop and ask first,
even if a brief or instruction seems to imply it. Confirm logo claims
against current code, not memory or a prior session's notes, since this
exact category of mistake has happened before in this project.
