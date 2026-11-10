# Deployment status and procedure

## What can be deployed now

The Next.js frontend is a working browser-local demo. There are **no backend API routes, database migrations, Supabase clients, authentication, shared user data, real enquiries, mutual matches, or live chat** in this revision. Deploying this repository to Vercel will publish the demo; it will not create those backend features. The UI labels sample data and demo-only actions.

Vercel can host both the frontend and future Next.js API routes. Supabase is the selected provider for the future database/auth/storage/realtime layer. No rent collection or paid subscriptions are implemented.

## Vercel frontend

1. Connect the GitHub repository `aakashi009/PG-Amigo` to a Vercel project named `pg-amigo` in your account/team.
2. Select Next.js and repository root `.`. `vercel.json` specifies the frozen install and production build. Set the production branch to `main`.
3. No application environment variables are required for the current demo. Do not enter placeholder or invented Supabase keys.
4. Deploy. After the build succeeds, verify the assigned HTTPS URL, static images/fonts, PG search/filter/save, enquiry demo, roommate questionnaire/like flow, and mobile layout. Local storage belongs to the browser/origin, not a shared database.
5. Future pushes to `main` can deploy automatically through the Vercel Git integration. The CI workflow runs lint, typecheck, unit tests, build, and browser tests independently. It does not deploy or provision Supabase.

For an agent-driven deployment, provide a Vercel account token securely through the environment settings with access to `api.vercel.com`. If an existing project/team should be used, provide its non-secret project/team identifiers. An authenticated API check must succeed before creating resources. Never commit tokens or the `.vercel` directory.

## Supabase backend prerequisite

A Supabase project alone will not turn the local-storage demo into a backend. The backend implementation still needs:

- Auth and role onboarding, server-side validated requests, and cookie/session handling.
- Migrations and tested RLS for profiles, approved PG listings/rooms/photos, saved listings, enquiries, roommate preferences, swipes/mutual matches, and member-only conversations/messages.
- Owner/admin review and moderation, report/block, rate limits, and private contact/document handling.
- Integration of the frontend actions with those APIs; an explicit separation of sample data from real records.
- Staging tests with at least two users proving cross-account access is denied and mutual matching/chat works.

Use an existing Supabase project if available. Otherwise, project creation requires the selected organisation, region, and secure database credentials. Provide project URL and publishable key in Vercel's environment settings when integration is implemented. Privileged credentials belong only on the server and must not use a `NEXT_PUBLIC_` prefix. A Supabase management API token, if needed by the agent, must be supplied securely and scoped to `api.supabase.com`. Do not paste credentials into chat.

The original target data model and roadmap remain in `docs/product-plan.md` as reference, not completed features.

## Environment network access

Agent-driven deployment needs `api.github.com` (repository/deployment API checks), `api.vercel.com` (deployment API), and `api.supabase.com` (project management). The specific Supabase project hostname and assigned Vercel deployment hostname must also be allowed once known. Preserve existing package-manager network presets. Save configuration is distinct from application deployment and does not publish an environment snapshot.
