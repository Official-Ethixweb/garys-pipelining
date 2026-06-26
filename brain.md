# Brain, Gary's Pipelining website rebuild

Read this before doing anything else in this project. Saves re-discovery.

**Brand/identity rules (logo, colors, typography, creative direction) live
in `BRAND_GUIDELINES.md` at the repo root. That file is authoritative;
read it before touching anything visual.**

**GitHub remote**: whenever the user says "push" / "push to GitHub" /
similar, with no other repo specified, push here:
`https://github.com/HiddenSkyAkash/garys-pipelining-web.git`. It's wired
up as the `origin` remote already (`git remote -v` to confirm). Push the
current branch (`git push -u origin <branch>` if it has no upstream yet),
don't assume `main` without checking what branch is actually checked out.

## What this is

Full rebuild of garyspipelining.com (sewer/drain trenchless contractor,
Tukwila WA), Next.js 16 (App Router) + Tailwind v4. Lives directly at
`a:/garyspipelining/` (this IS the project root, single folder,
`src`/`public`/etc. are direct children, no nested subfolder).

The old Lovable-connected project (`nextgen-pipelining-main`) and the
HTTrack mirror of the original WordPress site that used to live
alongside this one have been permanently deleted, by user request, once
all real business facts/photos had already been migrated into
`public/photos` and `src/lib/site-config.ts`. They no longer exist on
disk; don't look for them.

## Real business facts (don't invent new ones, pull from old mirror if more are needed)

- Phone: (206) 535-8460, Email: office@garyspipelining.com
- Address: 14101 Interurban Ave S, Unit 78-B, Tukwila, WA 98168
- License: WA #GARYSPC881RE
- Logo, colors, typography: see `BRAND_GUIDELINES.md`. Short version:
  the existing logo (`public/brand/logo.png`, `icon-circle.png`,
  `src/app/icon.png`, `apple-icon.png`) is a cartoon-superhero mark and
  it stays exactly as-is. Don't remove, replace, or redesign it, and
  don't repeat the mistake of "fixing" it because a creative brief
  mentions Space Ghost; that reference is tonal/conceptual only.
- Real Google reviews: the live garyspipelining.com (WordPress) runs a
  Trustindex widget synced to the real Google Business Profile, 4.5/5
  from 10 reviews total. Pulled 5 real positive ones verbatim from that
  widget's HTML (Alicia Vermaele, Kylie Barrett, Ronald Imbert, Brody,
  Bob Blumenthal), used in `reviews-section.tsx`. One real 1-star
  review also exists (Cape Breton) and is intentionally excluded, don't
  surface negative reviews, that's normal practice, not dishonesty.
  Don't fabricate additional reviewers/quotes beyond these 5; if more
  are needed, re-pull from the live widget the same way, don't invent.
- Don't invent stats like "25+ years" / "10k+ jobs", old site never
  stated tenure. Use qualitative claims only ("years of experience",
  "24/7", "licensed & insured").

## Architecture

- `src/lib/site-config.ts`, single source of truth for NAP/phone/email.
- `src/lib/content/services.ts` (9 services) / `locations.ts` (6 areas):
  all page copy lives here, not hardcoded in templates.
- `src/components/sections/service-page-template.tsx` /
  `location-page-template.tsx`, shared shells, driven by the content
  files above. 26 total pages, all passing `next build`.
- Fonts: **Source Sans 3** (single family, headings + body), self-hosted
  via `next/font/google` as a variable font, loaded once in
  `src/app/layout.tsx` and wired through `--font-display`/`--font-sans`
  in `globals.css`. Earlier pairings (Poppins + Open Sans, then briefly
  Inter + Instrument Serif) are retired; don't reintroduce a second
  family or revert to either.
- `public/photos/real/*`, actual job-site photos from the old site.
  `public/photos/stock/*`, supplementary curated photography (used only
  where no real photo exists, e.g. Bellevue/Federal Way location heroes).
  **Every single webp/asset in `public/` is wired into the site**, user
  asked for 100% asset utilization. If you add new images, use them
  somewhere or don't add them.
