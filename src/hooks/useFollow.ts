"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, doc, setDoc, deleteDoc, query, where, onSnapshot, getDoc, serverTimestamp } from "firebase/firestore";

export function useFollow(targetUid:string, targetUsername:string){
  const [isFollowing,setIsFollowing]=useState(false);
  const [followers,setFollowers]=useState(0);
  const [following,setFollowing]=useState(0);

  useEffect(()=>{
    if(!targetUid) return;
    // listeners for counts — reads follows collection
    const q1 = query(collection(db,"follows"), where("followingId","==", targetUid));
    const q2 = query(collection(db,"follows"), where("followerId","==", targetUid));
    const un1 = onSnapshot(q1, snap=> setFollowers(snap.size));
    const un2 = onSnapshot(q2, snap=> setFollowing(snap.size));
    const check = async ()=>{
      const u = auth.currentUser;
      if(!u) return;
      const id = `${u.uid}_${targetUid}`;
      const snap = await getDoc(doc(db,"follows", id));
      setIsFollowing(snap.exists());
    };
    check();
    return ()=>{ un1(); un2(); };
  },[targetUid]);

  const toggle = async ()=>{
    const u = auth.currentUser;
    if(!u) throw new Error("Login required to follow");
    const id = `${u.uid}_${targetUid}`;
    if(isFollowing){
      await deleteDoc(doc(db,"follows", id));
      setIsFollowing(false);
    } else {
      await setDoc(doc(db,"follows", id), { followerId: u.uid, followingId: targetUid, followerUsername: u.displayName||u.email?.split("@")[0], followingUsername: targetUsername, createdAt: serverTimestamp() });
      // notification to target
      try{
        const { createNotification } = await import("@/hooks/useNotifications");
        await createNotification(targetUid, { type:"follow", actorUsername: u.displayName||u.email?.split("@")[0]||"you", actorDisplayName: u.displayName||"you", actorId: u.uid } as any);
      } catch{}
      setIsFollowing(true);
    }
  };
  return { isFollowing, followers, following, toggle };
}
