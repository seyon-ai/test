# ====================================================================
# MASTER BUILD PROMPT
# ====================================================================

PROJECT_NAME = "IGMA"

VERSION = "2.0 — Full SaaS Rebuild"

TYPE = "AI Social Platform + AI Story-to-Reel Studio"

STATUS = "Rebuild from proven concept — build ALL pages this time"

AUTHOR = "AugX / Aug Dev Studio"

INSTRUCTIONS_FOR_AI = "You are one of several AI models (Claude, Fable, and
~20 others) working together in an orchestration pipeline to build this
app. Read this entire document before writing any code. This spec reflects
real lessons learned from a working prototype — follow the ARCHITECTURE
DECISIONS section exactly; it exists because earlier approaches were tried
and failed in production. Do not substitute your own defaults for the
choices marked FINAL below. Build every page listed in PAGE INVENTORY —
this is a full SaaS-scale build, not a demo."

# ====================================================================
# PRODUCT IDEA
# ====================================================================

Instagram is built around consuming content.
IGMA is built around creating imagination.

Two ways to create on IGMA:

1. QUICK POST — write an imaginary situation, funny event, fictional
   moment, dream, impossible story, or alternate reality. The AI reacts
   to it like an audience member (1-4 sentences, never writes for you,
   never continues your story).

2. IMAGINE STUDIO — a private, long-form back-and-forth conversation
   with the AI where you build out a story together scene by scene. When
   you hit Publish, the AI turns the conversation into a short illustrated
   "reel": a script broken into scenes, each with AI-generated artwork and
   narration, playable as a vertical scrolling video-like experience
   (TikTok/Reels style) with animated captions and a progress bar.

Both flows land in the same unified EXPLORE feed — a vertical
scroll-snap feed where quick posts and Imagine Studio reels are
interleaved chronologically, each with like/comment/share.

# ====================================================================
# ARCHITECTURE DECISIONS (FINAL — do not deviate)
# ====================================================================

These are not arbitrary preferences. Each one exists because the
previous approach broke in a specific, observed way. Follow them exactly.

## Backend: Firebase Spark (free tier) — NOT Blaze, NOT Supabase
- Auth: Firebase Auth (Google OAuth + email/password + email magic link)
- Database: Cloud Firestore
- File hosting for user-uploaded photos (avatars, story images): imgbb
  (free, no billing) — NOT Firebase Storage. Firebase Storage requires
  the paid Blaze plan and is NOT available on Spark. Do not use it
  anywhere in this build.
- No Supabase. It was tried first; its free-tier projects auto-pause
  after 7 days of inactivity, which broke the app repeatedly during
  normal development gaps. Firebase Spark does not have this problem.

## AI text generation: Groq
- Model: llama-3.3-70b-versatile (or current equivalent fast Groq model)
- Free tier, no billing wall, fast inference. Used for both:
  (a) the public "audience reaction" to quick posts (1-4 sentences,
      strict system prompt: react only, never continue/rewrite the story)
  (b) the private Imagine Studio conversation (a creative collaborator
      that asks questions and helps build the story, NOT the same voice
      as the public reactor)
  (c) the scene-script extraction when a user hits Publish (turns the
      full conversation into a JSON script: title + 3-6 scenes, each
      with a caption and an image-generation prompt)
- Do NOT use Gemini for anything. It was tried first; Google Cloud
  projects can silently inherit poisoned/rate-limited quota from
  unrelated leaked keys on the same project, and billing setup friction
  made it unreliable for a small free-tier project. Groq had none of
  these problems.

## Image generation: Pollinations.ai — FINAL, do not swap
- Endpoint: `https://gen.pollinations.ai/image/{url-encoded prompt}`
  with query params `width`, `height`, `nologo=true`, and optionally
  `seed` (deterministic per scene so re-renders are consistent).
- IMPORTANT — this endpoint changed in 2026. The OLDER endpoint
  `image.pollinations.ai/prompt/...` is DEPRECATED and silently fails.
  Use `gen.pollinations.ai` only.
