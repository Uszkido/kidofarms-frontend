"use client";

import {
    Wallet,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    DollarSign,
    Search,
    Filter,
    ArrowRight,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function FinancialsPage() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4">
                <div className="space-y-3">
                    <h2 className="text-4xl font-black font-serif text-primary uppercase italic tracking-tighter">Payout <span className="text-secondary tracking-tighter italic underline decoration-secondary/30 decoration-4 underline-offset-8">Registry</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 font-sans">Sovereign Asset Liquidation & Settlement Ledger</p>
                </div>
                <Link href="/dashboard/supplier/cashout" className="bg-primary text-secondary px-10 py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-secondary hover:text-primary transition-all flex items-center gap-3">
                    <Wallet size={18} /> Access Funds Node
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8 px-4">
                <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-2xl group hover:border-secondary transition-all flex flex-col justify-between min-h-[350px]">
                    <div>
                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-10 shadow-lg">
                            <TrendingUp size={32} />
                        </div>
                        <h4 className="text-2xl font-black font-serif uppercase tracking-tighter mb-2 italic">Total Revenue</h4>
                        <p className="text-primary/30 text-[9px] font-black uppercase tracking-[0.3em] mb-10 font-sans">Gross Settlement Index</p>
                    </div>
                    <div className="flex items-end gap-3 text-primary">
                        <span className="text-6xl font-black font-serif italic tracking-tighter leading-none font-sans">₦1.8M</span>
                        <div className="pb-2">
                            <span className="text-green-500 font-black text-xs flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full font-sans shadow-sm">+22%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-2xl group hover:border-secondary transition-all flex flex-col justify-between min-h-[350px]">
                    <div>
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-10 shadow-lg">
                            <Wallet size={32} />
                        </div>
                        <h4 className="text-2xl font-black font-serif uppercase tracking-tighter mb-2 italic">Available Node</h4>
                        <p className="text-primary/30 text-[9px] font-black uppercase tracking-[0.3em] mb-10 font-sans">Ready for Liquidation</p>
                    </div>
                    <div className="flex items-end gap-3 text-primary">
                        <span className="text-6xl font-black font-serif italic tracking-tighter leading-none font-sans">₦420K</span>
                        <div className="pb-2">
                            <span className="text-blue-500 font-black text-[9px] uppercase tracking-widest font-sans">Authorized Batch</span>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary p-12 rounded-[4rem] shadow-2xl text-primary flex flex-col justify-between min-h-[350px] relative overflow-hidden group border border-primary/5">
                    <Sparkles className="absolute -top-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-[3000ms]" />
                    <div>
                        <h4 className="text-3xl font-black font-serif italic uppercase tracking-tighter leading-none">Trust <br />Oracle <span className="text-primary/40 underline decoration-2 decoration-primary/10">Score</span></h4>
                        <p className="text-primary/40 text-[9px] font-black uppercase tracking-[0.3em] mt-4 font-sans italic">Creditworthiness Rating</p>
                    </div>
                    <div className="flex items-end gap-4">
                        <span className="text-7xl font-black font-serif italic tracking-tighter leading-none font-sans">98.4</span>
                        <div className="pb-2">
                            <div className="flex items-center gap-2 bg-primary text-secondary px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest font-sans shadow-xl">
                                <ShieldCheck size={12} /> Elite Tier
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] md:rounded-[4.5rem] p-8 md:p-16 border border-primary/5 shadow-2xl mx-4 space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-primary/5 pb-10">
                    <h3 className="text-2xl font-black font-serif italic uppercase text-primary">Settlement <span className="text-secondary italic underline decoration-2 underline-offset-8">History</span></h3>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:w-64">
                            <input
                                type="text"
                                placeholder="Search Ledger..."
                                className="w-full bg-neutral-50 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary font-black text-[9px] uppercase tracking-widest pl-12 shadow-inner font-sans"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                        </div>
                        <button className="p-4 bg-neutral-50 rounded-2xl border border-primary/5 hover:bg-white transition-all shadow-sm">
                            <Filter size={20} className="text-primary/40" />
                        </button>
                    </div>
                </div>

                <div className="grid gap-6">
                    {[
                        { date: "Oct 28", amount: "₦420,000", status: "Processing", id: "#ST-902-X", type: "Credit" },
                        { date: "Oct 21", amount: "₦185,500", status: "Settled", id: "#ST-884-X", type: "Credit" },
                        { date: "Oct 14", amount: "₦310,000", status: "Settled", id: "#ST-871-X", type: "Credit" },
                        { date: "Oct 07", amount: "₦120,000", status: "Settled", id: "#ST-842-X", type: "Debit" },
                    ].map((pay, i) => (
                        <div key={i} className="flex justify-between items-center bg-neutral-50 p-8 rounded-[3rem] border border-primary/5 group hover:bg-white transition-all shadow-sm hover:shadow-2xl duration-500">
                            <div className="flex items-center gap-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${pay.type === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {pay.type === 'Credit' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-black font-serif italic uppercase text-primary tracking-tighter font-sans">{pay.amount}</p>
                                    <p className="text-[9px] font-black text-primary/20 uppercase tracking-[0.4em] font-sans italic">Registry Node {pay.id}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest font-sans shadow-sm ${pay.status === 'Settled' ? 'bg-green-500 text-white' : 'bg-primary text-white animate-pulse'}`}>
                                    {pay.status === 'Settled' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                    {pay.status}
                                </div>
                                <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.3em] mt-4 font-sans italic">{pay.date}, 2026 • 11:42 AM</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-10 flex justify-center border-t border-primary/5">
                    <button className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/20 hover:text-secondary transition-all flex items-center gap-3 font-sans mt-4 group">
                        Download Complete Financial PDF <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
