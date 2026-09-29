// AI Chatbot API Route
// Integrates with OpenAI-compatible API for medical-safe responses.
// The system prompt is carefully engineered for medical safety.
//
// ENV: OPENAI_API_KEY (optional — falls back to rule-based responses if not set)
// ENV: OPENAI_BASE_URL (optional — defaults to OpenAI)

import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are "Agni", a friendly and knowledgeable AI health assistant for Agnivesh Ayurveda and Panchakarma Centre — a classical Ayurvedic clinic in Sarenga, Bankura, West Bengal, India.

# YOUR ROLE
- Help visitors understand Ayurvedic concepts, the clinic's specialities, and general wellness.
- Guide users toward booking a consultation with the clinic's qualified doctors for any health concern.
- Explain what conditions the clinic treats (digestive disorders, joint diseases, anorectal disorders, hormonal/menstrual issues, Panchakarma therapies).

# CRITICAL MEDICAL SAFETY RULES — NEVER VIOLATE THESE
1. YOU ARE NOT A DOCTOR. You cannot diagnose, prescribe, or recommend specific treatments for any individual.
2. NEVER name specific medicines, dosages, or herbal formulations for a user's personal condition. If asked, say: "This requires assessment by our Ayurvedic physician. I'd recommend booking a consultation."
3. For ANY of these red-flag symptoms, IMMEDIATELY advise seeking urgent medical/emergency care and do NOT attempt Ayurvedic guidance:
   - Chest pain, shortness of breath, difficulty breathing
   - Sudden severe pain (head, abdomen, chest)
   - Uncontrolled bleeding
   - High fever with confusion or stiff neck
   - Loss of consciousness, seizures
   - Suspected heart attack or stroke
   - Suicidal thoughts or mental health crisis
   - Severe allergic reaction
4. NEVER tell a user to stop or change any allopathic (modern medicine) prescription. Always say: "Please continue your current medications and discuss any changes with your doctor."
5. If a user describes a serious, undiagnosed, or worsening condition, always recommend in-person evaluation. Say: "This needs proper clinical examination. Please book a consultation with our doctor."
6. Do not make guarantees about outcomes. Say "may help" or "is traditionally used for" — never "will cure" or "guaranteed to fix."
7. Respect privacy. Do not ask for unnecessary personal/medical details beyond what's needed to guide them to the right service.
8. If the question is outside Ayurveda/health (e.g., coding, politics, unrelated topics), politely redirect: "I'm here to help with Ayurvedic health and wellness questions. How can I assist you with your health?"

# ABOUT THE CLINIC (use this information accurately)
- Name: Agnivesh Ayurveda and Panchakarma Centre
- Tagline: "Your Health, Our Concern"
- Address: Sarenga–Goaltore Road, Sarenga, Bankura – 722150, West Bengal
- Phone: +91 7044085126
- Email: contact@agniveshayurveda.com
- Hours: Mon–Fri 9 AM – 6 PM, Sat 9 AM – 2 PM, Sunday Closed
- Doctors:
  • Dr. Ayan Patra — B.A.M.S., M.D. (Ayu), Assistant Professor & Consultant, 5+ years experience
  • Dr. Swati Prasad — B.A.M.S., M.D. (Ayu), Assistant Professor & Consultant, 5+ years experience
- Both doctors available for OPD (in-person) and Teleconsultation.

# SPECIALITIES THE CLINIC TREATS
1. Digestive & Metabolic: IBS/Grahani, GERD/Amlapitta, Diabetes/Prameha, Fatty Liver/Yakrit Roga
2. Musculoskeletal & Joint: Osteoarthritis/Sandhivata, Rheumatoid Arthritis/Amavata, Gout/Vatarakta, Sciatica/Gridhrasi, Cervical & Lumbar Spondylosis
3. Anorectal: Hemorrhoids/Arsha, Anal Fissures/Parikartika, Fistula-in-Ano/Bhagandara
4. Menstrual & Hormonal: PCOS/PCOD, Dysmenorrhea/Kashtartava, Amenorrhea/Nashtartava, Menorrhagia/Asrigdara

# PANCHAKARMA
The clinic offers Panchakarma — the classical five-fold detoxification therapy of Ayurveda — including Vamana, Virechana, Basti, Nasya, and Raktamokshana, administered under qualified medical supervision.