- Route every request for this through your OWN server-side proxy route
  (e.g. `/api/media/image`) that adds `POLLINATIONS_API_KEY` server-side
  ONLY. Never construct a Pollinations URL containing an API key on the
  client or store such a URL in the database — that key would be
  publicly exposed to anyone who views the page/network tab. The
  browser should only ever see a same-origin URL like
  `/api/media/image?prompt=...&seed=...`, never the real Pollinations
  domain or key directly.
- Works fully anonymously with no key at all (rate-limited to roughly
  1 request per 15 seconds, watermarked). A registered key (from
  enter.pollinations.ai) raises this limit substantially and removes
  the watermark — support both, key optional.
- Generate images at portrait dimensions matching the reel frame
  (e.g. 1080x1920), not square — square images crop awkwardly in a
  vertical video-style player.

## Audio narration: BROWSER-NATIVE TEXT-TO-SPEECH — NOT Pollinations audio, NOT any hosted audio API
- Use the Web Speech API's `SpeechSynthesis` interface
  (`window.speechSynthesis` + `SpeechSynthesisUtterance`), built into
  every modern browser, completely free, zero API calls, zero hosting.
- When a reel scene is on screen, create a `SpeechSynthesisUtterance`
  from that scene's caption text and call `speechSynthesis.speak()`.
  Let the user's own device/browser pick its default voice (or expose a
  simple voice picker in Settings using `speechSynthesis.getVoices()`
  if time allows) — do not try to force a specific voice server-side.
- This is generated fresh, live, in the browser, each time the reel
  plays — it is NOT pre-generated, NOT stored, NOT a file with a URL.
  There is no `voiceUrl` field for this reason. This sidesteps every
  problem the earlier prototype hit with hosted audio: Pollinations'
  audio endpoint being rate-limited alongside image requests, Firebase
  Storage requiring a paid plan, and generation timeouts.
- Advance to the next scene either when `utterance.onend` fires, or
  after a fallback timer (~7s) if speech synthesis isn't supported/
  available on that device — never leave a scene stuck waiting forever.
- Respect a mute toggle: if muted, don't call `speak()` at all, just run
  the fallback timer.

## Hosting: Vercel
- Be aware of Vercel's serverless function execution time limits: 10
  seconds on the free Hobby plan, 60 seconds on Pro (configurable via
  `export const maxDuration = 60` in a route file, which only takes
  effect on Pro+). Any route that could take longer than this needs to
  either (a) genuinely not need to — prefer building URLs/deferring
  work to the client rather than doing slow work in a serverless
  function, or (b) clearly document the plan requirement.
- The Publish flow specifically: save the reel doc FAST (just build the
  scene URLs, don't wait on any generation server-side), then have the
  CLIENT preload every scene's image (and, since audio is now
  browser-native TTS, there is nothing to preload for audio at all)
  before revealing the reel, with a visible "IGMA is processing..."
  progress screen (scene-by-scene progress bar + elapsed time). This
  moves the waiting into the browser, which has no execution time cap,
  instead of a serverless function that does.

## Security
- Every write operation (like, comment, follow, DM, profile edit,
  reel publish) must verify the caller's real Firebase ID token
  server-side (`Authorization: Bearer <token>` header, verified via
  Firebase Admin SDK) — never trust a client-supplied user ID.
- Firestore security rules must independently enforce the same rules
  as a defense-in-depth layer, even though most writes route through
  server API routes using the Admin SDK (which bypasses rules) — rules
  matter for anything written directly by the client SDK (e.g. DM
  messages, for true real-time chat).
- Never put a secret-type API key in any URL, file, or field that a
  browser or database document could expose publicly.

# ====================================================================
# DESIGN LANGUAGE — DARK BLACK & SILVER (NEW — replaces prior purple theme)
# ====================================================================

STYLE = "Premium, moody, metallic — think matte black hardware with
brushed-silver accents, not a generic dark-mode invert of a light theme."

INSPIRATION = ["Apple Pro hardware", "Linear", "Arc Browser dark mode",
"high-end audio equipment UI", "brushed titanium"]

