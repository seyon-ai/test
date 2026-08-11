"use client";
import { useState } from "react";
import Link from "next/link";

export function StoryCard({ post, onLike }: { post: any, onLike: () => void }){
  const [showComments,setShowComments]=useState(false);
  const [comment,setComment]=useState("");
  const [comments,setComments]=useState<string[]>([]);
  return (
    <article className="glass rounded-[24px] p-6 hover:bg-white/[0.05] transition group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full metallic flex items-center justify-center font-bold text-sm text-black">{post.author[0]}</div>
        <div>
          <Link href={`/profile/${post.username}`} className="text-sm font-semibold hover:underline">@{post.username}</Link>
          <p className="text-xs text-silver-dim">{post.author} • {post.mood} • now</p>
        </div>
        <span className="ml-auto px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest">{post.mood.toUpperCase()}</span>
      </div>
      <p className="mt-4 text-[16px] leading-relaxed font-[400]">{post.text}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="" className="mt-4 rounded-2xl w-full aspect-[16/9] object-cover border border-white/10" />}
      <div className="mt-4 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] p-4 relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-30" />
        <p className="text-[10px] tracking-[0.18em] text-silver-dim relative">IGMA REACTS — GROQ LLAMA 3.3</p>
        <p className="text-[14px] mt-1.5 leading-snug relative">“{post.reaction}”</p>
      </div>
      <div className="flex items-center gap-5 mt-4 text-sm">
        <button onClick={onLike} className={`flex items-center gap-1.5 transition ${post.liked ? "text-white" : "text-silver-dim hover:text-white"}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${post.liked?"bg-white text-black border-white":"border-white/10 bg-white/5"}`}>♡</span> {post.likes}
        </button>
        <button onClick={()=>setShowComments(!showComments)} className="flex items-center gap-1.5 text-silver-dim hover:text-white"><span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">💬</span> {comments.length || "Comment"}</button>
        <button className="flex items-center gap-1.5 text-silver-dim hover:text-white ml-auto"><span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">↗</span> Share</button>
        <Link href={`/post/${post.id}`} className="text-xs underline text-silver-dim">Permalink</Link>
      </div>
      {showComments && (
        <div className="mt-4 border-t border-white/10 pt-4 space-y-3">
          {comments.map((c,i)=><p key={i} className="text-sm bg-white/5 rounded-xl px-3 py-2">{c}</p>)}
          <div className="flex gap-2">
            <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm" />
            <button onClick={()=>{ if(comment.trim()){ setComments([...comments, comment]); setComment(""); }}} className="metallic px-5 py-2 rounded-full text-sm font-semibold">Post</button>
          </div>
        </div>
      )}
    </article>
  )
}
