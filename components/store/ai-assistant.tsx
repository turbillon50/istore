"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Minus,
  Send,
  Bot,
  Sparkles,
  ChevronRight,
  ShoppingCart,
  RefreshCw,
  Star,
} from "lucide-react";

// ----------------------------------------------
// Types
// ----------------------------------------------

interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  price: number;
  comparePrice?: number;
  image: string;
  slug: string;
  rating: number;
  reviewCount: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: ProductSummary[];
  isStreaming?: boolean;
  timestamp: Date;
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

// ----------------------------------------------
// Quick prompts
// ----------------------------------------------

const QUICK_PROMPTS = [
  "¿Qué iPhone me recomiendas?",
  "¿Tienen financiamiento sin buró?",
  "¿Cuánto vale mi iPhone 14?",
  "Ver los más vendidos",
];

// ----------------------------------------------
// Message bubble
// ----------------------------------------------

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  // Parse markdown-style links [text](/path)
  const renderContent = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        return (
          <Link
            key={i}
            href={linkMatch[2]}
            className="text-[#60a5fa] underline underline-offset-2 hover:text-[#2563eb]"
          >
            {linkMatch[1]}
          </Link>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563eb] to-[#60a5fa] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-3.5 h-3.5 text-black" />
        </div>
      )}

      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        {/* Bubble */}
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-gradient-to-br from-[#2563eb] to-[#60a5fa] text-black font-medium rounded-tr-sm"
              : "bg-white/[0.07] border border-white/[0.08] text-white/90 rounded-tl-sm"
          }`}
        >
          {message.isStreaming && message.content === "" ? (
            <div className="flex gap-1 py-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/40"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                />
              ))}
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{renderContent(message.content)}</p>
          )}
          {message.isStreaming && message.content !== "" && (
            <span className="inline-block w-1.5 h-4 bg-white/60 ml-0.5 animate-pulse rounded-sm align-bottom" />
          )}
        </div>

        {/* Product cards */}
        {message.products && message.products.length > 0 && (
          <div className="w-full space-y-2">
            <p className="text-[11px] text-white/40 px-1">Productos sugeridos</p>
            {message.products.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.06] border border-white/[0.09] rounded-xl overflow-hidden hover:border-[#2563eb]/30 transition-colors"
              >
                <Link href={`/productos/${p.slug}`} className="flex gap-3 p-3">
                  <div className="relative w-12 h-12 flex-shrink-0 bg-white/[0.04] rounded-lg overflow-hidden">
                    <Image src={p.image} alt={p.name} fill className="object-contain p-1" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white line-clamp-1">{p.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-2.5 h-2.5 text-[#60a5fa]" fill="#60a5fa" />
                      <span className="text-[10px] text-white/50">{p.rating}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-sm font-black text-white">${p.price.toLocaleString("es-MX")}</span>
                      {p.comparePrice && p.comparePrice > p.price && (
                        <span className="text-[10px] text-white/30 line-through">${p.comparePrice.toLocaleString("es-MX")}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/25 flex-shrink-0 self-center" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <span className="text-[10px] text-white/20 px-1">
          {message.timestamp.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------
// Main component
// ----------------------------------------------

interface AIAssistantProps {
  productId?: string;
  categoryId?: string;
  cartItems?: CartItem[];
}

export default function AIAssistant({ productId, categoryId, cartItems }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Soy Iris, tu asistente de iStore. ¿En qué te puedo ayudar hoy? Puedo ayudarte a encontrar el producto perfecto, comparar dispositivos, o informarte sobre nuestros planes de financiamiento.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationHistory = useRef<Array<{ role: "user" | "assistant"; content: string }>>([]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Show unread indicator after 5s if not opened
  useEffect(() => {
    const t = setTimeout(() => {
      if (!isOpen) setHasUnread(true);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add to conversation history
    conversationHistory.current.push({ role: "user", content: text.trim() });

    // Placeholder streaming message
    const assistantId = `assistant_${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      isStreaming: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          context: {
            productId,
            categoryId,
            cartItems,
          },
          conversationHistory: conversationHistory.current.slice(-8),
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let suggestedProducts: ProductSummary[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "text") {
              accumulated += parsed.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: accumulated, isStreaming: true }
                    : m
                )
              );
            } else if (parsed.type === "products") {
              suggestedProducts = parsed.products;
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }

      // Finalize message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: accumulated, isStreaming: false, products: suggestedProducts }
            : m
        )
      );

      conversationHistory.current.push({ role: "assistant", content: accumulated });
    } catch (error) {
      console.error("AI Assistant error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: "Lo siento, tuve un problema al procesar tu mensaje. ¿Puedes intentarlo de nuevo?",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, productId, categoryId, cartItems]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome_reset",
        role: "assistant",
        content: "¡Hola de nuevo! ¿En qué te puedo ayudar?",
        timestamp: new Date(),
      },
    ]);
    conversationHistory.current = [];
  };

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? "60px" : "540px",
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[min(380px,calc(100vw-2rem))] bg-[#1a1a1a] border border-white/[0.09] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
            style={{ height: isMinimized ? 60 : 540 }}
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-gradient-to-r from-[#2563eb]/10 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563eb] to-[#60a5fa] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1a1a1a]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Iris</p>
                  <p className="text-[11px] text-white/40">Asistente de iStore · En línea</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all"
                  title="Nueva conversación"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick prompts — only when no conversation yet */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="text-xs px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-full text-white/60 hover:text-white hover:border-[#2563eb]/30 hover:bg-[#2563eb]/5 transition-all"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="flex-shrink-0 p-3 border-t border-white/[0.07]">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Pregúntame lo que necesites..."
                      disabled={isLoading}
                      className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#2563eb]/30 transition-all disabled:opacity-50"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#60a5fa] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(37, 99, 235,0.35)] transition-all flex-shrink-0"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 text-black" />
                      )}
                    </motion.button>
                  </div>
                  <p className="text-[10px] text-white/20 text-center mt-2">
                    Iris puede cometer errores. Verifica información importante.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={isOpen ? handleClose : handleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#2563eb] to-[#60a5fa] shadow-[0_8px_30px_rgba(37, 99, 235,0.45)] flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-black" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6 text-black" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-[#131313] flex items-center justify-center"
            >
              <span className="text-[10px] font-bold text-white">1</span>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-[#2563eb]/50"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          />
        )}
      </motion.button>
    </>
  );
}
