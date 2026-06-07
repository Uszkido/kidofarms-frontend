"use client";

import { useState } from "react";
import {
    Users,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Sparkles,
    ShieldCheck,
    ChevronRight,
    Share2,
    Trophy,
    Target,
    Leaf
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import { NIGERIAN_STATES } from "@/lib/constants";
import { motion } from "framer-motion";

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
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-xl w-full bg-white rounded-[3rem] p-12 text-center space-y-8 shadow-2xl border border-gray-100"
                >
                    <div className="w-24 h-24 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black font-serif text-primary uppercase italic">Protocol Activated!</h1>
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 leading-relaxed">
                            Your affiliate node has been initiated. Review cycle: 24 hours.
                        </p>
                    </div>
                    <Link href="/" className="inline-flex items-center gap-3 bg-primary text-secondary px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-secondary hover:text-primary transition-all shadow-xl">
                        Return home <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12 md:py-24 px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-5 gap-16 items-start">
                    {/* Left Side: Branding & Info */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="lg:col-span-2 space-y-12"
                    >
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-3 bg-primary/5 px-6 py-3 rounded-full text-primary font-black text-[9px] uppercase tracking-[0.3em]">
                                <Sparkles className="w-4 h-4 text-secondary" /> Partner Network
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black font-serif leading-[0.85] text-primary tracking-tighter uppercase italic">
                                Monetize <br />
                                <span className="text-secondary not-italic">Influence.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium italic max-w-md">
                                West Africa's most elite food network. Earn uncapped commissions on every node referral.
                            </p>
                        </div>

                        <div className="space-y-10">
                            {[
                                { title: "10% Commission", icon: Trophy, desc: "Highest payout in the agricultural tech sector." },
                                { title: "Node Tracking", icon: Share2, desc: "Live dashboard to monitor your referral conversions." },
                                { title: "Elite Assets", icon: Target, desc: "Access to premium media for your community growth." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex gap-6 items-start group"
                                >
                                    <div className="w-14 h-14 shrink-0 rounded-[1.25rem] bg-gray-50 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-primary transition-all duration-500 shadow-sm">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-black text-primary uppercase text-[10px] tracking-widest">{item.title}</h4>
                                        <p className="text-xs text-gray-400 font-medium leading-relaxed italic">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-[0_32px_80px_-16px_rgba(4,13,10,0.1)] border border-gray-100 relative">
                            <form onSubmit={handleSubmit} className="relative space-y-16">
                                <div className="space-y-3">
                                    <h2 className="text-3xl md:text-5xl font-black font-serif uppercase tracking-tighter text-primary italic leading-none">Affiliate Node</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Growth & Referral Identity</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-6 rounded-[1.5rem] border border-red-100 flex items-center gap-4">
                                        <ShieldCheck className="w-6 h-6 rotate-180 shrink-0" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                                    </div>
                                )}

                                <div className="space-y-16">
                                    {/* Section 1: Identity */}
                                    <div className="space-y-10">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {[
                                                { label: "Full Identity", name: "name", type: "text", placeholder: "Legal Name" },
                                                { label: "Registry Email", name: "email", type: "email", placeholder: "nexus@partner.com" },
                                                { label: "Phone Node", name: "phone", type: "tel", placeholder: "+234..." },
                                                { label: "Security Key", name: "password", type: "password", placeholder: "••••••••" }
                                            ].map((field) => (
                                                <div key={field.name} className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">{field.label}</label>
                                                    <input
                                                        type={field.type}
                                                        required
                                                        placeholder={field.placeholder}
                                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all placeholder:text-gray-300"
                                                        value={(formData as any)[field.name]}
                                                        onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Section 2: Channel Intel */}
                                    <div className="space-y-10 pt-16 border-t border-gray-50">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black font-serif uppercase tracking-widest text-primary italic">Channel Intelligence</h3>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Channel Origin</label>
                                                <select
                                                    required
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all cursor-pointer appearance-none"
                                                    value={formData.channelType}
                                                    onChange={e => setFormData({ ...formData, channelType: e.target.value })}
                                                >
                                                    <option value="Social Media">Social Media</option>
                                                    <option value="Blog/Website">Blog / Website</option>
                                                    <option value="Network Marketing">Network Marketing</option>
                                                    <option value="Offline Community">Offline Community</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Channel Handle / URL</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="@handle or website.com"
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all placeholder:text-gray-300"
                                                    value={formData.channelUrl}
                                                    onChange={e => setFormData({ ...formData, channelUrl: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Affiliate Experience</label>
                                                <select
                                                    required
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all cursor-pointer appearance-none"
                                                    value={formData.experience}
                                                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                                >
                                                    <option value="Beginner">Initiate (Beginner)</option>
                                                    <option value="Intermediate">Growth (Intermediate)</option>
                                                    <option value="Expert">Master (Expert)</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Primary Region</label>
                                                <select
                                                    required
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all cursor-pointer appearance-none"
                                                    value={formData.location}
                                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                >
                                                    {NIGERIAN_STATES.map(state => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="group w-full py-8 bg-primary text-secondary rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-secondary hover:text-primary transition-all shadow-2xl relative overflow-hidden disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <span className="relative z-10 flex items-center justify-center gap-4">
                                            {isLoading ? <Loader2 className="animate-spin" /> : <>Activate Partner Node <ChevronRight className="w-5 h-5" /></>}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
