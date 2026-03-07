"use client";

import { useState, useEffect } from "react";
import { Ticket, Percent, Plus, XCircle, ArrowLeft, Loader2, Tag } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function PromotionsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "0",
        usageLimit: "100"
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch(getApiUrl("/api/promotions"));
            const data = await res.json();
            setCoupons(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(getApiUrl("/api/promotions"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCoupon)
            });
            if (res.ok) {
                setIsAdding(false);
                fetchCoupons();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deactivateCoupon = async (id: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/promotions/${id}/deactivate`), { method: "PATCH" });
            if (res.ok) fetchCoupons();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-cream/30 p-6 lg:p-12">
            <div className="max-w-[1000px] mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-neutral-50 transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black font-serif text-primary">Marketing <span className="text-green-500 italic">Vault</span></h1>
                            <p className="text-sm font-medium text-primary/40">Coupons, discounts, and flash sale control</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-primary text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-secondary hover:text-primary transition-all shadow-xl"
                    >
                        <Plus size={16} /> New Coupon
                    </button>
                </header>

                {isAdding && (
                    <div className="bg-white p-8 rounded-[3rem] border-2 border-green-500/20 shadow-2xl space-y-6">
                        <h3 className="text-xl font-black font-serif text-primary">Forge New <span className="text-green-500 italic">Discount Code</span></h3>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/30">Coupon Code</label>
                                <input
                                    required
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g. HARVEST20"
                                    className="w-full bg-neutral-50 border border-primary/5 p-4 rounded-xl font-bold uppercase"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/30">Type</label>
                                <select
                                    value={newCoupon.discountType}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                    className="w-full bg-neutral-50 border border-primary/5 p-4 rounded-xl font-bold"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₦)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/30">Value</label>
                                <input
                                    required
                                    type="number"
                                    value={newCoupon.discountValue}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                                    placeholder="20"
                                    className="w-full bg-neutral-50 border border-primary/5 p-4 rounded-xl font-bold"
                                />
                            </div>
                            <div className="flex items-end gap-3">
                                <button type="submit" className="flex-grow bg-green-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest">Create Vault Entry</button>
                                <button type="button" onClick={() => setIsAdding(false)} className="bg-neutral-100 text-primary/40 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-green-500" size={40} />
                        </div>
                    ) : (
                        coupons.map((coupon) => (
                            <div key={coupon.id} className={`bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm flex items-center justify-between group transition-all ${!coupon.isActive && 'opacity-50'}`}>
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${coupon.isActive ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-400'}`}>
                                        <Ticket size={28} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Active Coupon</span>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black font-serif text-primary uppercase">{coupon.code}</h3>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-md text-[8px] font-black uppercase">
                                                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₦${Number(coupon.discountValue).toLocaleString()} OFF`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Usage</p>
                                        <p className="font-bold text-sm">{coupon.usedCount} / <span className="text-primary/40 font-medium">{coupon.usageLimit || '∞'}</span></p>
                                    </div>
                                    {coupon.isActive && (
                                        <button
                                            onClick={() => deactivateCoupon(coupon.id)}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    {!loading && coupons.length === 0 && (
                        <div className="bg-white p-20 rounded-[3rem] border border-dashed border-primary/10 text-center space-y-4">
                            <Tag className="mx-auto text-primary/10" size={48} />
                            <p className="text-primary/20 font-black uppercase tracking-widest">No active campaigns</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
