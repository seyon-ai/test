"use client";
import { useState } from "react";
import Link from "next/link";
import { StoryCard } from "@/components/StoryCard";
import Mascot from "@/components/Mascot";

const moods = ["All","Comedy","Fantasy","Horror","Romance","Sci-Fi","Trending"] as const;

const seed = [
  { id:"1", author:"Aria", username:"aria_dreams", text:"What if clouds were actually floating oceans and we could swim up there with sky-whales as lifeguards? I'd get a season pass.", mood:"Fantasy", reaction:"Okay but now I want a season pass to the sky-ocean. Sky-whale lifeguard is elite world-building.", likes:142, liked:false, imageUrl:"https://picsum.photos/seed/sky1/800/450" },
  { id:"2", author:"Dev", username:"dev_imagines", text:"I told my future self to call me yesterday. Still waiting. Suspect he's ghosting me — saw the call coming and declined.", mood:"Comedy", reaction:"Time-travel ghosting is crazy disrespect. He saw the future and still hit decline.", likes:89, liked:false },
  { id:"3", author:"Mara", username:"mara_night", text:"A library where every book writes itself as you live. I opened mine and it was already on chapter 40 — and it was burning.", mood:"Horror", reaction:"Chapter 40 and burning? I'm closing that book and pretending literacy is optional.", likes:231, liked:true, imageUrl:"https://picsum.photos/seed/lib/800/450" },
  { id:"4", author:"Kai", username:"kai_sci", text:"We built a fridge door that opens to last Tuesday. Tuesday remembers us, but we don't remember Tuesday.", mood:"Sci-Fi", reaction:"Big 'what if the simulation blinked' energy. I need the Director's Cut of Tuesday.", likes:64, liked:false },
  { id:"5", author:"Sofia", username:"sofia_love", text:"He left a note: 'Meet me where we first imagined meeting.' I've been searching every daydream since.", mood:"Romance", reaction:"My heart did a little flip. That's the most tender time-travel I've read.", likes:178, liked:false },
];

