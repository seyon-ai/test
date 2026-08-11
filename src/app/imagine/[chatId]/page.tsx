"use client";
import { useState } from "react";
import Link from "next/link";

type Msg = { role:"user"|"assistant", content:string };

export default function ChatPage({ params }: { params:{ chatId:string } }){
  const [msgs,setMsgs]=useState<Msg[]>([
    { role:"assistant", content:"Hey! Let's build your story scene by scene. What's the spark — a place, a character, or a 'what if'?" },
  ]);
  const [input,setInput]=useState("");
  const [publishing,setPublishing]=useState(false);
  const [progress,setProgress]=useState(0);

  const send=()=>{
    if(!input.trim()) return;
    const user:Msg={ role:"user", content:input };
    setMsgs(m=>[...m,user]);
    setInput("");
    setTimeout(()=>{
      const replies=[
        "Love that. What does it smell like there? And who's the one person who shouldn't be there but is?",
        "Ooh — and if that door could answer one question, what would you ask it?",
        "Got it. Paint me the light — is it warm, flickering, or that cold blue before dawn?",
      ];
      setMsgs(m=>[...m,{ role:"assistant", content: replies[Math.floor(Math.random()*replies.length)] }]);
    },700);
  };

  const publish= async ()=>{
    setPublishing(true);
    setProgress(0);
    // Per spec: save FAST (build URLs only), then client preloads images scene-by-scene
    for(let i=0;i<=100;i+=10){ await new Promise(r=>setTimeout(r,180)); setProgress(i); }
    setPublishing(false);
    // Redirect to reel
    window.location.href="/reels/demo123";
  };

  if(publishing){
    return (
      <div className="max-w-[560px] mx-auto px-6 py-16 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl metallic animate-bob flex items-center justify-center font-bold">IG</div>
        <h2 className="text-xl font-bold mt-4">IGMA is processing...</h2>
        <p className="text-sm text-text-mid">Building your reel — generating scene images via Pollinations proxy</p>
        <div className="h-2 bg-white/10 rounded-full mt-6 overflow-hidden">
          <div className="h-full metallic transition-all" style={{width: progress+"%"}} />
        </div>
        <p className="text-xs text-text-low mt-2">{progress}% • Preloading {Math.ceil(progress/25)}/4 scenes • Browser TTS ready (no audio files)</p>
      </div>
    )
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 py-6">
      <div className="flex items-center gap-3">
        <Link href="/imagine" className="text-sm text-silver-dim hover:text-white">← Studio</Link>
        <h1 className="font-semibold">Chat {params.chatId}</h1>
        <Link href={`/imagine/${params.chatId}/settings`} className="ml-auto text-xs border border-white/10 rounded-full px-3 py-1">Settings</Link>
        <button onClick={publish} className="metallic px-4 py-1.5 rounded-full text-sm font-semibold">Publish → Reel</button>
      </div>
      <div className="glass rounded-2xl mt-4 p-4 min-h-[420px] flex flex-col">
        <div className="flex-1 space-y-3 overflow-auto">
          {msgs.map((m,i)=>(
            <div key={i} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role==="user"?"bg-white text-black ml-auto":"bg-white/10 border border-white/10"}`}>{m.content}</div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Write the next beat..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm" />
          <button onClick={send} className="metallic px-6 py-2 rounded-full text-sm font-semibold">Send</button>
        </div>
        <p className="text-[11px] text-text-low mt-2">Groq llama-3.3-70b • Pollinations images via /api/media/image proxy • TTS is browser-native SpeechSynthesis</p>
      </div>
    </div>
  )
}
