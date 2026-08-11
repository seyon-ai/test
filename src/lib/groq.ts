import Groq from "groq-sdk";

export function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY || "gsk_dummy" });
}

export const REACTOR_SYSTEM = `You are IGMA's audience reactor. User shares an imaginary situation. React in 1-4 sentences ONLY. Never continue their story, never rewrite it, never add plot. Be a witty audience member reacting. Match their mood tag if given. Be concise, warm, and human.`;

export const STUDIO_SYSTEM = `You are IGMA Imagine Studio collaborator. Help user build a story scene by scene. Ask questions, suggest vivid details, keep momentum. Be creative, encouraging, concise (2-4 sentences). Never be the public reactor voice.`;

export async function generateReaction(text: string, mood: string, personality: string = "Balanced") {
  const groq = getGroq();
  const personalityNote = personality !== "Balanced" ? ` Tone: ${personality}.` : "";
  const c = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: REACTOR_SYSTEM + personalityNote },
      { role: "user", content: `Mood: ${mood}\nStory: ${text}\n\nReact now:` },
    ],
    max_tokens: 180,
    temperature: 0.9,
  });
  return c.choices[0]?.message?.content?.trim() || "Whoa — I wasn't ready for that twist. Love the imagination!";
}

export async function generateScript(chatHistory: {role:string, content:string}[]) {
  const groq = getGroq();
  const c = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: `Turn the conversation into a reel script JSON. Output ONLY valid JSON: {"title":"...", "scenes":[{"caption":"short caption 10-20 words","imagePrompt":"detailed image generation prompt, cinematic, photorealistic"}]} 3-6 scenes.` },
      ...chatHistory.map(m=>({ role: m.role as any, content: m.content })),
    ],
    max_tokens: 1000,
    temperature: 0.8,
    response_format: { type: "json_object" } as any,
  });
  const raw = c.choices[0]?.message?.content || "{}";
  try { return JSON.parse(raw); } catch { return { title: "Untitled Imagination", scenes: [{caption: chatHistory.slice(-1)[0]?.content?.slice(0,80) || "A moment", imagePrompt: "cinematic scene"}]} }
}
