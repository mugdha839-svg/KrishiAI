"use client";
import AppShell from "@/components/layout/AppShell";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { chatMessages } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/userAuth";
import { Send, Mic, MicOff, Sparkles, Loader2, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  lang?: string;
}

const quickQuestions = [
  "Should I sell my wheat now?",
  "What fertilizer to use for rice?",
  "Am I eligible for PM-Kisan?",
  "How to reduce farming costs?",
  "Best crop for next season?",
  "How is the crisis affecting me?",
];

export default function ChatPage() {
  const user = getCurrentUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || loading) return;
    setInput("");

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: msgText,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-reasoner", // Uses DeepSeek-R1 logic capability for complex agro-financial queries
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.text,
          })),
          farmerContext: user,
        }),
      });

      if (!res.ok) throw new Error("AI unavailable");

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request. Please try again.";
      const reasoning = data.choices?.[0]?.message?.reasoning_content || "";
      const aiText = reasoning ? `<think>${reasoning}</think>\n\n${content}` : content;

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: aiText,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallback: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: "🙏 I'm experiencing a temporary issue connecting to the AI service. Please try again in a moment. In the meantime, you can check the Market Prices or Crisis Hub pages for the latest information.",
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallback]);
    }
    setLoading(false);
  };

  const toggleVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SR = win.webkitSpeechRecognition || win.SpeechRecognition;
    if (!SR) {
      alert("Voice input is not supported in your browser.");
      return;
    }
    if (listening) {
      setListening(false);
      return;
    }
    setListening(true);
    const recognition = new SR();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-160px)] sm:h-[calc(100vh-130px)]">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)]">KrishiAI DeepSeek Assistant</h1>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Using DeepSeek-R1 Reasoning Engine
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scroll-smooth">
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%] sm:max-w-[70%]">
                <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text.replace(/<think>[\s\S]*?<\/think>/g, '').trim()}</p>
                </div>
                {msg.text.includes("<think>") && (
                   <details className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg" style={{ background: "var(--bg-muted)" }}>
                     <summary className="cursor-pointer font-medium hover:text-green-600">View DeepSeek Reasoning</summary>
                     <p className="mt-1 whitespace-pre-wrap">{msg.text.match(/<think>([\s\S]*?)<\/think>/)?.[1]}</p>
                   </details>
                )}
                <p className={`text-[10px] mt-1 px-2 text-[var(--text-muted)] ${msg.role === "user" ? "text-right" : ""}`}>{msg.time}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="chat-bubble-ai flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                <span className="text-sm text-[var(--text-secondary)]">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          {quickQuestions.map((q) => (
            <button key={q} onClick={() => sendMessage(q)}
              className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium whitespace-nowrap hover:bg-green-100 transition flex items-center gap-1 border border-green-100">
              <Sparkles className="w-3 h-3" /> {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
          <button onClick={toggleVoice}
            className={`p-2.5 rounded-xl transition-all ${
              listening ? "bg-red-500 text-white animate-pulse" : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-gray-200"
            }`}>
            {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message... (Hindi or English)"
            className="flex-1 p-2.5 rounded-xl border border-[var(--border)] text-sm bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            disabled={loading} />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
