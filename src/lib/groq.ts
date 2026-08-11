import Groq from "groq-sdk";

export function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY || "gsk_dummy" });
}

// --- BETTER INSTRUCTIONS — tight, no weird drift ---
export const REACTOR_SYSTEM = `You are IGMA's "Audience Reactor".
RULES — obey strictly:
- React ONLY in 1-4 sentences.
- NEVER continue the user's story, NEVER rewrite it, NEVER add new characters/plot.
- Be a real audience member: witty, warm, human, specific to their mood tag.
- Match mood: Comedy=playful, Fantasy=wonder, Horror=spooked, Romance=tender, Sci-Fi=curious.
- No meta talk, no "As an AI", no disclaimers, no hashtags.
Example: User: "I found a door in my fridge to last Tuesday." → You: "The fridge-to-Tuesday pipeline is unhinged. Are snacks still cold on the other side?"`;

export const STUDIO_SYSTEM = `You are IGMA Imagine Studio — a focused story collaborator.
RULES:
- Help build the story scene by scene. Ask 1 vivid question at a time, suggest 1 concrete detail.
- 2-4 sentences max, warm, cinematic.
- NEVER be the sarcastic reactor voice. Stay encouraging and tight.
- If user is stuck, offer 2 options: "Do you want to go darker or more hopeful?"
- Never repeat the user's text verbatim, never be verbose, never add disclaimers.`;

export async function generateReaction(text: string, mood: string, personality: string = "Balanced") {
  const groq = getGroq();
  const tone: Record<string,string> = {
    Balanced: "tone: balanced, clever",
    Wholesome: "tone: wholesome, sweet, encouraging",
    Sarcastic: "tone: dry, witty, light sarcasm — never mean",
    Hype: "tone: hyped, energetic, Gen-Z",
  };
  const c = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: REACTOR_SYSTEM + "\n" + (tone[personality] || "") },
      { role: "user", content: `Mood: ${mood}\nStory: """${text}"""\nReact now (1-4 sentences):` },
    ],
    max_tokens: 160,
    temperature: 0.75,
  });
  return c.choices[0]?.message?.content?.trim().slice(0, 320) || "Whoa — that twist caught me. More please!";
}

export async function generateStudioReply(history: {role:string, content:string}[], personality="Balanced") {
  const groq = getGroq();
  const tone: Record<string,string> = {
    Balanced: "", Wholesome: " Be wholesome.", Sarcastic: " Be lightly witty.", Hype: " Be hyped."
  };
  const c = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: STUDIO_SYSTEM + (tone[personality]||"") },
      ...history.map(m=>({ role: m.role as any, content: m.content })),
    ],
    max_tokens: 320,
    temperature: 0.82,
  });
  return c.choices[0]?.message?.content?.trim() || "Love that — what sound is in the air there?";
}

export async function generateScript(chatHistory: {role:string, content:string}[]) {
  const groq = getGroq();
  const c = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: `Turn the conversation into a reel script JSON. Output ONLY valid JSON: {"title":"3-5 words, cinematic","scenes":[{"caption":"12-18 words, present tense, vivid","imagePrompt":"detailed portrait 9:16 photorealistic cinematic prompt"}]}. 4-6 scenes. Keep captions TIGHT and imagePrompts highly visual.` },
      ...chatHistory.map(m=>({ role: m.role as any, content: m.content })),
    ],
    max_tokens: 1200,
    temperature: 0.8,
    response_format: { type: "json_object" } as any,
  });
  const raw = c.choices[0]?.message?.content || "{}";
  try { 
    const j = JSON.parse(raw);
    // sanitize
    j.scenes = (j.scenes||[]).slice(0,6).map((s:any)=>({ caption: String(s.caption).slice(0,140), imagePrompt: String(s.imagePrompt).slice(0,400) }));
    return j;
  } catch { return { title: "Untitled Imagination", scenes: [{caption: chatHistory.slice(-1)[0]?.content?.slice(0,90) || "A moment", imagePrompt: "cinematic portrait scene, photorealistic, 9:16"}]} }
}
