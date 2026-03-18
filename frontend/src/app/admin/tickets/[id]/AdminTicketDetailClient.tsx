"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Send,
    Loader2,
    CheckCircle2,
    User,
    Shield,
    Clock,
    MessageSquare,
    AlertCircle,
    Database,
    Ghost,
    Trash2
} from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";

export function AdminTicketDetailClient() {
    const { id } = useParams();
    const { data: session } = useSession();
    const router = useRouter();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchTicket = async () => {
        if (!id) return;
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
        fetchTicket();
    }, [id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [ticket?.messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || sending) return;
        const userId = (session?.user as any)?.id;
        if (!userId) return;

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

    const updateStatus = async (status: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/tickets/${id}/status`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchTicket();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#040d0a] flex items-center justify-center">
            <Loader2 className="animate-spin text-secondary opacity-20" size={64} />
        </div>
    );

    if (!ticket) return (
        <div className="min-h-screen bg-[#040d0a] flex flex-col items-center justify-center text-white/40 space-y-4">
            <Ghost size={64} />
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Node Not Found</p>
            <Link href="/admin/tickets" className="text-secondary hover:underline uppercase text-[9px] font-black tracking-widest mt-4">Return to Registry</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-6xl mx-auto h-[85vh] flex flex-col space-y-10">
                <header className="flex justify-between items-end shrink-0">
                    <div className="space-y-4">
                        <Link href="/admin/tickets" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Registry Intercepts
                        </Link>
                        <h1 className="text-5xl font-black font-serif italic text-white uppercase tracking-tighter leading-none">
                            {ticket.subject}
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${ticket.status === 'open' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                ticket.status === 'resolved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    'bg-white/5 text-white/40 border-white/10'
                                }`}>
                                Protocol: {ticket.status}
                            </span>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">#{ticket.id.substring(0, 8).toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {ticket.status !== 'resolved' && (
                            <button
                                onClick={() => updateStatus('resolved')}
                                className="bg-green-500/10 text-green-500 border border-green-500/20 px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-primary transition-all flex items-center gap-3"
                            >
                                <CheckCircle2 size={16} /> Mark Resolved
                            </button>
                        )}
                        <button
                            onClick={() => updateStatus('closed')}
                            className="bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:border-red-500 hover:text-white transition-all flex items-center gap-3"
                        >
                            <Trash2 size={16} /> Close Channel
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-10 scroll-smooth custom-scrollbar">
                        {ticket.messages?.map((msg: any) => {
                            const isMe = msg.senderId === (session?.user as any)?.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-4 duration-500`}>
                                    <div className={`max-w-[70%] space-y-3 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className="flex items-center gap-3 px-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{msg.senderName || 'Unknown Agent'}</span>
                                            <span className="text-[8px] font-bold text-white/10">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className={`p-8 rounded-[2.5rem] text-sm leading-relaxed ${isMe ? 'bg-secondary text-primary font-bold shadow-[0_20px_40px_rgba(197,160,89,0.1)] rounded-tr-none' :
                                            'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'
                                            }`}>
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="p-8 border-t border-white/10 bg-black/20">
                        {ticket.status === 'closed' || ticket.status === 'resolved' ? (
                            <div className="p-6 text-center text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                                This communication channel has been decommissioned by Administrative Order.
                            </div>
                        ) : (
                            <div className="relative group">
                                <input
                                    placeholder="Transmit response to Citizen..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] pl-10 pr-40 py-8 outline-none focus:border-secondary transition-all font-bold text-sm text-white/80 ring-0"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={sending || !newMessage.trim()}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-secondary text-primary px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl disabled:opacity-50 disabled:grayscale"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={16} /> : <> Send Protocol <Send size={16} /> </>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-10 shrink-0">
                    <div className="flex items-center gap-3 text-white/10">
                        <Shield size={16} />
                        <span className="text-[9px] font-black uppercase tracking-[0.5em]">End-to-End Encryption Active</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/10">
                        <Database size={16} />
                        <span className="text-[9px] font-black uppercase tracking-[0.5em]">Ledger Logged: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