export default function FeedPage(){
  const [posts,setPosts]=useState(seed);
  const [text,setText]=useState("");
  const [mood,setMood]=useState("Fantasy");
  const [filter,setFilter]=useState("All");
  const [publishing,setPublishing]=useState(false);
  const [showSuccess,setShowSuccess]=useState(false);

  const publish = async ()=>{
    if(!text.trim()) return;
    setPublishing(true);
    await new Promise(r=>setTimeout(r,1100));
    const reactions:Record<string,string>={
      Comedy:"I'm wheezing. The timing on that is criminal — 10/10 delivery.",
      Fantasy:"That's pure cinema in my head. I need the illustrated edition yesterday.",
      Horror:"Nope nope nope. You just made my room 10 degrees colder.",
      Romance:"Tender and cinematic. My heart is still hovering.",
      "Sci-Fi":"Simulation just blinked. Love the concept.",
    };
    const np:any={ id:Date.now().toString(), author:"You", username:"you", text, mood, reaction:reactions[mood]||"Imagination unlocked. More please.", likes:0, liked:false };
    setPosts(p=>[np,...p]);
    setText(""); setPublishing(false); setShowSuccess(true); setTimeout(()=>setShowSuccess(false),2500);
  };

  const toggleLike=(id:string)=> setPosts(p=>p.map(x=> x.id===id ? {...x, liked:!x.liked, likes: x.liked? x.likes-1: x.likes+1}:x));
  const filtered = filter==="All"? posts: filter==="Trending"? [...posts].sort((a,b)=>b.likes-a.likes): posts.filter(p=>p.mood===filter);

  return (
    <div className="max-w-[720px] mx-auto px-4 py-6">
      {/* HERO */}
      <div className="glass rounded-[28px] p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="flex gap-4 items-start">
          <Mascot size={64} />
          <div className="flex-1">
            <h1 className="font-display font-extrabold text-2xl md:text-3xl leading-tight">Instagram is for consuming.<br/><span className="metallic-text">IGMA is for creating.</span></h1>
            <p className="text-sm text-text-mid mt-2 max-w-[520px]">Two ways to create: <b className="text-white">Quick Post</b> — drop an impossible moment, AI reacts. <b className="text-white">Imagine Studio</b> — build a story scene-by-scene → publish as an illustrated reel with browser TTS narration.</p>
            <div className="flex gap-2 mt-4">
              <Link href="/imagine" className="metallic px-5 py-2 rounded-full text-sm font-semibold">Open Studio →</Link>
              <Link href="/explore" className="px-5 py-2 rounded-full border border-white/10 text-sm hover:bg-white/5">Explore Feed</Link>
            </div>
          </div>
        </div>
        {showSuccess && <div className="absolute bottom-3 right-4 bg-white text-black px-4 py-1.5 rounded-full text-xs font-semibold">Published! Groq reacted ✓</div>}
      </div>

      {/* Composer */}
      <div className="glass rounded-[24px] p-5 md:p-6 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">Quick Post</h2>
          <span className="text-xs text-silver-dim">Pollinations images are optional • Groq reacts in 1-4 sentences</span>
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="e.g., I found a door in my fridge that opens to last Tuesday..." maxLength={500} className="w-full mt-4 bg-[#0A0A0B] border border-white/10 rounded-2xl p-4 text-sm placeholder:text-text-low focus:outline-none focus:border-white/20 min-h-[110px]" />
        <div className="flex flex-wrap gap-2 mt-3">
          {moods.slice(1,6).map(m=>(
            <button key={m} onClick={()=>setMood(m)} className={`px-3.5 py-1.5 rounded-full text-xs border transition ${mood===m?"metallic border-transparent font-semibold text-black":"border-white/10 text-silver-dim hover:text-white hover:border-white/20"}`}>{m}</button>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-text-low">{text.length}/500 • {mood}</span>
          <button onClick={publish} disabled={!text.trim()||publishing} className="metallic px-7 py-2.5 rounded-full text-sm font-bold disabled:opacity-40 hover:opacity-90 transition flex items-center gap-2">
            {publishing && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/>}
            {publishing?"Publishing...":"Publish"}
          </button>
        </div>
      </div>

      {/* Filters + Stats */}
      <div className="flex gap-2 mt-6 overflow-auto pb-2 scrollbar-none">
        {moods.map(m=>(
          <button key={m} onClick={()=>setFilter(m)} className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap border transition ${filter===m?"bg-white text-black font-semibold border-white":"border-white/10 text-silver-dim hover:text-white"}`}>{m}</button>
        ))}
        <Link href="/explore" className="ml-auto text-xs text-silver-dim underline whitespace-nowrap self-center">Explore fullscreen →</Link>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="glass rounded-2xl p-3 text-center"><p className="text-xl font-bold">{posts.length}</p><p className="text-[11px] text-silver-dim">Stories</p></div>
        <div className="glass rounded-2xl p-3 text-center"><p className="text-xl font-bold">{posts.reduce((a,b)=>a+b.likes,0)}</p><p className="text-[11px] text-silver-dim">Total Likes</p></div>
        <div className="glass rounded-2xl p-3 text-center"><p className="text-xl font-bold">5</p><p className="text-[11px] text-silver-dim">Moods</p></div>
      </div>

      {/* Feed */}
      <div className="mt-6 space-y-5">
        {filtered.map(p=> <StoryCard key={p.id} post={p} onLike={()=>toggleLike(p.id)} />)}
      </div>

      <div className="glass rounded-2xl p-6 mt-8 text-center">
        <p className="text-sm font-semibold">Want the full cinematic experience?</p>
        <p className="text-xs text-text-mid">Every post here also lives in the vertical Explore feed with reels interleaved. Try Imagine Studio for the full story-to-reel magic.</p>
        <div className="flex justify-center gap-2 mt-3"><Link href="/explore" className="metallic px-5 py-2 rounded-full text-sm font-semibold">Explore</Link><Link href="/imagine" className="px-5 py-2 rounded-full border border-white/10 text-sm">Imagine Studio</Link></div>
      </div>
    </div>
  )
}
