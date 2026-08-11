"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Signup(){
  const { user, loading, signUpEmail, signInGoogle }=useAuth();
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [msg,setMsg]=useState("");
  const router=useRouter();
  useEffect(()=>{ if(!loading && user) router.push("/"); },[user,loading]);
  if(loading) return <div className="max-w-[480px] mx-auto px-6 py-12 text-center text-silver-dim">Checking auth...</div>;
  return (
    <div className="max-w-[480px] mx-auto px-6 py-12">
      <div className="glass rounded-[24px] p-8">
        <h1 className="text-2xl font-bold text-center">Create account</h1>
        <p className="text-sm text-text-mid text-center">Firebase Auth — email/password + Google</p>
        <button onClick={async()=>{ try{ await signInGoogle(); setMsg("Google success — redirecting"); setTimeout(()=>router.push("/"),600);} catch(e:any){ setMsg(e.message)}} } className="w-full mt-6 py-3 rounded-full bg-white text-black font-semibold">Continue with Google</button>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mt-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"/>
        <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password (6+ chars)" className="w-full mt-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"/>
        <button onClick={async()=>{ try{ await signUpEmail(email,pass); setMsg("Account created! Redirecting..."); setTimeout(()=>router.push("/"),600);} catch(e:any){ setMsg(e.message)}} } className="w-full mt-3 metallic py-3 rounded-full font-semibold text-sm">Sign Up</button>
        {msg && <p className="text-xs text-center mt-3 bg-white/5 rounded-xl p-2 break-words">{msg}</p>}
        <p className="text-xs text-center mt-4 text-silver-dim">Have account? <Link href="/login" className="underline">Login</Link></p>
      </div>
    </div>
  )
}
