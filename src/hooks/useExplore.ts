"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";

export type ExploreItem = 
  | { id:string, kind:"post", text:string, mood:string, reaction:string, likes:number, imageUrl?:string, author:string, username:string, createdAt:any }
  | { id:string, kind:"reel", title:string, author:string, username:string, likes:number, scenes:{caption:string, imageUrl:string}[], createdAt:any };

export function useExplore(){
  const [items,setItems]=useState<ExploreItem[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    let posts: any[] = [];
    let reels: any[] = [];
    let postReady=false, reelReady=false;

    const combine=()=>{
      if(!postReady || !reelReady) return;
      const merged: ExploreItem[] = [
        ...posts.map((p:any)=> ({ id:p.id, kind:"post" as const, ...p })),
        ...reels.map((r:any)=> ({ id:r.id, kind:"reel" as const, ...r })),
      ].sort((a:any,b:any)=> (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
      setItems(merged);
      setLoading(false);
    };

    const unsubPosts = onSnapshot(query(collection(db,"stories"), orderBy("createdAt","desc"), limit(50)), snap=>{
      posts = snap.docs.map(d=> ({ id:d.id, ...(d.data() as any)}));
      postReady=true; combine();
    }, ()=>{ postReady=true; combine(); });

    const unsubReels = onSnapshot(query(collection(db,"reels"), orderBy("createdAt","desc"), limit(50)), snap=>{
      reels = snap.docs.map(d=> ({ id:d.id, ...(d.data() as any)}));
      reelReady=true; combine();
    }, ()=>{ reelReady=true; combine(); });

    // fallback timeout so Explore never stays loading if Firestore empty/permission
    setTimeout(()=> setLoading(false), 3000);

    return ()=>{ unsubPosts(); unsubReels(); };
  },[]);

  return { items, loading };
}
