"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSession } from "next-auth/react";
import {
    ShieldCheck,
    CreditCard,
    Truck,
    Loader2,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { cart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        street: "",
        city: "",
        phone: ""
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch(getApiUrl("/api/orders"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    totalAmount: cartTotal,
                    street: form.street,
                    city: form.city,
                    state: "Nigeria", // Default
                    zip: "00000",
                    paymentMethod: "card",
                    userId: (session?.user as any)?.id
                })
            });

            const data = await res.json();
            if (res.ok) {
                clearCart();
                router.push("/profile"); // Or a success page
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow py-24 bg-cream/30">
                <div className="container mx-auto px-6">
                    <h1 className="text-5xl font-bold font-serif mb-12">Checkout</h1>

                    {error && (
                        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                            <ShieldCheck size={20} /> {error}
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-20">
                        <div className="space-y-12">
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                                    <h2 className="text-2xl font-bold font-serif">Shipping Details</h2>
                                </div>

                                <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">First Name</label>
                                        <input
                                            type="text" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Last Name</label>
                                        <input
                                            type="text" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Shipping Address</label>
                                        <input
                                            type="text" required value={form.street} onChange={e => setForm({ ...form, street: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">City</label>
                                        <input
                                            type="text" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Phone Number</label>
                                        <input
                                            type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium"
                                        />
                                    </div>
                                </form>
                            </section>

                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                                    <h2 className="text-2xl font-bold font-serif">Payment Method</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex items-center justify-center gap-3 p-6 rounded-3xl border-2 border-secondary bg-white shadow-sm">
                                        <CreditCard className="text-secondary" />
                                        <span className="font-bold">Card</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-3 p-6 rounded-3xl border border-primary/5 bg-white/50 hover:bg-white transition-all">
                                        <Truck className="text-primary/40" />
                                        <span className="font-bold text-primary/70">Transfer</span>
                                    </button>
                                </div>
                            </section>
                        </div>

                        <aside>
                            <div className="glass p-12 rounded-[3rem] border border-primary/5 shadow-2xl space-y-8">
                                <h2 className="text-2xl font-bold font-serif">Order Summary</h2>

                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {cart.length === 0 && <p className="text-sm text-primary/60 italic">Your cart is empty.</p>}
                                </div>

                                <div className="space-y-4 pt-8 border-t border-primary/5">
                                    <div className="flex justify-between font-bold text-2xl">
                                        <span>Total Amount</span>
                                        <span className="text-secondary font-serif">₦{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    form="checkout-form"
                                    type="submit"
                                    disabled={loading || cart.length === 0}
                                    className="w-full bg-primary text-white py-5 rounded-full font-bold hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : "Place Your Order"}
                                </button>

                                <div className="flex justify-center gap-6 pt-4 grayscale opacity-30">
                                    <ShieldCheck size={24} />
                                    <CreditCard size={24} />
                                    <Truck size={24} />
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
