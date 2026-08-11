"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function MyProfile(){
  const { user } = useAuth();
  const uid = user?.uid || "";
  const [stats,setStats]=useState({ stories:0, reels:0, followers:0, following:0, likes:0 });
  const [recentStories,setRecentStories]=useState<any[]>([]);
  const [recentReels,setRecentReels]=useState<any[]>([]);
  const [suggested,setSuggested]=useState<any[]>([]);
  const [recentConvos,setRecentConvos]=useState<any[]>([]);
  const [profile,setProfile]=useState<any>(null);

  useEffect(()=>{
    if(!uid) return;
    const un1 = onSnapshot(query(collection(db,"stories"), where("authorId","==", uid)), s=> { setStats(st=>({...st, stories:s.size})); setRecentStories(s.docs.map(d=>({id:d.id, ...d.data() as any})).slice(0,3)); });
    const un2 = onSnapshot(query(collection(db,"reels"), where("authorId","==", uid)), s=> { setStats(st=>({...st, reels:s.size})); setRecentReels(s.docs.map(d=>({id:d.id, ...d.data() as any})).slice(0,3)); });
    const un3 = onSnapshot(query(collection(db,"follows"), where("followingId","==", uid)), s=> setStats(st=>({...st, followers:s.size})));
    const un4 = onSnapshot(query(collection(db,"follows"), where("followerId","==", uid)), s=> setStats(st=>({...st, following:s.size})));
    const un5 = onSnapshot(query(collection(db,"profiles"), where("__name__","==", uid)) as any, s=> { if(!s.empty) setProfile(s.docs[0].data()); });
    // discover
    const un6 = onSnapshot(collection(db,"profiles"), s=> setSuggested(s.docs.map(d=>({id:d.id, ...d.data() as any})).filter((p:any)=>p.username && p.username!==user?.email?.split("@")[0]).slice(0,4)));
    const un7 = onSnapshot(query(collection(db,"conversations"), where("participantIds","array-contains", uid)), s=> setRecentConvos(s.docs.map(d=>({id:d.id, ...d.data() as any})).slice(0,3)));
    return ()=>{ un1(); un2(); un3(); un4(); un5(); un6(); un7(); };
  },[uid]);

  if(!user) return <div className="max-w-[900px] mx-auto px-6 py-12 text-center"><p className="text-silver-dim">Login to see your profile</p><Link href="/login" className="metallic px-6 py-2 rounded-full text-sm font-semibold mt-3 inline-block">Login</Link></div>;

  const username = user.displayName || user.email?.split("@")[0] || "you";

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-6">
      {/* HEADER CARD */}
      <div className="glass rounded-[28px] p-6 md:p-8 flex gap-6 flex-col md:flex-row relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <img src={user.photoURL || profile?.avatarUrl || `https://i.pravatar.cc/200?u=${uid}`} alt="avatar" className="w-24 h-24 rounded-3xl border border-white/10 object-cover relative" />
        <div className="flex-1 relative">
          <h1 className="text-2xl font-bold">@{username} <span className="text-xs font-normal text-silver-dim">• {user.email}</span></h1>
          <p className="text-sm text-text-mid mt-1">{profile?.bio || "Creating imagination on IGMA — dreams, reels, and impossible moments."}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <Link href="/profile/edit" className="metallic px-5 py-1.5 rounded-full text-sm font-semibold">Edit Profile</Link>
            <Link href="/settings" className="px-4 py-1.5 rounded-full border border-white/10 text-sm">Settings</Link>
            <Link href="/achievements" className="px-4 py-1.5 rounded-full border border-white/10 text-sm">Achievements</Link>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center self-center">
          {[
            [stats.stories,"Stories",`/profile/${username}`],
            [stats.reels,"Reels",`/profile/${username}/reels`],
            [stats.followers,"Followers",`/profile/${username}/followers`],
            [stats.following,"Following",`/profile/${username}/following`],
          ].map(([v,l,href]:any)=>(
            <Link key={l as string} href={href as string} className="glass rounded-2xl px-4 py-3 hover:bg-white/5 min-w-[80px]">
              <p className="text-xl font-bold">{v as number}</p><p className="text-[11px] text-silver-dim">{l as string}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 mt-6">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Your Stories</h3><Link href={`/profile/${username}`} className="text-xs text-silver-dim underline">View all</Link>
            </div>
            {recentStories.length===0 ? <p className="text-sm text-silver-dim mt-3">No stories yet — publish on Home feed</p> : (
              <div className="grid sm:grid-cols-3 gap-3 mt-3">
                {recentStories.map(s=>(
                  <Link key={s.id} href={`/post/${s.id}`} className="glass rounded-2xl p-3 hover:bg-white/5 block">
                    <p className="text-xs text-silver-dim">{s.mood}</p><p className="text-sm line-clamp-3 mt-1">{s.text}</p><p className="text-xs text-silver-dim mt-2">♡ {s.likes||0}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Your Reels</h3><Link href="/reels/trending" className="text-xs text-silver-dim underline">Trending</Link>
            </div>
            {recentReels.length===0 ? <p className="text-sm text-silver-dim mt-3">No reels yet — create in Imagine Studio → Publish</p> : (
              <div className="grid sm:grid-cols-3 gap-3 mt-3">
                {recentReels.map(r=>(
                  <Link key={r.id} href={`/reels/${r.id}`} className="rounded-2xl overflow-hidden border border-white/10 aspect-[9/16] relative block">
                    <img src={r.scenes?.[0]?.imageUrl || `https://picsum.photos/seed/${r.id}/400/700`} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white line-clamp-2">{r.title}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold">Achievements</h3>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {[
                ["First Spark","Publish 1 story", stats.stories>=1],
                ["Reel Maker","Publish 1 reel", stats.reels>=1],
                ["Social","Get 1 follower", stats.followers>=1],
              ].map(([t,d,done]:any)=>(
                <div key={t as string} className={`rounded-2xl p-3 border text-center ${done?"bg-white text-black border-white":"border-white/10 bg-white/5 text-silver-dim"}`}>
                  <p className="text-xs font-bold">{t as string}</p><p className="text-[11px]">{d as string}</p><p className="text-[11px] mt-1">{done?"✓":"○"}</p>
                </div>
              ))}
            </div>
            <Link href="/achievements" className="text-xs underline text-silver-dim mt-3 inline-block">View all achievements →</Link>
          </div>
        </div>

        {/* RIGHT RAIL */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-sm">New Messages</h3>
            {recentConvos.length===0 ? <p className="text-xs text-silver-dim mt-2">No conversations — <Link href="/messages/new" className="underline">start one</Link></p> : (
              <div className="space-y-2 mt-2">
                {recentConvos.map(c=>(
                  <Link key={c.id} href={`/messages/${c.id}`} className="flex gap-2 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">💬</div>
                    <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{c.id.slice(0,16)}…</p><p className="text-xs text-silver-dim truncate">{c.lastMessage||"No messages"}</p></div>
                  </Link>
                ))}
                <Link href="/messages" className="text-xs underline text-silver-dim">View all messages →</Link>
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-sm">Discover New Users</h3>
            {suggested.length===0 ? <p className="text-xs text-silver-dim mt-2">No users yet — invite friends!</p> : (
              <div className="space-y-2 mt-2">
                {suggested.map(p=>(
                  <Link key={p.id} href={`/profile/${p.username}`} className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5">
                    <img src={p.avatarUrl || `https://i.pravatar.cc/100?u=${p.username}`} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div><p className="text-xs font-semibold">@{p.username}</p><p className="text-[11px] text-silver-dim line-clamp-1">{p.bio||"Creator"}</p></div>
                    <span className="ml-auto text-xs border border-white/10 rounded-full px-2 py-1">View</span>
                  </Link>
                ))}
                <Link href="/discover-people" className="text-xs underline text-silver-dim">Discover more →</Link>
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-sm">Settings</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                ["/settings/ai-personality","AI Personality"],
                ["/settings/privacy","Privacy"],
                ["/settings/notifications","Notifications"],
                ["/settings/appearance","Appearance"],
                ["/settings/blocked-accounts","Blocked"],
                ["/settings/data-export","Export Data"],
              ].map(([href,label])=>(
                <Link key={href as string} href={href as string} className="px-3 py-2 rounded-xl border border-white/10 text-xs hover:bg-white/5 text-center">{label as string}</Link>
              ))}
            </div>
            <Link href="/settings" className="text-xs underline text-silver-dim mt-3 inline-block">Open all settings →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
