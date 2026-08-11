"use client";
import { useState } from "react";
import Link from "next/link";

type Chat = { id:string, title:string, preview:string, updated:string };

const initial: Chat[] = [
  { id:"c1", title:"The Midnight Library of Tomorrows", preview:"You: What if a library writes itself as you live...", updated:"2m ago" },
  { id:"c2", title:"Sky-Ocean", preview:"Assistant: Tell me more about the sky-whales...", updated:"1h ago" },
];

export default function ImaginePage(){
  const [chats,setChats]=useState(initial);
  const [title,setTitle]=useState("");
  const create=()=>{
    const id="c"+Date.now();
    setChats(c=>[{ id, title: title || "Untitled Imagination", preview:"New story — say hello to start", updated:"now" }, ...c]);
    setTitle("");
  };
  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold">Imagine Studio</h1>
      <p className="text-text-mid mt-1">Private back-and-forth with AI. When ready, hit Publish → illustrated reel.</p>
      <div className="glass rounded-2xl p-5 mt-6 flex gap-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New story title..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm" />
        <button onClick={create} className="metallic px-6 py-2 rounded-full text-sm font-semibold">+ New story</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {chats.map(c=>(
          <Link key={c.id} href={`/imagine/${c.id}`} className="glass rounded-2xl p-5 hover:bg-white/[0.06] transition">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-text-mid mt-1 line-clamp-2">{c.preview}</p>
            <p className="text-xs text-text-low mt-3">{c.updated} • Private</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
