"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    MapPin,
    CreditCard,
    User,
    Calendar,
    ChevronRight,
    Loader2,
    ShieldCheck
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function OrderDetailsPage({ params }: any) {
    const { id } = use(params) as any;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Fetch specific order details
                const res = await fetch(getApiUrl(`/api/orders/${id}`));
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-secondary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-6">
                <h1 className="text-3xl font-black font-serif">Order Not Found</h1>
                <Link href="/admin/orders" className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">
                    Back to Pipeline
                </Link>
            </div>
        );
    }

    const statusSteps = [
        { label: "Processing", icon: Clock, status: "processing" },
        { label: "Shipped", icon: Truck, status: "shipped" },
        { label: "Delivered", icon: CheckCircle2, status: "delivered" }
    ];

    const currentStepIndex = statusSteps.findIndex(s => s.status === order.orderStatus);

    return (
        <div className="min-h-screen bg-[#0E1116] text-[#E6EDF3] pb-24">
            <header className="bg-[#0E1116]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 py-6 px-6 shadow-2xl">
                <div className="container mx-auto max-w-7xl flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/orders" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:text-secondary hover:bg-white/10 transition-all border border-white/5">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Order Details</p>
                            <h1 className="text-2xl font-black font-serif uppercase tracking-tight text-white">#{order.id.substring(0, 8).toUpperCase()}</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-7xl px-6 pt-12 space-y-10">
                {/* 1. Track Progress */}
                <section className="bg-white/5 p-10 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl backdrop-blur-md">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 hidden md:block" />
                        {statusSteps.map((step, i) => {
                            const isPast = i <= currentStepIndex;
                            const isCurrent = i === currentStepIndex;

                            return (
                                <div key={i} className="relative z-10 flex flex-col items-center gap-4 bg-[#0E1116] md:bg-transparent px-8">
                                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all border-2 ${isPast ? 'bg-secondary text-primary border-secondary shadow-xl shadow-secondary/10' : 'bg-white/5 text-white/10 border-white/10'}`}>
                                        <step.icon size={32} />
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${isPast ? 'text-secondary' : 'text-white/20'}`}>{step.label}</p>
                                        <p className="text-[8px] font-bold text-white/40 mt-1">{isPast ? "COMPLETED" : "PENDING"}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Left: Items & Payment */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-md space-y-10">
                            <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-white">Cart <span className="text-secondary italic">Breakdown</span></h2>
                            <div className="space-y-6">
                                {order.items?.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center group bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-secondary/20 transition-all">
                                        <div className="flex gap-6 items-center">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5">
                                                {item.product?.images?.[0] ? (
                                                    <img src={item.product.images[0]} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package size={24} className="text-white/10" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg text-white group-hover:text-secondary transition-colors">{item.product?.name || "Item Listing"}</h4>
                                                <p className="text-xs font-bold text-white/20">Qty: {item.quantity} &bull; ₦{Number(item.price).toLocaleString()} per unit</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-xl font-serif text-white">₦{(item.quantity * Number(item.price)).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-10 border-t border-white/5 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Payment Method</p>
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
                                        <CreditCard size={16} className="text-secondary" />
                                        <span className="text-xs font-black uppercase tracking-widest text-white/60">{order.paymentMethod}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Grand Total</p>
                                    <p className="text-4xl font-black font-serif text-secondary">₦{Number(order.totalAmount).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Protection Badge */}
                        <div className="bg-secondary p-12 rounded-[3.5rem] text-primary flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-2xl shadow-secondary/10">
                            <ShieldCheck size={120} className="absolute -bottom-10 -right-10 text-primary/5 rotate-12" />
                            <div className="w-20 h-20 bg-primary rounded-[1.5rem] flex items-center justify-center text-secondary shadow-2xl shrink-0">
                                <ShieldCheck size={40} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black font-serif mb-2">Escrow Protected Shipment</h3>
                                <p className="text-primary/60 text-sm font-medium leading-relaxed max-w-lg">Funds for this order are held in Kido Escrow. They will only be released to the vendor upon customer confirmation or successful tracking verification.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Logistics & Customer */}
                    <div className="space-y-10">
                        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-md space-y-8">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 border-b border-white/5 pb-4">Customer Segment</h3>
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                                    <User size={28} />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-lg text-white">{order.user?.name || "Kido Explorer"}</p>
                                    <p className="text-xs font-bold text-secondary">Verified Member</p>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-4 text-xs font-medium text-white/40">
                                    <Calendar size={16} className="text-white/10" />
                                    Joined {new Date(order.user?.createdAt || Date.now()).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-white/40">
                                    <Package size={16} className="text-white/10" />
                                    12 Total Orders
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-md space-y-8">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 border-b border-white/5 pb-4">Logistics Node</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Ship to Address</p>
                                    <div className="bg-white/5 p-6 rounded-2xl space-y-1 border border-white/5">
                                        <p className="font-bold text-sm text-white">{order.street || "Main Street Branch"}</p>
                                        <p className="text-xs text-white/40 font-medium">{order.city}, {order.state} {order.zip}</p>
                                        <div className="flex items-center gap-2 mt-4 text-secondary font-black text-[10px] uppercase tracking-widest">
                                            <MapPin size={12} /> View on Radar
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full bg-secondary text-primary py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-secondary/10">
                                    Print Packing Slip
                                </button>
                                <button className="w-full bg-white/5 border border-white/10 text-white/60 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                                    Flag for Review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
}
