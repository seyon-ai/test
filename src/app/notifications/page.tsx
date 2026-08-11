"use client";
import { useNotifications } from "@/hooks/useNotifications";
import Link from "next/link";

export default function NotificationsPage(){
  const { notifs, loading, unread } = useNotifications();
  if(loading) return <div className="max-w-[700px] mx-auto px-6 py-12 text-silver-dim">Loading notifications...</div>;
  return (
    <div className="max-w-[700px] mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold">Notifications {unread>0 && <span className="ml-2 px-2 py-1 rounded-full bg-white text-black text-sm">{unread} new</span>}</h1>
      <p className="text-text-mid mt-1">Real-time Firestore — likes, comments, follows, mentions. Auto-created via createNotification() on every interaction.</p>
      <div className="mt-6 space-y-3">
        {notifs.length===0 ? (
          <div className="glass rounded-2xl p-8 text-center text-silver-dim">
            <p>No notifications yet</p>
            <p className="text-xs mt-1">Like or comment on a story → recipient gets a notification. Check Firestore “notifications” collection — recipientId == your uid.</p>
            <p className="text-xs mt-2">If empty, Firestore rules may block writes — allow: <code className="bg-white/10 px-1 rounded">match /notifications/{"{id}"} {"{ allow create: if request.auth != null; }"}</code></p>
          </div>
        ) : notifs.map(n=>(
          <div key={n.id} className={`glass rounded-2xl p-4 flex gap-3 ${!n.read?"border-white/20 bg-white/[0.06]":""}`}>
            <div className="w-9 h-9 rounded-full metallic flex items-center justify-center text-xs font-bold text-black">{n.actorDisplayName?.[0]||"A"}</div>
            <div className="flex-1">
              <p className="text-sm"><b>@{n.actorUsername}</b> {n.type==="like"?"liked":n.type==="comment"?"commented on":"followed"} your {n.reelId?"reel":"story"} {n.storyPreview && <span className="text-silver-dim">“{n.storyPreview.slice(0,40)}…”</span>}</p>
              <p className="text-xs text-silver-dim">{n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString() : "just now"} • {n.read?"read":"unread"}</p>
            </div>
            {n.storyId && <Link href={`/post/${n.storyId}`} className="text-xs underline self-center">Open</Link>}
            {n.reelId && <Link href={`/reels/${n.reelId}`} className="text-xs underline self-center">Reel</Link>}
          </div>
        ))}
      </div>
    </div>
  )
}
