# PG Amigo

A responsive first product demo for student PG discovery and lifestyle-based roommate matching in India. Built with Next.js App Router, React, TypeScript, and Lucide icons. The supplied `plan.md` is product reference material; this implementation is an interactive prototype, not a completed production roadmap.

## Run

Requires Node.js 22 or newer (validated on 24.22.1), and npm.

```sh
npm ci
npm run dev
```

Open port 3000 in your development environment. Production: `npm run build && npm start`.

## What works

- Search sample Bengaluru listings by college, locality, or property name.
- Combine price, gender, sharing, meal, and AC filters; sort by price, distance, rating, or recommendation.
- Open listing details, save homes, and try an enquiry form.
- Complete a three-step roommate profile with separate personal traits and preferred traits, importance weights, and dealbreakers.
- Rank compatible sample profiles using a pure two-way matching engine; pass or like profiles.
- Explore illustrative owner plans and save local property drafts.
- Responsive navigation, mobile filter drawer, empty states, keyboard-accessible dialogs, and moving safety guidance.

Saved listings, roommate preferences, likes, passes, enquiry status, and owner drafts use browser localStorage under `amigo:*` keys. Clear these keys to reset the demo. No personal information is sent to a server. The enquiry form saves only a listing ID; visit dates and messages are not retained or delivered. Owner drafts retain name, locality, rent, and selected plan; description is not retained.

## Validation

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Playwright uses system Chromium at `/usr/bin/chromium`; set `CHROMIUM_PATH` to your browser binary on another machine. It starts the production server when necessary. E2E tests cover search, shortlist persistence, enquiry, preferences, likes, owner drafts, and mobile overflow. Unit tests cover search filters, ranking, budget and gender constraints, bilateral dealbreakers, zero weights, and asymmetric scores.

## Product assumptions and production work

Bengaluru is a placeholder launch city. Listings, ratings, bed counts, profiles, distances, and owner prices are illustrative. Property photos are illustrative exteriors, not real Bengaluru PGs. No ownership or identity is verified. Likes are local demo actions, not mutual matches; there is no live chat.

Before a public beta, connect Supabase Auth/Postgres/Storage, add server-side validation and RLS policies with access-control tests, onboard real owners and permissioned photos, implement listing review/verification and private contact release, build real mutual matches and member-only conversations, and prepare reporting/blocking, rate limits, and reviewed legal pages. Payments remain deferred. Do not represent this demo as a live marketplace.

## Assets

Illustrative property images: the public `codewithsadee/realvine` example repository (`assets/images/property-1.jpg` through `property-6.jpg`), originally photographic demo content. Confirm production usage rights or replace with owner-permissioned photos before publishing. Fonts: locally bundled DM Sans and Manrope via Fontsource (OFL). Icons: Lucide (ISC). Hero illustration: original CSS, no external image service required.