COLOR_TOKENS = {
  "background": "#0A0A0B",          // near-black, slightly warm
  "surface": "#161618",              // card background
  "surface-elevated": "#1E1E21",     // raised cards, modals
  "border": "rgba(255,255,255,0.08)",
  "silver-primary": "#C7CBD1",       // main accent — cool brushed silver
  "silver-bright": "#E8EAED",        // hover states, active accents
  "silver-dim": "#8A8D93",           // secondary text, muted icons
  "text-hi": "#F5F5F6",
  "text-mid": "#A0A2A8",
  "text-low": "#6B6D73",
  "accent-gradient": "linear-gradient(135deg, #C7CBD1 0%, #E8EAED 50%, #9A9DA3 100%)"
  // Use this metallic gradient sparingly for primary CTAs and the
  // mascot/logo treatment — it should read as "brushed metal", not a
  // generic purple-to-blue gradient like a typical SaaS template.
}

FONT = ["Inter (body/UI)", "Poppins (display/headings)"]
  // Same font pairing as the prior build — it worked well, keep it.

DESIGN_REQUIREMENTS = [
  "Glassmorphism cards using rgba(255,255,255,0.03-0.06) fills with
   backdrop-blur, bordered in the silver-tinted border color above",
  "Rounded corners (16-24px on cards)",
  "Subtle metallic sheen on primary buttons (the accent-gradient)",
  "Micro animations on interaction (hover lift, tap scale)",
  "60 FPS scroll performance, especially in the Explore vertical feed",
  "Fully responsive, mobile-first",
  "The mascot (see LOGO) should render in silver/white rather than the
   previous orange-beak duck — keep the same silhouette and expression,
   recolor to match the new palette (e.g. brushed-silver body, a subtly
   darker silver or graphite beak instead of orange)"
]

## LOGO / MASCOT
Keep the existing mascot silhouette: a simple, flat-vector duck/goose
with a long neck, round head, side-eye expression, minimal and
brandable. Recolor for the new theme: silver-white body, graphite or
dark-silver beak, same personality. It should still work as a favicon,
app icon, and an animated "thinking" loader (subtle head-tilt bob
animation, already implemented in the prior build — keep that
animation, just apply the new color palette).

# ====================================================================
# PAGE INVENTORY — BUILD ALL OF THESE (~70-90 routes)
# ====================================================================

This is a full SaaS-scale build. Every item below is a real route/page,
not a placeholder. Group them into logical route folders in a Next.js
App Router structure.

## Auth & Onboarding (8)
1. /login — Google, email/password, email magic link (all three, all
   fully functional — magic link must actually complete sign-in when
   the emailed link is clicked, not just send the email)
2. /signup (can be the same page as /login with a mode toggle)
3. /onboarding/welcome
4. /onboarding/choose-username
5. /onboarding/interests — pick starting mood/genre preferences
6. /onboarding/follow-suggestions
7. /forgot-password
8. /verify-email

## Core Feed & Posting (6)
9. / (Feed) — composer + chronological feed of own + followed posts
10. /explore — unified vertical scroll-snap feed (quick posts + reels
    interleaved), full TikTok/Reels-style UX with like/comment/share
    on every item, autoplay/pause based on scroll position
11. /explore/[category] — filtered by mood (Comedy, Fantasy, Horror,
    Romance, Sci-Fi) or Trending
12. /post/[id] — single quick-post permalink view
13. /post/[id]/edit
14. /drafts — saved unpublished drafts

## Imagine Studio (AI story-to-reel) (6)
15. /imagine — list of the user's private AI conversations + "New
    story" entry point
16. /imagine/[chatId] — the private chat UI with the Publish flow
    (progress screen preloading every scene's image before reveal, per
    ARCHITECTURE DECISIONS above)
17. /imagine/[chatId]/settings — per-conversation AI personality tweak
18. /reels/[id] — the full-screen reel player (progress bar, animated
    captions, browser-TTS narration, tap-to-navigate scenes)
19. /reels/[id]/edit — author can edit captions/regenerate a scene
    image post-publish
20. /reels/trending

## Profile & Social (12)
21. /profile/[username] — bio, avatar, stats, tabbed Stories/Reels grid
22. /profile/[username]/followers — real followers list
23. /profile/[username]/following — real following list
24. /profile/[username]/likes
25. /profile/edit — bio, avatar upload (imgbb), display name
26. /profile/[username]/reels
27. /profile/[username]/stories
28. /achievements
29. /profile/[username]/mutuals
30. /discover-people
31. /profile/[username]/block (confirmation flow)
32. /profile/[username]/report

