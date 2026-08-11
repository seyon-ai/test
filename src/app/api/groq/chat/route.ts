import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { STUDIO_SYSTEM } from "@/lib/groq";

export const maxDuration = 60;

export async function POST(req: NextRequest){
  const { messages, personality } = await req.json();
  if(!messages) return NextResponse.json({ error: "Missing messages" }, { status: 400 });

  const key = process.env.GROQ_API_KEY;
  if(!key || key.includes("dummy")) {
    return NextResponse.json({ error: "GROQ_API_KEY not set on server — add it in Vercel Environment Variables and redeploy" }, { status: 500 });
  }

  try {
    const groq = new Groq({ apiKey: key });
    const c = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: STUDIO_SYSTEM + (personality && personality!=="Balanced" ? ` Tone: ${personality}` : "") },
        ...messages,
      ],
      max_tokens: 400,
      temperature: 0.85,
    });
    return NextResponse.json({ reply: c.choices[0]?.message?.content?.trim() });
  } catch(e:any){
    console.error("Groq chat error", e);
    // Surface real error so Vercel logs show it
    return NextResponse.json({ error: e.message || "Groq failed", detail: String(e) }, { status: 500 });
  }
}
