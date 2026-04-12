"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Sparkles, Send, Search, BookOpen, FileText, Bot, User, Loader2 } from "lucide-react";
import { getApiUrl } from "@/lib/api";

type Message = {
    role: "user" | "bot";
    text: string;
    type?: "general" | "research" | "chat";
};

export default function AdvancedKidoConcierge() {
    const [isOpen, setIsOpen] = useState(false);
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
            setMessages(prev => [...prev, { role: "bot", text: "My neural engine requires a valid Gemini API Key to provide live intelligence. Please configure your environment." }]);
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
                        className="absolute bottom-20 right-0 w-[400px] md:w-[450px] bg-white/90 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.15)] border border-primary/10 flex flex-col overflow-hidden h-[650px]"
                    >
                        {/* Status Bar */}
                        <div className="bg-primary p-8 text-white overflow-hidden relative">
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"
                            />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-secondary rounded-[1.2rem] flex items-center justify-center text-primary shadow-lg shadow-black/20">
                                        <Bot size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black font-serif italic tracking-tighter uppercase leading-none">Horizon <span className="text-secondary">AI</span></h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Unified Intelligence</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-white to-neutral-50/50 scroll-smooth">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`relative max-w-[85%] p-6 rounded-[2.2rem] text-[15px] font-bold leading-relaxed shadow-sm ${msg.role === "user"
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-white border border-primary/5 text-primary rounded-tl-none"
                                        }`}>
                                        <div className="absolute top-2 right-4 opacity-5 italic text-[8px] font-black uppercase tracking-widest">
                                            {msg.role === "user" ? "Citizen" : "Horizon"}
                                        </div>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/50 backdrop-blur-sm p-5 rounded-[2rem] rounded-tl-none border border-primary/5 flex gap-3 items-center">
                                        <Loader2 className="animate-spin text-primary" size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Consulting Knowledge Nodes...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-8 border-t border-primary/5 bg-white relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Message Horizon AI..."
                                    className="w-full pl-8 pr-16 py-6 bg-neutral-50 rounded-[2.2rem] text-[15px] font-bold text-primary placeholder:text-primary/20 focus:outline-none ring-4 ring-transparent focus:ring-primary/5 border border-primary/5 transition-all shadow-inner"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-3 top-3 p-4 bg-primary text-white rounded-[1.2rem] hover:bg-secondary hover:text-primary transition-all disabled:opacity-30 active:scale-95 shadow-lg shadow-primary/20"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <p className="text-center mt-6 text-[9px] font-black uppercase tracking-[0.3em] text-primary/20 leading-none">
                                Federated Learning • Kido Organic Protocol
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble Trigger */}
            <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`group w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-[0_24px_48px_rgba(0,0,0,0.15)] transition-all relative ${isOpen ? "bg-white text-primary border border-primary/5" : "bg-primary text-white hover:bg-secondary hover:text-primary"
                    }`}
            >
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-primary text-[10px] font-bold shadow-lg shadow-secondary/20 group-hover:bg-white border-2 border-primary">
                    AI
                </div>
                {isOpen ? <X size={32} strokeWidth={2.5} /> : <Sparkles size={32} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />}
            </motion.button>
        </div>
    );
}
