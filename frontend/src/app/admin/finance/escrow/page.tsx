"use client";

import { useState } from "react";
import {
    Lock,
    ShieldCheck,
    ArrowLeft,
    Activity,
    DollarSign,
    Scale,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function EscrowNodePage() {
    const [transactions] = useState([
        { id: "TX-9021", partner: "Olam Grains", amount: "₦4,200,000", status: "In Escrow", risk: "Low" },
        { id: "TX-8824", partner: "Bua Foods", amount: "₦12,000,000", status: "Verified", risk: "Neutral" },
        { id: "TX-7710", partner: "Kano Millers", amount: "₦2,100,000", status: "Disputed", risk: "High" },
    ]);

    return (
        <div className="min-h-screen bg-[#040d0a] text-white p-6 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <Link href="/admin/finance" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Finance Node
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black font-serif uppercase tracking-tighter leading-none italic">
                            Escrow <br /><span className="text-secondary">Vault</span>
                        </h1>
                    </div>
                </div>

                {/* Status Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                            <Lock size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Locked Liquidity</p>
                            <h3 className="text-4xl font-black font-serif italic text-white">₦18.4M</h3>
                        </div>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Active Disputes</p>
                            <h3 className="text-4xl font-black font-serif italic text-white">02</h3>
                        </div>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Released (24h)</p>
                            <h3 className="text-4xl font-black font-serif italic text-white">₦5.2M</h3>
                        </div>
                    </div>
                </div>

                {/* Ledger */}
                <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                    <div className="p-10 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-2xl font-black font-serif uppercase italic text-white">Escrow <span className="text-secondary">Ledger</span></h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Contract ID</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Counterparty</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Held Amount</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-10 py-8 text-sm font-bold font-mono text-secondary">{tx.id}</td>
                                        <td className="px-10 py-8 text-sm font-black uppercase">{tx.partner}</td>
                                        <td className="px-10 py-8 text-sm font-black font-serif italic">{tx.amount}</td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 ${tx.status === 'Disputed' ? 'bg-red-500/10 text-red-500' :
                                                    tx.status === 'Verified' ? 'bg-green-500/10 text-green-500' : 'bg-secondary/10 text-secondary'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button className="text-[10px] font-black uppercase text-white/40 hover:text-secondary transition-all">Audit Contract</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
