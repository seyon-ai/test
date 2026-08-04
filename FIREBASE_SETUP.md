# Firebase Setup Guide for Agnivesh Ayurveda

## 1. Create a Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project" → name it `agnivesh-ayurveda`
3. Enable Google Analytics (optional)

## 2. Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (add your web client ID from Google Cloud Console)
4. Under **Settings** → **Authorized domains**, add your Vercel domain

## 3. Create Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose location: `asia-south1` (Mumbai) for India
4. Deploy the rules from `firestore.rules`

## 4. Get Web App Config
1. Go to **Project Settings** → **Your apps** → **Web app** (`</>`)
2. Register app → copy the config
3. Add these to Vercel env vars:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

## 5. Set Admin Emails
Edit `ADMIN_EMAILS` array in `lib/auth-context.tsx`:
```ts
const ADMIN_EMAILS = [
  "admin@agniveshayurveda.com",
  "your-real-admin@email.com",
];
```

## 6. Enable Google Sign-In (Optional but recommended)
1. In Firebase Auth → Google provider → add your domain to authorized OAuth redirect URIs
2. For Vercel: `https://your-domain.vercel.app/__/auth/handler`

## 7. Firestore Security Rules
Deploy `firestore.rules` from this project to Firebase Console → Firestore → Rules.

## 8. Test
1. Deploy to Vercel
2. Visit `/auth` → sign up with email or Google
3. Visit `/book` → should work if signed in
4. Sign in with admin email → visit `/admin` → should see dashboard
5. Book an appointment → appears in admin panel in real-time
