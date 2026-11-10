# plan.md — PG & Roommate Platform (working name: `PGMate`)

> Single source of truth for building this product with Codex, from planning to deployment.
> Codex: read this file fully, then read `AGENTS.md`. Work on **one phase at a time**. Do not start a phase until the previous phase's acceptance criteria are checked off.

---

## 0. How to use this file with Codex

1. Put this file at the repo root as `plan.md`, plus the `AGENTS.md` from Appendix A.
2. For each phase, give Codex this prompt (Appendix B has the full template):
   > "Read plan.md and AGENTS.md. Implement **Phase N** only. Follow its tasks and meet its acceptance criteria. Run lint, typecheck and tests before finishing. Tick the checkboxes you completed and list anything you skipped."
3. Keep each Codex task small (one feature or one page). Commit after every task. Review diffs yourself before moving on.
4. If something here is ambiguous, Codex should **choose the simplest option, state the assumption in the PR/commit message, and continue**. Do not invent features not listed in the scope.

---

## 1. Product overview

**Problem.** Students moving to a new city for college or work struggle to:
- find trustworthy PGs (photos don't match reality, hidden charges, no reviews, brokers),
- find compatible roommates (sleep schedule, cleanliness, food habits, smoking, noise, budget).

**Solution.** One platform with two connected products:
1. **PG Listings** — verified local PG owners list properties with rooms, rent, rules, food, amenities, photos. Students search, filter, compare, save and enquire.
2. **Roommate Match ("Tinder for PG/flatmates")** — students fill *their own profile* and *what they want in a roommate*. The system scores compatibility both ways, students swipe, and on a mutual match they can chat and (optionally) shortlist a PG together.

**Core loop.**
`Student joins → searches PGs near college → enquires / saves` and `→ creates roommate profile → swipes → mutual match → chat → books same PG / room`.

**Differentiator.** Search by *distance from my college*, owner verification badges, and two-way preference-based roommate matching with safety controls (gender preference, hidden contact details until match).

**Success metrics (first 3 months after launch).**
- 50+ verified PG owners in the launch city/area
- 500+ student signups, 200+ completed roommate profiles
- 30% of students send at least one enquiry
- 50+ mutual roommate matches
- 10+ paying owners (validates revenue)

---

## 2. Assumptions & open decisions

Codex should treat these as defaults unless the owner changes them here.

| # | Decision | Default |
|---|----------|---------|
| A1 | Launch geography | One city / one college cluster first (e.g. the area around a large university). Multi-city later. |
| A2 | Country / currency | India, INR, phone numbers +91 |
| A3 | Auth | Phone OTP (primary) + Google sign-in. Email optional. |
| A4 | Languages | English first, Hindi later |
| A5 | Payments | Not needed for MVP. Razorpay in Phase 9. |
| A6 | Platform handles rent? | **No.** Platform only connects people. No rent collection in v1. |
| A7 | Chat | Text only, only after mutual match (students) or after enquiry (student ↔ owner) |
| A8 | Mobile | Responsive web / PWA first. Native app later if traction. |
| A9 | Gender safety default | Roommate matches are same-gender by default; cross-gender only if both opt in explicitly. |
| A10 | Pricing numbers | Placeholders in Section 5. Validate with real owners before fixing. |

**Open questions for the founder (answer before Phase 0 ends):**
- Which city/college cluster is the launch area?
- How will the first 20 owners be onboarded (field visits? existing contacts?)
- Will you operate as a pure marketplace or also verify properties physically?

---

## 3. Users & personas

| Persona | Needs | Key actions |
|---------|-------|-------------|
| **Student / Seeker** (primary) | Find affordable, safe PG near college; find compatible roommate | Search, filter, save, enquire, create roommate profile, swipe, chat |
| **PG Owner** | Fill vacancies, get genuine leads, look professional | Register, verify, list rooms, manage vacancies, reply to enquiries, buy promotion |
| **Admin (you / ops)** | Keep quality and safety high | Verify owners, moderate listings/reports, view analytics, manage plans |

---

## 4. Scope

### MVP (Phases 1–8) — must ship
- Auth (phone OTP + Google), role selection (student / owner)
- Student profile
- Owner onboarding + verification request
- PG listing CRUD (property → rooms → photos → amenities → rules)
- Student search: filters, sort, map/list, listing detail, save/shortlist, enquiry
- Owner dashboard: listings, vacancies, enquiries
- Roommate profile + preferences (the questionnaire)
- Matching engine + swipe deck + mutual match
- In-app chat for matches and enquiries
- Notifications (in-app + email)
- Report / block, admin moderation panel
- Basic SEO pages, legal pages (Terms, Privacy)

### v1.1 (Phases 9–11)
- Owner subscription plans, featured listings, lead credits (Razorpay)
- Reviews & ratings (verified residents only)
- Student premium (see who liked you, unlimited swipes, priority)
- Analytics dashboards, WhatsApp share links, referral codes

### v2 (backlog, do NOT build now)
- Rent collection & digital agreements, native mobile apps, multi-city, flat/room-sharing (non-PG) listings, video tours, AI-written listing descriptions, Hindi/regional languages, voice notes in chat

---

## 5. Business model

**Principle:** Students use it **free**. Owners pay for visibility and leads. Roommate premium is optional.

| Stream | How it works | Placeholder price (validate!) |
|--------|--------------|-------------------------------|
| **Owner subscription** | Free tier: 1 listing, basic visibility. Pro: more listings, analytics, verified badge priority. Premium: top placement, featured badge | Free / ₹499 / ₹1,499 per month |
| **Featured / boosted listing** | Pay to appear at top of search for N days | ₹99–₹299 per week |
| **Pay-per-lead (alternative)** | Owner pays only when a verified student sends an enquiry and contact is unlocked | ₹30–₹100 per lead |
| **Verified badge fee** | One-time physical/document verification | ₹299–₹999 one-time |
| **Student premium** | See who liked you, unlimited daily swipes, priority in match feed, undo swipe | ₹49–₹149 per month |
| **Local ads / partnerships (later)** | Tiffin/mess, laundry, movers, furniture rental, WiFi providers | Fixed monthly sponsorship |
| **Booking commission (later)** | Small % when a student books via platform | 2–5% |

**Monetization rules**
- Never paywall safety features (report, block, verification).
- Never sell or share student phone numbers to third parties.
- Track every lead (`enquiries` table) so lead-based billing can be switched on without a rewrite.

**Validation step (Phase 0):** talk to 10 owners; ask "would you pay ₹X/month for N verified leads?" Record answers in `docs/owner-interviews.md`.

---

## 6. Tech stack

Chosen for solo-developer speed, low cost, and being Codex-friendly (popular, well-documented tools).

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js (App Router) + TypeScript** | SSR/SEO for listing pages, one codebase for UI + API |
| Styling/UI | **Tailwind CSS + shadcn/ui** | Fast, consistent, accessible components |
| Backend/DB | **Supabase** (Postgres, Auth, Storage, Realtime, Row Level Security) | Auth + DB + file storage + chat realtime without running servers |
| Geo search | **PostGIS** extension (in Supabase) | "PGs within 2 km of my college" |
| Maps | **Leaflet + OpenStreetMap** (free). Google Maps optional later | No billing surprises |
| Forms/validation | **React Hook Form + Zod** | Same schema on client and server |
| Data fetching | Server Components + **TanStack Query** for client interactivity | |
| Swipe UI | **framer-motion** (drag gestures) | |
| Payments | **Razorpay** (Phase 9) | UPI support, India-first |
| SMS OTP | Supabase Phone Auth with **MSG91 or Twilio** | |
| Email | **Resend** | Simple transactional email |
| Images | Supabase Storage + Next.js `<Image>`; client-side compression before upload | |
| Testing | **Vitest** (unit), **Playwright** (e2e) | |
| CI/CD | **GitHub Actions** | |
| Hosting | **Vercel** (app) + **Supabase** (DB) | Free tiers cover MVP |
| Monitoring | **Sentry** (errors), **PostHog** (analytics) | |

> If Codex believes a different stack is clearly better, it must **not** switch silently. Propose it in `docs/decisions.md` first.

---

## 7. Architecture & repo structure

```
pgmate/
├─ plan.md
├─ AGENTS.md
├─ README.md
├─ .env.example
├─ docs/
│  ├─ decisions.md            # ADRs: why each choice was made
│  ├─ owner-interviews.md
│  └─ api.md
├─ supabase/
│  ├─ migrations/             # SQL migrations (source of truth for schema)
│  ├─ seed.sql                # demo colleges, amenities, sample listings
│  └─ config.toml
├─ src/
│  ├─ app/
│  │  ├─ (public)/            # landing, search, listing detail, legal
│  │  ├─ (auth)/              # login, verify OTP, onboarding
│  │  ├─ (student)/           # profile, saved, enquiries, roommate/*
│  │  ├─ (owner)/             # dashboard, listings, enquiries, billing
│  │  ├─ (admin)/             # moderation, verification queue, analytics
│  │  └─ api/                 # route handlers (webhooks, cron, etc.)
│  ├─ components/             # ui/, listings/, roommate/, chat/, layout/
│  ├─ lib/
│  │  ├─ supabase/            # server + browser clients
│  │  ├─ matching/            # scoring engine (pure functions, unit-tested)
│  │  ├─ validators/          # Zod schemas
│  │  └─ utils/
│  ├─ hooks/
│  └─ types/
└─ tests/
   ├─ unit/
   └─ e2e/
```

**Architecture rules**
- All DB access goes through Supabase clients; **Row Level Security (RLS) is ON for every table**. Never rely on UI checks alone.
- Matching logic lives in `src/lib/matching` as **pure functions** (no DB calls inside), so it is easy to test.
- Server Actions / route handlers validate every input with Zod.
- No secrets in client code. Only `NEXT_PUBLIC_*` vars are exposed.

---

## 8. Data model (Postgres)

Write these as migrations in `supabase/migrations/`. Enable `postgis` and `pgcrypto` first. Below is the target shape — Codex may adjust column types but must keep the relationships.

```sql
-- Enums
create type user_role as enum ('student','owner','admin');
create type gender_t as enum ('male','female','other');
create type room_type_t as enum ('single','double','triple','dorm');
create type listing_status_t as enum ('draft','pending_review','active','paused','rejected');
create type verification_status_t as enum ('unverified','pending','verified','rejected');
create type swipe_t as enum ('like','pass','superlike');

-- Users
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role user_role not null default 'student',
  full_name text, avatar_url text, phone text unique,
  gender gender_t, date_of_birth date,
  college_id uuid references colleges(id),
  course text, year_of_study int,
  city text, bio text,
  verification verification_status_t default 'unverified',
  is_banned boolean default false,
  created_at timestamptz default now()
);

create table colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null, city text not null,
  location geography(point, 4326) not null
);

-- Owners & listings
create table owner_profiles (
  owner_id uuid primary key references profiles(id) on delete cascade,
  business_name text, whatsapp text,
  verification verification_status_t default 'unverified',
  verification_docs jsonb,            -- storage paths only, private bucket
  plan text default 'free', plan_expires_at timestamptz
);

create table pg_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null, description text,
  address text, locality text, city text not null,
  location geography(point, 4326) not null,
  gender_allowed text check (gender_allowed in ('male','female','any')),
  food_included boolean default false, food_type text,       -- veg / non-veg / both
  rules jsonb,                         -- curfew, guests, smoking, alcohol, etc.
  deposit_amount int, notice_period_days int,
  status listing_status_t default 'draft',
  is_featured boolean default false, featured_until timestamptz,
  created_at timestamptz default now()
);

create table pg_rooms (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references pg_listings(id) on delete cascade,
  room_type room_type_t not null,
  rent_per_month int not null,
  total_beds int not null, vacant_beds int not null default 0,
  attached_bathroom boolean default false, has_ac boolean default false,
  available_from date
);

create table pg_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references pg_listings(id) on delete cascade,
  storage_path text not null, sort_order int default 0
);

create table amenities (id serial primary key, name text unique, icon text);
create table listing_amenities (
  listing_id uuid references pg_listings(id) on delete cascade,
  amenity_id int references amenities(id), primary key (listing_id, amenity_id)
);

-- Student ↔ listing interactions
create table saved_listings (
  student_id uuid references profiles(id) on delete cascade,
  listing_id uuid references pg_listings(id) on delete cascade,
  created_at timestamptz default now(), primary key (student_id, listing_id)
);

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references pg_listings(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  room_id uuid references pg_rooms(id),
  message text, status text default 'new',   -- new / replied / visit_scheduled / closed
  contact_unlocked boolean default false,    -- used for lead billing later
  created_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references pg_listings(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  rating int check (rating between 1 and 5),
  body text, stayed_from date, stayed_to date,
  is_verified_resident boolean default false,
  created_at timestamptz default now(),
  unique (listing_id, student_id)
);

-- Roommate matching
create table roommate_profiles (
  user_id uuid primary key references profiles(id) on delete cascade,
  is_active boolean default true,
  city text not null,
  budget_min int, budget_max int,
  move_in_from date, move_in_to date,
  preferred_localities text[],
  looking_for text,                    -- 'need_roommate_for_existing_pg' | 'find_pg_and_roommate'
  existing_listing_id uuid references pg_listings(id),
  my_traits jsonb not null,            -- what I am like (Section 9 schema)
  pref_traits jsonb not null,          -- what I want in a roommate + weights + dealbreakers
  gender_pref text default 'same',     -- same / any
  updated_at timestamptz default now()
);

create table swipes (
  swiper_id uuid references profiles(id) on delete cascade,
  target_id uuid references profiles(id) on delete cascade,
  action swipe_t not null, created_at timestamptz default now(),
  primary key (swiper_id, target_id)
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid references profiles(id) on delete cascade,
  user_b uuid references profiles(id) on delete cascade,
  score int, created_at timestamptz default now(),
  unique (user_a, user_b), check (user_a < user_b)
);

-- Chat
create table conversations (
  id uuid primary key default gen_random_uuid(),
  kind text check (kind in ('match','enquiry')),
  match_id uuid references matches(id), enquiry_id uuid references enquiries(id),
  created_at timestamptz default now()
);
create table conversation_members (
  conversation_id uuid references conversations(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  last_read_at timestamptz, primary key (conversation_id, user_id)
);
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  body text not null, created_at timestamptz default now()
);

-- Trust & safety
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id), target_user uuid references profiles(id),
  target_listing uuid references pg_listings(id), reason text, details text,
  status text default 'open', created_at timestamptz default now()
);
create table blocks (
  blocker_id uuid references profiles(id) on delete cascade,
  blocked_id uuid references profiles(id) on delete cascade,
  primary key (blocker_id, blocked_id)
);

-- Money (Phase 9)
create table plans (id text primary key, name text, price_inr int, features jsonb, audience text);
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id), razorpay_order_id text, razorpay_payment_id text,
  amount_inr int, purpose text, status text, created_at timestamptz default now()
);
```

**Indexes to add:** GIST on `pg_listings.location`, `colleges.location`; btree on `pg_listings(city,status)`, `pg_rooms(listing_id)`, `swipes(target_id)`, `messages(conversation_id, created_at)`.

**RLS policy summary**
- `profiles`: users read/update own row; public fields of others readable only via a limited view; admins read all.
- `pg_listings`: public can read `status='active'`; owners CRUD own; admins all.
- `enquiries`: student sees own; owner sees those for own listings.
- `roommate_profiles`, `swipes`, `matches`: user reads only own rows (matching feed is served by a server function, never raw table access).
- `messages`: only members of the conversation; blocked users cannot send.
- Private storage bucket for owner verification docs: owner + admin only.

---

## 9. Matching engine

### 9.1 The questionnaire (stored in `my_traits` / `pref_traits`)

Each question is answered **twice**: "What am I like?" and "What do I want in a roommate?" (with an importance weight and an optional dealbreaker flag).

| Trait key | Options | Notes |
|-----------|---------|-------|
| `sleep_schedule` | early_bird / normal / night_owl | |
| `cleanliness` | 1–5 (messy → very tidy) | numeric closeness |
| `smoking` | no / occasionally / yes | common dealbreaker |
| `drinking` | no / occasionally / yes | common dealbreaker |
| `food_habit` | veg / non_veg / eggetarian / jain | veg-only roommate is a common dealbreaker |
| `noise_level` | quiet / moderate / lively | |
| `guests` | never / sometimes / often | |
| `study_style` | silent_study / music_ok / group_study / not_studying (working) | |
| `ac_preference` | ac / non_ac / either | |
| `social_style` | introvert / ambivert / extrovert | |
| `languages` | multi-select | overlap scored |
| `interests` | tag multi-select (cricket, gaming, gym, music, coding, travel…) | overlap scored |
| `college_or_company`, `course_or_role`, `year` | text / select | optional small bonus for same college/course |

### 9.2 Algorithm (implement in `src/lib/matching/`)

**Step 1 — Hard filters** (exclude candidate if any fails):
- Same `city`, both profiles `is_active`, neither banned, no block either way, not already swiped.
- Gender rule: honor both users' `gender_pref` (default same-gender).
- Budget ranges overlap.
- Move-in windows overlap (or within ±30 days).
- Either user's **dealbreaker** trait conflicts with the other's actual trait.

**Step 2 — Directional score** `S(A→B)` in 0–100:
```
for each trait t:
   closeness(t) = 1 if exact match; partial credit for ordinal/numeric (e.g. |Δ|/range);
                  Jaccard overlap for multi-select
   weight(t)    = importance A set for t (0..3), default 1
S(A→B) = 100 * Σ(weight * closeness) / Σ(weight)
```

**Step 3 — Mutual score:**
```
mutual = round( sqrt( S(A→B) * S(B→A) ) )     // geometric mean punishes one-sided fit
+ small bonuses (cap +8): same college, same course, shared interests > 3, close locality preference
```

**Step 4 — Feed ranking:** sort by `mutual` desc; show a **reason chips** list ("Both night owls", "Both veg", "Budget fits", "Same college").

**Step 5 — Swipe → match:** when A likes B and B has already liked A (or superlike), create a `matches` row (`user_a < user_b`), create a `conversations` row, notify both.

**Quality requirements**
- Pure functions, 100% unit-tested with table-driven cases (dealbreaker, asymmetry, weights, bonuses).
- Feed is paginated (20 cards), pre-computed lazily; cache per user for 10 min.
- Never expose raw scores of the other person's private answers; show only reason chips.

---

## 10. Pages & API surface

### Public
`/` landing · `/pgs` search (filters + map) · `/pgs/[id]` detail · `/colleges/[slug]` SEO page ("PGs near X college") · `/about` · `/terms` · `/privacy` · `/safety`

### Auth & onboarding
`/login` · `/verify-otp` · `/onboarding` (choose role → profile basics)

### Student
`/student/profile` · `/student/saved` · `/student/enquiries` · `/roommates` (swipe deck) · `/roommates/setup` (questionnaire) · `/roommates/matches` · `/chat/[conversationId]` · `/student/settings`

### Owner
`/owner` dashboard · `/owner/listings` · `/owner/listings/new` · `/owner/listings/[id]/edit` · `/owner/enquiries` · `/owner/verification` · `/owner/billing` (Phase 9)

### Admin
`/admin` overview · `/admin/verifications` · `/admin/listings` · `/admin/reports` · `/admin/users` · `/admin/analytics`

### Server endpoints (route handlers / server actions)
- `search_listings(filters, bbox|college_id, sort, page)` — SQL function using PostGIS `ST_DWithin`
- `create_enquiry`, `reply_enquiry`
- `get_roommate_feed(page)`, `swipe(target_id, action)`
- `send_message`, `mark_read`
- `report`, `block`
- `razorpay/create-order`, `razorpay/webhook` (Phase 9)
- `cron/expire-featured`, `cron/stale-listings` (Vercel Cron)

---

## 11. Phased roadmap

Time estimates assume ~15–20 focused hours/week with Codex doing the heavy lifting. Adjust freely.

### Phase 0 — Discovery & validation (Week 0–1)
**Goal:** be sure people want this before writing code.
- [ ] Pick launch area (city + 2–3 colleges)
- [ ] Interview 10 students (how they found PG, biggest pain, roommate experiences) and 10 PG owners (vacancy pain, willingness to pay) → `docs/owner-interviews.md`
- [ ] Collect 15–20 real PGs (photos, rent, rules) with owner permission to seed the platform
- [ ] Finalize name, domain, logo, color palette
- [ ] Draft the roommate questionnaire and test it on 5 students on paper
- [ ] Create GitHub repo, Supabase project, Vercel project

**Acceptance:** at least 5 owners say they'd list; at least 10 students say they'd use roommate matching; decisions A1–A10 confirmed.

---

### Phase 1 — Project setup & foundations (Week 1–2)
**Goal:** empty but production-shaped app.
- [ ] Scaffold Next.js (TypeScript, App Router, Tailwind, ESLint) + shadcn/ui
- [ ] Add `AGENTS.md`, `.env.example`, Prettier, Husky pre-commit (lint + typecheck)
- [ ] Supabase local dev setup (`supabase init`), enable PostGIS + pgcrypto
- [ ] Migrations for all tables in Section 8 (enums, tables, indexes)
- [ ] RLS policies for every table + tests that prove a user cannot read others' data
- [ ] Seed script: colleges, amenities, 10 demo listings with coordinates
- [ ] Base layout: header, footer, mobile bottom nav, dark/light theme, toasts
- [ ] GitHub Actions CI: install → lint → typecheck → unit tests → build
- [ ] Deploy empty app to Vercel preview

**Acceptance:** `npm run lint && npm run typecheck && npm test && npm run build` pass in CI; preview URL loads; RLS tests green.

---

### Phase 2 — Auth & profiles (Week 2–3)
**Goal:** users can sign up and have a role.
- [ ] Phone OTP + Google login via Supabase Auth; rate-limit OTP requests
- [ ] Auto-create `profiles` row on signup (DB trigger)
- [ ] Onboarding wizard: choose **Student** or **Owner** → basic details (name, gender, college, course/year or business name)
- [ ] Student profile page with photo upload (compressed, ≤ 500 KB)
- [ ] Route protection middleware by role (`student`, `owner`, `admin`)
- [ ] Account settings: edit profile, delete account (hard delete personal data)

**Acceptance:** new user can sign up with OTP, pick a role, complete profile, log out/in, and is blocked from other roles' routes.

---

### Phase 3 — Owner onboarding & listing management (Week 3–5)
**Goal:** owners can publish quality listings.
- [ ] Owner dashboard shell with stats placeholders
- [ ] Multi-step "Add PG" form: basics → location (map pin + address autocomplete) → rooms & rent → amenities → rules & food → photos (min 4, drag to reorder) → preview → submit
- [ ] Draft autosave; status flow `draft → pending_review → active`
- [ ] Edit listing, pause/resume, delete, mark vacancies quickly (one-tap bed count update)
- [ ] Owner verification page: upload ID/proof + property proof to **private** bucket → status `pending`
- [ ] Admin verification queue (approve/reject with reason) — minimal version
- [ ] Email owner on approval/rejection

**Acceptance:** an owner can create a complete listing with 4+ photos, submit it, admin can approve it, and it appears as `active`. Unverified/incomplete listings cannot go live.

---

### Phase 4 — Student discovery: search, detail, enquiry (Week 5–7)
**Goal:** a student can find and contact a PG.
- [ ] `/pgs` search page: list + map toggle, infinite scroll
- [ ] Filters: city/locality, **distance from my college (1/2/5 km)**, budget slider, room type, gender allowed, food included, AC, attached bath, amenities, availability date, verified only
- [ ] Sort: relevance, price low→high, distance, newest
- [ ] Listing detail page: gallery, rooms table, amenities, rules, map, owner badge, vacancy chips, similar PGs
- [ ] Save/unsave listing, "compare up to 3" view
- [ ] Enquiry flow: message + preferred room + visit date → creates enquiry, notifies owner, unlocks owner contact (WhatsApp deep link `wa.me`)
- [ ] Owner enquiry inbox: reply, mark status, schedule visit
- [ ] SEO: dynamic metadata, `sitemap.xml`, `robots.txt`, JSON-LD (`LodgingBusiness`), `/colleges/[slug]` pages
- [ ] Performance: Lighthouse ≥ 85 mobile on search and detail pages

**Acceptance:** student can search near their college, filter, open a PG, save it, send an enquiry, and the owner sees it. Search response < 500 ms with 1,000 seeded listings.

---

### Phase 5 — Roommate profile & preferences (Week 7–8)
**Goal:** capture the data that powers matching.
- [ ] Questionnaire wizard (mobile-first, one question per screen, progress bar) covering "I am" and "I want" for each trait in Section 9.1, with importance sliders and "dealbreaker" toggles
- [ ] Extra fields: budget range, city, localities, move-in window, "I already have a PG/room" vs "I need both PG and roommate", optional link to a listing
- [ ] Profile card preview ("This is how others see you")
- [ ] Edit / pause / delete roommate profile
- [ ] Privacy controls: hide last name, hide college, show/hide photo until match
- [ ] Zod schemas shared between form and server

**Acceptance:** a student can complete, edit and pause their roommate profile; invalid inputs are rejected server-side; data stored matches schema in `my_traits` / `pref_traits`.

---

### Phase 6 — Matching engine & swipe experience (Week 8–10)
**Goal:** the Tinder-like core.
- [ ] Implement `src/lib/matching` (hard filters, directional score, mutual score, bonuses, reason chips) with full unit tests
- [ ] `get_roommate_feed` server function: candidate query → filter → score → paginate
- [ ] Swipe deck UI: drag left/right, buttons (pass / like / superlike), keyboard support, undo (premium later), empty state
- [ ] `swipe` action: record, detect mutual like, create `matches` + `conversations`
- [ ] "It's a match!" modal with reason chips and "Say hi" CTA
- [ ] Matches list page, unmatch action
- [ ] Daily swipe limit config (default generous; used later for premium)
- [ ] Seed script to generate 100 fake-but-realistic roommate profiles for local testing (dev only, never prod)

**Acceptance:** two test users with compatible answers see each other, like each other, and get a match; dealbreaker conflicts never appear in the feed; unit-test coverage on matching ≥ 90%.

---

### Phase 7 — Chat & notifications (Week 10–11)
**Goal:** matched users and enquiries can talk.
- [ ] Realtime chat with Supabase Realtime: conversation list, unread badges, typing indicator (optional), message history pagination
- [ ] Enforce rules via RLS: only members; blocked users cannot send; students can chat with owners only after enquiry
- [ ] Safety nudges in chat UI ("Don't share OTPs/bank details. Meet in public first.")
- [ ] In-app notification center (new match, new message, enquiry reply, listing approved)
- [ ] Transactional emails via Resend (templates: welcome, match, enquiry, approval)
- [ ] Web push (PWA) — optional stretch

**Acceptance:** two browsers see messages in < 1 s; blocked user cannot message; emails send for each event in staging.

---

### Phase 8 — Trust, safety & admin panel (Week 11–12)
**Goal:** make it safe enough to launch publicly.
- [ ] Report user / listing / message with reasons; block user (hides each other everywhere)
- [ ] Admin dashboards: verification queue, listing moderation, reports queue, ban/unban users, audit log of admin actions
- [ ] Profanity / spam / phone-number-in-first-message heuristics (flag, don't auto-ban)
- [ ] Student verification (college email OTP or ID upload) → "Verified student" badge
- [ ] Rate limiting (OTP, swipes, messages, enquiries) with Upstash Redis or Postgres counters
- [ ] Legal pages finalized: Terms, Privacy, Community guidelines, Grievance officer contact
- [ ] Cookie/consent banner and data-deletion request flow (DPDP Act, India)

**Acceptance:** a reported listing appears in admin queue within seconds; banned user cannot log in or appear anywhere; rate limits proven by tests.

---

### Phase 9 — Monetization (Week 12–14) — after real usage exists
**Goal:** start earning without hurting trust.
- [ ] `plans` seeded; owner billing page with plan comparison
- [ ] Razorpay Orders + Checkout; **webhook** verifies signature and updates `plan`, `plan_expires_at`, `payments`
- [ ] Featured listing purchase (days selector) → search ranking boost + "Featured" tag; Vercel Cron expires it
- [ ] Plan limits enforced server-side (listings count, analytics access)
- [ ] Lead credits / pay-per-lead toggle (feature flag) using `enquiries.contact_unlocked`
- [ ] GST-ready invoices (PDF/email); refund policy page
- [ ] Student premium: see who liked you, unlimited swipes, undo, priority in feed
- [ ] Owner analytics: views, saves, enquiries, conversion

**Acceptance:** test-mode payment upgrades an owner's plan end-to-end; replayed/forged webhooks are rejected; expired plans downgrade automatically.

---

### Phase 10 — QA, security & performance hardening (Week 14–15)
**Goal:** be confident before launch.
- [ ] Playwright e2e for critical flows: signup → list PG → admin approve → student search → enquiry; roommate setup → match → chat; payment (test mode)
- [ ] Security review checklist: RLS audit, Zod on all inputs, no secrets in client bundle, storage bucket policies, CSRF/session settings, dependency audit (`npm audit`), security headers (CSP, HSTS)
- [ ] Load test search + feed endpoints (k6, 100 concurrent users)
- [ ] Accessibility pass (keyboard nav, contrast, alt text) targeting WCAG AA
- [ ] Image optimization, DB query plans (`EXPLAIN ANALYZE`) for search and feed
- [ ] Error pages (404/500), empty states, loading skeletons everywhere
- [ ] Beta test with 20 real students + 5 owners; fix top 10 issues

**Acceptance:** e2e green in CI; no high-severity audit findings; Lighthouse ≥ 90 on landing and ≥ 85 on app pages (mobile); beta feedback triaged.

---

### Phase 11 — Deployment, launch & iteration (Week 15–16 and ongoing)
**Goal:** go live and learn. See Sections 14–16 for details.
- [ ] Production Supabase project, migrations applied via CI, backups enabled
- [ ] Production Vercel project, custom domain, HTTPS, env vars set
- [ ] Sentry + PostHog + uptime monitor live
- [ ] Soft launch to one college + 20 owners
- [ ] Weekly metrics review; fix → ship → measure loop

**Acceptance:** production passes smoke test checklist (Section 14.5); first real listings and first real match happen in production.

---

## 12. Testing strategy

| Level | Tool | What to cover |
|-------|------|---------------|
| Unit | Vitest | matching engine, validators, price/filter helpers, plan-limit logic |
| DB/RLS | SQL tests via `supabase test db` or Vitest + service role | every RLS policy: allowed and denied cases |
| Integration | Vitest + local Supabase | server actions: create listing, enquiry, swipe→match, webhook |
| E2E | Playwright (mobile + desktop viewports) | critical flows listed in Phase 10 |
| Manual | Checklist in `docs/qa-checklist.md` | camera/photo upload on real phones, slow 3G, low-end Android |

**Rules for Codex:** every new feature ships with tests; bug fixes start with a failing test; CI must be green to merge.

---

## 13. Security, privacy & legal (India-focused)

**Security**
- RLS on all tables; service-role key only on the server; rotate keys if leaked.
- Validate every input (Zod); sanitize user-generated text; escape on render.
- Private bucket for ID/proof documents with signed URLs, short expiry.
- Hide phone numbers until enquiry/match; never log OTPs or tokens.
- Rate-limit auth, swipes, messages, enquiries; CAPTCHA on repeated OTP requests.
- Webhook signature verification (Razorpay); idempotent payment handlers.
- Security headers, `httpOnly` secure cookies, dependency scanning (Dependabot).

**Privacy (DPDP Act 2023 — get legal review)**
- Explicit consent at signup; clear purpose for each data field.
- Data minimization: do not collect caste, religion, or exact home address.
- Right to access/delete: self-serve data export and account deletion.
- Retention policy: delete unverified documents after review; purge deleted accounts within 30 days.
- Name a grievance officer; publish contact in Privacy page.

**Legal / compliance**
- Terms of Service (platform is an intermediary; owners responsible for listing accuracy), Privacy Policy, Community Guidelines, Refund Policy.
- Listing rules: no discrimination language in listings or roommate prefs beyond lifestyle (food, smoking, sleep); moderate caste/religion-based exclusions out.
- GST registration when revenue crosses threshold; invoices for subscriptions.
- Consult a lawyer before launch for ToS/privacy and for roommate-matching safety disclaimers.

**Women & safety features (non-negotiable)**
- Same-gender default for roommate matching; cross-gender only with mutual opt-in.
- Verified badges visible on profiles and listings.
- One-tap report/block everywhere; safety tips page; optional "share my visit details" link for PG visits.

---

## 14. Deployment & CI/CD

### 14.1 Environments
| Env | Purpose | URL | DB |
|-----|---------|-----|----|
| Local | development | `localhost:3000` | Supabase local (Docker) |
| Preview | every PR | Vercel preview URL | Supabase **staging** project |
| Staging | pre-release testing | `staging.<domain>` | Supabase staging |
| Production | live | `<domain>` | Supabase production |

### 14.2 Environment variables (`.env.example`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only
NEXT_PUBLIC_SITE_URL=
RESEND_API_KEY=
SMS_PROVIDER_KEY=                   # MSG91 / Twilio
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=                # server only
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_POSTHOG_KEY=
SENTRY_DSN=
CRON_SECRET=
```

### 14.3 CI/CD pipeline (GitHub Actions)
1. On PR: install → lint → typecheck → unit tests → build → Playwright smoke → Vercel preview.
2. On merge to `main`: run migrations against **staging** → deploy staging → run e2e.
3. On release tag `v*`: apply migrations to **production** (manual approval step) → promote Vercel deployment.
4. Migrations are forward-only; destructive changes require a two-step (expand → contract) migration.

### 14.4 Production checklist
- [ ] Custom domain + HTTPS + www redirect
- [ ] Supabase: PITR/daily backups on, connection pooling on, RLS verified, auth redirect URLs set
- [ ] Storage buckets: public (listing images) vs private (documents) policies verified
- [ ] SMS provider DLT registration done (India) and OTP template approved
- [ ] Email domain verified (SPF, DKIM, DMARC)
- [ ] Razorpay live keys + webhook URL registered
- [ ] Sentry, PostHog, uptime monitor (e.g. Better Stack / UptimeRobot) connected
- [ ] `robots.txt` / `sitemap.xml` submitted to Google Search Console
- [ ] Legal pages linked in footer and onboarding

### 14.5 Smoke test after every production deploy
1. Landing page loads < 2 s
2. Login with OTP works
3. Search returns listings; listing detail opens
4. Send enquiry (test account) → owner sees it
5. Roommate feed loads; swipe works
6. Chat message delivers
7. No new Sentry errors for 15 minutes

### 14.6 Rollback
Vercel: instant rollback to previous deployment. DB: restore from backup only for data loss; otherwise ship a forward fix migration.

---

## 15. Observability & analytics

- **Errors:** Sentry (frontend + server), alert to email/Telegram on new issues.
- **Product analytics (PostHog):** events — `signup_completed`, `role_selected`, `listing_published`, `search_performed`, `listing_viewed`, `enquiry_sent`, `roommate_profile_completed`, `swipe`, `match_created`, `message_sent`, `payment_succeeded`.
- **Funnels to watch:** signup → profile complete → first enquiry; signup → roommate profile → first match → first message.
- **Health:** uptime monitor on `/api/health`; Supabase dashboard for slow queries.
- **Weekly review:** supply (active listings, vacancy %), demand (searches, enquiries), match rate, response time of owners, churn, revenue.

---

## 16. Launch & growth plan

**Pre-launch (Phase 0–10)**
- Landing page with waitlist (email/phone) from week 2
- Seed 20–50 real PGs (visit owners in person; offer 3–6 months free Pro plan)

**Soft launch (Week 15–16)**
- One college: campus ambassadors, WhatsApp groups, Instagram reels ("5 red flags before taking a PG"), posters near hostels
- Help every early user personally; collect feedback in-app (1-tap rating + comment)

**Growth loops**
- Roommate invites: "Invite a friend, both get premium for 7 days"
- Shareable listing and "roommate wanted" cards with WhatsApp share
- SEO pages per college and locality ("PG near <college> under ₹8000")
- Owner referral: owner invites another owner → free featured week

**Expansion criteria:** next college/city only after ≥ 60% of listings have a response within 24 h and ≥ 30 mutual matches/week in the current area.

---

## 17. Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| Cold start: no owners → no students | Onboard owners manually first; seed real listings; launch in one tiny area |
| Fake or misleading listings | Verification flow, photo minimums, report button, verified badge, periodic stale-listing checks |
| Roommate pool too small to match | Combine with PG search so every student has value; widen filters gradually; show "invite friends" |
| Safety incidents / harassment | Same-gender default, contact hidden until match, report/block, moderation, safety tips |
| Owners won't pay | Start with free; prove leads first; try pay-per-lead; talk to owners weekly |
| Off-platform deals (leakage) | Value-add features owners keep (vacancy manager, analytics, verified badge) rather than blocking contact |
| Legal/privacy issues | Minimal data, consent, deletion flow, lawyer review of ToS/privacy |
| Scope creep with Codex | One phase at a time, acceptance criteria, small PRs, review every diff |
| Costs rising | Stay on free tiers; compress images; cache feeds; set Supabase/Vercel spend alerts |

---

## 18. Timeline summary

| Weeks | Phase | Output |
|-------|-------|--------|
| 0–1 | 0 Discovery | validated idea, seed data, accounts created |
| 1–2 | 1 Setup | repo, DB schema, RLS, CI |
| 2–3 | 2 Auth | login, roles, profiles |
| 3–5 | 3 Owner & listings | owners publish verified PGs |
| 5–7 | 4 Discovery | search, detail, enquiry |
| 7–8 | 5 Roommate profile | questionnaire |
| 8–10 | 6 Matching | engine + swipe + matches |
| 10–11 | 7 Chat | realtime chat + notifications |
| 11–12 | 8 Safety & admin | moderation, legal, rate limits |
| 12–14 | 9 Monetization | plans, payments, premium |
| 14–15 | 10 Hardening | e2e, security, performance, beta |
| 15–16+ | 11 Launch | production, soft launch, iterate |

**Fastest path to a public beta:** Phases 0–8 (≈ 12 weeks). Phase 9 can wait until there is real traffic.

---

## Appendix A — `AGENTS.md` (put in repo root)

```markdown
# AGENTS.md

## Project
PG listings + roommate matching platform for students (India). Read plan.md before any task.

## Stack
Next.js (App Router, TypeScript), Tailwind + shadcn/ui, Supabase (Postgres, Auth, Storage, Realtime, RLS, PostGIS), Zod, Vitest, Playwright, Vercel.

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Unit tests: `npm test`
- E2E: `npm run test:e2e`
- DB: `npx supabase start`, `npx supabase db reset`, `npx supabase migration new <name>`

## Rules
1. Work on ONE phase/task at a time as instructed. Do not add features outside plan.md scope.
2. Every table must have RLS enabled with explicit policies. Add RLS tests for new tables.
3. Validate all inputs with Zod on the server. Never trust client data.
4. Never put secrets in client code or commit `.env` files.
5. Matching logic stays in `src/lib/matching` as pure, unit-tested functions.
6. TypeScript strict mode; no `any` unless justified with a comment.
7. Mobile-first UI; every page needs loading, empty and error states.
8. Run lint, typecheck and tests before finishing. Do not leave failing tests.
9. Schema changes only via new migration files in `supabase/migrations/`. Never edit applied migrations.
10. Small commits with clear messages. State assumptions made in the commit/PR description.
11. If a requirement is ambiguous, pick the simplest option, note the assumption, continue.
12. Do not log or expose personal data (phone numbers, documents, OTPs).

## Definition of done (any task)
- Acceptance criteria in plan.md met
- Tests added/updated and passing
- Lint + typecheck + build pass
- No console errors; accessible labels on inputs/buttons
- plan.md checkboxes updated
```

## Appendix B — Prompt templates for Codex

**Start a phase**
```
Read plan.md and AGENTS.md. Implement Phase <N> only, in the order of its task list.
Meet every acceptance criterion. Add tests. Run lint, typecheck, tests and build.
When finished, tick the completed checkboxes in plan.md and summarize: what was built, assumptions made, anything skipped.
```

**Single task**
```
In plan.md Phase <N>, implement only this task: "<paste task line>".
Touch the minimum files needed. Add tests. Do not refactor unrelated code.
```

**Bug fix**
```
Bug: <describe>. Steps to reproduce: <steps>. Expected: <x>. Actual: <y>.
First write a failing test that reproduces it, then fix it, then run the full test suite.
```

**Review pass (use after each phase)**
```
Review the changes from this phase against plan.md and AGENTS.md.
List: missing acceptance criteria, security/RLS gaps, missing tests, accessibility issues, performance concerns. Do not change code yet — just report.
```

## Appendix C — Quick glossary
- **PG** — Paying Guest accommodation (room/bed rented in a shared house, usually with meals).
- **RLS** — Row Level Security: database-enforced rules for who can read/write each row.
- **Mutual match** — both users liked each other; unlocks chat.
- **Dealbreaker** — a preference that automatically excludes a candidate if violated.
- **Lead** — a student enquiry sent to an owner; the unit of pay-per-lead billing.

---

*End of plan.md. Update this file as decisions change — it is the project's memory.*
