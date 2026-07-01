# Gary's Pipelining & Drain Cleaning Website

**Client:** Gary's Pipelining & Drain Cleaning (office@garyspipelining.com)

## What this project is

Marketing website for Gary's Pipelining & Drain Cleaning, a plumbing and drain
cleaning company. It's a full rebuild of the previous WordPress site, with
service pages, location pages, a coverage map, testimonials, and a contact/
estimate form that emails leads directly to the client.

## Tech stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- TypeScript
- Web3Forms (contact/estimate form email delivery)
- Vercel (hosting/deploy)

## How to set it up locally

1. Clone the repo and check out a `feat/` branch for your task.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the env example and fill in the values (see below):
   ```bash
   cp .env.local.example .env.local
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 (use http://127.0.0.1:3000 if port 3000 is
   already bound on the IPv6 loopback).

## Environment variables needed

- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, Web3Forms access key used by the
  contact/estimate form. Without it the form still validates client-side but
  submissions are rejected and visitors see a "please call instead" fallback.

Never commit `.env*` files, they are already excluded via `.gitignore`.

## Deployment notes

- Deploys to Vercel. `npm run build` then `npm start` locally reproduces the
  production build; on Vercel this runs automatically on push via its Next.js
  adapter.
- The Web3Forms access key must be set as an environment variable in the
  Vercel project settings, it is not committed to the repo.

## Key contacts

- Client: Gary's Pipelining & Drain Cleaning (office@garyspipelining.com)
- Amar, project manager
- Akash, lead dev (akash@ethixweb.com)

## Project structure

- `src/lib/site-config.ts`, single source of truth for phone, email,
  address, license number.
- `src/lib/content/services.ts` / `locations.ts`, all copy for the 9
  service pages and 6 location pages. Edit here, not in the templates.
- `src/components/sections/service-page-template.tsx` /
  `location-page-template.tsx`, the shared page shells driven by that
  content.
- `public/brand`, `public/photos/real`, the real logo and real job-site
  photos pulled from the old WordPress site. `public/photos/stock` is
  curated supplementary photography used where no real photo exists yet.

## Branching

One task = one branch, branched off `develop`/`main` and named after the
ClickUp task (e.g. `feat/contact-form-fix`). Never commit directly to
`develop` or `main`.
