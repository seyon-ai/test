# ClinicFlow AI — Director Demo Script (Tuesday)
**Total runtime: ~4–5 minutes live.** Practice once end-to-end before the meeting.
Fictional patient data only. Never create a record with a real patient's name or number.

---

## Pre-flight (5 minutes before)

1. Open the demo site, sign in with ChatGPT, let the dashboard fully load.
2. Optional but recommended: **Settings → "Reset demo data"** (Admin) so the workspace is exactly the scripted state. (If that button isn't published yet: sign in with a fresh ChatGPT account — a new sign-in auto-seeds the 12 fictional enquiries.)
3. Open these 4 pages in mind-order: **Enquiry Inbox → CRM Pipeline → Appointment Requests → Follow-Up Automation**. Keep Analytics and Settings as the "depth" pages.
4. Browser at 100% zoom, bookmarks bar hidden, notifications off. Phone silent.
5. Backup: have the recorded demo video (see RECORDING-SCRIPT) open in another tab.

**Opening frame (say this once):**
> "Everything you'll see today is a private demonstration workspace — the patients are synthetic and every simulated channel is clearly labelled. The workflows, permissions and audit trail are real system behaviour. I'll show one enquiry going through the whole journey — it takes about four minutes."

> **Version note:** this script assumes the updated demo workspace (**Stellar Dental — Demo Workspace**, staff shown as *Front Desk / Treatment Coordinator / Practice Manager*). If you're demoing the currently deployed build instead, the sample clinic reads "BrightSmile Dental Demo" and staff are *Aisha/Daniel/Mei* — same behaviour, just say "sample workspace; yours would carry your clinic's name and staff".

---

## The guided flow

### Beat 1 — Enquiry capture + approved auto-reply (60s)
**Go to: Enquiry Inbox → "Create test enquiry"**
- Fill: name `Nurul Izzati` (say: "synthetic patient"), service **Braces & Aligners**, source Website, message *"How do I request an appointment? I would like braces."* — tick consent.
- **Show the thread:** patient message → automatic reply. Click the reply to show the **FAQ source** badge.
- **Say:** "The reply is the clinic's own approved answer, sent word-for-word — the assistant never invents information. Notice it logged the patient's follow-up consent."

### Beat 2 — The safety guard (30s)
**In the same inbox view**, open the enquiry from **Arjun Kumar** ("My tooth hurts, what should I do?").
- **Show:** automatic reply is the fixed **staff handoff** — no clinical advice, no pain questions answered.
- **Say:** "Anything clinical, urgent, or about pricing goes to a human. This is deliberate: an assistant that answers 'what should I do about my toothache' is a liability for a clinic."

### Beat 3 — Routing + pipeline (45s)
**Go to: CRM Pipeline**
- **Show:** Nurul Izzati's card is assigned to **Treatment Coordinator** (Braces & Aligners rule). Arjun's went to **Front Desk**.
- **Say:** "Assignment is automatic and rule-based — you configure which staff handle which service category."
- **Try (expected to fail):** drag/set Arjun's stage to *Confirmed* → show the refusal message.
- **Say:** "Confirmed appointments can't be clicked into existence — staff must confirm an actual appointment request. That keeps the pipeline honest."

### Beat 4 — Appointment request + explicit confirmation (45s)
**Go to: Appointment Requests**
- Open Nurul's request (preferred time shown, marked *"availability unverified"*).
- Click **Confirm** as staff. Note the actor + timestamp in history.
- **Say:** "In the demo this records a staff decision. In a paid implementation this connects to your booking process — request, confirm, and the patient is notified on WhatsApp."

### Beat 5 — Follow-ups + suppression (60s)
**Go to: Follow-Up Automation**
- Point at the job list: pending / sent / cancelled rows with reasons.
- **Advance the follow-up clock 24h** → show a job transition to **Sent (simulation)**. The label says simulation because no messaging provider is connected in the demo.
- **Say:** "Follow-ups go only to patients who consented. If staff take over the conversation, the patient opts out, or the appointment is confirmed — the follow-up cancels automatically. There's a live demo of this: open Chloe Tan's enquiry, enable human takeover, and show its pending job cancel immediately."
- Point to the **two-attempt retry ceiling**: "Failures never retry forever. Nothing annoys a patient like a runaway bot."

### Beat 6 — Audit + reporting (45s)
**Go to: Overview, then Analytics**
- Overview: KPI cards (enquiries, pending requests, confirmed, automated vs **human** response times shown separately).
- Analytics: date filter → metrics update. Click **Export CSV**.
- **Say:** "The export deliberately contains no names, phone numbers or message content — just workflow metadata. Every action in the system is in the audit trail with who, what and when."

### Close (30s)
**Go to: Settings** — show Roles (Admin / Receptionist / Manager, enforced server-side) and the routing rules.
> "What's demo-only today: the outbound channels are simulated and labelled as such. A paid implementation replaces those with your real WhatsApp Business number, your approved FAQ content, and staff accounts — the workflow engine is already the real thing. Happy to walk through what that rollout looks like."

**Then stop selling.** Let the director talk. Pricing is your conversation.

---

## If something breaks

| Problem | Fallback |
|---|---|
| Site won't load / sign-in fails | Switch to the backup recording immediately, don't debug live |
| Action fails or looks wrong | "That's the demo workspace — let me reset it" → Settings → Reset demo data, or move on to the next beat |
| Director asks about a live WhatsApp demo | "The message content and consent logic are live in the system; the sending is simulated and labelled — connecting your WhatsApp number is the first implementation step, and I'll show you the exact plan." |
| Asked for real patient data / their own data | "Everything here is synthetic by design — real data goes in only after the security and privacy review." |

## Do NOT
- Do not claim WhatsApp/CRM/scheduling are connected — the labels say simulated and the director can read.
- Do not enter real patient names or phone numbers "just to test".
- Do not promise EMR/insurance/clinical features.
- Do not let the meeting become a feature-list tour — the strength is the one-enquiry journey.
