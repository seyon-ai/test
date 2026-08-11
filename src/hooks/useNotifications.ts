"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, writeBatch, serverTimestamp } from "firebase/firestore";

export type Notif = { id:string, type:"like"|"comment"|"follow"|"mention"|"reel", actorUsername:string, actorDisplayName:string, storyPreview?:string, reelId?:string, storyId?:string, read:boolean, createdAt:any };

export function useNotifications(){
  const [notifs,setNotifs]=useState<Notif[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const u = auth.currentUser;
    if(!u){ setLoading(false); setNotifs([]); return; }
    const q = query(collection(db,"notifications"), where("recipientId","==", u.uid), orderBy("createdAt","desc"));
    const unsub = onSnapshot(q, snap=>{ setNotifs(snap.docs.map(d=> ({ id:d.id, ...(d.data() as any)}))); setLoading(false); }, ()=> setLoading(false));
    return ()=> unsub();
  },[]);
  return { notifs, loading, unread: notifs.filter(n=>!n.read).length };
}

// client helper to create a notification — call on like/comment/follow
export async function createNotification(recipientId:string, data: Omit<Notif,"id"|"createdAt"|"read"> & { recipientId:string }){
  if(!recipientId || recipientId===auth.currentUser?.uid) return; // don't self-notify
  const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
  const { db } = await import("@/lib/firebase");
  await addDoc(collection(db,"notifications"), { ...data, recipientId, read:false, createdAt: serverTimestamp() });
}
