"use client";

import { useState } from "react";
import {
    Users,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Leaf,
    MapPin,
    ShieldCheck,
    Tractor,
    ChevronRight,
    FileText,
    BadgeCheck,
    CreditCard
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";

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
            <div className="min-h-screen bg-cream/10 flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 text-center space-y-8 shadow-2xl border border-primary/5">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black font-serif text-primary">Farm Registration Successful!</h1>
                        <p className="text-primary/60 font-medium leading-relaxed">
                            Welcome to the Kido Farms family. Your farmer profile has been created and is pending review. We will contact you shortly.
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
        <div className="min-h-screen bg-cream/10 py-24 px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-5 gap-16">
                    {/* Left Side: Branding & Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full text-green-700 font-black text-[10px] uppercase tracking-widest">
                                <Leaf size={14} /> Farmer Registration
                            </div>
                            <h1 className="text-6xl font-black font-serif leading-[0.9] text-primary tracking-tighter">
                                Grow with <br />
                                <span className="text-green-600 italic">Kido Farms.</span>
                            </h1>
                            <p className="text-xl text-primary/60 leading-relaxed font-medium">
                                Join our network of premium agricultural producers and get direct access to hundreds of buyers and subscribers.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { title: "Direct Buyers", icon: Users, desc: "Connect directly with families and businesses looking for fresh produce." },
                                { title: "Guaranteed Offtake", icon: Tractor, desc: "Join our subscriber network for guaranteed monthly crop purchases." },
                                { title: "Premium Pricing", icon: BadgeCheck, desc: "Get better margins for quality produce with our trusted brand." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start group">
                                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-primary/5 shadow-sm flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                                        <item.icon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-primary uppercase text-sm tracking-tight">{item.title}</h4>
                                        <p className="text-sm text-primary/40 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[4rem] p-12 lg:p-16 shadow-2xl border border-primary/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[120px] opacity-10 -translate-y-32 translate-x-32" />

                            <form onSubmit={handleSubmit} className="relative space-y-12">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black font-serif uppercase tracking-tight">Farmer Profile</h2>
                                    <p className="text-sm text-primary/40 font-medium">Please provide your agricultural and contact details</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                                        <ShieldCheck className="rotate-180" size={16} /> {error}
                                    </div>
                                )}

                                <div className="space-y-12">
                                    {/* Section 1: Personal Info */}
                                    <div className="space-y-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Farm Details */}
                                    <div className="space-y-8 pt-6 border-t border-primary/5">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black font-serif uppercase tracking-tight">Farm Information</h3>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Farm Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.farmName}
                                                    onChange={e => setFormData({ ...formData, farmName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">State</label>
                                                <select
                                                    required
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all cursor-pointer"
                                                    value={formData.farmLocationState}
                                                    onChange={e => setFormData({ ...formData, farmLocationState: e.target.value })}
                                                >
                                                    <option value="Kano">Kano</option>
                                                    <option value="Kaduna">Kaduna</option>
                                                    <option value="Jigawa">Jigawa</option>
                                                    <option value="Abuja">Abuja</option>
                                                    <option value="Jos">Jos</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">LGA / Region</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.farmLocationLga}
                                                    onChange={e => setFormData({ ...formData, farmLocationLga: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Farm Size</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 50 Hectares"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.farmSize}
                                                    onChange={e => setFormData({ ...formData, farmSize: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Farming Type</label>
                                                <select
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all cursor-pointer"
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
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Primary Produce</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Tomatoes, Maize, Cattle"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.primaryProduce}
                                                    onChange={e => setFormData({ ...formData, primaryProduce: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 flex items-center justify-between">
                                                    <span>Organic Certified?</span>
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 accent-green-600 rounded-md cursor-pointer"
                                                        checked={formData.isOrganicCertified}
                                                        onChange={e => setFormData({ ...formData, isOrganicCertified: e.target.checked })}
                                                    />
                                                </label>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Years of Experience</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.yearsOfExperience}
                                                    onChange={e => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Payout Info */}
                                    <div className="space-y-8 pt-6 border-t border-primary/5">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black font-serif uppercase tracking-tight flex items-center gap-2">
                                                <CreditCard size={20} className="text-primary/40" /> Payout Information
                                            </h3>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Bank Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.bankName}
                                                    onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Account Number</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.accountNumber}
                                                    onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Account Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                                    value={formData.accountName}
                                                    onChange={e => setFormData({ ...formData, accountName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-6 bg-green-600 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-green-700 transition-all shadow-2xl shadow-green-600/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="animate-spin" size={24} />
                                        ) : (
                                            <>
                                                Submit Farmer Application <ChevronRight size={24} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
