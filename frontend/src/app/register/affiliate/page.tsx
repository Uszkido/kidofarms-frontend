"use client";

import { useState } from "react";
import {
    Users,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Sparkles,
    MapPin,
    ShieldCheck,
    Briefcase,
    ChevronRight,
    Share2,
    Trophy,
    Target
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import { NIGERIAN_STATES } from "@/lib/constants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AffiliateRegistrationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        channelType: "Social Media",
        channelUrl: "",
        experience: "Beginner",
        location: "Lagos",
        bankName: "",
        accountNumber: "",
        accountName: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(getApiUrl("/api/auth/signup/affiliate"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                const data = await res.json();
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 text-center space-y-8 shadow-2xl">
                    <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-secondary animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black font-serif text-primary uppercase italic">Welcome to the Network!</h1>
                        <p className="text-primary/60 font-medium leading-relaxed">
                            Your affiliate protocol has been initiated. Our network agents will review your channel and activate your referral node within 24 hours.
                        </p>
                    </div>
                    <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">
                        Return Home <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <Header />
            <main className="py-24 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto pt-20">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        {/* Left Side: Branding & Value Prop */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest">
                                    <Sparkles size={14} /> Affiliate Partner Node
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black font-serif text-white tracking-tighter leading-none italic uppercase">
                                    Monetize Your <br />
                                    <span className="text-secondary italic">Influence.</span>
                                </h1>
                                <p className="text-xl text-white/40 leading-relaxed font-medium max-w-lg">
                                    Join West Africa's most elite food network. Share premium organic harvests with your audience and earn uncapped commissions on every successful node referral.
                                </p>
                            </div>

                            <div className="grid gap-6">
                                {[
                                    { icon: Trophy, title: "10% Commission", desc: "Highest payout in the agricultural tech sector." },
                                    { icon: Share2, title: "Real-time Tracking", desc: "Live dashboard to monitor your referral conversions." },
                                    { icon: Target, title: "Elite Content", desc: "Access to premium media assets for your promotions." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 items-start p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group">
                                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                            <item.icon size={28} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black font-serif text-white uppercase italic">{item.title}</h4>
                                            <p className="text-white/40 text-sm font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden border-8 border-secondary/20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px]" />

                            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                                <section className="space-y-8">
                                    <h3 className="text-2xl font-black font-serif text-primary uppercase italic border-b border-primary/5 pb-4">Personal Profile</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary"
                                                placeholder="+234..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Account Password</label>
                                            <input
                                                required
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Account Password</label>
                                            <input
                                                required
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Primary Region</label>
                                            <select
                                                required
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary appearance-none"
                                            >
                                                {NIGERIAN_STATES.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-8">
                                    <h3 className="text-2xl font-black font-serif text-primary uppercase italic border-b border-primary/5 pb-4">Channel Intel</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Channel Type</label>
                                            <select
                                                required
                                                value={formData.channelType}
                                                onChange={(e) => setFormData({ ...formData, channelType: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary appearance-none"
                                            >
                                                <option value="Social Media">Social Media</option>
                                                <option value="Blog/Website">Blog/Website</option>
                                                <option value="Network Marketing">Network Marketing</option>
                                                <option value="Offline Community">Offline Community</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Channel Handle/URL</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.channelUrl}
                                                onChange={(e) => setFormData({ ...formData, channelUrl: e.target.value })}
                                                className="w-full bg-cream/10 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold text-primary"
                                                placeholder="@handle or website.com"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {error && (
                                    <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 flex items-center gap-3">
                                        <ShieldCheck size={18} /> {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs hover:bg-secondary hover:text-primary transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <>Activate Partner Node <ChevronRight size={18} /></>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
