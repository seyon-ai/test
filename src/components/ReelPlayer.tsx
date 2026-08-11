"use client";
import { useEffect, useRef, useState } from "react";

export type Scene = { caption: string; imageUrl: string; imagePrompt?: string };

export default function ReelPlayer({ title, scenes }: { title: string; scenes: Scene[] }) {
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(false);
  const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
  const [voiceIdx,setVoiceIdx]=useState(0);
  const [progress,setProgress]=useState(0);
  const [wordIdx,setWordIdx]=useState(-1);

  useEffect(()=>{
    if(typeof window!=="undefined" && "speechSynthesis" in window){
      const load=()=> setVoices(window.speechSynthesis.getVoices());
      load(); window.speechSynthesis.onvoiceschanged=load;
    }
  },[]);

  const words = scenes[idx]?.caption?.split(" ") || [];

  const speak = (text: string) => {
    if (muted || typeof window === "undefined" || !("speechSynthesis" in window)) {
      setWordIdx(-1);
      let w=0;
      const iv=setInterval(()=>{ setProgress(p=> Math.min(100, p+3)); w+=1; setWordIdx(Math.floor((w/35)*words.length)); }, 120);
      setTimeout(()=>{ clearInterval(iv); setIdx(i=> Math.min(i+1, scenes.length-1)); }, 7000);
      return ()=> clearInterval(iv);
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if(voices[voiceIdx]) u.voice=voices[voiceIdx];
    u.rate = 0.96; u.pitch = 1;
    let w=0;
    u.onboundary=(e:any)=>{
      if(e.name==="word"){ setWordIdx(w); w+=1; }
    };
    const start=Date.now();
    const iv=setInterval(()=> setProgress(Math.min(100, ((Date.now()-start)/6500)*100)), 80);
    u.onend = () => { clearInterval(iv); setProgress(100); setWordIdx(-1); setTimeout(()=> setIdx(i=> Math.min(i+1, scenes.length-1)), 500); };
    u.onerror=()=>{ clearInterval(iv); setWordIdx(-1); setTimeout(()=> setIdx(i=> Math.min(i+1, scenes.length-1)), 600); };
    window.speechSynthesis.speak(u);
    return ()=> clearInterval(iv);
  };

  useEffect(()=>{
    setProgress(0); setWordIdx(-1);
    if (!scenes[idx]) return;
    const clean=speak(scenes[idx].caption);
    return ()=> { if(typeof window!=="undefined") window.speechSynthesis.cancel(); if(clean) (clean as any)(); }
  },[idx, muted, voiceIdx]);

  useEffect(()=>()=>{ if(typeof window!=="undefined") window.speechSynthesis.cancel(); },[]);

  const scene = scenes[idx];
  if(!scene) return null;
  return (
    <div className="relative w-full max-w-[360px] mx-auto aspect-[9/16] rounded-[28px] overflow-hidden bg-black border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      <img src={scene.imageUrl} alt={scene.caption} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
      <div className="absolute top-0 left-0 right-0 p-2 flex gap-1">
        {scenes.map((_,i)=> (
          <div key={i} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-white transition-all duration-100" style={{width: i<idx?"100%": i===idx? progress+"%":"0%"}} />
          </div>
        ))}
      </div>
      <div className="absolute top-6 left-0 right-0 px-4 flex justify-between items-center">
        <p className="text-[10px] tracking-[0.18em] text-white/75 bg-black/30 backdrop-blur px-2.5 py-1 rounded-full border border-white/10">{title.toUpperCase()} • {idx+1}/{scenes.length}</p>
        <div className="flex gap-1">
          <select value={voiceIdx} onChange={e=>setVoiceIdx(Number(e.target.value))} className="bg-black/40 backdrop-blur border border-white/20 rounded-full text-[10px] px-2 py-1 text-white max-w-[110px]">
            {voices.slice(0,8).map((v,i)=><option key={i} value={i} className="text-black">{v.name.slice(0,18)}</option>)}
            {voices.length===0 && <option>Default</option>}
          </select>
          <button onClick={()=> setMuted(m=>!m)} className="w-8 h-8 rounded-full bg-black/40 backdrop-blur border border-white/20 text-xs">{muted?"🔇":"🔊"}</button>
        </div>
      </div>
      {/* BETTER SUBTITLES — word-highlight + background */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-black/55 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <p className="text-white text-[15px] font-medium leading-snug flex flex-wrap gap-1">
            {words.map((w,i)=>(
              <span key={i} className={`px-1 rounded transition ${i===wordIdx?"bg-white text-black": i<wordIdx?"text-white":"text-white/90"}`}>{w}</span>
            ))}
          </p>
          <div className="mt-2 h-1 bg-white/15 rounded-full overflow-hidden"><div className="h-full metallic transition-all" style={{width: progress+"%"}}/></div>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={()=> setIdx(i=> Math.max(0,i-1))} disabled={idx===0} className="flex-1 py-2.5 rounded-full bg-white/15 backdrop-blur border border-white/15 text-sm disabled:opacity-30">Prev</button>
          <button onClick={()=> setIdx(i=> Math.min(scenes.length-1,i+1))} disabled={idx===scenes.length-1} className="flex-1 py-2.5 rounded-full metallic text-sm font-semibold disabled:opacity-30">Next</button>
        </div>
        <p className="text-center text-[10px] text-white/50 mt-2">{muted ? "Muted — 7s auto-advance" : "Tap word-highlight subtitles • Browser TTS"}</p>
      </div>
      <button onClick={()=> setIdx(i=> Math.max(0,i-1))} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-24" aria-label="prev"/>
      <button onClick={()=> setIdx(i=> Math.min(scenes.length-1,i+1))} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-24" aria-label="next"/>
    </div>
  )
}
