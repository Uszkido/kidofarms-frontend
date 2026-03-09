"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Package, Truck, Clock, Heart, Search, Filter, ArrowRight, CreditCard, ShieldCheck, Plus, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function ConsumerDashboard() {
    const { data: session } = useSession();
    const [cards, setCards] = useState<any[]>([]);
    const [loadingCards, setLoadingCards] = useState(true);
    const [trackingId, setTrackingId] = useState("");
    const [trackingResult, setTrackingResult] = useState<any>(null);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);

    useEffect(() => {
        if ((session?.user as any)?.id) {
            fetchCards();
        }
    }, [(session?.user as any)?.id]);

    const fetchCards = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/cards?userId=${(session?.user as any)?.id}`));
            const data = await res.json();
            if (Array.isArray(data)) setCards(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCards(false);
        }
    };

    const handleTrack = async () => {
        if (!trackingId) return;
        setTrackingLoading(true);
        // Simulate tracking fetch
        setTimeout(() => {
            setTrackingResult({
                id: trackingId,
                status: "In Transit",
                location: "Kano Dispatch Hub",
                oxygen: "98%",
                temp: "18°C",
                eta: "Tomorrow, 2:00 PM"
            });
            setTrackingLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-32 pb-24 bg-cream/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">
                        {/* Welcome Header & Hero */}
                        <div className="relative h-[300px] md:h-[400px] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl group mb-12">
                            <img
                                src="https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=1470&auto=format&fit=crop"
                                alt="Organic Harvest"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5000ms]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                            <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
                                <div className="space-y-3 md:space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-secondary text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        <Heart className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" strokeWidth={3} />
                                        Farm-to-Table Fresh
                                    </div>
                                    <h1 className="text-3xl md:text-6xl font-black font-serif text-white leading-tight">Hello, <br /><span className="text-secondary italic">Shopper</span></h1>
                                </div>
                                <Link href="/shop" className="bg-white text-primary px-6 md:px-10 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-secondary hover:text-primary transition-all shadow-2xl flex items-center justify-center gap-3 w-full md:w-auto">
                                    Browse Today's Harvest <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Orders", value: "12", icon: Package, color: "bg-blue-50 text-blue-600" },
                                { label: "In Transit", value: "2", icon: Truck, color: "bg-green-50 text-green-600" },
                                { label: "Hours Saved", value: "48h", icon: Clock, color: "bg-secondary/20 text-secondary" },
                                { label: "Saved Items", value: "24", icon: Heart, color: "bg-red-50 text-red-600" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 group hover:shadow-xl transition-all">
                                    <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif">{stat.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Orders Section */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black font-serif">Recent <span className="text-secondary italic">Orders</span></h2>
                                <button className="text-sm font-black text-primary/40 hover:text-secondary underline underline-offset-8">View All History</button>
                            </div>

                            <div className="bg-white rounded-[3rem] border border-primary/5 shadow-xl overflow-hidden">
                                <div className="p-8 border-b border-primary/5 bg-cream/20 flex justify-between items-center">
                                    <div className="flex gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Order Number</p>
                                            <p className="font-bold text-sm">#KD-9028-X</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Date Placed</p>
                                            <p className="font-bold text-sm">Oct 24, 2026</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Delivered</span>
                                </div>
                                <div className="p-10 space-y-8">
                                    {[
                                        { name: "Organic Strawberries", qty: "2kg", price: "₦24,000", description: "Freshly picked from Jos highlands." },
                                        { name: "Bulk Maize (50kg)", qty: "1 Bag", price: "₦15,000", description: "High-grade dry maize for processing." },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center group">
                                            <div className="flex gap-6 items-center">
                                                <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center font-black text-primary/20">📦</div>
                                                <div>
                                                    <h4 className="font-bold text-lg group-hover:text-secondary transition-colors">{item.name}</h4>
                                                    <p className="text-xs text-primary/40 font-medium line-clamp-2 mt-2">{item.description}</p>
                                                </div>
                                            </div>
                                            <span className="font-black text-lg">{item.price}</span>
                                        </div>
                                    ))}
                                    <div className="pt-8 border-t border-primary/5 flex justify-between items-center">
                                        <button className="text-primary font-black text-sm flex items-center gap-2 hover:text-secondary">
                                            Track Shipment <ArrowRight size={16} />
                                        </button>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Total Paid</p>
                                            <p className="text-2xl font-black font-serif">₦39,000</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Tracking Mini-Widget */}
                        <div className="bg-primary rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-full h-full opacity-10">
                                <Search className="w-80 h-80 absolute -top-20 -right-20 rotate-12" />
                            </div>
                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h2 className="text-4xl font-black font-serif leading-tight">Where's my <br /><span className="text-secondary italic">Harvest?</span></h2>
                                    <p className="text-cream/40 font-medium">Enter your tracking ID to see real-time oxygen levels and transit status of your perishables.</p>
                                    <div className="flex gap-2 p-2 bg-white/10 rounded-2xl border border-white/10">
                                        <input
                                            className="bg-transparent border-none outline-none flex-grow px-4 py-2 text-white placeholder:text-white/20 font-mono"
                                            placeholder="KD-XXXX-XXXX"
                                            value={trackingId}
                                            onChange={(e) => setTrackingId(e.target.value)}
                                        />
                                        <button
                                            onClick={handleTrack}
                                            disabled={trackingLoading}
                                            className="bg-secondary text-primary px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
                                        >
                                            {trackingLoading ? <Loader2 size={16} className="animate-spin" /> : "Track"}
                                        </button>
                                    </div>

                                    {trackingResult && (
                                        <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10 space-y-4 animate-in fade-in slide-in-from-top-4">
                                            <div className="flex justify-between items-center group">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black uppercase text-white/40">Real-time Location</p>
                                                    <p className="text-sm font-bold text-secondary">{trackingResult.location}</p>
                                                </div>
                                                <X
                                                    size={16}
                                                    className="cursor-pointer text-white/20 hover:text-white"
                                                    onClick={() => setTrackingResult(null)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                                                <div>
                                                    <p className="text-[8px] font-black uppercase text-white/40 mb-1">Status</p>
                                                    <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-black">{trackingResult.status}</span>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black uppercase text-white/40 mb-1">Oxygen Level</p>
                                                    <p className="text-sm font-bold text-secondary">{trackingResult.oxygen}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="hidden md:block">
                                    <div className="space-y-4 py-6 border-l-2 border-secondary/20 pl-10">
                                        {[
                                            { label: "Shipment Picked Up", time: "08:30 AM", active: false },
                                            { label: "Out for Delivery", time: "10:15 AM", active: true },
                                            { label: "Delivered", time: "Pending", active: false },
                                        ].map((step, i) => (
                                            <div key={i} className={`flex items-start gap-4 ${step.active ? "opacity-100" : "opacity-30"}`}>
                                                <div className={`w-3 h-3 rounded-full mt-1 ${step.active ? "bg-secondary" : "bg-white"}`} />
                                                <div>
                                                    <p className="text-sm font-black uppercase tracking-widest">{step.label}</p>
                                                    <p className="text-[10px] font-medium">{step.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods Section */}
                        <div className="space-y-6 pt-12 border-t border-primary/5">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black font-serif">Saved <span className="text-secondary italic">Cards</span></h2>
                                <button
                                    onClick={() => setIsAddCardOpen(true)}
                                    className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-lg flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add New Card
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {loadingCards ? (
                                    <div className="col-span-full py-20 flex justify-center"><Loader2 size={32} className="animate-spin text-secondary" /></div>
                                ) : cards.map((card) => (
                                    <div key={card.id} className="relative h-60 rounded-[3rem] bg-gradient-to-br from-gray-900 to-black p-10 text-white shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Card Brand</p>
                                                    <p className="text-xl font-black italic tracking-tighter uppercase">{card.cardBrand}</p>
                                                </div>
                                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/5">
                                                    <CreditCard className="text-secondary" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-mono tracking-[0.2em] mb-4">•••• •••• •••• {card.last4}</p>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Card Holder</p>
                                                        <p className="text-sm font-bold truncate max-w-[150px]">{session?.user?.name || "Kido Explorer"}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Expires</p>
                                                        <p className="text-sm font-bold">{card.expiry}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-2 bg-secondary" />
                                    </div>
                                ))}

                                {cards.length === 0 && !loadingCards && (
                                    <div className="relative h-60 rounded-[3rem] bg-secondary/5 border-2 border-dashed border-primary/10 p-10 flex flex-col items-center justify-center text-center space-y-3">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary/20 shadow-inner">
                                            <CreditCard size={20} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">No saved cards found</p>
                                    </div>
                                )}

                                {/* Save Card CTA */}
                                <div className="h-60 rounded-[3rem] border-4 border-dashed border-primary/10 bg-cream/10 flex flex-col items-center justify-center p-10 gap-4 group hover:border-secondary transition-all cursor-pointer hover:bg-secondary/5">
                                    <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center text-primary/10 group-hover:bg-secondary group-hover:text-primary group-hover:scale-110 transition-all shadow-inner">
                                        <Plus className="w-10 h-10" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-sm uppercase tracking-widest">Save Tag-ID Card</p>
                                        <p className="text-[10px] text-primary/30 font-bold">Instantly pay with physical ID</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {isAddCardOpen && (
                <AddCardModal
                    onClose={() => setIsAddCardOpen(false)}
                    onSuccess={() => {
                        fetchCards();
                        setIsAddCardOpen(false);
                    }}
                    userId={(session?.user as any)?.id}
                />
            )}
        </div>
    );
}

function AddCardModal({ onClose, onSuccess, userId }: any) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cardBrand: "Visa",
        last4: "",
        expiry: "",
        userId: userId
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/cards"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) onSuccess();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-8 right-8 text-primary/20 hover:text-primary transition-colors">
                    <X size={24} />
                </button>
                <div className="mb-8">
                    <h3 className="text-3xl font-black font-serif uppercase tracking-tight">Add <span className="text-secondary italic">Card</span></h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-2">Securely save your payment method.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Card Brand</label>
                        <select
                            className="w-full bg-neutral-50 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:ring-2 focus:ring-secondary/30"
                            value={formData.cardBrand}
                            onChange={(e) => setFormData({ ...formData, cardBrand: e.target.value })}
                        >
                            <option>Visa</option>
                            <option>Mastercard</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Last 4 Digits</label>
                        <input
                            required
                            maxLength={4}
                            className="w-full bg-neutral-50 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:ring-2 focus:ring-secondary/30"
                            placeholder="4242"
                            value={formData.last4}
                            onChange={(e) => setFormData({ ...formData, last4: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Expiry (MM/YY)</label>
                        <input
                            required
                            placeholder="12/28"
                            className="w-full bg-neutral-50 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:ring-2 focus:ring-secondary/30"
                            value={formData.expiry}
                            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Save Card Node"}
                    </button>
                </form>
            </div>
        </div>
    );
}