- Contact form: React Hook Form + Zod to Web3Forms (`src/lib/web3forms.ts`).
  Needs `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in `.env.local` (see
  `.env.local.example`) to actually deliver email, currently unset.

## Landmines hit this session, don't re-hit them

1. **`next.config.ts` MUST have `allowedDevOrigins: ["127.0.0.1", "localhost"]`.**
   Without it, Next 16 dev mode silently blocks HMR/hydration JS when the
   site is accessed via `127.0.0.1` instead of `localhost`, page loads
   fine visually but **all client interactivity silently breaks**: nav
   dropdowns don't open, forms native-submit instead of validating (you
   get `?name=&phone=...` in the URL bar, that's the tell). No console
   error, no exception, just dead JS. Already fixed; don't remove this
   config.
2. **Port 3000 collision**: an unrelated project's dev server
   ("Ethixweb", a different TanStack Start app) sometimes runs on this
   machine bound to `[::1]:3000` (IPv6 loopback). `localhost` may resolve
   there instead of to this project. Always verify with
   `netstat -ano | grep :3000` before assuming which server you're
   hitting. Never kill that other process, not yours.
3. **Stale/duplicate dev servers**: `pkill -f "next dev"` on this Windows
   git-bash setup often fails to actually kill the node process (PID
   mismatch). If a restart shows "Port 3000 is in use" or "another next
   dev server is already running," find the real PID via netstat and
   `powershell -Command "Stop-Process -Id <PID> -Force"`, then restart.
4. **Lucide icon components**: never do `const Icon = getIcon(name); <Icon/>`
   inside a render function, Next 16's `react-hooks/static-components`
   ESLint rule fails the build on this pattern (treated as "creating a
   component during render"). Use a switch-statement component instead
   (see `src/components/ui/service-icon.tsx`), each case returns a
   statically-named JSX tag directly.
5. **`generateMetadata`/page `params` and `searchParams` are `Promise`s**
   in this Next version, always `await params` / `await searchParams`,
   never destructure synchronously (training-data-era Next.js assumed
   sync access; this version doesn't allow it).
6. **next/image with a static import**: if you override one of
   width/height, override both (matching the real file's aspect ratio),
   or the rendered image can end up wrong-sized. Don't pass just `height`
   without `width` on a static import.
7. **Vercel deployment, three separate real causes, in order found**: (a)
   repo only had `create-next-app`'s day-1 commit, the real site was
   never actually committed, always `git add -A && git commit` and
   confirm `git status` is clean before assuming a push will work; (b)
   the repo had project files nested inside an extra subfolder (from a
   manual GitHub upload), Vercel needed `Root Directory` set to match
   that subfolder name in Settings → General, now resolved since this
   project is flattened to one folder, so Root Directory should be left
   blank; (c) Vercel **Deployment Protection** was on, which makes every
   external visitor (including any agent fetching the URL) see a
   generic 404 instead of a login wall, by design, to hide that the
   deployment exists. A clean build + 404 on literally every URL
   including the deployment's own unique link, with zero errors in the
   build log, means check Deployment Protection, not the code.
8. **`next build` while a `next dev` server is running**: both share the
   same `.next/` output directory; running `next build` concurrently with
   a live `next dev` process can throw a spurious
   `InvariantError: Expected workStore to be initialized` and abort the
   build. Not a real code bug, find and stop the dev server PID first
   (`netstat -ano | grep :3000`, confirm it's *this* project by curling it
   and checking the page title, then `Stop-Process -Id <PID> -Force`),
   optionally `rm -rf .next`, then rebuild.

## Verification habits that actually caught real bugs

Build passing (`next build`, `tsc --noEmit`, `eslint`) does **not** prove
client interactivity works, it caught zero of the landmines above.
What actually caught them: a Playwright script that navigates, clicks
the real button/link, and checks the resulting URL/DOM state (not just
HTTP status codes). Re-run something like that after any change to
Header, forms, or next.config before telling the user it's done.
