"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check, CreditCard, MapPin, Phone, User, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SubscriptionCheckoutPage() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const userRole = (session?.user as any)?.role;
        const isBusiness = ['business', 'wholesale_buyer', 'retailer', 'hotel', 'distributor'].includes(userRole);
        if (isBusiness) {
            router.push('/dashboard/buyer');
        }
    }, [session, router]);

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "Lagos",
        zip: "",
        plan: "Weekly Farm Basket",
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(getApiUrl("/api/subscribers"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                // Success! Redirect to subscriber dashboard
                router.push("/dashboard/subscriber?status=success");
            } else {
                alert("Failed to process subscription. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />            <main className="flex-grow pt-32 pb-24 bg-cream/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {/* Progress Stepper */}
                        <div className="flex justify-between items-center px-12 relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-primary/5 -translate-y-1/2 z-0" />
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-secondary -translate-y-1/2 z-0 transition-all duration-500"
                                style={{ width: `${(step - 1) * 50}%` }}
                            />
                            {[1, 2, 3].map((s) => (
                                <div key={s} className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 ${step >= s ? "bg-secondary text-primary shadow-lg scale-110" : "bg-white text-primary/20 border border-primary/5"
                                    }`}>
                                    {step > s ? <Check size={20} /> : s}
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-[4rem] p-12 md:p-16 border border-primary/5 shadow-2xl space-y-10">
                            {step === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black font-serif">Contact Information</h2>
                                        <p className="text-primary/40 text-sm font-medium">Let's get started with your delivery details.</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Email Address</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                                                <input name="email" value={formData.email} onChange={handleChange} required className="w-full bg-cream/30 border-none rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-medium" placeholder="jane@example.com" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                                                <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-cream/30 border-none rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-medium" placeholder="+234..." />
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={nextStep} className="w-full bg-primary text-white py-6 rounded-3xl font-black text-lg hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3">
                                        Shipping Address <ArrowRight size={20} />
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-500">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black font-serif">Delivery Address</h2>
                                        <p className="text-primary/40 text-sm font-medium">Where should we deliver your weekly harvest?</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Street Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                                                <input name="street" value={formData.street} onChange={handleChange} required className="w-full bg-cream/30 border-none rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-medium" placeholder="123 Farm Way" />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">City</label>
                                                <input name="city" value={formData.city} onChange={handleChange} required className="w-full bg-cream/30 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-medium" placeholder="Ikeja" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">State</label>
                                                <select name="state" value={formData.state} onChange={handleChange} className="w-full bg-cream/30 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-black text-xs uppercase tracking-widest appearance-none">
                                                    <option>Lagos</option>
                                                    <option>Abuja</option>
                                                    <option>Kano</option>
                                                    <option>Jos</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2">Zip</label>
                                                <input name="zip" value={formData.zip} onChange={handleChange} className="w-full bg-cream/30 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-medium" placeholder="100001" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={prevStep} className="flex-1 border-2 border-primary/5 py-6 rounded-3xl font-black text-primary/30 hover:bg-cream transition-all flex items-center justify-center gap-3">
                                            <ArrowLeft size={18} /> Back
                                        </button>
                                        <button onClick={nextStep} className="flex-[2] bg-primary text-white py-6 rounded-3xl font-black text-lg hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3">
                                            Payment Method <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-500">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-2">
                                            <h2 className="text-4xl font-black font-serif">Secure Payment</h2>
                                            <p className="text-primary/40 text-sm font-medium">Verify your plan and complete payment.</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-secondary font-serif">₦40,000</p>
                                            <p className="text-[10px] font-black uppercase tracking-tighter text-primary/20">Monthly Total</p>
                                        </div>
                                    </div>

                                    <div className="bg-primary p-10 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full" />
                                        <div className="flex justify-between items-center">
                                            <CreditCard size={32} strokeWidth={1.5} className="text-secondary" />
                                            <div className="flex gap-2">
                                                <div className="w-8 h-8 rounded-full bg-secondary/20" />
                                                <div className="w-8 h-8 rounded-full bg-cream/20" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-2">Card Number</label>
                                                <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} className="w-full bg-white/10 border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-secondary text-white placeholder:text-white/20 font-mono tracking-widest" placeholder="**** **** **** ****" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-2">Expiry Date</label>
                                                    <input name="expiry" value={formData.expiry} onChange={handleChange} className="w-full bg-white/10 border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-secondary text-white placeholder:text-white/20 font-medium" placeholder="MM/YY" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-2">CVV</label>
                                                    <input name="cvv" value={formData.cvv} onChange={handleChange} className="w-full bg-white/10 border-none rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-secondary text-white placeholder:text-white/20 font-medium" placeholder="***" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={prevStep} className="flex-1 border-2 border-primary/5 py-6 rounded-3xl font-black text-primary/30 hover:bg-cream transition-all flex items-center justify-center gap-3">
                                            <ArrowLeft size={18} /> Back
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="flex-[2] bg-secondary text-primary py-6 rounded-3xl font-black text-lg hover:bg-white border-2 border-secondary transition-all shadow-xl flex items-center justify-center gap-3"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" /> : "Complete Secure Payment"}
                                        </button>
                                    </div>
                                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-primary/20">
                                        By clicking, you authorize Kido Farms to charge your card N40,000 monthly. Secure SSL Encryption Active.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>


            <Footer />
        </div>
    );
}
