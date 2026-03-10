"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, DollarSign, CheckCircle2, TrendingUp, AlertTriangle, User } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminInvestmentsPage() {
    const [investments, setInvestments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInvestments = async () => {
        try {
            const res = await fetch(getApiUrl("/api/investments"));
            if (res.ok) setInvestments(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/investments/${id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchInvestments();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0E1116] text-[#E6EDF3] px-6 py-24">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12">
                    <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-secondary transition-all mb-4">
                        <ArrowLeft size={14} /> Back to Hub
                    </Link>
                    <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter text-white">Agritech <span className="text-secondary italic">Investments</span></h1>
                    <p className="text-white/40 font-medium text-sm mt-2">Oversee capital flows and partnership funding.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-secondary" size={48} />
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {investments.length === 0 ? (
                            <div className="bg-white/5 p-20 rounded-[4rem] border border-white/5 text-center space-y-4 backdrop-blur-md">
                                <DollarSign size={48} className="mx-auto text-white/10" />
                                <h3 className="text-2xl font-black font-serif text-white">No Investments Yet</h3>
                                <p className="text-white/20 font-medium">Opportunities listed on the portal haven't received funding yet.</p>
                            </div>
                        ) : (
                            <div className="bg-white/5 rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-white/20">Investor</th>
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-white/20">Amount</th>
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-white/20">Type</th>
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-white/20">Status</th>
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-white/20 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {investments.map(inv => (
                                            <tr key={inv.id} className="group hover:bg-white/5 transition-all">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-secondary group-hover:text-primary transition-all border border-white/5">
                                                            <User size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-sm text-white">{inv.userName || 'Unknown Investor'}</p>
                                                            <p className="text-[10px] text-white/20 uppercase font-bold">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 font-black text-lg text-white">₦{Number(inv.amount).toLocaleString()}</td>
                                                <td className="px-10 py-8 italic font-medium text-white/40">{inv.type}</td>
                                                <td className="px-10 py-8">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                                        inv.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                                            'bg-red-500/10 text-red-400'
                                                        }`}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8 text-right space-x-2">
                                                    <select
                                                        value={inv.status}
                                                        onChange={(e) => updateStatus(inv.id, e.target.value)}
                                                        className="bg-[#161B22] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:ring-2 focus:ring-secondary/30 transition-all cursor-pointer"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

    );
}
