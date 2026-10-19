# Tuesday Demo Prep — Summary & Checklist
**Meeting:** Stellar Dental clinic director, Tuesday (20 Oct 2026). Goal: demonstrate the system, gauge interest in paid implementation.

## The pack (this folder)

| File | Purpose | For whom |
|---|---|---|
| `DEMO-SCRIPT.md` | The guided 4–5 min live demo (click-by-click + talk track + fallbacks) | Presenter |
| `RECORDING-SCRIPT.md` | Backup demo video — record Monday | Presenter |
| `TEST-REPORT.md` | Feature-by-feature verification proof + browser checklist | Both |
| `CLINIC-RESEARCH.md` | Verified Stellar Dental facts + fit questions | Presenter |
| `INTEGRATIONS-RESEARCH.md` | WhatsApp/HighLevel/booking reality + costs + timeline | Both |
| `TECH-QA-BRIEF.md` | Answers to the 5 likely director questions | Presenter |
| `scripts/demo-walkthrough.mjs` | Re-runnable proof of the full workflow (`node scripts/demo-walkthrough.mjs`) | Technical |
| Source changes (below) | Demo personalisation + **Reset demo data** button | Technical |

## Source changes vs the currently deployed demo (v3 export)
1. `lib/clinic-config.mjs` *(new)* — Stellar Dental identity + service categories + honest channel status table
2. `lib/seed.mjs` — demo workspace personalised ("Stellar Dental — Demo Workspace"): real locations/hours/contact routes in clinic profile + approved-FAQ seed, service categories matching their own inquiry form, one implants scenario. Patients remain synthetic. *(Also: `seed()` = empty live state for future real use; `demoSeed()` = the 12-enquiry demo.)*
3. `lib/engine.mjs` / `lib/faq.mjs` — 5-service taxonomy + Stellar vocabulary in the admin-FAQ matcher (clinical/price/urgency guard unchanged)
4. `app/api/action/route.ts` + `app/page.tsx` — **Reset demo data** (Settings, Admin-only, audited) → one click restores the scripted 12-enquiry workspace
5. `app/layout.tsx` — title "ClinicFlow AI | Stellar Dental Demo Workspace"
6. `tests/` — updated expectations; deterministic clock fix
7. **Demo labels kept exactly as deployed** ("DEMO — FICTIONAL DATA", "SIMULATION ONLY", "Not Connected — Demo Mode") per requirement "keep simulated features clearly labelled"

## Before Tuesday — checklist

### Today/Monday
- [ ] **Record the backup video** (`RECORDING-SCRIPT.md`) — highest-value insurance
- [ ] Publish source changes to the demo site (below) **or** decide to demo the deployed version as-is (it's fully working — see fallback note)
- [ ] Practice DEMO-SCRIPT once end-to-end (timed, 4–5 min)
- [ ] Browser checklist from `TEST-REPORT.md` (login, 5 reloads, second tab, one enquiry flow, phone/mobile view, logout)
- [ ] Load TECH-QA-BRIEF on the presentation laptop (offline copy)

### Tuesday morning
- [ ] Sign in → **Reset demo data** → verify 12 enquiries and the Overview numbers
- [ ] Open DEMO-SCRIPT + backup video in separate tabs, Do Not Disturb on, laptop power, phone hotspot ready
- [ ] Print/wire the one-page CLINIC-RESEARCH "ASK" list — the director conversation matters more than features

## Publishing the source changes (owner workflow)
These changes are **source-level** and go live through the ChatGPT Sites project that owns `clinicflow-ai.yourdigitalchad.chatgpt.site` (workspace "yourdigitalchad") — **do not** hand-deploy elsewhere before Tuesday (per the export notes: no migration, no auth changes).
1. In the Sites project, replace the changed files listed above (the whole folder is in this zip — **include `build/`** if transferring manually; it was lost once already).
2. Publish. Then sign in and click **Settings → Reset demo data** (important: existing workspaces do not auto-reseed).
3. Verify with the browser checklist.

**Fallback if publishing can't happen before Tuesday:** demo the deployed version as-is — the engine, workflows and demo data are identical (all 24+20 checks pass against the same code). Adjustments by voice only:
- Workspace shows "BrightSmile Dental Demo" as the sample clinic → say "the sample workspace carries a placeholder clinic; yours would carry Stellar Dental's name, your two locations and your approved answers — we've already prepared those."
- Staff names are Aisha/Daniel/Mei instead of Front Desk/Treatment Coordinator → same difference.
- No Reset button → sign in with a fresh ChatGPT account for a clean workspace.

## Known demo-version boundaries (keep labelled, as planned)
Outbound messaging is simulated ("SIMULATION ONLY"), integrations show "Not Connected — Demo Mode", appointment confirmation is a recorded staff decision (no external booking). This honesty is a selling point — own it in the demo.

## After Tuesday (if they want to proceed)
`stellar-dental/` implementation starter + `BUILD-PLAN.md` (from the earlier work) already outline M1–M4: web form + email, staff logins, WhatsApp Cloud API (start Meta verification day one), deployment on `care.stellardental.my`. See `INTEGRATIONS-RESEARCH.md` for the cost/timeline numbers to quote against.
