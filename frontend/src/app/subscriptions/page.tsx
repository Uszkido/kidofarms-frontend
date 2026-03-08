"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check, ArrowRight, Loader2, ShieldCheck, Truck } from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function SubscriptionPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [submitting, setSubmitting] = useState(false);
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(getApiUrl("/api/subscribers"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            if (res.ok) setStatus("success");
            else setStatus("error");
        } catch {
            setStatus("error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow py-24">
                <section className="py-24 bg-cream/30">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto space-y-8 mb-20">
                            <span className="bg-secondary text-primary px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest">Subscription Service</span>
                            <h1 className="text-6xl md:text-7xl font-bold font-serif leading-tight">Weekly <span className="text-secondary italic">Farm Basket</span></h1>
                            <p className="text-xl text-primary/70">A curated selection of our freshest harvest delivered to your doorstep every week. Freshness guaranteed.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
                            <div className="relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop"
                                    alt="Farm Basket"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <h3 className="text-4xl font-bold font-serif">What's in the Box?</h3>
                                    <p className="text-primary/60">Our baskets are seasonal, varied, and always premium. Each week you'll receive a mix of:</p>
                                    <ul className="grid grid-cols-1 gap-4">
                                        {[
                                            "3-4 types of seasonal fruits (Mangoes, Apples, Oranges)",
                                            "Fresh leafy greens (Spinach, Kale, Lettuce)",
                                            "Essential vegetables (Tomatoes, Onions, Peppers, Okra)",
                                            "Choice of whole grains or fresh chicken/beef (optional add-on)",
                                            "A surprise artisanal treat from our farm kitchen"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4 items-center font-medium bg-white p-4 rounded-2xl border border-primary/5">
                                                <div className="bg-secondary p-1 rounded-full"><Check size={16} className="text-primary" /></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-primary p-12 rounded-[3rem] text-white space-y-8 shadow-xl relative overflow-hidden">
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <h4 className="text-2xl font-bold font-serif">Monthly Plan</h4>
                                            <p className="text-cream/50 text-sm italic">Save 15% with annual subscription</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-4xl font-bold text-secondary font-serif">₦40,000</p>
                                            <p className="text-xs uppercase tracking-widest text-cream/40">per month</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        <p className="text-cream/60 text-sm leading-relaxed">
                                            Get priority access to the freshest harvests, curated by our master farmers and delivered with zero middlemen.
                                        </p>
                                        <a
                                            href="/subscriptions/checkout"
                                            className="w-full bg-secondary text-primary py-5 rounded-full font-bold text-lg hover:bg-white transition-all shadow-lg flex items-center justify-center gap-3"
                                        >
                                            Start Secure Checkout
                                            <ArrowRight size={22} />
                                        </a>
                                    </div>

                                    <div className="flex justify-between gap-4 pt-4 border-t border-white/10 relative z-10">
                                        <div className="flex gap-2 items-center text-[10px] uppercase font-bold tracking-tighter text-cream/40">
                                            <ShieldCheck size={14} /> Secure Payment
                                        </div>
                                        <div className="flex gap-2 items-center text-[10px] uppercase font-bold tracking-tighter text-cream/40">
                                            <Truck size={14} /> Free Priority Delivery
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