## Messaging (5)
33. /messages — conversation list, real-time
34. /messages/[conversationId] — real-time chat thread
35. /messages/requests — message requests from non-followers
36. /messages/new — start a new conversation by username search
37. /messages/[conversationId]/settings

## Notifications (3)
38. /notifications — real, per-user, likes/comments/follows/mentions
39. /notifications/settings
40. /notifications/mentions

## Settings (12)
41. /settings — hub page
42. /settings/account
43. /settings/appearance — theme, though this build is dark-only by
    default; still expose density/accent options
44. /settings/ai-personality — reactor tone: Balanced / Wholesome /
    Sarcastic / Hype
45. /settings/privacy — private posts, who can DM you, who can see
    follower list
46. /settings/notifications
47. /settings/blocked-accounts
48. /settings/connected-accounts
49. /settings/data-export
50. /settings/delete-account
51. /settings/language
52. /settings/accessibility

## Search & Discovery (4)
53. /search — universal search (people, posts, reels, tags)
54. /search/people
55. /search/tags
56. /tags/[tag]

## Admin / Creator Tools (8)
57. /admin (protected — only visible to the account owner/admin role)
58. /admin/users
59. /admin/reports
60. /admin/content-moderation
61. /admin/analytics
62. /admin/api-usage — Groq/Pollinations/imgbb usage visibility
63. /admin/announcements
64. /admin/feature-flags

## Legal / Support / Marketing (12)
65. /about
66. /help
67. /help/[article]
68. /contact
69. /terms
70. /privacy-policy
71. /community-guidelines
72. /changelog
73. /status — service status page
74. /pricing (even if free-only today, scaffold for future tiers)
75. /brand — press kit / logo assets
76. /careers (placeholder is fine)

## System / Error pages (4)
77. /404
78. /500
79. /offline (PWA offline fallback)
80. /maintenance

# ====================================================================
# DATA MODEL (Firestore)
# ====================================================================

profiles/{uid}: { username, displayName, avatarUrl, avatarInitials, bio,
  aiPersonality, followers, following, storyCount, createdAt }

stories/{id}: { authorId, author{username,displayName,avatarInitials,
  avatarUrl}, text, mood, imageUrl, reaction, isDraft, likes, comments,
  createdAt }

stories/{id}/comments/{id}: { author, text, createdAt }

reels/{id}: { title, authorId, author{...}, scenes:[{caption,
  imageUrl}], likes, comments, createdAt }
  // NOTE: no voiceUrl field — narration is generated live client-side
  // via SpeechSynthesis, never stored.

reels/{id}/comments/{id}: { author, text, createdAt }

likes/{uid_storyId}, reelLikes/{uid_reelId}: { userId, storyId/reelId,
  createdAt }

follows/{followerId_followingId}: { followerId, followingId, createdAt }

conversations/{sorted uidA_uidB}: { participantIds[], participants{},
  lastMessage, lastSenderId, updatedAt }
conversations/{id}/messages/{id}: { senderId, text, createdAt }

aiChats/{id}: { userId, title, lastMessage, published, updatedAt }
  — PRIVATE, owner-only read/write
aiChats/{id}/messages/{id}: { role: "user"|"assistant", content,
  createdAt }

notifications/{id}: { recipientId, actorId, actorUsername,
  actorDisplayName, type, storyId, storyPreview, read, createdAt }

# ====================================================================
# FINAL GOAL
# ====================================================================

Build the complete, production-ready IGMA platform exactly as specified
above — every page in the inventory, the dark black & silver design
system throughout, Pollinations for images via a secure server-side
proxy, and browser-native Web Speech API for reel narration (no hosted
audio files, no voiceUrl field, nothing that needs a paid plan). This is
a full SaaS build: aim for the full page count, not a trimmed-down demo.
Every interaction (like, comment, follow, DM, publish) must be backed by
real Firestore writes, verified server-side by a real Firebase ID token
— no mock data anywhere in the final build.
