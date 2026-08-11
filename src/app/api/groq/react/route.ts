import { NextRequest, NextResponse } from "next/server";
import { generateReaction } from "@/lib/groq";
import { verifyIdToken } from "@/lib/firebaseAdmin";

export const maxDuration = 60;

export async function POST(req: NextRequest){
  const auth = req.headers.get("authorization");
  if(!auth?.startsWith("Bearer ")){ return NextResponse.json({error:"Missing token"}, {status:401}); }
  try{ await verifyIdToken(auth.split(" ")[1]); } catch { return NextResponse.json({error:"Invalid token"}, {status:401}); }
  const { text, mood, personality } = await req.json();
  if(!text) return NextResponse.json({error:"Missing text"}, {status:400});
  const reaction = await generateReaction(text, mood||"Fantasy", personality||"Balanced");
  return NextResponse.json({ reaction });
}
