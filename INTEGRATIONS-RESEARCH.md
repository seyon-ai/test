# Integration Research — what a real implementation needs (19 Oct 2026)

Current state: all external channels in the demo are **simulated and labelled** (messaging/CRM/scheduling adapters are mock implementations with a clean swap-in contract: `send(job)`, `capture(enquiry)`, `request(appointment)`). Nothing below is connected yet.

## 1. WhatsApp Business

**Two routes:**
| Route | What it is | Cost | Effort |
|---|---|---|---|
| **Cloud API via BSP** (360dialog, Twilio, Wati, AiSensy, etc.) | Fast onboarding, hosted API, template management, webhooks | Meta fees + BSP fee (~RM 100–500/mo typical) | Days |
| **Meta Cloud API direct** | Direct from Meta, cheapest at scale | Meta fees only | More setup work (webhook server, template approval) |

**Meta's official per-message rates — Malaysia (from 1 Jul 2025; updated 1 Oct 2026):**

| Category | MYR / delivered message | Notes |
|---|---|---|
| Marketing (promos, broadcasts) | **RM 0.3467** | Always charged |
| Utility (appointment reminders, confirmations) | **RM 0.0564** | Volume tiers at high scale |
| Service (human reply within 24h of patient's message) | First **1,000/month free per number**, then **RM 0.0564** | New since 1 Oct 2026 |
| Click-to-WhatsApp ads / FB Page button window | **Free for 72h** from first reply | "Free entry point" |
| Inbound patient messages | **Free** | |

*Example monthly messaging cost: 2,000 appointment-reminder (utility) messages ≈ **RM 113** + 1,500 service replies after the free tier ≈ RM 85 → ~RM 200/mo total. Scale: 500/mo ≈ RM 30–60.*

**Rules that shape the product (non-negotiable):**
- **Opt-in required** before any outbound template; our consent records already track this.
- Outside the 24-hour patient-service window, only **pre-approved templates** can be sent (our follow-ups = utility templates, e.g. "Hi {name}, following up on your enquiry… reply to continue").
- Template approval takes hours–days; business verification (WABA) takes **days–weeks — start now**.
- Their current `wa.me/60113996…` number can be **migrated** to the Business Platform (brief downtime, profile preserved). Keep the existing consumer/Business-app flow working until cutover.
- **Limitation:** automated replies must stay administrative — matches our approved-FAQ-only design.

## 2. HighLevel (GoHighLevel) as CRM

| Plan | Monthly | Relevant |
|---|---|---|
| Starter | **$97** (3 sub-accounts) | CRM, pipelines, calendars — **no API access** |
| Unlimited | **$297** | **API + webhooks** + white-label — needed for integration |
| Agency SaaS Pro | **$497** | Reselling to end clients |

- Integration shape: our Care Desk pushes enquiries/contacts to HighLevel via API (or receives form submissions from HighLevel). HighLevel can also *be* the WhatsApp reseller (they resell Meta rates at a small markup, e.g. MY utility ~$0.0147).
- **Cost note for the client:** GHL is only worth it if they want the full marketing/CRM suite. If they just need enquiry + follow-up + WhatsApp, our Care Desk alone is cheaper than GHL. Don't push GHL unless they ask for CRM features — it's a $3,564+/yr line item.
- **ASK:** do they already use any CRM/marketing tool? (Don't assume.)

## 3. Clinic booking / practice software (Malaysia landscape)

Observed market: local clinic-management systems (Cliniclah, Klinify, Aoikumo, CliniSys, desk.clinic ~RM 89–189/mo, LamaniPulse) handle patient records, billing, MyInvois e-invoicing; lightweight booking widgets (Calendly/Setmore/SimplyBook/Cal.com, ~RM 50–200/mo) handle slots; many dental clinics simply run WhatsApp + an appointment book.

**Integration options (depends on what they use — ASK first):**
1. Provider has an API/webhook → we sync appointment requests/confirmations directly (best case).
2. No API → our "appointment request" stays the record of intent; staff confirm in Care Desk **and** in their diary (two clicks, zero new software).
3. They want online booking too → lightweight widget on the website + webhook into Care Desk.

**We do not replace their clinical record system.** Care Desk is the enquiry/communication layer.

## 4. Automation tools

- The Care Desk engine already runs scheduling/suppression/audit — no extra automation platform needed for follow-ups.
- Optional glue (only if they want CRM sync etc.): n8n/Make (~RM 0–100/mo) — our adapters usually make this unnecessary.

## 5. Security & compliance requirements

- **PDPA 2010 (Malaysia):** explicit consent for follow-ups (already recorded per contact), purpose limitation, retention policy, patient access/deletion requests → include in implementation checklist.
- Data hosting: their site states "hosted in Malaysia" — offer a Malaysian data-residency option for the Care Desk DB to match expectations.
- Access control: role-based (Admin/Receptionist/Manager), server-enforced — exists today; staff individual logins are an implementation deliverable.
- Encryption in transit (TLS) standard; at-rest (platform-managed). Audit trail of every action — already built.
- WhatsApp templates must never include clinical advice; patient data minimisation in exports (already: exports exclude names/phones/message text).
- Before real patient data: security/privacy review + backup/retention policy (already listed in the implementation plan).

## 6. Realistic implementation timeline

| Phase | Work | Calendar |
|---|---|---|
| 0 | Kickoff: FAQ sign-off, staff list, access to website + WhatsApp number | Week 0 |
| 1 | Web enquiry form live (site → Care Desk) + email notifications + staff logins | **Week 1–2** |
| 2 | WhatsApp Business: verification, templates, send/receive wiring | **Week 2–5** (Meta approval is the long pole) |
| 3 | Booking-software integration (if any) + training + go-live | Week 4–6 |
| — | Quick win if WhatsApp approval slips: **web + email live in ~1 week**, WhatsApp deep-link keeps working meanwhile |

**Total: ~3–6 weeks** to full implementation. Recurring costs for the clinic: messaging (RM 50–300/mo typical) + hosting (low) + optional support plan.
