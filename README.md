# IGMA 2.0 — Full SaaS Rebuild

Instagram is for consuming. **IGMA is for creating imagination.**

## Quick Start
```bash
npm install
cp .env.example .env  # fill Firebase + GROQ + optional POLLINATIONS + IMGBB keys
npm run dev    # http://localhost:3000
npm run build  # production build (68 routes)
```

## Architecture — FINAL (per spec)
- **Firebase Spark (free)** — Auth (Google + email/password + magic link) + Firestore. **NO Firebase Storage** — use `imgbb` via `src/lib/imgbb.ts`.
- **Groq `llama-3.3-70b-versatile`** — `src/lib/groq.ts` for reactor + studio + script extraction.
- **Pollinations `gen.pollinations.ai`** ONLY via `src/app/api/media/image/route.ts` proxy — portrait 1080x1920, never expose key client-side.
- **Browser TTS** — `window.speechSynthesis` in `ReelPlayer.tsx` — no hosted audio, no voiceUrl.
- **Vercel** — `vercel.json` sets `maxDuration:60` for API routes (needs Pro for >10s).

## Auth — REAL
`src/hooks/useAuth.tsx` provides `AuthProvider` with:
- `signInWithPopup(googleProvider)`
- `signInWithEmailAndPassword` / `createUserWithEmailAndPassword`
- `sendSignInLinkToEmail` + `isSignInWithEmailLink` + `signInWithEmailLink` (magic link completes sign-in)

Wrap is in `src/app/layout.tsx`. See `/login` and `/signup`.

## Data — REAL + Fallback
`src/hooks/useStories.ts` uses Firestore real-time `onSnapshot` on `stories` collection. If Firebase not configured or no stories, UI falls back to curated seed data so Explore/Feed still works. Writes require real Firebase ID token.

## Duck Logo — REAL
- Generated silver duck at `public/duck-logo.png` / `src/app/icon.png` / `src/app/apple-icon.png`
- Used in `Navbar.tsx` as `<img src="/duck-logo.png">` + favicon via `metadata.icons`.
- Brushed-silver body, graphite beak — matches Dark Black & Silver theme.

## Pages (68)
Feed, Explore (snap feed), Imagine Studio, Reels, Profile, Messages, Notifications, Settings, Search, Admin, Legal — all scaffolded per PAGE INVENTORY. Replace mock with Firestore as you connect .env.

## Design Tokens
`#0A0A0B` bg, `#161618` surface, `#C7CBD1` silver — see `globals.css` + `tailwind.config.ts` + `Mascot.tsx`.

Deploy: `vercel --prod` — set env vars in Vercel dashboard.
