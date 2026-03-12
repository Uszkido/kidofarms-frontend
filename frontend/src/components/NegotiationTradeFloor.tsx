"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, DollarSign, ShieldCheck, Clock, User, MessageSquare, ArrowRight, Gavel, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    sender: "Farmer" | "Vendor" | "System";
    text: string;
    timestamp: string;
    isBid?: boolean;
    bidAmount?: string;
}

interface NegotiationTradeFloorProps {
    isOpen: boolean;
    onClose: () => void;
    batchId: string;
    productName: string;
    initialPrice: string;
}

export function NegotiationTradeFloor({ isOpen, onClose, batchId, productName, initialPrice }: NegotiationTradeFloorProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", sender: "System", text: `Trade Floor initialized for batch ${batchId}. Sovereign Escrow is active.`, timestamp: "09:00 AM" },
        { id: "2", sender: "Farmer", text: "Quality is top-tier this morning. Moisture at 12.5%. Available for immediate loading.", timestamp: "09:05 AM" }
    ]);
    const [input, setInput] = useState("");
    const [bidInput, setBidInput] = useState("");
    const [isAccepted, setIsAccepted] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!input.trim()) return;
        const newMessage: Message = {
            id: Date.now().toString(),
            sender: "Vendor",
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);
        setInput("");
    };

    const handlePlaceBid = () => {
        if (!bidInput.trim()) return;
        const newBid: Message = {
            id: Date.now().toString(),
            sender: "Vendor",
            text: `PROPOSED BID: ₦${bidInput}/Ton`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isBid: true,
            bidAmount: bidInput
        };
        setMessages([...messages, newBid]);
        setBidInput("");
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-end md:justify-center p-0 md:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-primary/40 backdrop-blur-md"
                />

                <motion.div
                    initial={{ x: "100%", opacity: 0.5 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0.5 }}
                    transition={{ type: "spring", damping: 30, stiffness: 200 }}
                    className="relative w-full max-w-xl h-full md:h-[90vh] bg-white md:rounded-[4rem] shadow-2xl flex flex-col border-l-8 border-secondary/20"
                >
                    {/* Header */}
                    <div className="p-8 md:p-12 bg-primary text-white space-y-6 relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-[60px]" />
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-2 bg-secondary text-primary px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                                    <Gavel size={12} /> Live Negotiation Node
                                </div>
                                <h2 className="text-3xl font-black font-serif italic uppercase tracking-tighter leading-none">
                                    {productName} <br />
                                    <span className="text-secondary tracking-tighter italic">The Trade Floor</span>
                                </h2>
                            </div>
                            <button onClick={onClose} className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Floor Listing</p>
                                <p className="font-serif italic font-black text-xl text-secondary">₦{initialPrice}</p>
                            </div>
                            <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Escrow Status</p>
                                <p className="font-serif italic font-black text-xl text-green-400">SECURE</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto p-8 md:p-12 space-y-8 no-scrollbar bg-cream/10">
                        {messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={`flex flex-col ${msg.sender === 'Vendor' ? 'items-end' : 'items-start'} ${msg.sender === 'System' ? 'items-center' : ''}`}
                            >
                                {msg.sender !== 'System' && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-2 px-4 italic">{msg.sender} • {msg.timestamp}</span>
                                )}
                                <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${msg.sender === 'Vendor'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : msg.sender === 'System'
                                            ? 'bg-cream/50 text-primary/40 border border-primary/5 italic text-[10px] uppercase tracking-widest text-center px-10'
                                            : 'bg-white text-primary rounded-tl-none border border-primary/5'
                                    } ${msg.isBid ? 'border-2 border-secondary bg-secondary/10 text-primary' : ''}`}>
                                    {msg.text}
                                    {msg.isBid && !isAccepted && msg.sender === 'Vendor' && (
                                        <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span>Farmer is reviewing...</span>
                                            <Clock size={12} className="animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />

                        {isAccepted && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-green-500 p-8 rounded-[2.5rem] text-white space-y-4 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px]" />
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 size={32} />
                                    <div>
                                        <h4 className="text-xl font-black font-serif italic uppercase tracking-tight">Trade Finalized!</h4>
                                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Sovereign Smart-Contract Minted</p>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-white text-green-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all">
                                    Proceed to Payout
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Interaction Area */}
                    {!isAccepted && (
                        <div className="p-8 md:p-12 border-t border-primary/5 bg-white space-y-6">
                            {/* Bid Row */}
                            <div className="flex gap-4">
                                <div className="relative flex-grow">
                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" />
                                    <input
                                        value={bidInput}
                                        onChange={(e) => setBidInput(e.target.value)}
                                        placeholder="Enter Bid / Ton"
                                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-cream/20 border-2 border-transparent focus:border-secondary outline-none font-black text-primary text-sm transition-all"
                                    />
                                </div>
                                <button onClick={handlePlaceBid} className="px-10 bg-secondary text-primary rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
                                    Place Bid
                                </button>
                            </div>

                            {/* Chat Row */}
                            <div className="flex gap-4">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Communicate with Node Farmer..."
                                    className="flex-grow px-8 py-5 rounded-2xl bg-cream/20 border border-transparent focus:bg-white focus:border-primary/5 outline-none font-medium text-primary text-sm transition-all"
                                />
                                <button onClick={handleSendMessage} className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-xl">
                                    <Send size={24} />
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-6 text-[8px] font-black uppercase tracking-widest text-primary/20 italic">
                                <div className="flex items-center gap-2"><ShieldCheck size={12} /> Kido Escrow V2.0</div>
                                <div className="flex items-center gap-2"><TrendingUp size={12} /> Optimal Price Engine Active</div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
