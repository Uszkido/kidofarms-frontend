"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { CreditCard, Truck, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
    const { cartTotal } = useCart();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-32 pb-24 bg-cream/30">
                <div className="container mx-auto px-6">
                    <h1 className="text-5xl font-bold font-serif mb-12">Checkout</h1>

                    <div className="grid lg:grid-cols-2 gap-20">
                        <div className="space-y-12">
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                                    <h2 className="text-2xl font-bold font-serif">Shipping Details</h2>
                                </div>

                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">First Name</label>
                                        <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Last Name</label>
                                        <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Shipping Address</label>
                                        <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">City</label>
                                        <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Phone Number</label>
                                        <input type="tel" className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm" />
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
                                    {/* Cart items summary could go here */}
                                    <p className="text-sm text-primary/60 italic">Reviewing your fresh harvest...</p>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-primary/5">
                                    <div className="flex justify-between font-bold text-2xl">
                                        <span>Total Amount</span>
                                        <span className="text-secondary font-serif">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-primary text-white py-5 rounded-full font-bold hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3 text-lg">
                                    Place Your Order
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
