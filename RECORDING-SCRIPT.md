# Backup Demo Recording — 10-minute job, do it Monday

I can't screen-record from my environment, so here's exactly what to capture. A 5-minute Loom/QuickTime recording is the single best insurance for Tuesday.

## Setup (2 min)
1. Chrome, 1080p, 100% zoom, hide bookmarks bar, close other tabs, Do Not Disturb on.
2. Open the demo site, sign in, **Settings → Reset demo data** (or use a fresh ChatGPT account).
3. Start recording (Loom / QuickTime / OBS — full screen + microphone). Speak at demo pace.

## Record this sequence (follow DEMO-SCRIPT.md beats 1–6)

Narrate as if the director is watching. The exact talk-track sentences are in DEMO-SCRIPT.md — read them almost verbatim. Aim for **5–6 minutes**.

1. Opening frame (15s) — "private demo workspace, synthetic patients, simulated channels labelled"
2. Create test enquiry → show auto-reply + FAQ source (60s)
3. Arjun Kumar (tooth hurts) → staff handoff safety story (30s)
4. Pipeline → routing labels → stage refusal on "Confirmed" (45s)
5. Appointment request → explicit Confirm (45s)
6. Follow-ups → advance clock → sent-simulation + suppression (60s)
7. Overview + Analytics + CSV export (45s)
8. Settings: roles + "what a paid implementation looks like" close (30s)

## After recording (3 min)
1. Watch it once at 1.5× to check audio and pacing.
2. Rename: `ClinicFlow-AI-demo-[date].mp4`. Keep the raw file AND a trimmed version (<8 min).
3. Put it in a shared folder the friend can open offline (also download to the meeting laptop!). A cloud link alone is not a backup if venue Wi-Fi dies.
4. Optional belt-and-braces: 6 screenshots (one per beat) in a slide/doc, in case video playback fails.

## If the live site misbehaves while recording
- Don't restart the recording — pause, fix (reset demo data), continue; you can cut the gap later.
- If it's truly broken, record the local fallback instead (friend's machine with `pnpm dev`) — but only if that's already been run once successfully. Otherwise ship screenshots + the walkthrough transcript (`scripts/demo-walkthrough.mjs` output printed to PDF).
