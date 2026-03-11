"use client";

import { useState } from "react";
import { ArrowLeft, Zap, Loader2, Calendar, Percent, Tag, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";

export default function NewPromotionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        type: "percentage",
        expiresAt: "",
        usageLimit: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/promotions"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Promotion node deployed across the network.");
                router.push("/admin/promotions");
            } else {
                const error = await res.json();
                alert(error.error || "Failed to deploy promotion.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10">
            <div className="max-w-3xl mx-auto space-y-12">
                <Link href="/admin/promotions" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-secondary transition-all">
                    <ArrowLeft size={14} /> Back to Nexus
                </Link>

                <div className="space-y-4">
                    <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-2xl">
                        <Zap size={32} />
                    </div>
                    <h1 className="text-5xl font-black font-serif uppercase tracking-tighter text-white italic">
                        Deploy <span className="text-secondary">Network Promo</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-10 rounded-[4rem] backdrop-blur-3xl space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />

                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 ml-4"><Tag size={12} /> Promo Code</label>
                            <input
                                required
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="KIDO-SOVEREIGN"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all font-mono"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 ml-4"><Percent size={12} /> Yield Discount</label>
                            <input
                                required
                                type="number"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                placeholder="15"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 ml-4"><Calendar size={12} /> Expiry Protocol</label>
                            <input
                                required
                                type="date"
                                value={formData.expiresAt}
                                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all appearance-none"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 ml-4"><Zap size={12} /> Usage Limit</label>
                            <input
                                type="number"
                                value={formData.usageLimit}
                                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                placeholder="Unlimited"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-secondary text-primary py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 mt-8 relative z-10"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <> <Shield size={20} /> Authorize Network Boost </>}
                    </button>
                </form>
            </div>
        </div>
    );
}
