"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { StoryCard } from "@/components/StoryCard";
import Mascot from "@/components/Mascot";
import { uploadToImgbb } from "@/lib/imgbb";
import { auth } from "@/lib/firebase";
import { useExplore } from "@/hooks/useExplore";
import { createNotification } from "@/hooks/useNotifications";

const moods = ["All","Comedy","Fantasy","Horror","Romance","Sci-Fi","Trending"] as const;

const seed:any[] = [
  { id:"seed1", kind:"post", text:"What if clouds were actually floating oceans and we could swim up there with sky-whales as lifeguards? I'd get a season pass.", mood:"Fantasy", reaction:"Okay but now I want a season pass to the sky-ocean. Sky-whale lifeguard is elite world-building.", likes:142, liked:false, imageUrl:"https://picsum.photos/seed/sky1/800/450", author:"Aria", username:"aria_dreams", createdAt:{seconds:999999999} },
  { id:"seed2", kind:"post", text:"I told my future self to call me yesterday. Still waiting. Suspect he's ghosting me — saw the call coming and declined.", mood:"Comedy", reaction:"Time-travel ghosting is crazy disrespect. He saw the future and still hit decline.", likes:89, liked:false, author:"Dev", username:"dev_imagines", createdAt:{seconds:999999990} },
];

export default function FeedPage(){
  const { items: realPosts, loading } = useExplore();
  // Feed shows ONLY posts (like Explore shows both) — but uses SAME Firestore source
  const firestorePosts = realPosts.filter((x:any)=> x.kind==="post");
  const posts = firestorePosts.length>0 ? firestorePosts : seed;

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
    try{ const url = await uploadToImgbb(f); setImageUrl(url); setMsg("Image uploaded via imgbb ✓ — supports IMGBB_API_KEY or NEXT_PUBLIC_IMGBB_API_KEY"); } catch(err:any){ setMsg("imgbb upload failed: "+err.message); } finally{ setUploading(false); }
  };

  const publish = async ()=>{
    if(!text.trim()) return;
    setPublishing(true); setMsg("");
    try{
      let reaction = "Imagination unlocked. More please.";
      let token: string| null = null;
      try{ token = await auth.currentUser?.getIdToken() || null; } catch{}
      const headers: any = { "Content-Type": "application/json" };
      if(token) headers["Authorization"] = "Bearer "+token;
      const res = await fetch("/api/groq/react", { method:"POST", headers, body: JSON.stringify({ text, mood }) });
      const j = await res.json();
      if(res.ok && j.reaction) reaction = j.reaction;
      else if(j.error) setMsg("Groq: "+j.error + " (if you just added GROQ_API_KEY, REDEPLOY in Vercel!)");

      // Save to Firestore — Home + Explore both listen to same collection so it appears in BOTH
      try{
        const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        if(!auth.currentUser) setMsg(m=> m + " — saved locally (login to save permanently to Firestore & notify followers)");
        if(auth.currentUser) await addDoc(collection(db,"stories"), { text, mood, reaction, imageUrl: imageUrl||null, authorId: auth.currentUser.uid, author: auth.currentUser.displayName|| auth.currentUser.email?.split("@")[0]||"you", username: auth.currentUser.email?.split("@")[0]||"you", likes:0, createdAt: serverTimestamp() });
      } catch(e:any){ setMsg("Firestore save failed: "+e.message+" — check Firestore Rules allow write if request.auth != null"); }

      // Optimistic local add so user sees instantly even before onSnapshot
      const np:any={ id:"local-"+Date.now(), kind:"post", text, mood, reaction, likes:0, liked:false, imageUrl: imageUrl||undefined, author: auth.currentUser?.displayName||"You", username: auth.currentUser?.email?.split("@")[0]||"you", createdAt:{seconds:Date.now()/1000}};
      // if real data empty, we use seed array state — but now we just rely on Firestore; keep msg
      setText(""); setImageUrl(null);
      if(!msg.includes("Groq:")) setMsg("Published! Now visible on Home feed AND Explore (same Firestore). Refresh if not — check Firestore rules.");
    } catch(e:any){ setMsg("Publish failed: "+e.message); }
    setPublishing(false);
  };

  const filtered:any[] = filter==="All"? posts : filter==="Trending"? [...posts].sort((a:any,b:any)=>(b.likes||0)-(a.likes||0)): posts.filter((p:any)=>p.mood===filter);

  return (
    <div className="max-w-[720px] mx-auto px-4 py-6">
      <div className="glass rounded-[28px] p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="flex gap-4 items-start">
          <Mascot size={64} />
          <div className="flex-1">
            <h1 className="font-display font-extrabold text-2xl md:text-3xl leading-tight">Instagram is for consuming.<br/><span className="metallic-text">IGMA is for creating.</span></h1>
            <p className="text-sm text-text-mid mt-2">Home = your posts chronologically. Explore = Home + Reels interleaved. Both read same Firestore — publish once, appears in both. {loading && "Syncing..."}</p>
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
          <span className="text-xs text-silver-dim">{firestorePosts.length>0? `${firestorePosts.length} live posts (Firestore)` : "DEMO — add Firestore story to go live"} • imgbb</span>
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="e.g., I found a door in my fridge that opens to last Tuesday..." maxLength={500} className="w-full mt-4 bg-[#0A0A0B] border border-white/10 rounded-2xl p-4 text-sm placeholder:text-text-low focus:outline-none focus:border-white/20 min-h-[110px]" />
        {imageUrl && <div className="mt-3 relative"><img src={imageUrl} alt="upload" className="w-full rounded-2xl border border-white/10 aspect-[16/9] object-cover"/><button onClick={()=>setImageUrl(null)} className="absolute top-2 right-2 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs border border-white/20">Remove</button></div>}
        <div className="flex flex-wrap gap-2 mt-3">
          {moods.slice(1,6).map(m=>(
            <button key={m} onClick={()=>setMood(m)} className={`px-3.5 py-1.5 rounded-full text-xs border ${mood===m?"metallic border-transparent font-semibold text-black":"border-white/10 text-silver-dim"}`}>{m}</button>
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
        <p className="text-[11px] text-text-low mt-2">imgbb works with IMGBB_API_KEY or NEXT_PUBLIC_IMGBB_API_KEY — add either in Vercel → Redeploy.</p>
      </div>

      <div className="flex gap-2 mt-6 overflow-auto pb-2">
        {moods.map(m=>(
          <button key={m} onClick={()=>setFilter(m)} className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap border ${filter===m?"bg-white text-black font-semibold":"border-white/10 text-silver-dim"}`}>{m}</button>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        {filtered.length===0 ? (
          <div className="glass rounded-2xl p-8 text-center text-silver-dim">No posts for {filter} yet — publish one! If Firestore posts don't show, check Rules: allow read if true, allow create if request.auth != null.</div>
        ) : filtered.map((p:any)=> <StoryCard key={p.id} post={p} onLike={async()=>{
          // like + notification
          try{
            const { doc, updateDoc, increment } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");
            if(p.id.startsWith("seed") || p.id.startsWith("local")) return;
            await updateDoc(doc(db,"stories", p.id), { likes: increment(1) });
            if(p.authorId) await createNotification(p.authorId, { type:"like", actorUsername: auth.currentUser?.email?.split("@")[0]||"you", actorDisplayName: auth.currentUser?.displayName||"you", actorId: auth.currentUser?.uid||"", storyId: p.id, storyPreview: p.text?.slice(0,40) } as any);
          } catch{}
        }} />)}
      </div>
    </div>
  )
}
