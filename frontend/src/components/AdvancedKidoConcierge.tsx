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
                        className="fixed md:absolute bottom-24 right-4 left-4 md:left-auto md:right-0 md:w-[450px] max-h-[calc(100vh-10rem)] md:max-h-[650px] bg-[#040d0a]/95 backdrop-blur-3xl rounded-[2rem] md:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col overflow-hidden h-[500px] md:h-[650px] z-[1010]"
                    >
                        {/* Status Bar */}
                        <div className="bg-secondary/10 p-4 md:p-8 border-b border-white/5 relative overflow-hidden shrink-0">
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-20"
                            />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-14 md:h-14 bg-secondary rounded-xl md:rounded-2xl flex items-center justify-center text-primary shadow-[0_10px_30px_rgba(196,255,1,0.3)]">
                                        <Bot size={20} className="md:w-7 md:h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-black font-serif italic tracking-tighter uppercase leading-none text-white">Horizon AI</h4>
                                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-secondary mt-1 flex items-center gap-2">
                                            <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-secondary rounded-full animate-pulse" /> Unified Intelligence
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/30 hover:text-white transition-all">
                                    <X className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Protocol Buttons */}
                        <div className="px-4 md:px-6 py-3 md:py-4 flex gap-2 border-b border-white/5 bg-white/[0.02] overflow-x-auto no-scrollbar shrink-0">
                            {[
                                { label: "Harvest Status", icon: "🌾" },
                                { label: "Track My Order", icon: "📦" },
                                { label: "Report Anomaly", icon: "⚠️" },
                                { label: "Organic Protocols", icon: "🧪" },
                                { label: "Sensor Health", icon: "📡" },
                            ].map((btn: any, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(btn.label)}
                                    className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-wider text-white/60 hover:bg-secondary hover:text-primary hover:border-secondary transition-all shadow-sm flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                                >
                                    <span>{btn.icon}</span> {btn.label}
                                </button>
                            ))}
                        </div>

                        {/* Chat Body */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 space-y-8 scroll-smooth custom-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`relative max-w-[90%] md:max-w-[85%] p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] text-sm font-medium leading-relaxed shadow-lg break-words whitespace-pre-wrap ${msg.role === "user"
                                        ? "bg-primary text-white border border-secondary/20 rounded-tr-none"
                                        : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none font-sans"
                                        }`}>
                                        {msg.role === "bot" && (
                                            <div className="flex items-center gap-2 mb-3 px-3 py-1 bg-secondary/10 text-secondary rounded-full border border-secondary/20 w-fit">
                                                <ShieldCheck size={12} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Kido Verified Result</span>
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
                                        <div className="bg-white/5 p-6 rounded-[2rem] rounded-tl-none border border-white/5 flex items-center gap-4">
                                            <Loader2 size={20} className="animate-spin text-secondary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Syncing Neurons...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 md:p-8 border-t border-white/5 bg-white/[0.02] shrink-0">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Consult Horizon AI Master..."
                                    className="w-full pl-4 md:pl-6 pr-14 md:pr-16 py-3 md:py-5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-secondary transition-all shadow-inner font-medium text-sm"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-2.5 md:p-4 bg-secondary text-primary rounded-lg md:rounded-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-30 shadow-xl"
                                >
                                    <Send className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                            </div>
                            <p className="text-center mt-4 md:mt-6 text-[8px] font-black uppercase tracking-[0.4em] text-white/10 leading-none">
                                Federated AI Network • Jos-Jos Node Status: GREEN
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
