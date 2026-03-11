"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    ArrowLeft,
    Send,
    Loader2,
    CheckCircle2,
    User,
    Shield,
    MessageSquare,
    Ghost
} from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";

export default function UserTicketDetailPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchTicket = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/tickets/${id}`));
            if (res.ok) {
                const data = await res.json();
                setTicket(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchTicket();
    }, [id, session]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [ticket?.messages]);

    const handleSend = async () => {
        const userId = (session?.user as any)?.id;
        if (!newMessage.trim() || sending || !userId) return;
        setSending(true);
        try {
            const res = await fetch(getApiUrl(`/api/tickets/${id}/reply`), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: userId,
                    message: newMessage
                })
            });
            if (res.ok) {
                setNewMessage("");
                fetchTicket();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-cream/10 flex items-center justify-center">
            <Loader2 className="animate-spin text-secondary opacity-20" size={64} />
        </div>
    );

    if (!ticket) return (
        <div className="min-h-screen bg-cream/10 flex flex-col items-center justify-center text-primary/40 space-y-4">
            <Ghost size={64} />
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Sync Broken</p>
            <Link href="/dashboard/support" className="text-secondary hover:underline uppercase text-[9px] font-black tracking-widest mt-4">Return to Registry</Link>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-cream/10">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col space-y-8">

                        {/* Header */}
                        <header className="flex justify-between items-end shrink-0">
                            <div className="space-y-3">
                                <Link href="/dashboard/support" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-secondary group transition-all">
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to List
                                </Link>
                                <h1 className="text-4xl font-black font-serif italic text-primary uppercase leading-tight">
                                    {ticket.subject}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${ticket.status === 'open' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                                            ticket.status === 'resolved' ? 'bg-green-100 text-green-600 border-green-200' :
                                                'bg-gray-100 text-gray-500 border-gray-200'
                                        }`}>
                                        Status: {ticket.status}
                                    </span>
                                </div>
                            </div>
                        </header>

                        {/* Chat Hub */}
                        <div className="flex-1 flex flex-col bg-white border border-primary/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />

                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth custom-scrollbar">
                                {ticket.messages?.map((msg: any) => {
                                    const isMe = msg.senderId === (session?.user as any)?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2`}>
                                            <div className={`max-w-[75%] space-y-2 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                                <div className="flex items-center gap-3 px-2">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/30">{msg.senderRole === 'admin' ? 'Kido Infrastructure Admin' : 'You'}</span>
                                                </div>
                                                <div className={`p-6 rounded-[2rem] text-[13px] leading-relaxed ${isMe ? 'bg-secondary text-primary font-bold shadow-lg rounded-tr-none' :
                                                        'bg-cream/40 border border-primary/5 text-primary/80 rounded-tl-none'
                                                    }`}>
                                                    {msg.message}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Input */}
                            <div className="p-8 border-t border-primary/5 bg-cream/20">
                                {ticket.status === 'closed' || ticket.status === 'resolved' ? (
                                    <div className="p-4 text-center text-primary/30 text-[9px] font-black uppercase tracking-widest">
                                        This protocol channel is closed.
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        <input
                                            placeholder="Reply to Agent..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            className="w-full bg-white border border-primary/10 rounded-[2rem] pl-8 pr-32 py-5 outline-none focus:border-secondary transition-all font-bold text-sm text-primary ring-0 shadow-inner"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={sending || !newMessage.trim()}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-secondary text-primary px-8 py-3 rounded-full font-black uppercase tracking-widest text-[9px] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
                                        >
                                            {sending ? <Loader2 className="animate-spin" size={14} /> : <> Send <Send size={14} /> </>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-10 opacity-30">
                            <div className="flex items-center gap-2">
                                <Shield size={14} />
                                <span className="text-[8px] font-black uppercase tracking-widest">Secure Transmission Hub</span>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
