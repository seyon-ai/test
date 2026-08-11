"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function LoginPage(){
  const { signInGoogle, signInEmail, sendMagicLink } = useAuth();
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [msg,setMsg]=useState(""); const [mode,setMode]=useState<"password"|"magic">("password");

  const handleEmail= async()=>{
    try{
      if(mode==="magic"){ await sendMagicLink(email); setMsg("Magic link sent! Check inbox — clicking it WILL sign you in."); }
      else { await signInEmail(email,pass); setMsg("Signed in!"); }
    } catch(e:any){ setMsg(e.message); }
  };

  return (
    <div className="max-w-[480px] mx-auto px-6 py-12">
      <div className="glass rounded-[24px] p-8">
        <img src="/duck-logo.png" alt="duck" className="w-12 h-12 rounded-xl mx-auto" />
        <h1 className="text-2xl font-bold text-center mt-3">Welcome to IGMA</h1>
        <p className="text-sm text-text-mid text-center">Google • Email/Password • Magic Link — all via Firebase Auth</p>

        <button onClick={async()=>{ try{ await signInGoogle(); setMsg("Google sign-in success"); } catch(e:any){ setMsg(e.message)} }} className="w-full mt-6 py-3 rounded-full bg-white text-black font-semibold flex items-center justify-center gap-2"> <span>G</span> Continue with Google</button>

        <div className="flex gap-2 mt-4">
          <button onClick={()=>setMode("password")} className={`flex-1 py-2 rounded-full text-sm border ${mode==="password"?"bg-white text-black":"border-white/10 text-silver-dim"}`}>Password</button>
          <button onClick={()=>setMode("magic")} className={`flex-1 py-2 rounded-full text-sm border ${mode==="magic"?"bg-white text-black":"border-white/10 text-silver-dim"}`}>Magic Link</button>
        </div>

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mt-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
        {mode==="password" && <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full mt-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />}
        <button onClick={handleEmail} className="w-full mt-3 metallic py-3 rounded-full font-semibold text-sm">{mode==="magic"?"Send Magic Link":"Sign In"}</button>
        {msg && <p className="text-xs text-center mt-3 text-silver-bright bg-white/5 rounded-xl p-2">{msg}</p>}

        <p className="text-xs text-center mt-4 text-silver-dim">No account? <Link href="/signup" className="underline">Sign up</Link> • <Link href="/forgot-password" className="underline">Forgot password</Link></p>
        <p className="text-[11px] text-text-low text-center mt-3">Auth uses Firebase Auth — Spark free tier. Add your NEXT_PUBLIC_FIREBASE_* keys in .env — no Blaze needed. Magic link completes sign-in via isSignInWithEmailLink.</p>
      </div>
    </div>
  )
}
