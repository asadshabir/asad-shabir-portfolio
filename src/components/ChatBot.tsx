import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { sendChat, type ChatMessage, type ChatError, type ChatErrorKind } from "@/lib/chatbotService";
import chatbotIcon from "@/assets/chatbot-premium-icon.png";
import profilePhoto from "@/assets/chaticon.png";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * T034 — Chatbot with Backend Integration
 *
 * Identity: Always "I am Asad Shabir"
 * Languages: English, Urdu (اردو), Sindhi (سنڌي)
 * Topics: skills, services, projects, stack, hiring, collaboration, contact
 * Off-topic: polite redirect
 *
 * Quick replies: Hire Asad, Tech Stack, Projects, Contact
 */
const QUICK_REPLIES = [
    "Tell me about your AI projects",
    "What are Digital FTEs?",
    "Show your tech stack",
    "Tell me about your experience",

];

const INITIAL_GREETING = {
  en: "Hi ! 👋 I'm **Asad Shabir** — an Agentic AI Engineer, Digital FTE Architect, and Full-Stack AI Developer. I design intelligent AI products, multi-agent systems, advanced RAG applications, and enterprise automations that deliver real business impact. What would you like to explore today?",

  ur: "وعلیکم السلام! 👋 میں **اسد شابیر** ہوں — Agentic AI Engineer، Digital FTE Architect، اور Full-Stack AI Developer۔ میں ذہین AI سسٹمز، Multi-Agent Architectures، Advanced RAG Applications، اور Enterprise Automations تیار کرتا ہوں جو حقیقی کاروباری نتائج فراہم کرتے ہیں۔ آپ آج کس بارے میں جاننا چاہتے ہیں؟",

  sd: "وعليڪم السلام! 👋 آئون **اسد شابير** آھيان — Agentic AI Engineer، Digital FTE Architect، ۽ Full-Stack AI Developer. آئون ذهين AI سسٽمز، Multi-Agent Architectures، Advanced RAG Applications، ۽ Enterprise Automations ٺاھيان ٿو جيڪي حقيقي ڪاروباري قدر پيدا ڪن ٿا. اڄ توھان ڇا ڄاڻڻ چاھيو ٿا؟",
};

const ChatBot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_GREETING.en },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [language, setLanguage] = useState<"en" | "ur" | "sd">("en");
  const [sessionTracked, setSessionTracked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { trackChatbot } = useAnalytics();

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Track chatbot session on first user message
    if (!sessionTracked) {
      trackChatbot();
      setSessionTracked(true);
    }

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await sendChat(
        [...messages, { role: "user", content: text }],
        language,
        sessionId
      );

      if (result.ok) {
        if (result.session_id) setSessionId(result.session_id);
        if (result.language) setLanguage(result.language as "en" | "ur" | "sd");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.message.content },
        ]);
      }
    } catch (err: unknown) {
      // Classify the error
      const isChatError = (e: unknown): e is ChatError =>
        e !== null && typeof e === "object" && "kind" in e && "message" in e;

      if (isChatError(err)) {
        // Transient errors (rate limit, timeout, unavailable, network) → toast only, no chat bubble
        const transientKinds: ChatErrorKind[] = ["RATE_LIMIT", "TIMEOUT", "UNAVAILABLE", "NETWORK"];
        if (transientKinds.includes(err.kind)) {
          toast({
            title: err.kind === "RATE_LIMIT" ? "AI models at capacity" : "Chat unavailable",
            description: err.kind === "RATE_LIMIT"
              ? "All AI models are busy. Please wait a moment and try again."
              : err.message,
            variant: "default",
          });
        } else {
          // Non-transient errors (auth, server, unknown) → add as chat message
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: err.message },
          ]);
        }
      } else {
        // Fallback for unknown error types
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        toast({
          title: "Chat error",
          description: msg,
          variant: "destructive",
        });
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile: full-screen overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9998] md:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed z-[9999] premium-glass-strong flex flex-col overflow-hidden
              inset-0 rounded-none md:rounded-2xl
              md:bottom-24 md:right-4 lg:right-8 md:top-auto md:left-auto
              md:w-[420px] md:h-[580px] md:max-w-[calc(100vw-2rem)]"
            style={{
              boxShadow: "0 0 48px hsl(var(--primary) / 0.12), 0 24px 72px rgba(0,0,0,0.55)",
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* Header — clean and premium */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 flex-shrink-0">
                  <img
                    src={profilePhoto}
                    alt="Asad Shabir"
                    className="w-full h-full rounded-full object-cover border-2 border-primary/50"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald border-2 border-background" />
                </div>
                <div>
                  <p className="font-bold text-base leading-none">Asad Shabir</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {language === "ur" ? "AI asistent" : language === "sd" ? "AI اسسٽنٽ" : "AI Assistant"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close chat"
                className="text-muted-foreground hover:text-foreground transition-colors p-2 -mr-1 rounded-full hover:bg-muted/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-primary to-emerald text-primary-foreground rounded-br-md"
                        : "premium-glass text-foreground rounded-bl-md border border-border/50"
                    }`}
                  >
                    {renderMarkdown(msg.content)}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted/60 px-4 py-3 rounded-2xl rounded-bl-md border border-border/50">
                    <div className="flex gap-1.5">
                      {[0, 150, 300].map((d) => (
                        <span
                          key={d}
                          className="w-2 h-2 rounded-full bg-primary/70 animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick reply suggestions */}
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => sendMessage(reply)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 text-foreground/80 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex items-center gap-2 p-3 sm:p-4 border-t border-border/50"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === "ur" ? "پیغام لکھیں..." :
                  language === "sd" ? "پيغام لکھو..." :
                  "Ask me anything about Asad..."
                }
                disabled={isTyping}
                className="flex-1 px-4 py-3 rounded-full bg-muted/40 border border-border/60 focus:border-primary/50 outline-none text-sm transition-colors"
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isTyping}
                whileTap={{ scale: 0.92 }}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-emerald text-primary-foreground flex items-center justify-center disabled:opacity-40 flex-shrink-0"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Lightweight markdown renderer (bold, italic, code, breaks)
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <p key={i} className={i > 0 ? "mt-1.5" : ""}>
      {line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j} className="font-semibold text-primary">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={j}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={j} className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{part.slice(1, -1)}</code>;
        }
        return <span key={j}>{part}</span>;
      })}
    </p>
  ));
}

// Floating launcher button
export const ChatButton = ({ onClick, isScrolling = false }: { onClick: () => void; isScrolling?: boolean }) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isScrolling ? 0 : 1,
        scale: isScrolling ? 0.5 : 1,
        y: isScrolling ? 20 : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={onClick}
      className="fixed bottom-6 right-4 sm:right-6 md:right-8 z-[9999] group flex items-center gap-3"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        pointerEvents: isScrolling ? "none" as const : "auto" as const,
      }}
    >
      {/* Floating label - shows when button is visible */}
      <AnimatePresence>
        {!isScrolling && (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full
              bg-card/90 border border-border/60 backdrop-blur-sm
              text-xs sm:text-sm font-semibold text-foreground/90 shadow-lg"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
            </span>
            Chat with Asad
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar button */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-emerald/20 blur-sm" />
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary/40 shadow-lg shadow-primary/20">
          <img
            src={chatbotIcon}
            alt="Chat with Asad"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
      </div>
    </motion.button>
  );
};

export default ChatBot;