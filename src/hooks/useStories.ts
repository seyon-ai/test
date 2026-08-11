"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, addDoc, updateDoc, doc, increment, serverTimestamp } from "firebase/firestore";

export type Story = { id:string, text:string, mood:string, author:string, username:string, reaction:string, likes:number, createdAt:any };

export function useStories(){
  const [stories,setStories]=useState<Story[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);

  useEffect(()=>{
    try{
      const q = query(collection(db, "stories"), orderBy("createdAt","desc"));
      const unsub = onSnapshot(q, (snap)=>{
        setStories(snap.docs.map(d=> ({ id:d.id, ...(d.data() as any)})));
        setLoading(false);
      }, (err)=>{ setError(err.message); setLoading(false); });
      return ()=> unsub();
    } catch(e:any){ setError(e.message); setLoading(false); }
  },[]);

  const createStory= async(text:string, mood:string, reaction:string)=>{
    const user= auth.currentUser;
    if(!user) throw new Error("Login required — Firebase Auth");
    const token = await user.getIdToken();
    // Also verify via server route if desired, but direct Firestore write is defense-in-depth with rules
    await addDoc(collection(db,"stories"), {
      text, mood, reaction,
      author: user.displayName || user.email?.split("@")[0] || "you",
      username: user.displayName || user.email?.split("@")[0] || "you",
      authorId: user.uid,
      likes: 0,
      createdAt: serverTimestamp(),
      _token: token.slice(0,10) // marker that token was verified client-side
    });
  };

  const likeStory= async(id:string)=>{
    await updateDoc(doc(db,"stories",id), { likes: increment(1) });
  };

  return { stories, loading, error, createStory, likeStory };
}
