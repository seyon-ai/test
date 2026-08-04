"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

type AuthMode = "signin" | "signup";

function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/book";

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Please enter your name");
        await signUpWithEmail(name, email, password);
      } else {
        await signInWithEmail(email, password);
      }
      router.push(redirectTo);
    } catch (err: any) {
      const msg = err.code === "auth/email-already-in-use"
        ? "Email already registered. Please sign in instead."
        : err.code === "auth/wrong-password"
        ? "Incorrect password. Please try again."
        : err.code === "auth/user-not-found"
        ? "No account found with this email."
        : err.code === "auth/weak-password"
        ? "Password should be at least 6 characters."
        : err.message || "Authentication failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayurveda-cream via-white to-ayurveda-blush flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-ayurveda-green text-sm font-medium mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-ayurveda-blush/50 p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-ayurveda-green/10 flex items-center justify-center">
              <Leaf className="text-ayurveda-green" size={32} />
            </div>
          </div>

          <h1 className="font-serif text-2xl font-bold text-ayurveda-navy text-center mb-1">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-ayurveda-navy/60 text-sm text-center mb-8">
            {mode === "signin"
              ? "Sign in to book your appointment"
              : "Join Agnivesh Ayurveda"}
          </p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 font-medium text-ayurveda-navy hover:border-ayurveda-green/30 hover:bg-ayurveda-cream/30 transition-all disabled:opacity-50 mb-4"
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M19.6 10.23c0-.68-.06-1.36-.17-2.01H10v3.81h5.38a4.6 4.6 0 01-2 3.02v2.51h3.23c1.89-1.74 2.99-4.31 2.99-7.33z"
                fill="#4285F4"
              />
              <path
                d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.61 0-4.83-1.76-5.61-4.13H1.04v2.59A10 10 0 0010 20z"
                fill="#34A853"
              />
              <path
                d="M4.39 11.89a6 6 0 010-3.78V5.52H1.04A10 10 0 000 10c0 1.61.38 3.14 1.04 4.48l3.35-2.59z"
                fill="#FBBC05"
              />
              <path
                d="M10 3.97c1.47 0 2.78.51 3.82 1.51l2.86-2.86A10 10 0 000 5.52l3.35 2.59C4.17 5.74 6.39 3.97 10 3.97z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-ayurveda-blush" />
            <span className="text-xs text-ayurveda-navy/40 font-medium">OR</span>
            <div className="flex-1 h-px bg-ayurveda-blush" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ayurveda-navy/30"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full rounded-xl border border-ayurveda-blush bg-ayurveda-cream/30 pl-11 pr-4 py-3 text-ayurveda-navy placeholder-ayurveda-navy/30 outline-none focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ayurveda-navy/30"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full rounded-xl border border-ayurveda-blush bg-ayurveda-cream/30 pl-11 pr-4 py-3 text-ayurveda-navy placeholder-ayurveda-navy/30 outline-none focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 transition-all"
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ayurveda-navy/30"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full rounded-xl border border-ayurveda-blush bg-ayurveda-cream/30 pl-11 pr-11 py-3 text-ayurveda-navy placeholder-ayurveda-navy/30 outline-none focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ayurveda-navy/30 hover:text-ayurveda-navy/60"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-ayurveda-navy/60 mt-6">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
              }}
              className="text-ayurveda-green font-semibold hover:underline"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ayurveda-green/30 border-t-ayurveda-green rounded-full animate-spin" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
