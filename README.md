# Hashton

**Harry Ashton** — Senior frontend engineer (contract & consulting). This repository is the source for my portfolio site; stack and setup are documented below if you need them.

---

## What’s inside

- **Visual system** — Paper-and-ink palette, hairline borders, hard shadows, monospace captions (Tailwind CSS v4 + design tokens in `src/styles/globals.css`).
- **Hero** — Custom `HeroVideo` player (poster, fullscreen dialog, keyboard-friendly controls, reduced-motion aware).
- **Work** — Case studies from `src/content/work/*.mdx` with dynamic `/work/[slug]` routes.
- **Contact** — React Hook Form + Zod; `POST /api/contact` sends mail via [Resend](https://resend.com/) when configured, otherwise returns a graceful fallback for `mailto:`.
- **SEO** — Metadata, Open Graph image, `robots.txt`, `sitemap.xml`, JSON-LD `Person` schema.
- **Analytics** — Vercel Analytics & Speed Insights (optional in production).

## Tech stack

| Layer     | Choices                                                                    |
| --------- | -------------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org/) 15 (App Router), React 19, TypeScript       |
| Styling   | Tailwind CSS v4, Framer Motion                                             |
| Content   | MDX (`gray-matter`, `@next/mdx` / remote MDX pipeline as wired in the app) |
| Forms     | react-hook-form, Zod                                                       |
| Icons     | `simple-icons`, bespoke brand SVGs where needed                            |

## Requirements

- **Node.js** ≥ 18.18 (recommended: **20.x**)
- **pnpm** (package manager for this repo)

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm lint      # ESLint
pnpm build     # production build (Turbopack)
pnpm start     # run production server locally
```

## Environment variables

Create a `.env.local` (not committed) for production-like behavior:

| Variable               | Purpose                                                                           |
| ---------------------- | --------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (metadata, OG, sitemap). Example: `https://hashton.vercel.app` |
| `RESEND_API_KEY`       | Resend API key — contact form sends email when set                                |
| `CONTACT_EMAIL`        | Inbox address for contact submissions                                             |
| `CONTACT_FROM`         | Optional Resend `from` string (defaults in API route if unset)                    |

If `RESEND_API_KEY` or `CONTACT_EMAIL` is missing, the API still responds successfully with `fallback: true` so the UI can open the user’s mail client instead.

## Project layout (high level)

```
src/
  app/           # App Router pages, API routes, OG image
  components/    # Layout, sections, video, UI primitives
  content/work/  # MDX case studies
  lib/           # Site config, nav, data helpers
  styles/        # Global CSS + Tailwind theme
public/          # Static assets (e.g. video, posters)
```

## Deploy

Configured for **[Vercel](https://vercel.com/)**: connect the repo, set the env vars above, and deploy. Asset-heavy routes are static where possible; `/api/contact` runs on the Edge/Node runtime per Next defaults.

---

I maintain this repo at [@thehashton](https://github.com/thehashton).
