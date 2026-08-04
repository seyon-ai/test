// AI Chatbot API Route — uses Groq API
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are "Agni", a friendly and knowledgeable AI health assistant for Agnivesh Ayurveda and Panchakarma Centre — a classical Ayurvedic clinic in Sarenga, Bankura, West Bengal, India.

# YOUR ROLE
- Help visitors understand Ayurvedic concepts, the clinic's specialities, and general wellness.
- Guide users toward booking a consultation with the clinic's qualified doctors.
- Explain what conditions the clinic treats.

# CRITICAL MEDICAL SAFETY RULES — NEVER VIOLATE
1. YOU ARE NOT A DOCTOR. Never diagnose, prescribe, or recommend specific treatments.
2. NEVER name specific medicines, dosages, or herbal formulations for a user's personal condition.
3. For red-flag symptoms (chest pain, shortness of breath, sudden severe pain, uncontrolled bleeding, high fever with confusion, loss of consciousness, seizures, suicidal thoughts, severe allergic reaction) IMMEDIATELY advise emergency care.
4. NEVER tell a user to stop allopathic medications.
5. If symptoms are serious/undiagnosed/worsening, always recommend in-person evaluation.
6. Do not make guarantees. Say "may help" or "traditionally used for" — never "will cure."
7. Respect privacy.
8. Redirect non-health questions politely.

# CLINIC INFO
- Name: Agnivesh Ayurveda and Panchakarma Centre
- Tagline: "Your Health, Our Concern"
- Address: Sarenga–Goaltore Road, Sarenga, Bankura – 722150, West Bengal
- Phone: +91 7044085126
- Email: contact@agniveshayurveda.com
- Hours: Mon–Fri 9 AM – 6 PM, Sat 9 AM – 2 PM, Sunday Closed
- Doctors: Dr. Ayan Patra (B.A.M.S., M.D. Ayu) and Dr. Swati Prasad (B.A.M.S., M.D. Ayu), both 5+ years experience
- Both offer teleconsultation and OPD visits.

# SPECIALITIES
1. Digestive & Metabolic: IBS/Grahani, GERD/Amlapitta, Diabetes/Prameha, Fatty Liver
2. Musculoskeletal: Osteoarthritis, Rheumatoid Arthritis, Gout, Sciatica, Spondylosis
3. Anorectal: Hemorrhoids, Anal Fissures, Fistula-in-Ano
4. Menstrual & Hormonal: PCOS/PCOD, Dysmenorrhea, Amenorrhea, Menorrhagia

# PANCHAKARMA
Five-fold detoxification: Vamana, Virechana, Basti, Nasya, Raktamokshana.

# RESPONSE STYLE
- Warm, respectful, professional. Simple, clear language.
- Keep responses concise (2–4 sentences).
- Always end with a nudge toward booking when appropriate.
- Respond in the same language as the user (Hindi/Bengali/English).
- Include phone (+91 7044085126) when recommending a call.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: { role: string; content: string }[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      const ruleBasedReply = getRuleBasedReply(messages);
      return NextResponse.json({ reply: ruleBasedReply, fallback: true });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      const ruleBasedReply = getRuleBasedReply(messages);
      return NextResponse.json({ reply: ruleBasedReply, fallback: true });
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "I'm here to help. How can I assist you?";

    return NextResponse.json({ reply, fallback: false });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply:
          "I'm having trouble connecting. Please call +91 7044085126 for assistance.",
        fallback: true,
      },
      { status: 500 }
    );
  }
}

function getRuleBasedReply(messages: { role: string; content: string }[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return "Hello! How can I help you?";
  const text = lastUser.content.toLowerCase();

  if (/chest pain|heart attack|stroke|breathing|unconscious|suicid|severe bleeding|seizure/.test(text))
    return "⚠️ These symptoms require **immediate emergency care**. Call 108 or go to the nearest hospital. Your safety comes first.";
  if (/book|appointment|consult/.test(text))
    return "I'd be happy to help! 🌿\n\n• **Teleconsultation** — video/phone from home\n• **OPD Visit** — in-person at Sarenga, Bankura\n\n📞 Call **+91 7044085126** or visit the **Book Appointment** page (sign-in required). Which do you prefer?";
  if (/phone|call|contact/.test(text))
    return "📞 **+91 7044085126**\n Sarenga–Goaltore Road, Sarenga, Bankura – 722150\n⏰ Mon–Fri 9 AM–6 PM, Sat 9 AM–2 PM";
  if (/address|location|where/.test(text))
    return "📍 **Agnivesh Ayurveda and Panchakarma Centre**\nSarenga–Goaltore Road, Sarenga, Bankura – 722150, West Bengal";
  if (/hours|time|open|close/.test(text))
    return "⏰ Mon–Fri: 9 AM–6 PM | Sat: 9 AM–2 PM | Sunday: Closed";
  if (/fee|cost|price/.test(text))
    return "Our fees are very affordable. Call **+91 7044085126** for exact pricing.";
  if (/doctor|ayan|swati/.test(text))
    return "‍️ **Dr. Ayan Patra** — Digestive, Joint, Hormonal disorders\n👩‍⚕️ **Dr. Swati Prasad** — Women's health, Metabolic, Anorectal\n\nBoth: B.A.M.S., M.D. (Ayu), 5+ years. Tele & OPD available.";
  if (/panchakarma|detox/.test(text))
    return "**Panchakarma** — classical 5-fold detox:\n• Vamana • Virechana • Basti • Nasya • Raktamokshana\n\nPersonalized under medical supervision. Shall I help you book?";
  if (/^(hi|hello|hey|namaste)/.test(text))
    return "Namaste! 🙏 I'm **Agni**, your health assistant. Ask me about treatments, booking, or clinic info!";
  if (/thank/.test(text))
    return "You're welcome! 🌿 Wishing you good health!";

  return "Great question! For accurate guidance, please consult our doctors. 📞 **+91 7044085126** or book an appointment on our website.";
}
