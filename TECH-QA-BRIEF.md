# Technical Q&A Brief — answers for the clinic director

Short, honest answers. The last column is what **not** to over-promise.

---

### Q1. "Can this connect to our existing WhatsApp?"
**Answer:** "Yes. Your existing WhatsApp number can be moved onto the WhatsApp Business Platform — patients keep messaging the same number. We then connect it to the system: outbound appointment reminders and follow-ups use approved message templates, and replies inside the 24-hour window come back to the shared inbox. Setup includes Meta business verification, which usually takes one to three weeks — that's why we start it first. Until it's live, your current WhatsApp flow keeps working unchanged."
**Don't promise:** same-day go-live; unlimited free broadcasts (marketing messages cost per message); auto-replies to medical questions.

### Q2. "Can it integrate with our appointment software?"
**Answer:** "Depends on what you use — that's one of the things I'd like to understand today. If it has an API or webhooks, we sync appointment requests and confirmations directly. If not, staff confirm in the Care Desk and in your existing diary — the Care Desk records the request, the consent and the conversation, without replacing your clinical records. Many clinics start with the Care Desk as the front layer and integrate later."
**Don't promise:** integration with a specific system before discovery; that we replace their PMS/EMR.

### Q3. "Is patient information secure?"
**Answer:** "Three things. First: today's demo contains only synthetic patients — nothing real. Second: in the real system, access is role-based and enforced server-side, every action is audit-logged with who/what/when, and data is encrypted in transit. Third: consent is a first-class record — follow-ups only go to patients who agreed, and an opt-out cancels everything pending immediately. We follow Malaysia's PDPA requirements for consent and retention, and we run a security and privacy review before any real patient data enters the system. Analytics exports deliberately exclude names, phone numbers and message content."
**Don't promise:** certifications we don't have (HIPAA, ISO 27001 — the clinic's ISO 9001 is theirs, not ours); "military-grade" fluff; storing clinical records (we don't).

### Q4. "Can multiple staff use it?"
**Answer:** "Yes — that's core design. There are three roles: Admin (configuration, FAQ approval, rules), Receptionist (enquiries, replies, appointments, opt-outs) and Manager (read-only reporting). Permissions are enforced on the server, not just hidden in the interface, and every action is attributed to the person who did it. In the demo you're seeing one owner login; staff accounts are part of the implementation — you'll tell us who needs which role."
**Don't promise:** unlimited named accounts on day one without setup; that role changes apply retroactively to past audit entries.

### Q5. "How long would implementation take?"
**Answer:** "A phased rollout, roughly three to six weeks total. The web enquiry form and email notifications can be live in about a week — quick value, no external approvals. The WhatsApp integration is the long pole because of Meta's business verification and message-template approval; we start that in week one so it lands while we train your team. Staff accounts and your approved FAQ content go in parallel. If WhatsApp approval takes longer, everything else still goes live — and your current WhatsApp button keeps working until we switch over."
**Don't promise:** under a week for full scope; a fixed date for Meta's approval.

---

### Likely follow-ups
- **"What does it cost?"** → that's the commercial conversation (your call). Recurring costs to be transparent about: WhatsApp messages (~RM 50–300/mo at typical clinic volume), hosting (low), optional support plan.
- **"Does it answer medical questions?"** → "No — deliberately. Anything clinical, urgent or price-related is routed to your staff. It only ever sends admin answers you have approved, word for word."
- **"What about our Google reviews / marketing?"** → "Out of scope for this system — it focuses on enquiry-to-appointment operations. It does report which channel enquiries come from (Website, WhatsApp, Facebook, Walk-in) so you can see what marketing produces."
- **"Can we try it with our real enquiries?"** → "Yes — as a paid pilot phase after the security review, starting with the web form."
