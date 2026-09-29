"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Leaf, Bot, User, Loader2, Phone } from "lucide-react";
import { clinicInfo } from "@/lib/data";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Namaste! 🙏 I'm **Agni**, your health assistant from Agnivesh Ayurveda and Panchakarma Centre.\n\nI can help you with:\n• Understanding our treatments & specialities\n• Booking a consultation\n• Clinic info (hours, location, doctors)\n• General Ayurvedic wellness guidance\n\n⚠️ *I'm an AI assistant, not a doctor. For medical advice, please consult our physicians.*\n\nHow can I help you today?",
};

const QUICK_REPLIES = [
  "Book an appointment",
  "What do you treat?",
  "Clinic hours & address",
  "About our doctors",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setHasError(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I'm here to help. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setHasError(true);
      const errorMsg: Message = {
        id: `e-${Date.now()}`,
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Please call us directly at **+91 7044085126** for assistance. 🙏",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Simple markdown-like formatting
  const formatContent = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        let formatted = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        return (
          <span key={i}>
            <span dangerouslySetInnerHTML={{ __html: formatted }} />
            {i < content.split("\n").length - 1 && <br />}
          </span>
        );
      });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-ayurveda-navy text-white rotate-0"
            : "bg-ayurveda-green text-white animate-pulse"
        }`}
        aria-label="Open chat"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            1
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-2xl border border-ayurveda-blush/50 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-ayurveda-green-dark to-ayurveda-green px-5 py-4 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <Leaf size={20} />
              </div>
              <div className="flex-1">
                <div className="font-serif font-bold text-base">Agni</div>
                <div className="text-xs text-ayurveda-sage flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-300 inline-block"></span>
                  AI Health Assistant · Agnivesh Ayurveda
                </div>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-white/50 bg-white/5 rounded-lg px-2 py-1">
              ⚠️ For informational purposes only. Not a substitute for medical advice.
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-ayurveda-cream/30 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-ayurveda-green/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={14} className="text-ayurveda-green" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-ayurveda-green text-white rounded-br-md"
                      : "bg-white border border-ayurveda-blush/50 text-ayurveda-navy rounded-bl-md shadow-sm"
                  }`}
                >
                  {formatContent(msg.content)}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-ayurveda-navy/10 flex items-center justify-center shrink-0 mt-1">
                    <User size={14} className="text-ayurveda-navy" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-ayurveda-green/10 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-ayurveda-green" />
                </div>
                <div className="bg-white border border-ayurveda-blush/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-ayurveda-green/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-ayurveda-green/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-ayurveda-green/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {hasError && (
              <div className="flex justify-center">
                <a
                  href={`tel:${clinicInfo.phone.replace(/\D/g, "")}`}
                  className="text-xs text-ayurveda-green font-medium flex items-center gap-1 hover:underline"
                >
                  <Phone size={12} /> Call {clinicInfo.phone} instead
                </a>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && !isLoading && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-ayurveda-cream text-ayurveda-green px-3 py-1.5 rounded-full border border-ayurveda-green/20 hover:bg-ayurveda-green hover:text-white transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="px-4 py-3 border-t border-ayurveda-blush/50 bg-white shrink-0 flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question..."
              disabled={isLoading}
              className="flex-1 bg-ayurveda-cream/50 rounded-xl px-4 py-2.5 text-sm text-ayurveda-navy placeholder-ayurveda-navy/40 outline-none focus:ring-2 focus:ring-ayurveda-green/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-ayurveda-green text-white flex items-center justify-center hover:bg-ayurveda-green-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
