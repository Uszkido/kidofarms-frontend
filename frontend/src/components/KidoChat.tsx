"use client";

import { useState, useRef, useEffect } from "react";
import {
    MessageSquare,
    X,
    Send,
    Loader2,
    Zap,
    Leaf,
    Bot,
    User,
    Sparkles,
    ChevronDown,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "@/lib/api";

type Message = {
    role: "user" | "model" | "model-local";
    content: string;
};

export default function KidoChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", content: "Greetings from Kido Farms! I am the Horizon AI. How can I assist your harvest or trade today?" }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

            const res = await fetch(getApiUrl("/api/ai/chat"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg, history }),
            });

            const data = await res.json();
            setMessages(prev => [...prev, {
                role: data.isLocal ? "model-local" : "model",
                content: data.reply
            }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: "model", content: "My neural nodes are currently re-aligning. Please try again in a moment." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 🛸 CHAT TRIGGER BUTTON */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-[200] w-20 h-20 bg-secondary text-primary rounded-[2rem] shadow-[0_20px_50px_rgba(197,160,89,0.4)] flex items-center justify-center group"
            >
                {isOpen ? <ChevronDown size={32} /> : <MessageSquare size={32} />}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-secondary text-[10px] font-black rounded-full flex items-center justify-center border-2 border-secondary animate-bounce">1</div>
            </motion.button>

            {/* 🧬 CHAT WINDOW */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-32 right-8 z-[200] w-[450px] max-w-[calc(100vw-4rem)] h-[650px] max-h-[calc(100vh-12rem)] bg-[#040d0a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                    >
                        {/* HEADER */}
                        <div className="p-8 border-b border-white/5 bg-secondary/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-xl">
                                    <Bot size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black font-serif italic text-white uppercase tracking-tighter">Horizon AI</h3>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" /> Neural Core Active
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-3 bg-white/5 rounded-full text-white/30 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* MESSAGES */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
                        >
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-primary text-secondary' : 'bg-secondary text-primary'}`}>
                                            {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                                        </div>
                                        <div className={`p-6 rounded-[2rem] text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-primary text-white border border-secondary/20 rounded-tr-none'
                                                : 'bg-white/5 text-white/80 border border-white/5 rounded-tl-none'
                                            }`}>
                                            {msg.role === 'model-local' && (
                                                <div className="flex items-center gap-2 mb-3 px-3 py-1 bg-secondary/10 text-secondary rounded-full border border-secondary/20 w-fit">
                                                    <ShieldCheck size={12} />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Sovereign Vault Protocol</span>
                                                </div>
                                            )}
                                            <p className="font-medium">{msg.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center animate-pulse">
                                            <Zap size={18} />
                                        </div>
                                        <div className="bg-white/5 p-6 rounded-[2rem] rounded-tl-none border border-white/5 flex items-center gap-4">
                                            <Loader2 size={20} className="animate-spin text-secondary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Synthesizing...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* INPUT */}
                        <form onSubmit={handleSend} className="p-8 border-t border-white/5 bg-white/[0.02]">
                            <div className="relative group">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Consult Horizon AI..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-16 py-5 outline-none focus:border-secondary transition-all font-medium text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-secondary text-primary rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/10 text-center mt-6">
                                Integrated with Kido Neural Nodes | v5.0 Master Protocol
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
