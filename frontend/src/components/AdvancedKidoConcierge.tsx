"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Sparkles, Send, Search, BookOpen, FileText, Bot, User, Loader2, BarChart3, ShieldCheck, Mic } from "lucide-react";
import { getApiUrl } from "@/lib/api";

type Message = {
    role: "user" | "bot";
    text: string;
    type?: "general" | "research" | "chat";
};

export default function AdvancedKidoConcierge({ forceOpen, onClose }: { forceOpen?: boolean; onClose?: () => void }) {
    const [internalOpen, setInternalOpen] = useState(false);

    // Support both internal and external control
    const isOpen = forceOpen !== undefined ? forceOpen : internalOpen;
    const setIsOpen = (val: boolean) => {
        if (onClose && !val) onClose();
        setInternalOpen(val);
    };

    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", text: "Kido Horizon Online. I am your unified agricultural intelligence. Ask me about harvests, research, or orders.", type: "general" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const handleAiTrigger = (e: any) => {
            if (!internalOpen && !forceOpen) setInternalOpen(true);
            setInput(e.detail);
        };
        window.addEventListener('ai-trigger-message', handleAiTrigger);
        return () => window.removeEventListener('ai-trigger-message', handleAiTrigger);
    }, [internalOpen, forceOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch(getApiUrl("/api/ai/chat"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(1).map(m => ({
                        role: m.role === "bot" ? "model" : "user",
                        parts: [{ text: m.text }]
                    }))
                })
            });

            if (!response.ok) throw new Error("API failed");
            const data = await response.json();
            setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "bot", text: "I'm optimizing my knowledge nodes right now. How can I assist you with harvests or orders today?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative pointer-events-auto">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(20px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(20px)" }}
                        className="fixed inset-x-3 top-3 bottom-24 sm:inset-auto sm:bottom-24 sm:right-0 sm:w-[400px] sm:h-[560px] bg-[#040d0a]/95 backdrop-blur-3xl rounded-[1.75rem] sm:rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.55)] border border-white/10 flex flex-col overflow-hidden z-[1010]"
                    >
                        {/* Status Bar */}
                        <div className="bg-secondary/10 p-4 sm:p-5 border-b border-white/5 relative overflow-hidden shrink-0">
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-20"
                            />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary shadow-[0_10px_30px_rgba(196,255,1,0.3)]">
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black font-serif italic tracking-tighter uppercase leading-none text-white">Kido Assistant</h4>
                                        <p className="text-[9px] font-bold tracking-wide text-secondary mt-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" /> Online support
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} aria-label="Close assistant" className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Protocol Buttons */}
                        <div className="px-4 py-3 flex gap-2 border-b border-white/5 bg-white/[0.02] overflow-x-auto no-scrollbar shrink-0">
                            {[
                                { label: "Track an order", icon: "📦" },
                                { label: "Find products", icon: "🛒" },
                                { label: "Farming advice", icon: "🌾" },
                            ].map((btn: any, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(btn.label)}
                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/80 hover:bg-secondary hover:text-primary hover:border-secondary transition-all shadow-sm flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                                >
                                    <span>{btn.icon}</span> {btn.label}
                                </button>
                            ))}
                        </div>

                        {/* Chat Body */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-5 scroll-smooth custom-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`relative max-w-[88%] p-4 rounded-2xl text-sm font-medium leading-6 shadow-lg break-words whitespace-pre-wrap ${msg.role === "user"
                                        ? "bg-primary text-white border border-secondary/20 rounded-tr-none"
                                        : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none font-sans"
                                        }`}>
                                        {msg.role === "bot" && (
                                            <div className="flex items-center gap-2 mb-3 px-3 py-1 bg-secondary/10 text-secondary rounded-full border border-secondary/20 w-fit">
                                                <ShieldCheck size={12} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Kido guide</span>
                                            </div>
                                        )}
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center animate-pulse">
                                            <Sparkles size={18} />
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-3">
                                            <Loader2 size={20} className="animate-spin text-secondary" />
                                            <span className="text-xs font-medium text-white/50">Thinking…</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5 bg-white/[0.02] shrink-0">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask about orders, products, or farming…"
                                    className="w-full pl-4 pr-14 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/35 focus:outline-none focus:border-secondary transition-all shadow-inner font-medium text-sm"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    aria-label="Send message"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-secondary text-primary rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-xl"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-center mt-3 text-[9px] text-white/30 leading-none">
                                Powered by Kido Farms support
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
