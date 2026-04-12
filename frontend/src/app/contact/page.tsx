"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, Instagram, Facebook, Twitter, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";

export default function ContactPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: session?.user?.email || "",
        subject: "General Inquiry",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(getApiUrl("/api/tickets"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: (session?.user as any)?.id || null,
                    guestName: `${form.firstName} ${form.lastName}`,
                    guestEmail: form.email,
                    subject: form.subject,
                    message: form.message
                })
            });

            if (res.ok) {
                setSuccess(true);
                setForm({ ...form, message: "" });
            } else {
                setError("Failed to transmit signal to Kido Hub.");
            }
        } catch (err) {
            setError("Neural link failed. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow py-24 bg-cream/30">
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-20">
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <h1 className="text-6xl font-bold font-serif text-primary">Sovereign <span className="text-secondary italic">Support</span></h1>
                                    <p className="text-lg text-primary/70 max-w-md">
                                        Submit a secure ticket to the Kido Hub. Our agronomists and support team are standing by.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary shadow-sm">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary">HQ Location</p>
                                            <p className="text-primary/60">Jos Plateau Tech Cluster, Nigeria</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary shadow-sm">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary">Priority Line</p>
                                            <p className="text-primary/60">+234 800 KIDO FARMS</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 p-8 rounded-3xl bg-primary text-white space-y-4 shadow-xl">
                                    <ShieldCheck className="text-secondary" size={32} />
                                    <h4 className="text-xl font-bold font-serif">Encrypted Transmission</h4>
                                    <p className="text-sm text-cream/60">All support tickets are logged on our sovereign ledger for verified resolution.</p>
                                </div>
                            </div>

                            <div className="relative">
                                {success ? (
                                    <div className="glass p-12 rounded-[3rem] shadow-2xl border border-secondary/20 flex flex-col items-center text-center space-y-6 animate-in zoom-in">
                                        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                                            <Send size={40} />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-bold font-serif">Signal Transmitted</h2>
                                            <p className="text-primary/60">Your ticket has been logged. Check your email for status updates.</p>
                                        </div>
                                        <button onClick={() => setSuccess(false)} className="bg-primary text-white px-8 py-3 rounded-full font-bold">Submit Another</button>
                                    </div>
                                ) : (
                                    <div className="glass p-12 rounded-[3rem] shadow-2xl border border-primary/5">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest bg-red-50 p-3 rounded-xl">{error}</p>}
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">First Name</label>
                                                    <input required type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm" placeholder="John" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">Last Name</label>
                                                    <input required type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm" placeholder="Doe" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">Email Address</label>
                                                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm" placeholder="john@example.com" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">Issue / Subject</label>
                                                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm appearance-none">
                                                    <option>General Inquiry</option>
                                                    <option>Order Tracking</option>
                                                    <option>Payment Issue</option>
                                                    <option>Farm Visit Request</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">Details</label>
                                                <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none h-40 shadow-sm" placeholder="Describe your inquiry..."></textarea>
                                            </div>
                                            <button disabled={loading} className="w-full bg-primary text-white py-5 rounded-full font-bold hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3">
                                                {loading ? <Loader2 size={24} className="animate-spin" /> : <><Send size={20} /> Transmit Message</>}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
