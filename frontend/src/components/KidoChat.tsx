"use client";

import { useState, useRef, useEffect } from "react";
import {
    MessageSquare,
    X,
    Send,
    Loader2,
    Zap,
    Bot,
    User,
    Sparkles,
    ChevronDown,
    ShieldCheck,
    Cpu,
    Globe,
    Menu
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
        { role: "model", content: "Kido Horizon Online. I am your unified agricultural intelligence. Ask me about harvests, research, or our global market protocols." }
    ]);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Handle responsiveness detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Prevent body scroll when chat is open on mobile
    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen, isMobile]);

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
            setMessages(prev => [...prev, { role: "model", content: "Neural sync interrupted. Please verify your connection to the Kido Grid." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 🛸 CHAT TRIGGER BUTTON */}
            <motion.button
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed z-[200] flex items-center justify-center transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
                    ${isOpen
                        ? 'bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full'
                        : 'bottom-6 right-6 sm:bottom-8 sm:right-8 w-16 h-16 sm:w-20 sm:h-20 bg-secondary text-primary rounded-[1.5rem] sm:rounded-[2.5rem]'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={isMobile ? 24 : 32} />}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-7 sm:h-7 bg-primary text-secondary text-[9px] sm:text-[11px] font-black rounded-full flex items-center justify-center border-2 border-secondary shadow-lg">
                        AI
                    </div>
                )}
            </motion.button>

            {/* 🧬 CHAT WINDOW */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={isMobile ? { y: "100%" } : { opacity: 0, y: 50, scale: 0.95 }}
                        animate={isMobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
                        exit={isMobile ? { y: "100%" } : { opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={`fixed z-[199] flex flex-col overflow-hidden bg-[#0a0f0d]/98 backdrop-blur-2xl border-white/10 shadow-[0_50px_150px_rgba(0,0,0,0.9)] 
                            ${isMobile
                                ? 'inset-0 w-full h-full rounded-none'
                                : 'bottom-32 right-8 w-[420px] h-[700px] border rounded-[2.5rem]'
                            }`}
                    >
                        {/* HEADER */}
                        <div className="relative p-6 sm:p-8 border-b border-white/10 bg-gradient-to-b from-secondary/20 to-transparent">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-2xl overflow-hidden">
                                            <Bot size={28} className="animate-pulse" />
                                            <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#0a0f0d]" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg sm:text-xl font-black italic text-white uppercase tracking-tighter">Horizon AI</h3>
                                            <span className="px-1.5 py-0.5 bg-secondary/20 text-secondary text-[8px] font-bold rounded uppercase tracking-widest border border-secondary/30">v5.1</span>
                                        </div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary/70 flex items-center gap-1.5">
                                            Unified Intelligence • Sovereign Node
                                        </p>
                                    </div>
                                </div>

                                {isMobile && (
                                    <button onClick={() => setIsOpen(false)} className="p-2 text-white/50 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                )}
                            </div>

                            {/* CHAT TOOLS / QUICK ACTIONS */}
                            <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {[
                                    { icon: <Zap size={10} />, label: "Status" },
                                    { icon: <Globe size={10} />, label: "Market" },
                                    { icon: <Cpu size={10} />, label: "Protocols" },
                                    { icon: <ShieldCheck size={10} />, label: "Trust" }
                                ].map((tool, idx) => (
                                    <button key={idx} className="flex-none flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap">
                                        {tool.icon} {tool.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* MESSAGES */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 space-y-10 scroll-smooth custom-scrollbar"
                        >
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-3 sm:gap-4 max-w-[90%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-white/10 
                                            ${msg.role === 'user' ? 'bg-primary text-secondary' : 'bg-white/5 text-white/60'}`}>
                                            {msg.role === 'user' ? <User size={16} /> : <Zap size={16} />}
                                        </div>
                                        <div className={`relative p-5 sm:p-6 rounded-[1.8rem] text-sm leading-relaxed 
                                            ${msg.role === 'user'
                                                ? 'bg-primary text-white border border-secondary/20 rounded-tr-none'
                                                : 'bg-white/[0.03] text-white/90 border border-white/5 rounded-tl-none'
                                            }`}>
                                            {msg.role === 'model-local' && (
                                                <div className="flex items-center gap-2 mb-3 px-3 py-1 bg-secondary/10 text-secondary rounded-full border border-secondary/20 w-fit">
                                                    <ShieldCheck size={12} />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Kido Verified Result</span>
                                                </div>
                                            )}
                                            <p className="font-medium whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 text-secondary flex items-center justify-center animate-pulse border border-white/10">
                                            <Loader2 size={18} className="animate-spin" />
                                        </div>
                                        <div className="bg-white/[0.02] px-6 py-4 rounded-[1.8rem] rounded-tl-none border border-white/5">
                                            <div className="flex gap-1.5">
                                                <span className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* INPUT */}
                        <div className="p-6 sm:p-8 border-t border-white/10 bg-gradient-to-t from-black/50 to-transparent">
                            <form onSubmit={handleSend} className="relative group">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Consult Horizon AI Master..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-16 py-4 sm:py-5 outline-none focus:border-secondary transition-all font-medium text-sm text-white placeholder:text-white/20"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-secondary text-primary rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-20 disabled:grayscale disabled:scale-100"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/20 text-center mt-6">
                                Federated AI Network • Jos-Jos Node Status: <span className="text-green-500">Green</span>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(197, 160, 89, 0.2);
                }
            `}</style>
        </>
    );
}
