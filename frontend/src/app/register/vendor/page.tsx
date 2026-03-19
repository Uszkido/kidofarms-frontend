"use client";

import { useState, useEffect } from "react";
import {
    Users,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Leaf,
    MapPin,
    ShieldCheck,
    ShoppingBag,
    ChevronRight,
    Building2,
    FileText,
    ArrowDown
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import { NIGERIAN_STATES } from "@/lib/constants";
import { GeoapifyAutocomplete } from "@/components/GeoapifyAutocomplete";

const CATEGORIES = [
    { id: "Fruits", label: "Organic Fruits", icon: "🍎" },
    { id: "Vegetables", label: "Fresh Vegetables", icon: "🥬" },
    { id: "Grains", label: "Grains & Cereals", icon: "🌾" },
    { id: "Fishes", label: "Freshwater Fish", icon: "🐟" },
    { id: "Chicken", label: "Poultry (Chicken)", icon: "🐔" },
    { id: "Beef", label: "Livestock (Beef)", icon: "🐄" }
];

export default function VendorRegistrationPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        businessName: "",
        description: "",
        categories: [] as string[],
        name: "",
        email: "",
        phone: "",
        password: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        location: "Kano", // Primary Region for Vendor categorization
    });

    const handleAddressSelect = (address: any) => {
        setFormData(prev => ({
            ...prev,
            street: address.address_line1 || address.formatted,
            city: address.city || address.suburb || address.village || prev.city,
            state: address.state || prev.state
        }));
    };

    const toggleCategory = (catId: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(catId)
                ? prev.categories.filter(id => id !== catId)
                : [...prev.categories, catId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(getApiUrl("/api/vendors/register"), {
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
                    <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-secondary animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black font-serif text-primary">Application Received!</h1>
                        <p className="text-primary/60 font-medium leading-relaxed">
                            Thank you for joining the Kido Farms Network. Our team will review your farm details and verify your business within 24-48 hours.
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
                            <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest">
                                <Leaf size={14} /> Farmer Partnership Program
                            </div>
                            <h1 className="text-6xl font-black font-serif leading-[0.9] text-primary tracking-tighter">
                                Scale Your <br />
                                <span className="text-secondary italic">Farm Business.</span>
                            </h1>
                            <p className="text-xl text-primary/60 leading-relaxed font-medium">
                                Join the elite network of community farmers in Kano, Abuja, and Lagos reaching thousands of premium customers.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { title: "Direct Access", icon: Users, desc: "Connect directly with consumers, cutting out margins from middlemen." },
                                { title: "Smart Logistics", icon: ShoppingBag, desc: "Automated dispatch and delivery handled by our premium network." },
                                { title: "Real-time Pricing", icon: ShieldCheck, desc: "Control your own harvest prices with live market data insights." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start group">
                                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-primary/5 shadow-sm flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all">
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
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[120px] opacity-10 -translate-y-32 translate-x-32" />

                            <form onSubmit={handleSubmit} className="relative space-y-12">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black font-serif uppercase tracking-tight">Business Profile</h2>
                                    <p className="text-sm text-primary/40 font-medium">Tell us about your farm operation</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                                        <ShieldCheck className="rotate-180" size={16} /> {error}
                                    </div>
                                )}

                                <div className="space-y-12">
                                    {/* Section 1: Business Info */}
                                    <div className="space-y-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
                                                    <Building2 size={12} /> Farm Business Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Kano Valley Organics"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary placeholder:text-primary/20 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                                    value={formData.businessName}
                                                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
                                                    <MapPin size={12} /> Primary Region
                                                </label>
                                                <select
                                                    required
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-secondary/20 outline-none transition-all appearance-none cursor-pointer"
                                                    value={formData.location}
                                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                >
                                                    {NIGERIAN_STATES.map(state => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
                                                <FileText size={12} /> About Your Harvest
                                            </label>
                                            <textarea
                                                required
                                                rows={3}
                                                placeholder="What do you grow? Describe your farming practices..."
                                                className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary placeholder:text-primary/20 focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none"
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 2: Contact Information */}
                                    <div className="space-y-8 pt-6 border-t border-primary/5">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black font-serif uppercase tracking-tight">Contact Information</h3>
                                            <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">Personal details for account management</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Contact Person Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Full Name"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="farmer@example.com"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    placeholder="+234..."
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Secure Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    placeholder="••••••••"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Farm Address */}
                                    <div className="space-y-8 pt-6 border-t border-primary/5">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black font-serif uppercase tracking-tight">Farm Location</h3>
                                            <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">Physical address for dispatch planning</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 px-2">Farm Street Address (Automated)</label>
                                                <GeoapifyAutocomplete
                                                    onSelect={handleAddressSelect}
                                                    placeholder="Enter farm location..."
                                                    initialValue={formData.street}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">City</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="City"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                                    value={formData.city}
                                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">State</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="State"
                                                    className="w-full bg-cream/20 border border-primary/5 rounded-2xl px-6 py-4 font-bold text-primary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                                    value={formData.state}
                                                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 4: Product Categories */}
                                    <div className="space-y-6 pt-6 border-t border-primary/5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Product Specializations</label>
                                            <span className="text-[10px] font-bold text-secondary">Select all that apply</span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {CATEGORIES.map(cat => (
                                                <div
                                                    key={cat.id}
                                                    onClick={() => toggleCategory(cat.id)}
                                                    className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${formData.categories.includes(cat.id)
                                                        ? "bg-secondary border-secondary shadow-lg shadow-secondary/20 scale-105"
                                                        : "bg-white border-primary/5 hover:border-secondary/30"
                                                        }`}
                                                >
                                                    <span className="text-2xl">{cat.icon}</span>
                                                    <span className={`text-[10px] font-black uppercase tracking-tight ${formData.categories.includes(cat.id) ? "text-primary" : "text-primary/40"
                                                        }`}>
                                                        {cat.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || formData.categories.length === 0}
                                        className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="animate-spin" size={24} />
                                        ) : (
                                            <>
                                                Submit Partnership Application <ChevronRight size={24} />
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
