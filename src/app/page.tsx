"use client";
import { useState } from "react";
import Link from "next/link";
import { StoryCard } from "@/components/StoryCard";
import Mascot from "@/components/Mascot";
import { uploadToImgbb } from "@/lib/imgbb";
import { auth } from "@/lib/firebase";

const moods = ["All","Comedy","Fantasy","Horror","Romance","Sci-Fi","Trending"] as const;

const seed = [
  { id:"1", author:"Aria", username:"aria_dreams", text:"What if clouds were actually floating oceans and we could swim up there with sky-whales as lifeguards? I'd get a season pass.", mood:"Fantasy", reaction:"Okay but now I want a season pass to the sky-ocean. Sky-whale lifeguard is elite world-building.", likes:142, liked:false, imageUrl:"https://picsum.photos/seed/sky1/800/450" },
  { id:"2", author:"Dev", username:"dev_imagines", text:"I told my future self to call me yesterday. Still waiting. Suspect he's ghosting me — saw the call coming and declined.", mood:"Comedy", reaction:"Time-travel ghosting is crazy disrespect. He saw the future and still hit decline.", likes:89, liked:false },
  { id:"3", author:"Mara", username:"mara_night", text:"A library where every book writes itself as you live. I opened mine and it was already on chapter 40 — and it was burning.", mood:"Horror", reaction:"Chapter 40 and burning? I'm closing that book and pretending literacy is optional.", likes:231, liked:true, imageUrl:"https://picsum.photos/seed/lib/800/450" },
];

export default function FeedPage(){
  const [posts,setPosts]=useState(seed);
  const [text,setText]=useState("");
  const [mood,setMood]=useState("Fantasy");
  const [filter,setFilter]=useState("All");
  const [publishing,setPublishing]=useState(false);
  const [msg,setMsg]=useState("");
  const [imageUrl,setImageUrl]=useState<string| null>(null);
  const [uploading,setUploading]=useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0]; if(!f) return;
    setUploading(true); setMsg("");
    try{ const url = await uploadToImgbb(f); setImageUrl(url); setMsg("Image uploaded via imgbb ✓"); } catch(err:any){ setMsg("imgbb upload failed: "+err.message + " — add NEXT_PUBLIC_IMGBB_API_KEY in Vercel env"); } finally{ setUploading(false); }
  };

  const publish = async ()=>{
    if(!text.trim()) return;
    setPublishing(true); setMsg("");
    try{
      // REAL GROQ call — with Firebase ID token if logged in
      let reaction = "Imagination unlocked. More please.";
      let token: string| null = null;
      try{ token = await auth.currentUser?.getIdToken() || null; } catch{}
      const headers: any = { "Content-Type": "application/json" };
      if(token) headers["Authorization"] = "Bearer "+token;

      const res = await fetch("/api/groq/react", {
        method:"POST",
        headers,
        body: JSON.stringify({ text, mood })
      });
      const j = await res.json();
      if(res.ok && j.reaction) reaction = j.reaction;
      else if(j.error) setMsg("Groq: "+j.error + " (if you just added GROQ_API_KEY, REDEPLOY in Vercel!)");

      const np:any={ id:Date.now().toString(), author: auth.currentUser?.displayName || "You", username: auth.currentUser?.email?.split("@")[0] || "you", text, mood, reaction, likes:0, liked:false, imageUrl: imageUrl || undefined };
      // Also try Firestore write (if logged in) — non-blocking
      try{
        const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        if(auth.currentUser) await addDoc(collection(db,"stories"), { text, mood, reaction, imageUrl: imageUrl||null, authorId: auth.currentUser.uid, author: np.author, username: np.username, likes:0, createdAt: serverTimestamp() });
      } catch{}

      setPosts(p=>[np,...p]);
      setText(""); setImageUrl(null);
      if(!j.error) setMsg("Published! Groq reacted ✓");
    } catch(e:any){ setMsg("Publish failed: "+e.message); }
    setPublishing(false);
  };

  const toggleLike=(id:string)=> setPosts(p=>p.map(x=> x.id===id ? {...x, liked:!x.liked, likes: x.liked? x.likes-1: x.likes+1}:x));
  const filtered = filter==="All"? posts: filter==="Trending"? [...posts].sort((a,b)=>b.likes-a.likes): posts.filter(p=>p.mood===filter);

  return (
    <div className="max-w-[720px] mx-auto px-4 py-6">
      <div className="glass rounded-[28px] p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="flex gap-4 items-start">
          <Mascot size={64} />
          <div className="flex-1">
            <h1 className="font-display font-extrabold text-2xl md:text-3xl leading-tight">Instagram is for consuming.<br/><span className="metallic-text">IGMA is for creating.</span></h1>
            <p className="text-sm text-text-mid mt-2 max-w-[520px]">Two ways: <b className="text-white">Quick Post</b> — drop a moment, Groq reacts. <b className="text-white">Imagine Studio</b> — long story → reel.</p>
            <div className="flex gap-2 mt-4">
              <Link href="/imagine" className="metallic px-5 py-2 rounded-full text-sm font-semibold">Open Studio →</Link>
              <Link href="/explore" className="px-5 py-2 rounded-full border border-white/10 text-sm hover:bg-white/5">Explore Feed</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-[24px] p-5 md:p-6 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">Quick Post</h2>
          <span className="text-xs text-silver-dim">Groq llama-3.3 • imgbb upload</span>
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="e.g., I found a door in my fridge that opens to last Tuesday..." maxLength={500} className="w-full mt-4 bg-[#0A0A0B] border border-white/10 rounded-2xl p-4 text-sm placeholder:text-text-low focus:outline-none focus:border-white/20 min-h-[110px]" />
        
        {imageUrl && <div className="mt-3 relative"><img src={imageUrl} alt="upload" className="w-full rounded-2xl border border-white/10 aspect-[16/9] object-cover"/><button onClick={()=>setImageUrl(null)} className="absolute top-2 right-2 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs border border-white/20">Remove</button></div>}

        <div className="flex flex-wrap gap-2 mt-3">
          {moods.slice(1,6).map(m=>(
            <button key={m} onClick={()=>setMood(m)} className={`px-3.5 py-1.5 rounded-full text-xs border transition ${mood===m?"metallic border-transparent font-semibold text-black":"border-white/10 text-silver-dim hover:text-white"}`}>{m}</button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-4 items-center">
          <label className={`px-4 py-2 rounded-full border text-xs cursor-pointer flex items-center gap-2 ${uploading?"opacity-50":"hover:bg-white/5 border-white/10"}`}>
            <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
            {uploading ? "Uploading..." : "📷 Add Image (imgbb)"}
          </label>
          <span className="text-xs text-text-low">{text.length}/500 • {mood}</span>
          <button onClick={publish} disabled={!text.trim()||publishing} className="ml-auto metallic px-7 py-2.5 rounded-full text-sm font-bold disabled:opacity-40 flex items-center gap-2">
            {publishing && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/>}
            {publishing?"Publishing...":"Publish"}
          </button>
        </div>
        {msg && <p className="text-xs mt-3 p-2 rounded-xl bg-white/5 border border-white/10 break-words">{msg}</p>}
      </div>

      <div className="flex gap-2 mt-6 overflow-auto pb-2">
        {moods.map(m=>(
          <button key={m} onClick={()=>setFilter(m)} className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap border ${filter===m?"bg-white text-black font-semibold":"border-white/10 text-silver-dim"}`}>{m}</button>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        {filtered.map(p=> <StoryCard key={p.id} post={p} onLike={()=>toggleLike(p.id)} />)}
      </div>
    </div>
  )
}
