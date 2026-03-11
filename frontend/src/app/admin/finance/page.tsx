"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft,
    CreditCard,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Loader2,
    ShieldCheck,
    Activity,
    Zap,
    Scale,
    Send
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function FinanceNode() {
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [formData, setFormData] = useState({
        userId: "",
        amount: "",
        reason: ""
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(getApiUrl("/api/admin/stats"));
            if (res.ok) setStats(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreditInjection = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/finance/credit"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Financial injection successful.");
                setFormData({ userId: "", amount: "", reason: "" });
            } else {
                const error = await res.json();
                alert(error.error || "Injection failed.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-16">
                <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                    <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Command Center
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-1 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-secondary">Central Finance Node</h2>
                        </div>
                        <h1 className="text-7xl font-black font-serif uppercase tracking-tighter text-white italic">
                            Liquidity <span className="text-secondary italic">& Oversight</span>
                        </h1>
                    </div>
                </div>

                {/* 📊 BUDGET VITALITY */}
                <div className="grid md:grid-cols-3 gap-8">
                    <FinanceMetric label="Total Revenue" value={`₦${(stats?.revenue || 0).toLocaleString()}`} icon={<DollarSign size={24} />} color="text-green-400" />
                    <FinanceMetric label="Projected Yield" value="₦482M" icon={<TrendingUp size={24} />} color="text-secondary" />
                    <FinanceMetric label="Infrastructure Cost" value="₦42M" icon={<Activity size={24} />} color="text-blue-400" />
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* 💰 CREDIT INJECTION PORTAL */}
                    <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black font-serif italic text-white mb-2 uppercase">Financial <span className="text-secondary">Injection</span></h3>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Manually credit a citizen's account or B2B loan facility.</p>
                        </div>

                        <form onSubmit={handleCreditInjection} className="relative z-10 space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <FormInput label="Recipient ID / Email" value={formData.userId} onChange={(val: string) => setFormData({ ...formData, userId: val })} placeholder="aminu@kido.com" />
                                <FormInput label="Amount (NGN)" type="number" value={formData.amount} onChange={(val: string) => setFormData({ ...formData, amount: val })} placeholder="500,000" />
                            </div>
                            <FormInput label="Auth Reason / Description" value={formData.reason} onChange={(val: string) => setFormData({ ...formData, reason: val })} placeholder="Bulk Wheat Pre-financing" />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-secondary text-primary py-6 rounded-3xl font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 mt-8"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <> <Zap size={20} /> Authorize Injection </>}
                            </button>
                        </form>
                    </div>

                    {/* 🛡️ GOVERNANCE PANEL */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-secondary rounded-[3rem] p-10 text-primary shadow-2xl relative overflow-hidden group">
                            <Scale className="absolute -bottom-10 -right-10 text-primary/10 w-48 h-48 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-3xl font-black font-serif leading-none italic uppercase">Audit Protocol</h3>
                                <p className="text-primary/60 text-[10px] font-black uppercase leading-relaxed tracking-widest">Supreme Admin has full rights to reverse transactions or freeze wallets under Governance Act 4.0.</p>
                                <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl">Full Ledger Audit</button>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Network Vitals</h4>
                            <div className="space-y-4">
                                <NetworkRow label="Wallet Nodes" value="4,208" />
                                <NetworkRow label="B2B Float" value="₦58.2M" />
                                <NetworkRow label="Security Payouts" value="₦2.4M" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FinanceMetric({ label, value, icon, color }: any) {
    return (
        <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] space-y-4 shadow-xl hover:border-secondary transition-all cursor-crosshair group">
            <div className={`p-4 rounded-2xl bg-white/5 w-14 h-14 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{label}</p>
                <h3 className="text-4xl font-black font-serif text-white">{value}</h3>
            </div>
        </div>
    );
}

interface FormInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    type?: string;
    placeholder?: string;
}

function FormInput({ label, value, onChange, type = "text", placeholder }: FormInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:border-secondary transition-all"
            />
        </div>
    );
}

function NetworkRow({ label, value }: any) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-black text-white">{value}</span>
        </div>
    );
}
