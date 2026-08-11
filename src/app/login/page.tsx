"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage(){
  const { user, loading, signInGoogle, signInEmail, sendMagicLink } = useAuth();
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [msg,setMsg]=useState(""); const [mode,setMode]=useState<"password"|"magic">("password");
  const router = useRouter();

  // FIX: redirect when already logged in — this is why it "stayed on login page"
  useEffect(()=>{ if(!loading && user) router.push("/"); },[user, loading]);

  if(loading) return <div className="max-w-[480px] mx-auto px-6 py-12 text-center text-silver-dim">Checking auth...</div>;
  if(user) return <div className="max-w-[480px] mx-auto px-6 py-12 text-center"><p className="text-sm">Already logged in as {user.email} — redirecting...</p></div>;

  const handleEmail= async()=>{
    try{
      if(mode==="magic"){ await sendMagicLink(email); setMsg("Magic link sent! Check inbox — clicking it WILL sign you in. Don't close this tab."); }
      else { await signInEmail(email,pass); setMsg("Signed in! Redirecting..."); setTimeout(()=> router.push("/"), 600); }
    } catch(e:any){ setMsg(e.message); }
  };

  const handleGoogle= async()=>{
    try{ await signInGoogle(); setMsg("Google success! Redirecting..."); setTimeout(()=> router.push("/"), 600); } catch(e:any){ setMsg(e.message)}
  };

  return (
    <div className="max-w-[480px] mx-auto px-6 py-12">
      <div className="glass rounded-[24px] p-8">
        <img src="/duck-logo.png" alt="duck" className="w-12 h-12 rounded-xl mx-auto border border-white/10" />
        <h1 className="text-2xl font-bold text-center mt-3">Welcome to IGMA</h1>
        <p className="text-sm text-text-mid text-center">Google • Email/Password • Magic Link — Firebase Auth</p>

        <button onClick={handleGoogle} className="w-full mt-6 py-3 rounded-full bg-white text-black font-semibold flex items-center justify-center gap-2">Continue with Google</button>

        <div className="flex gap-2 mt-4">
          <button onClick={()=>setMode("password")} className={`flex-1 py-2 rounded-full text-sm border ${mode==="password"?"bg-white text-black":"border-white/10 text-silver-dim"}`}>Password</button>
          <button onClick={()=>setMode("magic")} className={`flex-1 py-2 rounded-full text-sm border ${mode==="magic"?"bg-white text-black":"border-white/10 text-silver-dim"}`}>Magic Link</button>
        </div>

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mt-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
        {mode==="password" && <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full mt-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />}
        <button onClick={handleEmail} className="w-full mt-3 metallic py-3 rounded-full font-semibold text-sm">{mode==="magic"?"Send Magic Link":"Sign In"}</button>
        {msg && <p className="text-xs text-center mt-3 bg-white/5 rounded-xl p-3 break-words">{msg}</p>}

        <p className="text-xs text-center mt-4 text-silver-dim">No account? <Link href="/signup" className="underline">Sign up</Link> • <Link href="/forgot-password" className="underline">Forgot?</Link></p>
        <p className="text-[11px] text-text-low text-center mt-3">If Groq fails on Vercel, check: Vercel → Settings → Env Vars → GROQ_API_KEY → Redeploy (env vars require redeploy!).</p>
      </div>
    </div>
  )
}
