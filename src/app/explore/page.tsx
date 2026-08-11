"use client";
import { useState, useEffect } from "react";
import ReelPlayer from "@/components/ReelPlayer";
import Link from "next/link";
import { useExplore } from "@/hooks/useExplore";

const fallback = [
  { id:"p1", kind:"post" as const, text:"What if clouds were floating oceans with sky-whale lifeguards?", mood:"Fantasy", reaction:"Season pass to the sky-ocean please.", likes:142, author:"Aria", username:"aria_dreams", createdAt:null, imageUrl:"https://picsum.photos/seed/exp1/600/800" },
  { id:"r1", kind:"reel" as const, title:"The Door in the Fridge", author:"Kai", username:"kai_sci", likes:412, createdAt:null, scenes:[
    { caption:"Maya opens her fridge and finds a door where the milk should be.", imageUrl:"/api/media/image?prompt=cinematic%20fridge%20glowing%20door%20photorealistic%20portrait&seed=11&width=1080&height=1920" },
    { caption:"Last Tuesday is waiting on the other side, still warm.", imageUrl:"/api/media/image?prompt=time%20portal%20kitchen%20warm%20light%20surreal&seed=12&width=1080&height=1920" },
  ]},
];

export default function ExplorePage(){
  const { items: real, loading } = useExplore();
  const feed = real.length>0 ? real : fallback as any;
  const [idx,setIdx]=useState(0);
  const item:any = feed[idx] || fallback[0];

  useEffect(()=>{ setIdx(0); },[real.length]);

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6 grid lg:grid-cols-[1fr_380px] gap-6">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-display">Explore {loading && <span className="text-sm font-normal text-silver-dim">• syncing Firestore...</span>}</h1>
          <span className="text-xs text-silver-dim">{idx+1}/{feed.length} • {real.length>0? "LIVE (stories+reels interleaved by createdAt)" : "DEMO — add stories/reels to Firestore to go live"}</span>
        </div>
        <p className="text-sm text-text-mid">Unified feed — every short post + every reel interleaved chronologically. Publish a reel → it appears here instantly via onSnapshot.</p>
        <div className="flex gap-2 mt-4 overflow-auto pb-2">
          {["All","Comedy","Fantasy","Horror","Romance","Sci-Fi","Trending"].map(c=>(
            <Link key={c} href={c==="All"?"/explore":`/explore/${c}`} className="px-3 py-1 rounded-full text-xs whitespace-nowrap border border-white/10 text-silver-dim hover:text-white">{c}</Link>
          ))}
        </div>

        <div className="mt-4 h-[74vh] overflow-y-scroll snap-y snap-mandatory rounded-[28px] border border-white/10 bg-black scroll-smooth">
          {feed.map((it:any,i:number)=>(
            <div key={it.id+"-"+i} className="h-[74vh] snap-start relative flex items-center justify-center p-4">
              {it.kind==="post" ? (
                <div className="w-full max-w-[520px] glass rounded-[24px] p-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full metallic text-[10px] font-bold text-black">{it.mood?.toUpperCase()}</span>
                    <span className="text-xs text-silver-dim">@{it.username}</span>
                    <span className="ml-auto text-xs text-silver-dim">♡ {it.likes||0}</span>
                  </div>
                  <p className="text-xl leading-relaxed mt-4 font-medium">{it.text}</p>
                  {it.imageUrl && <img src={it.imageUrl} alt="" className="mt-4 rounded-2xl w-full aspect-[4/3] object-cover" />}
                  <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5"><p className="text-sm">“{it.reaction}”</p><p className="text-[11px] text-silver-dim">IGMA reacts • Groq</p></div>
                  <div className="flex gap-2 mt-4"><button className="flex-1 py-2 rounded-full bg-white text-black text-sm font-semibold">♡ Like</button><Link href={`/post/${it.id}`} className="flex-1 py-2 rounded-full border border-white/10 text-sm text-center">Open</Link></div>
                </div>
              ) : (
                <div className="scale-[0.92]">
                  <ReelPlayer title={it.title} scenes={it.scenes} />
                  <p className="text-center text-xs text-white/60 mt-2">@{it.username} • {it.likes||0} likes • word-highlight subtitles</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass rounded-2xl p-5 sticky top-[76px]">
          <h3 className="font-semibold">Now Playing</h3>
          <p className="text-xs text-silver-dim">{item.kind==="post"?"Quick Post":"Reel"} • {item.kind==="post"? item.mood : item.title}</p>
          <div className="flex gap-1 mt-3">
            {feed.slice(0,8).map((_:any,i:number)=> <button key={i} onClick={()=>setIdx(i)} className={`h-1 flex-1 rounded-full ${i===idx?"bg-white":"bg-white/20"}`} />)}
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {feed.slice(0,8).map((it:any,i:number)=>(
              <button key={i} onClick={()=>setIdx(i)} className={`aspect-[9/16] rounded-xl border overflow-hidden ${i===idx?"border-white":"border-white/10"}`}>
                {it.kind==="reel" ? <img src={it.scenes[0].imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] p-1 text-center">{it.text?.slice(0,30)}</div>}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-text-low mt-3">Reels & posts both live here. If your new reel/post doesn't show, check Firestore rules & that createdAt is serverTimestamp().</p>
        </div>
      </div>
    </div>
  )
}
