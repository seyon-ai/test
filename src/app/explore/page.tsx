"use client";
import { useState, useRef, useEffect } from "react";
import ReelPlayer from "@/components/ReelPlayer";
import Link from "next/link";

const feed = [
  { type:"post" as const, id:"p1", author:"@aria_dreams", mood:"Fantasy", text:"What if clouds were floating oceans with sky-whale lifeguards?", reaction:"Season pass to the sky-ocean please. That's elite world-building.", likes:142, img:"https://picsum.photos/seed/exp1/600/800" },
  { type:"reel" as const, id:"r1", title:"The Door in the Fridge", author:"@kai_sci", likes:412, scenes:[
    { caption:"Maya opens her fridge and finds a door where the milk should be.", imageUrl:"/api/media/image?prompt=cinematic%20fridge%20interior%20glowing%20door%20photorealistic%20portrait&seed=11&width=1080&height=1920" },
    { caption:"Last Tuesday is waiting on the other side, still warm.", imageUrl:"/api/media/image?prompt=time%20portal%20kitchen%20warm%20light%20surreal&seed=12&width=1080&height=1920" },
    { caption:"She steps through. Tuesday remembers her.", imageUrl:"/api/media/image?prompt=girl%20stepping%20through%20portal%20cinematic%20portrait&seed=13&width=1080&height=1920" },
  ]},
  { type:"post" as const, id:"p2", author:"@dev_imagines", mood:"Comedy", text:"My future self is ghosting me. Saw the call coming and declined — from the future.", reaction:"Time-travel ghosting is wild disrespect.", likes:89 },
  { type:"reel" as const, id:"r2", title:"Midnight Library", author:"@mara_night", likes:298, scenes:[
    { caption:"The library writes itself as you live. Chapter 40 is burning.", imageUrl:"/api/media/image?prompt=burning%20book%20library%20at%20night%20cinematic&seed=21&width=1080&height=1920" },
    { caption:"You turn the page and the words turn red.", imageUrl:"/api/media/image?prompt=glowing%20red%20text%20on%20page%20dark%20library&seed=22&width=1080&height=1920" },
  ]},
  { type:"post" as const, id:"p3", author:"@sofia_love", mood:"Romance", text:"Meet me where we first imagined meeting — I've been searching every daydream since.", reaction:"My heart did a flip. Tender and cinematic.", likes:178 },
];

export default function ExplorePage(){
  const [idx,setIdx]=useState(0);
  const containerRef=useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{ if(e.key==="ArrowDown") setIdx(i=>Math.min(feed.length-1,i+1)); if(e.key==="ArrowUp") setIdx(i=>Math.max(0,i-1)); };
    window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h);
  },[]);

  const item = feed[idx];
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6 grid lg:grid-cols-[1fr_380px] gap-6">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-display">Explore</h1>
          <span className="text-xs text-silver-dim">↑↓ or swipe • {idx+1}/{feed.length}</span>
        </div>
        <p className="text-sm text-text-mid">Unified vertical scroll — quick posts + Imagine reels interleaved chronologically.</p>
        <div className="flex gap-2 mt-4 overflow-auto pb-2">
          {["All","Comedy","Fantasy","Horror","Romance","Sci-Fi","Trending"].map(c=>(
            <Link key={c} href={c==="All"?"/explore":`/explore/${c}`} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border ${idx===0&&c==="All"?"bg-white text-black":"border-white/10 text-silver-dim hover:text-white"}`}>{c}</Link>
          ))}
          <Link href="/reels/trending" className="px-3 py-1 rounded-full metallic text-xs font-semibold whitespace-nowrap">Trending Reels</Link>
        </div>

        {/* BIG vertical snap feed */}
        <div ref={containerRef} className="mt-4 h-[74vh] overflow-y-scroll snap-y snap-mandatory rounded-[28px] border border-white/10 bg-black scroll-smooth">
          {feed.map((it,i)=>(
            <div key={i} className="h-[74vh] snap-start relative flex items-center justify-center p-4">
              {it.type==="post" ? (
                <div className="w-full max-w-[520px] glass rounded-[24px] p-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full metallic text-[10px] font-bold text-black">{it.mood.toUpperCase()}</span>
                    <span className="text-xs text-silver-dim">{it.author}</span>
                    <span className="ml-auto text-xs text-silver-dim">♡ {it.likes}</span>
                  </div>
                  <p className="text-xl leading-relaxed mt-4 font-medium">{it.text}</p>
                  {it.type==="post" && (it as any).img && <img src={(it as any).img} alt="" className="mt-4 rounded-2xl w-full aspect-[4/3] object-cover" />}
                  <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5"><p className="text-sm">“{it.reaction}”</p><p className="text-[11px] text-silver-dim">IGMA reacts</p></div>
                  <div className="flex gap-2 mt-4"><button className="flex-1 py-2 rounded-full bg-white text-black text-sm font-semibold">♡ Like</button><button className="flex-1 py-2 rounded-full border border-white/10 text-sm">💬 Comment</button></div>
                </div>
              ) : (
                <div className="scale-[0.92] origin-center">
                  <ReelPlayer title={it.title} scenes={it.scenes} />
                  <p className="text-center text-xs text-white/60 mt-2">{it.author} • {it.likes} likes • Tap to navigate • SpeechSynthesis narration</p>
                </div>
              )}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                <button onClick={()=>setIdx(Math.max(0,i-1))} className="w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm">↑</button>
                <button onClick={()=>setIdx(Math.min(feed.length-1,i+1))} className="w-9 h-9 rounded-full metallic text-sm font-bold text-black">↓</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right rail */}
      <div className="space-y-4">
        <div className="glass rounded-2xl p-5 sticky top-[76px]">
          <h3 className="font-semibold">Now Playing</h3>
          <p className="text-xs text-silver-dim">{item.type==="post"?"Quick Post":"Reel"} • {item.type==="post"? (item as any).mood : (item as any).title}</p>
          <div className="flex gap-1 mt-3">
            {feed.map((_,i)=> <button key={i} onClick={()=>setIdx(i)} className={`h-1 flex-1 rounded-full ${i===idx?"bg-white":"bg-white/20"}`} />)}
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {feed.map((it,i)=>(
              <button key={i} onClick={()=>setIdx(i)} className={`aspect-[9/16] rounded-xl border overflow-hidden relative ${i===idx?"border-white":"border-white/10"}`}>
                {it.type==="reel" ? <img src={it.scenes[0].imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] p-1">{it.text.slice(0,28)}</div>}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={()=>setIdx(i=>Math.max(0,i-1))} className="flex-1 py-2 rounded-full border border-white/10 text-sm">Prev</button>
            <button onClick={()=>setIdx(i=>Math.min(feed.length-1,i+1))} className="flex-1 py-2 rounded-full metallic text-sm font-semibold">Next</button>
          </div>
          <p className="text-[11px] text-text-low mt-3">Autoplay logic: reel speaks via window.speechSynthesis when in view. Mute toggle inside player. Falls back to 7s timer.</p>
        </div>
      </div>
    </div>
  )
}
