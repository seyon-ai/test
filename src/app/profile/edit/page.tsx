"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { uploadToImgbb } from "@/lib/imgbb";

export default function EditProfile(){
  const [displayName,setDisplayName]=useState("");
  const [username,setUsername]=useState("");
  const [bio,setBio]=useState("");
  const [avatarUrl,setAvatarUrl]=useState("");
  const [msg,setMsg]=useState("");
  const [saving,setSaving]=useState(false);
  const [uploading,setUploading]=useState(false);

  useEffect(()=>{
    const load= async()=>{
      const u = auth.currentUser;
      if(!u) return;
      setDisplayName(u.displayName||"");
      setUsername(u.email?.split("@")[0]||"");
      const snap = await getDoc(doc(db,"profiles", u.uid));
      if(snap.exists()){
        const d=snap.data() as any;
        setUsername(d.username||username);
        setBio(d.bio||"");
        setAvatarUrl(d.avatarUrl||"");
      }
    };
    load();
  },[]);

  const onFile= async(e:any)=>{
    const f=e.target.files?.[0]; if(!f) return;
    setUploading(true);
    try{ const url=await uploadToImgbb(f); setAvatarUrl(url); setMsg("Avatar uploaded via imgbb ✓"); } catch(e:any){ setMsg(e.message); } finally{ setUploading(false); }
  };

  const save= async()=>{
    const u=auth.currentUser; if(!u) { setMsg("Login required"); return; }
    setSaving(true);
    try{
      if(displayName) await updateProfile(u, { displayName, photoURL: avatarUrl||u.photoURL||undefined } as any);
      await setDoc(doc(db,"profiles", u.uid), { username: username.toLowerCase().trim(), displayName, bio, avatarUrl, updatedAt: serverTimestamp(), createdAt: serverTimestamp() }, { merge:true });
      setMsg("Profile saved ✓ — visible at /profile/"+username+" and /profile/me");
    } catch(e:any){ setMsg(e.message); }
    setSaving(false);
  };

  return (
    <div className="max-w-[640px] mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold">Edit Profile</h1>
      <p className="text-text-mid text-sm">Avatar via imgbb (free, no Blaze) — supports IMGBB_API_KEY or NEXT_PUBLIC_IMGBB_API_KEY</p>
      <div className="glass rounded-2xl p-6 mt-6 space-y-4">
        <div className="flex gap-4 items-center">
          <img src={avatarUrl || auth.currentUser?.photoURL || `https://i.pravatar.cc/200?u=${username}`} alt="avatar" className="w-16 h-16 rounded-2xl border border-white/10 object-cover" />
          <label className={`px-4 py-2 rounded-full border text-xs cursor-pointer ${uploading?"opacity-50":"hover:bg-white/5 border-white/10"}`}>
            <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
            {uploading?"Uploading...":"📷 Change Avatar (imgbb)"}
          </label>
        </div>
        <div>
          <label className="text-xs text-silver-dim">Username (unique)</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="yourname" className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-silver-dim">Display Name</label>
          <input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Aria Dreams" className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-silver-dim">Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell your imagination..." maxLength={160} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm min-h-[80px]" />
          <p className="text-xs text-text-low text-right">{bio.length}/160</p>
        </div>
        <button onClick={save} disabled={saving} className="w-full metallic py-3 rounded-full font-semibold text-sm disabled:opacity-40">{saving?"Saving...":"Save Profile"}</button>
        {msg && <p className="text-xs p-3 bg-white/5 rounded-xl break-words">{msg}</p>}
      </div>
    </div>
  )
}
