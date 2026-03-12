"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ShoppingCart, Search, Info, Leaf, Sparkles, Send, Bot, User } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

type Message = {
    role: "user" | "bot";
    text: string;
};

export default function KidoConcierge() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", text: "Welcome to Kido Farms! I'm your AI Concierge. How can I help you harvest success today?" }
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
            const response = await axios.post(`${API_URL}/ai/chat`, {
                message: userMessage,
                history: messages.map(m => ({
                    role: m.role === "bot" ? "model" : "user",
                    parts: [{ text: m.text }]
                }))
            });

            setMessages(prev => [...prev, { role: "bot", text: response.data.reply }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: "bot", text: "Forgive me, my neural circuits are a bit tangled. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-12 right-12 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-96 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-primary/10 flex flex-col overflow-hidden h-[500px]"
                    >
                        {/* Header */}
                        <div className="p-6 bg-primary text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary rounded-xl text-primary">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black font-serif">Kido AI Concierge</h4>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/80">Always Bloom Logic</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
                        >
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === "user"
                                            ? "bg-secondary text-primary rounded-tr-none"
                                            : "bg-cream text-primary rounded-tl-none border border-primary/5"
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-cream p-4 rounded-2xl rounded-tl-none border border-primary/5 flex gap-1">
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-primary/30 rounded-full" />
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-primary/30 rounded-full" />
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-primary/30 rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-primary/5 bg-white">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Message concierge..."
                                    className="w-full pl-6 pr-14 py-4 bg-cream rounded-2xl text-sm font-bold text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 border border-primary/5"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-2 p-2.5 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${isOpen ? "bg-primary text-white" : "bg-primary text-secondary border-4 border-secondary shadow-[0_0_20px_rgba(242,201,76,0.3)]"
                    }`}
            >
                {isOpen ? <X size={28} strokeWidth={2.5} /> : <MessageCircle size={28} strokeWidth={2.5} />}
            </motion.button>
        </div>
    );
}
