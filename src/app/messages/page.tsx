"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export default function MessagesPage(){
  const [convos,setConvos]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const u = auth.currentUser;
    if(!u){ setLoading(false); return; }
    const q = query(collection(db,"conversations"), where("participantIds","array-contains", u.uid), orderBy("updatedAt","desc"));
    const unsub = onSnapshot(q, snap=>{ setConvos(snap.docs.map(d=>({ id:d.id, ...d.data() as any}))); setLoading(false); }, ()=> setLoading(false));
    return ()=> unsub();
  },[]);
  if(loading) return <div className="max-w-[700px] mx-auto px-6 py-12 text-silver-dim">Loading messages...</div>;
  return (
    <div className="max-w-[700px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Link href="/messages/new" className="metallic px-4 py-2 rounded-full text-sm font-semibold">+ New</Link>
      </div>
      <p className="text-text-mid text-sm">Real-time Firestore — collection `conversations` where participantIds array-contains your uid.</p>
      {convos.length===0 ? (
        <div className="glass rounded-2xl p-8 mt-6 text-center text-silver-dim">
          <p>No conversations yet</p>
          <p className="text-xs mt-1">Start one at /messages/new — writes need Firestore rule: <code className="bg-white/10 px-1 rounded">allow create if request.auth != null</code></p>
        </div>
      ) : convos.map(c=>(
        <Link key={c.id} href={`/messages/${c.id}`} className="glass rounded-2xl p-4 mt-3 flex gap-3 hover:bg-white/[0.06] block">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">💬</div>
          <div><p className="font-semibold text-sm">{c.participants ? Object.values(c.participants).join(", ") : c.id}</p><p className="text-xs text-silver-dim truncate max-w-[400px]">{c.lastMessage||"No messages yet"}</p></div>
          <span className="ml-auto text-xs text-silver-dim">{c.updatedAt?.toDate ? c.updatedAt.toDate().toLocaleTimeString() : ""}</span>
        </Link>
      ))}
    </div>
  )
}
