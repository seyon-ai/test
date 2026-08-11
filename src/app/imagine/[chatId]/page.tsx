"use client";
import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";

type Msg = { role:"user"|"assistant", content:string };

export default function ChatPage({ params }: { params:{ chatId:string } }){
  const [msgs,setMsgs]=useState<Msg[]>([
    { role:"assistant", content:"Hey! Let's build your story scene by scene. What's the spark — a place, a character, or a 'what if'?" },
  ]);
  const [input,setInput]=useState("");
  const [publishing,setPublishing]=useState(false);
  const [progress,setProgress]=useState(0);
  const [sending,setSending]=useState(false);
  const [err,setErr]=useState("");

  const send= async ()=>{
    if(!input.trim() || sending) return;
    const user:Msg={ role:"user", content:input };
    const next = [...msgs, user];
    setMsgs(next);
    setInput("");
    setSending(true); setErr("");
    try{
      let token: string| null = null;
      try{ token = await auth.currentUser?.getIdToken() || null; } catch{}
      const headers: any = { "Content-Type":"application/json" };
      if(token) headers["Authorization"]="Bearer "+token;

      const res = await fetch("/api/groq/chat", {
        method:"POST",
        headers,
        body: JSON.stringify({ messages: next.map(m=>({ role:m.role, content:m.content })) })
      });
      const j = await res.json();
      if(!res.ok) throw new Error(j.error || "Groq failed");
      setMsgs(m=>[...m,{ role:"assistant", content: j.reply }]);
    } catch(e:any){
      setErr(e.message + " — if you just added GROQ_API_KEY in Vercel, you MUST Redeploy (Deployments → ... → Redeploy)");
      // fallback mock so chat still feels alive
      setMsgs(m=>[...m,{ role:"assistant", content: "Love that! What does it smell like there? And who's the one person who shouldn't be there but is? (Groq error — check Vercel env & redeploy)" }]);
    } finally{ setSending(false); }
  };

  const publish= async ()=>{
    setPublishing(true);
    setProgress(0);
    for(let i=0;i<=100;i+=10){ await new Promise(r=>setTimeout(r,180)); setProgress(i); }
    setPublishing(false);
    window.location.href="/reels/demo123";
  };

  if(publishing){
    return (
      <div className="max-w-[560px] mx-auto px-6 py-16 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl metallic animate-bob flex items-center justify-center font-bold">IG</div>
        <h2 className="text-xl font-bold mt-4">IGMA is processing...</h2>
        <p className="text-sm text-text-mid">Building reel — Pollinations proxy + browser TTS</p>
        <div className="h-2 bg-white/10 rounded-full mt-6 overflow-hidden">
          <div className="h-full metallic transition-all" style={{width: progress+"%"}} />
        </div>
        <p className="text-xs text-text-low mt-2">{progress}% • Preloading {Math.ceil(progress/25)}/4 scenes</p>
      </div>
    )
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 py-6">
      <div className="flex items-center gap-3">
        <Link href="/imagine" className="text-sm text-silver-dim hover:text-white">← Studio</Link>
        <h1 className="font-semibold">Chat {params.chatId}</h1>
        <span className="text-xs text-silver-dim hidden sm:inline">Groq llama-3.3 • REAL</span>
        <Link href={`/imagine/${params.chatId}/settings`} className="ml-auto text-xs border border-white/10 rounded-full px-3 py-1">Settings</Link>
        <button onClick={publish} className="metallic px-4 py-1.5 rounded-full text-sm font-semibold">Publish → Reel</button>
      </div>
      <div className="glass rounded-2xl mt-4 p-4 min-h-[420px] flex flex-col">
        <div className="flex-1 space-y-3 overflow-auto max-h-[52vh] pr-1">
          {msgs.map((m,i)=>(
            <div key={i} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role==="user"?"bg-white text-black ml-auto":"bg-white/10 border border-white/10"}`}>{m.content}</div>
          ))}
          {sending && <div className="text-xs text-silver-dim">Groq is thinking...</div>}
        </div>
        {err && <p className="text-xs mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-xl break-words">{err}</p>}
        <div className="flex gap-2 mt-4">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Write the next beat... (Groq live if API key set)" className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm" />
          <button onClick={send} disabled={sending} className="metallic px-6 py-2 rounded-full text-sm font-semibold disabled:opacity-40">{sending?"...":"Send"}</button>
        </div>
        <p className="text-[11px] text-text-low mt-2">If Groq not working: Vercel → Settings → Environment Variables → GROQ_API_KEY → Deployments → Redeploy. Check Vercel Logs → Runtime Logs for error.</p>
      </div>
    </div>
  )
}
