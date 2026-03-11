"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    MessageSquare,
    Clock,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    ShieldAlert,
    Send,
    LifeBuoy
} from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";

export default function UserSupportHistory() {
    const { data: session } = useSession();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        const userId = (session?.user as any)?.id;
        if (!userId) return;

        try {
            const res = await fetch(getApiUrl(`/api/tickets/user/${userId}`));
            const data = await res.json();
            setTickets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchTickets();
    }, [session]);

    return (
        <div className="flex flex-col min-h-screen bg-cream/10">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto space-y-12">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div className="space-y-4">
                                <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-secondary group transition-all">
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                                </Link>
                                <h1 className="text-5xl font-black font-serif italic text-primary uppercase leading-none">Support <br /><span className="text-secondary">Protocols</span></h1>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-primary/5 shadow-xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                                    <LifeBuoy size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 leading-none mb-1">Response Time</p>
                                    <p className="text-sm font-black text-primary">Est. 1-2 Hours</p>
                                </div>
                            </div>
                        </div>

                        {/* Ticket List */}
                        <div className="space-y-6">
                            {loading ? (
                                <div className="p-20 flex flex-col items-center gap-4">
                                    <Loader2 className="animate-spin text-secondary" size={48} />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 italic">Scanning Secure Channels...</p>
                                </div>
                            ) : tickets.length > 0 ? (
                                <div className="grid gap-6">
                                    {tickets.map((ticket: { id: string; subject: string; status: string; updatedAt: string; createdAt: string }) => (
                                        <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`}>
                                            <div className="bg-white border border-primary/5 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${ticket.status === 'open' ? 'bg-amber-100 text-amber-600' :
                                                                ticket.status === 'resolved' ? 'bg-green-100 text-green-600' :
                                                                    'bg-gray-100 text-gray-500'
                                                                }`}>
                                                                {ticket.status}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-primary/20 uppercase tracking-widest">#{ticket.id.substring(0, 8).toUpperCase()}</span>
                                                        </div>
                                                        <h3 className="text-xl font-black font-serif text-primary group-hover:text-secondary transition-colors">{ticket.subject}</h3>
                                                        <p className="text-[10px] text-primary/30 font-bold uppercase tracking-widest italic">
                                                            Last Activity: {new Date(ticket.updatedAt || ticket.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-primary/5 rounded-2xl text-primary/10 group-hover:text-secondary transition-colors">
                                                        <MessageSquare size={24} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white border border-dashed border-primary/10 rounded-[3rem] p-24 text-center space-y-6">
                                    <div className="w-20 h-20 bg-primary/5 rounded-full mx-auto flex items-center justify-center text-primary/10">
                                        <LifeBuoy size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black font-serif text-primary uppercase italic">All Systems Operational</h3>
                                        <p className="text-xs text-primary/30 font-medium max-w-xs mx-auto">No incident reports detected. Your node is in perfect sync with the Kido Network.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
