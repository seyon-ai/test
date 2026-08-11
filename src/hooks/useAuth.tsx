"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut, User } from "firebase/auth";

type Ctx = { user: User|null, loading:boolean, signInGoogle:()=>Promise<void>, signInEmail:(e:string,p:string)=>Promise<void>, signUpEmail:(e:string,p:string)=>Promise<void>, sendMagicLink:(e:string)=>Promise<void>, logout:()=>Promise<void> };
const AuthCtx = createContext<Ctx>(null as any);
export const useAuth =()=> useContext(AuthCtx);

export function AuthProvider({children}:{children:React.ReactNode}){
  const [user,setUser]=useState<User|null>(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    // Handle magic link completion
    if(typeof window!=="undefined" && isSignInWithEmailLink(auth, window.location.href)){
      let email= window.localStorage.getItem("emailForSignIn") || window.prompt("Confirm email for magic link") || "";
      if(email) signInWithEmailLink(auth, email, window.location.href).then(()=> window.localStorage.removeItem("emailForSignIn")).catch(console.error);
    }
    const unsub=onAuthStateChanged(auth, (u)=>{ setUser(u); setLoading(false); });
    return ()=> unsub();
  },[]);
  const signInGoogle= async()=>{ await signInWithPopup(auth, googleProvider); };
  const signInEmail= async(e:string,p:string)=>{ await signInWithEmailAndPassword(auth,e,p); };
  const signUpEmail= async(e:string,p:string)=>{ await createUserWithEmailAndPassword(auth,e,p); };
  const sendMagicLink= async(email:string)=>{
    const actionCodeSettings={ url: window.location.origin + "/login", handleCodeInApp:true };
    await sendSignInLinkToEmail(auth,email,actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
  };
  const logout= async()=> signOut(auth);
  return <AuthCtx.Provider value={{user,loading, signInGoogle, signInEmail, signUpEmail, sendMagicLink, logout}}>{children}</AuthCtx.Provider>
}
