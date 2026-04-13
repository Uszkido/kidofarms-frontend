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
                        initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
                        className="absolute bottom-20 right-0 w-[350px] md:w-[400px] bg-white/95 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.2)] border border-primary/10 flex flex-col overflow-hidden h-[580px]"
                    >
                        {/* Status Bar */}
                        <div className="bg-primary p-6 text-white overflow-hidden relative">
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"
                            />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary shadow-lg">
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black font-serif italic tracking-tighter uppercase leading-none text-secondary">Horizon AI</h4>
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">Sovereign Intelligence</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Quick Protocol Buttons */}
                        <div className="bg-neutral-50 px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide border-b border-primary/5">
                            {[
                                { label: "Harvest status", icon: "🌾" },
                                { label: "Track my order", icon: "📦" },
                                { label: "Organic protocols", icon: "🧪" },
                                { icon: <BarChart3 size={16} />, label: "Check Carbon Score", action: () => window.location.href = '/admin/logistics' },
                                { icon: <ShieldCheck size={16} />, label: "View Sensor Health", action: () => window.location.href = '/admin/logistics' },
                                { icon: <Mic size={16} />, label: "Voice Harvest Hub", action: () => window.location.href = '/admin/inventory' },
                                { label: "Audit Supply Chain Carbon", icon: "🌍" }
                            ].map((btn: any, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (btn.action) btn.action();
                                        else setInput(btn.label);
                                    }}
                                    className="whitespace-nowrap px-4 py-2 bg-white border border-primary/10 rounded-full text-[9px] font-black uppercase tracking-wider text-primary hover:bg-secondary hover:border-secondary transition-all shadow-sm flex items-center gap-2"
                                >
                                    <span>{btn.icon}</span> {btn.label}
                                </button>
                            ))}
                        </div>

                        {/* Chat Body */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-neutral-50/50 scroll-smooth">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`relative max-w-[85%] p-4 rounded-[1.8rem] text-[13px] font-bold leading-relaxed shadow-sm ${msg.role === "user"
                                        ? "bg-primary text-white rounded-tr-none"
                                        : "bg-white border border-primary/5 text-primary rounded-tl-none tabular-nums"
                                        }`}>
                                        <div className="absolute top-1 right-3 opacity-10 italic text-[7px] font-black uppercase tracking-widest">
                                            {msg.role === "user" ? "Citizen" : "Horizon"}
                                        </div>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-[1.5rem] rounded-tl-none border border-primary/5 flex gap-3 items-center">
                                        <Loader2 className="animate-spin text-primary" size={16} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/40 text-center">Nodes syncing...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-primary/5 bg-white relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask Horizon..."
                                    className="w-full pl-6 pr-14 py-4 bg-neutral-50 rounded-2xl text-[13px] font-bold text-primary placeholder:text-primary/20 focus:outline-none ring-4 ring-transparent focus:ring-primary/5 border border-primary/5 transition-all shadow-inner"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-2 p-3 bg-primary text-white rounded-xl hover:bg-secondary hover:text-primary transition-all disabled:opacity-30 active:scale-95 shadow-md"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <p className="text-center mt-4 text-[7px] font-black uppercase tracking-[0.3em] text-primary/20 leading-none">
                                Kido Alpha Protocol • High Security Mode
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
