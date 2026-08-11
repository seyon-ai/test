import { NextRequest, NextResponse } from "next/server";
import { generateReaction } from "@/lib/groq";
import { verifyIdToken } from "@/lib/firebaseAdmin";

export const maxDuration = 60;

export async function POST(req: NextRequest){
  const key = process.env.GROQ_API_KEY;
  if(!key || key.includes("dummy")) {
    return NextResponse.json({ error: "GROQ_API_KEY missing on server — set it in Vercel → Settings → Environment Variables → redeploy" }, { status: 500 });
  }

  // Verify token if present, but don't block if Firebase Admin not configured — log warning instead
  const auth = req.headers.get("authorization");
  if(auth?.startsWith("Bearer ")){
    try{ await verifyIdToken(auth.split(" ")[1]); } catch(e:any){ console.warn("ID token verify failed, continuing anyway:", e.message); }
  }

  const { text, mood, personality } = await req.json();
  if(!text) return NextResponse.json({error:"Missing text"}, {status:400});
  try{
    const reaction = await generateReaction(text, mood||"Fantasy", personality||"Balanced");
    return NextResponse.json({ reaction });
  } catch(e:any){
    console.error("Groq react error", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
