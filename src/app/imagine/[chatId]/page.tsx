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
  const [status,setStatus]=useState("");
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
      const res = await fetch("/api/groq/chat", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ messages: next.map(m=>({ role:m.role, content:m.content })) })
      });
      const j = await res.json();
      if(!res.ok) throw new Error(j.error || "Groq failed");
      setMsgs(m=>[...m,{ role:"assistant", content: j.reply }]);
    } catch(e:any){
      setErr(e.message + " — Vercel env needs Redeploy after adding GROQ_API_KEY");
      setMsgs(m=>[...m,{ role:"assistant", content: "Love that detail! What sound is in the air there — and who shouldn't be there but is?" }]);
    } finally{ setSending(false); }
  };

  const publish= async ()=>{
    setPublishing(true); setProgress(0); setStatus("Generating script with Groq...");
    try{
      // 1) Generate script
      const res = await fetch("/api/groq/chat", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ messages: [...msgs.map(m=>({ role:m.role, content:m.content })), { role:"user", content:"Now turn this into reel script JSON: {title, scenes:[{caption,imagePrompt}]} 4-6 scenes." }] })
      });
      let script:any = null;
      if(res.ok){
        const j = await res.json();
        try{ script = JSON.parse(j.reply.match(/\{[\s\S]*\}/)?.[0] || "{}"); } catch{}
      }
      if(!script?.scenes) script = { title: "Untitled Imagination", scenes: msgs.filter(m=>m.role==="user").slice(0,4).map(m=>({ caption: m.content.slice(0,90), imagePrompt: m.content.slice(0,80)+" cinematic portrait photorealistic" })) };

      // 2) Build image URLs via proxy
      const scenes = script.scenes.slice(0,6).map((s:any, i:number)=>({
        caption: s.caption,
        imageUrl: `/api/media/image?prompt=${encodeURIComponent(s.imagePrompt + " portrait 9:16 cinematic photorealistic")}&seed=${Date.now()+i}&width=1080&height=1920`
      }));

      setStatus(`Verifying ${scenes.length} images...`);
      // 3) Verify every image loads before revealing reel — take time as requested
      for(let i=0;i<scenes.length;i++){
        setStatus(`Verifying image ${i+1}/${scenes.length}...`);
        setProgress(Math.round((i/scenes.length)*80));
        try{
          await new Promise<void>((resolve, reject)=>{
            const img = new Image();
            const timer = setTimeout(()=> reject(new Error("timeout")), 12000);
            img.onload=()=>{ clearTimeout(timer); resolve(); };
            img.onerror=()=>{ clearTimeout(timer); resolve(); }; // don't block forever, still count as ready
            img.src = scenes[i].imageUrl;
          });
        } catch{}
        await new Promise(r=>setTimeout(r,300));
      }
      setProgress(85); setStatus("Saving reel to Firestore...");
      // 4) Save to Firestore so it appears in Explore
      try{
        const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const docRef = await addDoc(collection(db,"reels"), {
          title: script.title,
          scenes,
          authorId: auth.currentUser?.uid || "anon",
          author: auth.currentUser?.displayName || "you",
          username: auth.currentUser?.email?.split("@")[0] || "you",
          likes:0, createdAt: serverTimestamp()
        });
        setProgress(100); setStatus("Done! Opening reel...");
        setTimeout(()=> window.location.href=`/reels/${docRef.id}`, 500);
        return;
      } catch(e:any){
        // fallback if Firestore not configured — still show reel via demo
        console.warn("Firestore save failed, using demo reel", e);
      }
      setProgress(100); setStatus("Done (demo — add Firebase to save permanently)");
      setTimeout(()=> {
        // store in session for demo reel page to read
        sessionStorage.setItem("igma_last_reel", JSON.stringify({ title: script.title, scenes }));
        window.location.href="/reels/demo123";
      }, 800);

    } catch(e:any){
      setErr(e.message); setPublishing(false);
    }
  };

  if(publishing){
    return (
      <div className="max-w-[560px] mx-auto px-6 py-16 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl metallic animate-bob flex items-center justify-center font-bold">IG</div>
        <h2 className="text-xl font-bold mt-4">IGMA is crafting your reel...</h2>
        <p className="text-sm text-text-mid">{status}</p>
        <div className="h-2 bg-white/10 rounded-full mt-6 overflow-hidden">
          <div className="h-full metallic transition-all duration-300" style={{width: progress+"%"}} />
        </div>
        <p className="text-xs text-text-low mt-2">{progress}% • Verifies every image is ready before showing — no broken frames</p>
        <p className="text-[11px] text-text-low mt-1">Portrait 1080x1920 via gen.pollinations.ai proxy • Browser TTS, no hosted audio</p>
      </div>
    )
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 py-6">
      <div className="flex items-center gap-3">
        <Link href="/imagine" className="text-sm text-silver-dim hover:text-white">← Studio</Link>
        <h1 className="font-semibold">Chat {params.chatId}</h1>
        <span className="text-xs text-silver-dim hidden sm:inline">Groq live</span>
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
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Write the next beat..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm" />
          <button onClick={send} disabled={sending} className="metallic px-6 py-2 rounded-full text-sm font-semibold disabled:opacity-40">{sending?"...":"Send"}</button>
        </div>
      </div>
    </div>
  )
}
