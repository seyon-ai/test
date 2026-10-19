# Test Report — ClinicFlow AI demo verification (19 Oct 2026)

Verified on the `demo-tuesday` source (identical engine to the deployed site, plus demo content updates). All test data synthetic. Local runtime: Node 22.23.3, pnpm 11.25.

## Feature verification (task 1)

| Feature | Evidence | Status |
|---|---|---|
| Patient enquiry capture | Walkthrough step 1 (20/20 suite) + live API `create` → enquiry, contact (+60 normalised), consent, inbound message all persisted | ✅ |
| CRM dashboard & pipeline | Walkthrough steps 3/7 + live API: pipeline `{Closed/Lost 1, Confirmed 2, Appt Requested 2, Contacted 7, Attended 1}` reconciles with records; metrics match in acceptance tests 12/17 | ✅ |
| Approved FAQ responses | Walkthrough steps 3–4: approved questions answered with **verbatim** approved text; clinical/price/urgent wording → fixed staff handoff (acceptance tests 5/6) | ✅ |
| Automatic staff assignment | Walkthrough step 2: Braces & Aligners → Treatment Coordinator; all 5 routing branches + disabled-fallback covered (acceptance test 4) | ✅ |
| Appointment request & confirmation | Walkthrough step 5 + live API: request Pending → explicit staff Confirm → stage Confirmed; pipeline cannot self-confirm (acceptance test 7) | ✅ |
| Follow-up scheduling & suppression | Walkthrough step 6 + live API: job auto-scheduled (consent), sent exactly once on clock advance, cancelled on takeover/opt-out/confirmation ("Enquiry resolved or terminal" observed live); 6 suppression modes + 2-attempt retry ceiling (acceptance tests 8–11, 15) | ✅ |
| Audit logs & reporting | Walkthrough step 7: every action audited with actor/role/timestamp; replayed event IDs suppressed with zero mutation; `/api/qa` bounded summary omits contact details (acceptance tests 3/23) | ✅ |

## Test execution record

| Check | Result |
|---|---|
| `node --test tests/acceptance.mjs` — workflow & regression | **24/24 PASS** |
| `node --test tests/demo-walkthrough.mjs`-style full journey (`scripts/demo-walkthrough.mjs`) | **20/20 PASS** |
| `node --experimental-strip-types --test tests/dev-auth.mjs` — auth boundaries (loopback-only fixture, header stripping, cross-origin/remote/forgery rejection) | **9/9 PASS** |
| `pnpm exec tsc --noEmit` | **Clean (exit 0)** |
| `pnpm build` (production build) | **Complete** |
| `python3 tests/database-persistence.py` — real migrated D1 file: reload, membership, entity refs, stale-revision rejection | **PASS** |
| Live local API session — sign-in → **5 consecutive state loads** (simulated reloads) | Identical state hash `7aff3834b9c6` ×5 |
| Live workflow via API — reset → create → confirm → advance 25h | All actions 200; suppression + audit observed |
| **Server restart persistence** | Revision 4, 13 enquiries, snapshot digest `722ee23dd0aa` **unchanged after restart** |
| Anonymous access to `/api/state` | **401** (sign-in required) |
| Origin-less cross-check | POST requires same-origin when Origin header present |

## Bugs found & fixed

1. **Demo-seed test clock drift (real bug in test harness):** fixture preferred-dates were hard-coded while the workspace clock used wall time → 4 failures as "today" advanced. Fixed: tests pin a deterministic clock. (Also fixed in the implementation fork.)
2. **Missing `build/` tooling after source transfer (environment bug, not app):** the `build/` directory (Sites build plugin, required by `vite.config.ts` and dev-auth tests) was lost during file transfer. Restored from the original ZIP. **When handing the source to anyone, ship the whole folder including `build/`.**
3. **UI-claims honesty test vs demo wording mismatch** after content updates: expectations aligned to the demo's "DEMO — FICTIONAL DATA / Not Connected — Demo Mode / SIMULATION ONLY" labels (which task 2 explicitly wants kept).
4. **No functional engine bugs found.** Validation, routing, idempotency, suppression and metrics behave as documented across 24+20 automated checks.

## New for the demo (not a rebuild)

- **"Reset demo data" (Admin)** in Settings → restores the pristine 12-synthetic-enquiry scenario in one click (server-enforced Admin-only, audited). Solves "messy workspace mid-demo".
- Demo workspace personalised for the meeting: clinic profile **Stellar Dental — Demo Workspace**, services matching their real inquiry categories, FAQ answers with their real public locations/contact routes, one implants scenario. All patients still synthetic and labelled.

## Not verifiable in this environment (friend's browser checklist)

The live `chatgpt.site` deployment and visual/mobile layout need a real browser — do this once before Tuesday (5 min):

1. Sign in to the demo site → dashboard loads with seeded enquiries. *(If the workspace predates the content update, click **Settings → Reset demo data**, or sign in with a fresh ChatGPT account.)*
2. Reload the page **5 times** — data must persist each time (it is saved in the cloud database).
3. Open a second tab → same data.
4. Run one enquiry end-to-end (DEMO-SCRIPT beats 1–5).
5. Mobile check: open on a phone → sidebar collapses to the hamburger menu, tables scroll, forms usable.
6. Log out/in once.

## Backup recording

Cannot be produced from this environment (no screen capture). See `RECORDING-SCRIPT.md` — 10 minutes to record a 5-minute Loom with the exact narration.
