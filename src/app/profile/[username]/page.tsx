"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useFollow } from "@/hooks/useFollow";

export default function Profile(){
  const params = useParams() as any;
  const username = decodeURIComponent(params.username);
  const [profile,setProfile]=useState<any>(null);
  const [uid,setUid]=useState<string>("");
  const [storyCount,setStoryCount]=useState(0);
  const [reelCount,setReelCount]=useState(0);

  useEffect(()=>{
    // Find uid by username — profiles collection
    const q = query(collection(db,"profiles"), where("username","==", username));
    const unsub = onSnapshot(q, async snap=>{
      if(!snap.empty){
        const d = snap.docs[0];
        setProfile({ id:d.id, ...d.data() as any });
        setUid(d.id);
      } else {
        // fallback: if no profile, try to find by stories author
        setProfile({ username, displayName: username, bio:"Imagination creator" });
        setUid("");
      }
    });
    return ()=> unsub();
  },[username]);

  useEffect(()=>{
    if(!uid) return;
    const un1 = onSnapshot(query(collection(db,"stories"), where("authorId","==", uid)), s=> setStoryCount(s.size));
    const un2 = onSnapshot(query(collection(db,"reels"), where("authorId","==", uid)), s=> setReelCount(s.size));
    return ()=>{ un1(); un2(); };
  },[uid]);

  const follow = useFollow(uid, username);
  const isOwn = auth.currentUser?.uid === uid;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <div className="glass rounded-3xl p-8 flex gap-6 flex-col md:flex-row">
        <img src={profile?.avatarUrl || `https://i.pravatar.cc/200?u=${username}`} alt="avatar" className="w-20 h-20 rounded-full border border-white/10 object-cover" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">@{username}</h1>
          <p className="text-text-mid text-sm">{profile?.displayName || username} • {profile?.bio || "Creating imagination on IGMA"}</p>
          <div className="flex gap-6 mt-3 text-sm">
            <span><b>{storyCount}</b> <span className="text-silver-dim">Stories</span></span>
            <span><b>{reelCount}</b> <span className="text-silver-dim">Reels</span></span>
            <span><b>{follow.followers}</b> <span className="text-silver-dim">Followers</span></span>
            <span><b>{follow.following}</b> <span className="text-silver-dim">Following</span></span>
          </div>
          <div className="flex gap-2 mt-4">
            {isOwn ? (
              <Link href="/profile/edit" className="metallic px-5 py-1.5 rounded-full text-sm font-semibold">Edit Profile</Link>
            ) : (
              <button onClick={follow.toggle} className={`px-5 py-1.5 rounded-full text-sm font-semibold border ${follow.isFollowing?"bg-white text-black":"metallic border-transparent"}`}>{follow.isFollowing ? "Following ✓" : "Follow"}</button>
            )}
            <Link href={`/profile/${username}/followers`} className="px-4 py-1.5 rounded-full border border-white/10 text-sm">Followers</Link>
            <Link href={`/profile/${username}/following`} className="px-4 py-1.5 rounded-full border border-white/10 text-sm">Following</Link>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <Link href={`/profile/${username}`} className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold">Stories</Link>
        <Link href={`/profile/${username}/reels`} className="px-4 py-2 rounded-full border border-white/10 text-sm">Reels</Link>
        <Link href={`/profile/${username}/likes`} className="px-4 py-2 rounded-full border border-white/10 text-sm">Likes</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {storyCount===0 && reelCount===0 ? (
          <div className="glass rounded-2xl p-8 text-center text-silver-dim md:col-span-2">No stories yet — publish on Home feed. Reels appear after Imagine Studio → Publish.</div>
        ) : (
          <>
            <div className="glass rounded-2xl p-6"><p className="font-semibold">Stories</p><p className="text-sm text-silver-dim">{storyCount} stories by @{username}</p></div>
            <div className="glass rounded-2xl p-6"><p className="font-semibold">Reels</p><p className="text-sm text-silver-dim">{reelCount} reels</p></div>
          </>
        )}
      </div>
    </div>
  )
}
