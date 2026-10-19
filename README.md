# ClinicFlow AI

Private, authenticated dental enquiry automation demonstration for BrightSmile Dental Demo. Synthetic data only. No provider sends or external booking calls are made.

## Try the application

1. Open the deployed private Site and sign in with ChatGPT.
2. Click **Create Test Enquiry**. Use invented data, choose an administrative question, optional preferred date/time and follow-up consent.
3. The inbox displays the contact reference, routed staff, approved reply source or handoff, consent and audit trail.
4. Review the same record in **CRM Pipeline** and **Appointment Requests**. Only Admin or Receptionist can explicitly confirm. Record attendance through the CRM stage selector.
5. Open **Follow-Up Automation**, advance the deterministic clock and inspect pending, sent simulation, failed or cancelled jobs. Eligible sends are simulated once. Retry is manual and bounded to two attempts.
6. Process an opt-out or enable human takeover in the inbox. Pending jobs cancel immediately and are also checked again at execution.
7. Edit approved administrative FAQ records and routing rules as Admin. Settings lets the owner preview Receptionist and Manager permissions, enforced by the backend.
8. Analytics uses timestamps in Malaysia time. Export omits display names, message content and phone numbers.

## Technical setup

- Node >=22.13.0. Install dependencies with `pnpm install --frozen-lockfile`.
- `pnpm dev` launches the Vinext development app. In the portable local profile, sign in at `/signin-with-chatgpt?return_to=/`. Hosted authentication is owned by Sites.
- `.openai/hosting.json` declares `DB` for Cloudflare D1. Do not put secrets in this manifest or the client.
- Generate appended schema migrations with `pnpm db:generate`.
- Build via the Sites build helper or `pnpm build` for standalone use.
- For a local D1 test instance, apply pending SQL once:
  `node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_groovy_goblin_queen.sql`
- `node --test tests/acceptance.mjs` runs workflow acceptance tests.
- `python tests/database-persistence.py` tests a migrated local D1 database and removes its temporary test workspace.
- `pnpm exec tsc --noEmit` verifies TypeScript.
- Sites publication applies hosted migrations. Local test records are never uploaded.

## Architecture and schema

`components/ui.tsx` contains shared UI components, and `app/page.tsx` contains the eight page views. `lib/engine.mjs` owns atomic enquiry processing and audited actions. Separate modules implement FAQ retrieval, staff routing, appointment management, follow-up execution, reporting, authorization and mock integration adapters. API routes require authenticated identity and membership for every read/write. The only role override is an Admin-owned demo preview that can narrow access. A non-Admin member cannot elevate through request parameters.

D1 stores `workspaces` and `memberships`. A workspace is an atomic, versioned JSON aggregate with structured entity collections: clinic, users, roles, contacts, enquiries, messages, FAQ entries, appointment requests, follow-up jobs, consent records, routing rules, audit events and integration events. IDs relate these collections; contacts and enquiries have distinct IDs. Unique integration event IDs are persisted and checked before mutation. Optimistic revision checks prevent concurrent requests from overwriting data or persisting duplicate events. This bounded demo design uses an aggregate rather than independently queryable SQL tables for every entity. A production migration should normalize these entities, add foreign keys/indexes and database-level event uniqueness for scale.

Each authenticated owner is provisioned an isolated fictional clinic. The directory is synthetic routing staff, not invited sign-in accounts. Shared clinic membership administration is explicitly unavailable in this first demonstration. Backend membership roles exist and are enforced.

FAQ matching is deterministic and conservative: supported administrative phrases, a limited administrative vocabulary and clinical/price/availability guards. Every supported reply is the exact saved approved answer. Unknown vocabulary or unsupported scope produces a fixed staff handoff. The tester is a read-only preview; persisted enquiry processing uses the same module on the server.

