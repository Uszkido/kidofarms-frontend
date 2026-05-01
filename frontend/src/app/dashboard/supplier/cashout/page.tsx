"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Wallet, Loader2, CheckCircle2, AlertCircle, Banknote, Building2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function VendorCashoutPage() {
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState("");
    const [bankDetails, setBankDetails] = useState({
        bankName: "",
        accountNumber: "",
        accountName: ""
    });
    const [status, setStatus] = useState({ type: "", message: "" });
    const [processing, setProcessing] = useState(false);

    const { data: session } = useSession();
    const userId = (session?.user as any)?.id || "";

    useEffect(() => {
        if (!userId) return;
        fetch(getApiUrl(`/api/wallet?userId=${userId}`))
            .then(res => res.json())
            .then(data => {
                setWallet(data.wallet);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [userId]);

    const handleCashout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) return;

        setProcessing(true);
        setStatus({ type: "", message: "" });

        try {
            const res = await fetch(getApiUrl("/api/wallet/cashout"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    amount,
                    bankDetails
                })
            });

            const data = await res.json();
            if (res.ok) {
                setStatus({ type: "success", message: `₦${Number(amount).toLocaleString()} cashed out successfully!` });
                setWallet({ ...wallet, balance: data.newBalance });
                setAmount("");
            } else {
                setStatus({ type: "error", message: data.error || "Cashout failed" });
            }
        } catch (err) {
            setStatus({ type: "error", message: "Network error occurred." });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="animate-spin text-secondary" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-50 px-6 py-24">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-12">
                    <Link href="/dashboard/supplier" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all mb-4">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                    <h1 className="text-5xl font-extrabold font-serif uppercase tracking-tighter text-primary">Cash <span className="text-secondary italic">Out</span></h1>
                    <p className="text-primary/40 font-medium text-sm mt-2">Withdraw your earnings to your registered bank account.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="md:col-span-1 bg-primary text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Wallet size={80} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Available Balance</p>
                        <h2 className="text-4xl font-black font-serif text-secondary">₦{Number(wallet?.balance || 0).toLocaleString()}</h2>
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-[9px] font-bold text-white/30 uppercase">Settlement Node: Active</p>
                        </div>
                    </div>

                    <form onSubmit={handleCashout} className="md:col-span-2 bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-sm space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Amount to Withdraw (₦)</label>
                                <div className="relative">
                                    <Banknote className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={20} />
                                    <input
                                        type="number"
                                        required
                                        max={wallet?.balance}
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-neutral-50 border border-primary/10 rounded-2xl pl-16 pr-6 py-5 text-2xl font-black font-serif outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Bank Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={bankDetails.bankName}
                                            onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                            placeholder="e.g. Zenith Bank"
                                            className="w-full bg-neutral-50 border border-primary/10 rounded-2xl pl-16 pr-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-secondary/30"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Account Number</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={bankDetails.accountNumber}
                                            onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                            placeholder="10-digit number"
                                            className="w-full bg-neutral-50 border border-primary/10 rounded-2xl pl-16 pr-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-secondary/30"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {status.message && (
                            <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing || !amount || Number(amount) <= 0}
                            className="w-full bg-primary text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {processing ? <Loader2 className="animate-spin" size={20} /> : <Banknote size={20} />}
                            {processing ? "Processing..." : "Confirm Withdrawal"}
                        </button>
                    </form>
                </div>

                <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5">
                    <h3 className="text-xl font-black font-serif mb-8 flex items-center gap-3">
                        <Loader2 size={24} className="text-secondary" /> Withdrawal Logic
                    </h3>
                    <div className="space-y-6">
                        {[
                            { step: "01", title: "Internal Validation", desc: "The system verifies your transaction volume vs requested amount." },
                            { step: "02", title: "Escrow Release", desc: "Funds locked in successful deliveries are moved to your payout block." },
                            { step: "03", title: "Bank Dispatch", desc: "Our payment processor triggers an NIP transfer to your bank." }
                        ].map((step, i) => (
                            <div key={i} className="flex gap-6">
                                <span className="text-2xl font-black font-serif text-primary/10 italic leading-none">{step.step}</span>
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-tight">{step.title}</h4>
                                    <p className="text-primary/40 text-[10px] font-medium mt-1 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
