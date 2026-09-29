import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  Auth,
  connectAuthEmulator,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore";

// Firebase web config is public by design (security comes from Firestore rules
// + Authorized domains), so it is safe to hardcode. Env vars still override.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD0q-La20UhjAQkPeps6CU_-PqfOsc--E4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "agniveshayurveda-67091.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "agniveshayurveda-67091",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "agniveshayurveda-67091.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "985685759419",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:985685759419:web:d82110d329fa211027a09e",
};

const isConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId;

// Only initialize if config is valid (client-side with env vars set)
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;

function getFirebase() {
  if (!isConfigValid) {
    return { app: null, auth: null, db: null, googleProvider: null };
  }

  if (!app) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    googleProviderInstance = new GoogleAuthProvider();

    // Emulator support
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
      if (typeof window !== "undefined") {
        connectAuthEmulator(authInstance, "http://localhost:9099");
        connectFirestoreEmulator(dbInstance, "localhost", 8080);
      }
    }
  }

  return {
    app,
    auth: authInstance,
    db: dbInstance,
    googleProvider: googleProviderInstance,
  };
}

// Export getters instead of instances — safe for SSR/SSG
export const getFirebaseApp = () => getFirebase().app;
export const getFirebaseAuth = () => getFirebase().auth;
export const getFirebaseDb = () => getFirebase().db;
export const getGoogleProvider = () => getFirebase().googleProvider;

// Convenience exports for client components
export const auth = getFirebaseAuth();
export const db = getFirebaseDb();
export const googleProvider = getGoogleProvider();
export const firebaseApp = getFirebaseApp();

export { isConfigValid };
