"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Check,
    X,
    Search,
    ArrowLeft,
    Loader2,
    Mail,
    Clock,
    CircleDashed,
    ShieldCheck
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function SubscriberManagementPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSubscribers = async () => {
        try {
            const res = await fetch(getApiUrl("/api/subscribers"));
            const data = await res.json();
            setSubscribers(data);
        } catch (error) {
            console.error("Failed to fetch");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/subscribers/${id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchSubscribers();
        } catch (error) {
            alert("Update failed");
        }
    };

    const deleteSubscriber = async (id: string) => {
        if (!confirm("Remove this subscriber?")) return;
        try {
            await fetch(getApiUrl(`/api/subscribers/${id}`), { method: "DELETE" });
            fetchSubscribers();
        } catch (error) {
            alert("Delete failed");
        }
    };

    const filtered = subscribers.filter(s => s.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50">
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-4">
                                <ArrowLeft size={14} /> Back to Hub
                            </Link>
                            <h1 className="text-4xl font-black font-serif uppercase tracking-tighter">Basket <span className="text-secondary italic">Subscribers</span></h1>
                            <p className="text-primary/40 font-medium text-sm mt-2">Approve and manage recurring farm basket memberships.</p>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-primary/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-[4rem] border border-primary/5 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50/50 border-b border-primary/5">
                                <tr>
                                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-primary/40">Subscriber Info</th>
                                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-primary/40">Plan</th>
                                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-primary/40">Status</th>
                                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-primary/40 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {loading ? (
                                    <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin text-secondary mx-auto" size={40} /></td></tr>
                                ) : filtered.map(sub => (
                                    <tr key={sub.id} className="hover:bg-neutral-50/30 transition-colors group text-sm">
                                        <td className="py-6 px-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                                                    <Mail size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-primary">{sub.email}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-0.5">Joined {new Date(sub.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-10">
                                            <span className="font-bold text-primary/70">{sub.plan}</span>
                                        </td>
                                        <td className="py-6 px-10">
                                            <div className="flex items-center gap-2">
                                                {sub.status === 'pending' ? (
                                                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                                                        <CircleDashed size={12} className="animate-spin" /> Pending Approval
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest">
                                                        <ShieldCheck size={12} /> Active Member
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-6 px-10 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {sub.status === 'pending' && (
                                                    <button
                                                        onClick={() => updateStatus(sub.id, 'active')}
                                                        className="p-3 bg-secondary text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg shadow-secondary/20"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <button onClick={() => deleteSubscriber(sub.id)} className="p-3 text-primary/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

function Trash2(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>;
}