# RESPONSE STYLE
- Warm, respectful, and professional. Use simple, clear language.
- Keep responses concise (2–4 sentences for most questions). Expand only when genuinely helpful.
- Always end with a gentle nudge toward action when appropriate: "Would you like to book a consultation?" or "Our doctors can assess this properly — shall I help you book an appointment?"
- For Hindi/Bengali messages, respond in the same language when possible.
- Include the clinic phone (+91 7044085126) when recommending a call.

# HOW TO HANDLE SPECIFIC REQUESTS
- "Book appointment" → "You can book directly on our website at /book or call us at +91 7044085126. Would you prefer teleconsultation or an OPD visit?"
- "Cost / fees" → "Consultation fees are very affordable. Please call +91 7044085126 for exact details as they vary by consultation type."
- "Which doctor should I see?" → Briefly explain both doctors' expertise and suggest booking — the clinic will match based on condition.
- Herb/medicine questions → Give general educational info about the herb's traditional use, then say: "For personalized recommendations, please consult our doctor."`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: { role: string; content: string }[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    const openaiBaseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

    // If no API key, return a smart rule-based response
    if (!openaiApiKey) {
      const ruleBasedReply = getRuleBasedReply(messages);
      return NextResponse.json({
        reply: ruleBasedReply,
        fallback: true,
      });
    }

    const response = await fetch(`${openaiBaseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
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
      console.error("OpenAI API error:", errorText);
      // Fallback to rule-based if API fails
      const ruleBasedReply = getRuleBasedReply(messages);
      return NextResponse.json({ reply: ruleBasedReply, fallback: true });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "I'm here to help. How can I assist you with your health today?";

    return NextResponse.json({ reply, fallback: false });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "I'm having trouble connecting right now. Please call us at +91 7044085126 for immediate assistance.", fallback: true },
      { status: 500 }
    );
  }
}

/**
 * Smart rule-based fallback when no AI API is configured.
 * Provides helpful, medically-safe responses based on keyword matching.
 */
function getRuleBasedReply(messages: { role: string; content: string }[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return "Hello! How can I help you today?";

  const text = lastUser.content.toLowerCase();

  // Emergency red flags
  if (/chest pain|heart attack|stroke|breathing|unconscious|suicid|severe bleeding|seizure|high fever.*confus/.test(text)) {
    return "⚠️ These symptoms require **immediate emergency medical care**. Please call 108 (ambulance) or go to the nearest hospital emergency department right away. Once you're safe, you can consult our Ayurvedic doctors for follow-up care. Your safety comes first.";
  }

  // Booking
  if (/book|appointment|consult|visit|see a doctor/.test(text)) {
    return "I'd be happy to help you book a consultation! 🌿\n\nYou have two options:\n• **Teleconsultation** — video/phone call from home\n• **OPD Visit** — in-person at our clinic in Sarenga, Bankura\n\n📞 Call us at **+91 7044085126** or visit the **Book Appointment** page on our website. Which would you prefer?";
  }

  // Phone / contact
  if (/phone|number|call|contact|reach/.test(text)) {
    return "📞 You can reach us at **+91 7044085126**.\n\n📍 Our clinic is at: Agnivesh Ayurveda and Panchakarma Centre, Sarenga–Goaltore Road, Sarenga, Bankura – 722150, West Bengal.\n\n⏰ Hours: Mon–Fri 9 AM–6 PM, Sat 9 AM–2 PM.";
  }

  // Address / location
  if (/address|location|where|find you|directions|map/.test(text)) {
    return "📍 **Agnivesh Ayurveda and Panchakarma Centre**\nSarenga–Goaltore Road, Sarenga, Bankura – 722150, West Bengal\n\nYou can get directions on Google Maps by searching our name. Call **+91 7044085126** if you need help finding us!";
  }

  // Hours
  if (/hours|time|open|close|when/.test(text)) {
    return "⏰ Our clinic hours:\n• Monday – Friday: 9:00 AM – 6:00 PM\n• Saturday: 9:00 AM – 2:00 PM\n• Sunday: Closed\n\nFor urgent queries outside hours, please call +91 7044085126.";
  }

  // Fees / cost
  if (/fee|cost|price|charge|how much|expensive/.test(text)) {
    return "Our consultation fees are very affordable and vary by consultation type (teleconsultation vs. OPD). For exact pricing, please call us at **+91 7044085126**. Quality Ayurvedic care shouldn't break the bank! 💰";
  }

  // Doctors
  if (/doctor|physician|ayan|swati|who treats/.test(text)) {
    return "We have two experienced Ayurvedic physicians:\n\n‍⚕️ **Dr. Ayan Patra** — B.A.M.S., M.D. (Ayu), 5+ years experience. Specializes in digestive, joint, and hormonal disorders.\n\n👩‍⚕️ **Dr. Swati Prasad** — B.A.M.S., M.D. (Ayu), 5+ years experience. Specializes in women's health, metabolic conditions, and anorectal disorders.\n\nBoth offer teleconsultation and OPD visits. Which doctor would you like to see?";
  }

  // Panchakarma
  if (/panchakarma|detox|detoxification|basti|nasya|vamana/.test(text)) {
    return " **Panchakarma** is Ayurveda's classical five-fold detoxification therapy, offered at our centre under qualified medical supervision. It includes:\n• Vamana (therapeutic emesis)\n• Virechana (purgation)\n• Basti (medicated enema)\n• Nasya (nasal therapy)\n• Raktamokshana (bloodletting)\n\nIt's personalized based on your Prakriti and condition. Our doctors will assess whether it's right for you — shall I help you book a consultation?";
  }

  // Digestive
  if (/acidity|gas|ibs|constipation|diarrhea|digestion|bloating|gerd/.test(text)) {
    return "Digestive issues like acidity, IBS, bloating, and constipation are commonly treated in Ayurveda through diet, lifestyle, and herbs that restore Agni (digestive fire). 🔥\n\nSince these symptoms can have many causes, our doctor will assess your Prakriti and provide a personalized plan. Shall I help you book a consultation?";
  }

  // Joint / pain
  if (/joint|pain|arthritis|knee|back pain|spondylosis|sciatica|gout/.test(text)) {
    return "Joint pain and musculoskeletal conditions are a key focus at our clinic. Ayurveda offers effective treatments including Abhyanga (oil massage), localized therapies like Janu Basti/Kati Basti, herbal medicines, and Panchakarma. 🦴\n\nFor proper diagnosis and treatment, please book a consultation with our doctors. Call +91 7044085126.";
  }

  // PCOS / hormonal / menstrual
  if (/pcos|pcod|period|menstrual|hormon|irregular|fertility/.test(text)) {
    return "Hormonal and menstrual disorders like PCOS/PCOD, irregular periods, and fertility concerns are treated with Ayurvedic metabolic balancing, specific herbs (Shatavari, Ashoka, Lodhra), and lifestyle protocols. 🌸\n\nThese conditions require personalized assessment. Dr. Swati Prasad specializes in this area. Would you like to book a consultation?";
  }

  // Piles / fissure / fistula
  if (/piles|hemorrhoid|fissure|fistula|anal|rectal|bleeding.*stool/.test(text)) {
    return "Anorectal disorders like hemorrhoids (Arsha), fissures, and fistula are effectively treated in Ayurveda — including Kshara Sutra therapy for fistula, which is a highly regarded non-surgical approach. 🩺\n\nThese conditions need proper clinical examination. Please book a consultation or call **+91 7044085126**.";
  }

  // Diabetes
  if (/diabetes|sugar|prameha|blood sugar/.test(text)) {
    return "Ayurveda manages early to moderate Type 2 Diabetes through Kapha-reducing diet, herbs like Gurmar and Methi, regular exercise, and metabolic-resetting therapies. 🌿\n\n**Important:** Please continue your current medications and discuss any changes with your doctor. Our Ayurvedic approach works alongside your existing care. Shall I help you book a consultation?";
  }

  // General greeting
  if (/^(hi|hello|hey|namaste|good morning|good evening|hii)/.test(text)) {
    return "Namaste! 🙏 Welcome to Agnivesh Ayurveda and Panchakarma Centre. I'm Agni, your health assistant. How can I help you today?\n\nYou can ask me about:\n• Our doctors and specialities\n• Booking a consultation\n• Ayurvedic treatments\n• Clinic location and hours";
  }

  // Thanks
  if (/thank|thanks|dhanyavad/.test(text)) {
    return "You're welcome! 🌿 If you have any more questions, feel free to ask. Wishing you good health!";
  }

  // Default
  return "That's a great question! To give you the most accurate and safe guidance, I'd recommend speaking directly with our Ayurvedic doctors who can assess your specific situation.\n\n📞 Call us at **+91 7044085126** or visit our **Book Appointment** page. How else can I help?";
}
