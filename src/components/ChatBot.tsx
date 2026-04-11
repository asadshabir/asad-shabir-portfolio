import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What are your top skills?",
  "Tell me about ASA-Mind",
  "What full-stack apps have you built?",
  "How can you help my project?",
];

const botKnowledge = `I'm Asad Shabir, an AI Engineer and Full-Stack Developer from Pakistan. I specialize in building agentic AI systems, production-ready chatbots, and full-stack web applications. My key skills include React, Next.js, TypeScript, Python, FastAPI, OpenAI Agents SDK, LangChain, Prompt Engineering, Supabase, and automation. 

My flagship project is ASA-Mind — an intelligent AI Chat Assistant built with OpenAI Agents SDK featuring multi-agent orchestration. I've also built AI-powered educational content, e-commerce platforms, real-time dashboards, and automation engines. I've worked at companies like Techlogix and Arbisoft, and currently freelance on cutting-edge AI projects.

I'm passionate about building things that actually ship and deliver real value. I can help with AI integration, full-stack development, chatbot development, automation, and more.`;

const ChatBot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! 👋 I'm Asad's AI assistant. Ask me anything about my skills, projects, or how I can help you!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simple local response (replace with actual AI call when backend is connected)
    await new Promise((r) => setTimeout(r, 1200));

    let response = "That's a great question! ";
    const lowerText = text.toLowerCase();
    if (lowerText.includes("skill")) {
      response = "My top skills include React, Next.js, TypeScript, Python, FastAPI, OpenAI Agents SDK, LangChain, Prompt Engineering, and Supabase. I'm particularly strong in agentic AI systems and full-stack development!";
    } else if (lowerText.includes("asa-mind") || lowerText.includes("asamind")) {
      response = "ASA-Mind is my flagship project — an intelligent AI Chat Assistant powered by OpenAI Agents SDK. It features multi-agent orchestration, real-time streaming responses, and conversational memory. It showcases my expertise in building production-grade AI systems!";
    } else if (lowerText.includes("full-stack") || lowerText.includes("app")) {
      response = "I've built several full-stack applications including e-commerce platforms with Stripe integration, real-time dashboards with WebSockets, and various SaaS tools. My stack typically includes Next.js, Supabase, TypeScript, and Python/FastAPI for backends.";
    } else if (lowerText.includes("help") || lowerText.includes("project") || lowerText.includes("hire")) {
      response = "I'd love to help! I can assist with AI integration (chatbots, agents, RAG), full-stack web development, automation pipelines, or prompt engineering. Feel free to reach out via the contact form or email me directly!";
    } else {
      response += "I'm an AI Engineer and Full-Stack Developer specializing in agentic AI systems, production chatbots, and modern web applications. What specifically would you like to know?";
    }

    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setIsTyping(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-4 md:right-8 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] glass-strong rounded-2xl flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-bold">Ask Asad AI</span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted/50 text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted/50 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Suggestion chips */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full glass text-primary hover:bg-primary/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 p-4 border-t border-border/50"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2.5 rounded-full bg-background/50 border border-border/50 focus:border-primary/50 outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover-lift disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Floating chat button
export const ChatButton = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 1, type: "spring" }}
    onClick={onClick}
    className="fixed bottom-6 right-4 md:right-8 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center z-50 animate-pulse-glow hover:scale-110 transition-transform"
  >
    <MessageCircle className="w-6 h-6" />
  </motion.button>
);

export default ChatBot;