Follow-up jobs are evaluated against the demo clock. Consent is tracked at contact level, so an opt-out cancels eligible jobs across associated enquiries. Takeover, resolution, terminal pipeline stages and confirmed/rejected/cancelled requests suppress sends. Failed sends stay failed until an authorized manual retry. No autonomous background scheduler runs in this demo.

## Acceptance verification

23 automated workflow and regression checks cover ten unique enquiries, contact association, replay suppression, routing, FAQ scope, clinical handoff, explicit appointment confirmation, simulated-time execution, suppression conditions, execution-time consent checks, failed-send retries, calculated metrics/date filters, role restrictions, linked state serialization and input/stage validation. An additional migrated-D1 check verifies actual disk persistence, role reload and stale-revision rejection. Build and TypeScript checks are run before publication. Interactive browser and mobile visual QA are unavailable in the authoring environment and are not claimed as verified.

## Production integrations still required

- HighLevel CRM API access, field mapping and authenticated webhook ingestion.
- WhatsApp Business and email credentials, approved templates, consent policies and delivery-status webhooks.
- A verified scheduling provider with slot lookup, booking identifiers, conflict handling, timezone configuration and rescheduling.
- Real clinic-approved FAQ content and ongoing approval governance.
- Shared staff membership invitations and access administration.
- A server/background job scheduler, durable send idempotency, monitoring, retention and production backups.
- Production security/privacy review before any real patient data is used.

All integration cards initially read **Not Connected — Demo Mode**. Appointment confirmation is only a recorded staff decision, not a verified external reservation. Display data and demo numbers are invented, and must not be used for real contact attempts.

## Published QA status — 11 October 2026

Production document and API access were tested without sign-in and returned HTTP 401. A platform-authorized service request without a browser identity also received application HTTP 401, including an attempted appointment mutation. Live database inspection confirmed the schema and a saved workspace, but its JSON state was truncated by the read tool, so production record totals could not be reconciled. Browser sign-in reached Google but returned HTTP 502 / connection refused, including one reload. Authenticated enquiry submission/reload, role actions, follow-up clock actions, dashboard reconciliation, mobile layout and interactive Back/Forward tests are therefore BLOCKED / NOT EXECUTED. Local test passes do not establish a published end-to-end pass.

Corrections separate automated and human response averages, explicitly mark all channels disconnected (including SMS), label sent history as simulated, normalize contact phone prefixes and persist navigation using URL hashes. Browser verification of those corrections remains pending. No new automation feature was added.

## Fictional development administrator fixture

A clean portable checkout provides the platform's loopback-only development fixture. Run `pnpm dev` and open `http://localhost:5173/signin-with-chatgpt?return_to=/`. The fictional identity is `local_clinicflow_demo_admin`, display name Fictional Clinic Administrator, with an isolated synthetic workspace. No password or production credential is used. The middleware strips caller-supplied identity headers, requires both a loopback host and loopback remote address, rejects cross-origin sign-in and is disabled for builds and managed previews. This is local development authentication only. It does not authenticate a published Site.

`node --experimental-strip-types --test tests/dev-auth.mjs` verifies those boundaries. After building, `node qa/check-auth-artifact.mjs` proves fixture markers are absent from the production Worker.

## Published authentication diagnosis and bounded verification

A normal owner browser successfully called GET /api/state at 2026-10-11 13:37 Malaysia time (HTTP 200; request 76c2afef07c7ebafd8ada3b6c1b1b97a). The cloud testing browser's Google sign-in page returned HTTP 502 / connection refused. Preview-renderer requests carrying email/name but no stable user ID correctly received 401. Do not substitute email for the required stable identity or enable loopback authentication in hosted code. No app-level authentication secret is missing: hosted sign-in is platform-owned.

After sign-in, `/api/qa` returns a bounded, read-only verification summary with revision, collection counts, status breakdowns, recent enquiry IDs, state byte length and a snapshot digest. It omits contact names, numbers and message content. The endpoint still requires platform user identity and workspace membership. Diagnostic tool truncation is separate from the application's API response; no actual truncated application response has been demonstrated.
