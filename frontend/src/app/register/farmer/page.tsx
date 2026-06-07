"use client";

import { useState } from "react";
import {
    Users,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Leaf,
    ShieldCheck,
    Tractor,
    ChevronRight,
    BadgeCheck,
    CreditCard
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import { NIGERIAN_STATES } from "@/lib/constants";
import { motion } from "framer-motion";

export default function FarmerRegistrationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        farmName: "",
        farmLocationState: "Kano",
        farmLocationLga: "",
        farmSize: "",
        farmingType: "Crop Farming",
        primaryProduce: "",
        isOrganicCertified: false,
        yearsOfExperience: "",
        bankName: "",
        accountNumber: "",
        accountName: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(getApiUrl("/api/auth/signup/farmer"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push(`/verify-account?email=${encodeURIComponent(formData.email)}`);
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
                    <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black font-serif text-primary uppercase italic">Success!</h1>
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 leading-relaxed">
                            Welcome to the Kido Farms family. Your farmer profile has been created and is pending review.
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
                                <Leaf className="w-4 h-4 text-secondary" /> Farmer Registration
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black font-serif leading-[0.85] text-primary tracking-tighter uppercase italic">
                                Grow With <br />
                                <span className="text-secondary not-italic">Kido Farms.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium italic max-w-md">
                                Join our network of premium agricultural producers and connect directly to the global table.
                            </p>
                        </div>

                        <div className="space-y-10">
                            {[
                                { title: "Direct Buyers", icon: Users, desc: "Connect directly with families and businesses looking for fresh produce." },
                                { title: "Guaranteed Offtake", icon: Tractor, desc: "Join our subscriber network for guaranteed monthly crop purchases." },
                                { title: "Premium Pricing", icon: BadgeCheck, desc: "Get better margins for quality produce with our trusted brand." }
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
                                    <h2 className="text-3xl md:text-5xl font-black font-serif uppercase tracking-tighter text-primary italic leading-none">Farmer Profile</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Agricultural & Bio-Digital Identity</p>
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
                                                { label: "Registry Email", name: "email", type: "email", placeholder: "name@nexus.com" },
                                                { label: "Mobile Node", name: "phone", type: "tel", placeholder: "+234..." },
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

                                    {/* Section 2: Farm Details */}
                                    <div className="space-y-10 pt-16 border-t border-gray-50">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black font-serif uppercase tracking-widest text-primary italic">Farm Asset Details</h3>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Farm Organization Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Kido Node Jos"
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all placeholder:text-gray-300"
                                                    value={formData.farmName}
                                                    onChange={e => setFormData({ ...formData, farmName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Sovereign State</label>
                                                <select
                                                    required
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all cursor-pointer appearance-none"
                                                    value={formData.farmLocationState}
                                                    onChange={e => setFormData({ ...formData, farmLocationState: e.target.value })}
                                                >
                                                    {NIGERIAN_STATES.map(state => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">LGA / Region</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Zone AC"
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all placeholder:text-gray-300"
                                                    value={formData.farmLocationLga}
                                                    onChange={e => setFormData({ ...formData, farmLocationLga: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Land Capacity</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 50 Hectares"
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all placeholder:text-gray-300"
                                                    value={formData.farmSize}
                                                    onChange={e => setFormData({ ...formData, farmSize: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Farming Protocol</label>
                                                <select
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all cursor-pointer appearance-none"
                                                    value={formData.farmingType}
                                                    onChange={e => setFormData({ ...formData, farmingType: e.target.value })}
                                                >
                                                    <option value="Crop Farming">Crop Farming</option>
                                                    <option value="Livestock">Livestock</option>
                                                    <option value="Poultry">Poultry</option>
                                                    <option value="Dairy">Dairy</option>
                                                    <option value="Mixed Farming">Mixed Farming</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Financials */}
                                    <div className="space-y-10 pt-16 border-t border-gray-50">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black font-serif uppercase tracking-widest text-primary italic flex items-center gap-4">
                                                Payout Registry <CreditCard className="w-5 h-5 text-secondary" />
                                            </h3>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Institution Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Bank Name"
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all placeholder:text-gray-300"
                                                    value={formData.bankName}
                                                    onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Account Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="0000000000"
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all placeholder:text-gray-300"
                                                    value={formData.accountNumber}
                                                    onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Account Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Legal Entity Name"
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-8 py-5 font-bold text-primary focus:bg-white focus:border-secondary outline-none transition-all placeholder:text-gray-300"
                                                    value={formData.accountName}
                                                    onChange={e => setFormData({ ...formData, accountName: e.target.value })}
                                                />
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
                                            {isLoading ? <Loader2 className="animate-spin" /> : <>Initiate Application <ChevronRight className="w-5 h-5" /></>}
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
