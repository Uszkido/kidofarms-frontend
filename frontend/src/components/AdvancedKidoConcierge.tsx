"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Sparkles, Send, Search, BookOpen, FileText, Bot, User, Loader2 } from "lucide-react";
import { getApiUrl } from "@/lib/api";

type Message = {
    role: "user" | "bot";
    text: string;
    type?: "general" | "research";
};

export default function AdvancedKidoConcierge() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"chat" | "research">("chat");
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", text: "Kido Horizon Online. How can I assist with your harvests today?", type: "general" }
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
                    message: activeTab === "research" ? `RESEARCH QUERY: ${userMessage}. Use the retrieve_farming_knowledge tool.` : userMessage,
                    history: messages.slice(1).map(m => ({
                        role: m.role === "bot" ? "model" : "user",
                        parts: [{ text: m.text }]
                    }))
                })
            });

            if (!response.ok) throw new Error("API failed");
            const data = await response.json();
            setMessages(prev => [...prev, { role: "bot", text: data.reply, type: activeTab }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "bot", text: "Neural parity lost. Re-establishing connection." }]);
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
                        <div className="bg-primary p-6 text-white overflow-hidden relative">
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"
                            />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-secondary/20">
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black font-serif italic tracking-tighter uppercase">Kido <span className="text-secondary">Horizon</span></h4>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure Node X-09</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Dual Mode Tabs */}
                            <div className="flex gap-2 mt-6 p-1 bg-white/5 rounded-2xl border border-white/10">
                                <button
                                    onClick={() => setActiveTab("chat")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "chat" ? "bg-white text-primary shadow-xl" : "text-white/40 hover:text-white"}`}
                                >
                                    <MessageCircle size={14} /> Concierge
                                </button>
                                <button
                                    onClick={() => setActiveTab("research")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "research" ? "bg-white text-primary shadow-xl" : "text-white/40 hover:text-white"}`}
                                >
                                    <Search size={14} /> Research
                                </button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-white to-neutral-50/50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`relative max-w-[85%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${msg.role === "user"
                                        ? "bg-primary text-white rounded-tr-none"
                                        : msg.type === "research"
                                            ? "bg-secondary/10 border border-secondary/20 text-primary rounded-tl-none font-serif italic"
                                            : "bg-white border border-primary/5 text-primary rounded-tl-none"
                                        }`}>
                                        <div className="absolute top-0 right-0 p-2 opacity-5 italic text-[10px] font-black">
                                            {msg.role === "user" ? "Citizen" : "Horizon"}
                                        </div>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-cream p-5 rounded-3xl rounded-tl-none border border-primary/5 flex gap-2">
                                        <Loader2 className="animate-spin text-primary/40" size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Analyzing data nodes...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Research Suggestions */}
                        {activeTab === "research" && messages.length < 3 && (
                            <div className="px-8 pb-4 flex gap-2 overflow-x-auto">
                                {[
                                    { text: "Soil pH Kano", icon: <BookOpen size={12} /> },
                                    { text: "Sorghum Mulching", icon: <FileText size={12} /> }
                                ].map((sug, i) => (
                                    <button key={i} onClick={() => setInput(sug.text)} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-[10px] font-black uppercase text-secondary hover:bg-secondary hover:text-primary transition-all">
                                        {sug.icon} {sug.text}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-8 bt-border-primary/5 bg-white relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder={activeTab === "chat" ? "Ask Kido AI..." : "Search Agricultural Research..."}
                                    className="w-full pl-8 pr-16 py-5 bg-neutral-50 rounded-[2rem] text-sm font-bold text-primary placeholder:text-primary/20 focus:outline-none ring-2 ring-transparent focus:ring-primary/5 border border-primary/5 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-3 top-2.5 p-3 bg-primary text-white rounded-2xl hover:bg-secondary hover:text-primary transition-all disabled:opacity-30 active:scale-95 shadow-lg shadow-primary/10"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className="text-center mt-4 text-[8px] font-black uppercase tracking-[0.2em] text-primary/20 leading-none">
                                Powered by Kido Neural Network • Secure-A-Tier encryption
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
