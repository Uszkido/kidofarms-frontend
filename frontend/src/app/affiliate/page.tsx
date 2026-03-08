"use client";


import { Users, TrendingUp, DollarSign, ArrowRight, CheckCircle2, Share2, Award, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AffiliateLanding() {
    const steps = [
        {
            icon: Users,
            title: "Join the Family",
            desc: "Register for free and get your unique Kido referral link instantly.",
            color: "bg-blue-50 text-blue-600"
        },
        {
            icon: Share2,
            title: "Share the Freshness",
            desc: "Promote Kido Farms on social media, blogs, or with friends and family.",
            color: "bg-purple-50 text-purple-600"
        },
        {
            icon: DollarSign,
            title: "Earn Commissions",
            desc: "Get a 5% commission on every successful order made through your link.",
            color: "bg-secondary/20 text-secondary"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">


            <main className="flex-grow pt-32 pb-24">
                {/* Hero Section */}
                <section className="container mx-auto px-6 mb-24">
                    <div className="relative rounded-[3rem] md:rounded-[5rem] overflow-hidden bg-primary p-12 md:p-24 text-white shadow-2xl">
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
                        <div className="relative z-10 max-w-2xl space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest"
                            >
                                <Award className="w-3 h-3" /> Partner with Us
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-8xl font-black font-serif leading-tight"
                            >
                                Grow with <br /><span className="text-secondary italic">Kido Farms</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg md:text-xl text-cream/60 leading-relaxed font-medium"
                            >
                                Join our affiliate program and earn rewards for bringing fresh, organic farm produce to your community.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-6 pt-4"
                            >
                                <Link href="/login?mode=signup" className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl text-center">
                                    Become an Affiliate
                                </Link>
                                <button className="border-2 border-white/10 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all text-center">
                                    Learn More
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Why Join Section */}
                <section className="container mx-auto px-6 mb-32">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black font-serif">Why Join Our <br /><span className="text-secondary italic">Affiliate Program?</span></h2>
                        <p className="text-primary/40 font-medium">We believe in rewarding those who help us build a healthier, farm-direct future.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-12 rounded-[3.5rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all group"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    <step.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-black font-serif mb-4">{step.title}</h3>
                                <p className="text-primary/40 leading-relaxed font-medium">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Benefits Banner */}
                <section className="container mx-auto px-6 mb-32">
                    <div className="bg-cream rounded-[4rem] p-12 md:p-24 grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black font-serif">Unmatched <br /><span className="text-primary/20 italic">Partner Perks</span></h2>
                            <div className="space-y-6">
                                {[
                                    "High conversion rates on premium farm products",
                                    "Real-time tracking dashboard for your earnings",
                                    "Monthly payouts directly to your bank account",
                                    "Priority support and marketing assets",
                                    "Exclusive access to new product launches"
                                ].map((perk, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 size={16} strokeWidth={3} />
                                        </div>
                                        <p className="font-black text-primary/60 text-sm italic">{perk}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-[3rem] overflow-hidden bg-primary rotate-3">
                                <img
                                    src="https://images.unsplash.com/photo-1464225644886-df08142663d3?q=80&w=1470&auto=format&fit=crop"
                                    alt="Community"
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </div>
                            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[2.5rem] shadow-2xl space-y-2 -rotate-3 border border-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        <Zap size={20} />
                                    </div>
                                    <p className="text-2xl font-black font-serif italic text-primary">5%</p>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Commission Rate</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="container mx-auto px-6 text-center">
                    <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-white space-y-12">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-4xl md:text-7xl font-black font-serif leading-tight">Ready to <br />Start <span className="text-secondary italic">Building?</span></h2>
                            <p className="text-cream/40 font-medium">Join thousands of partners helping us connect local farms to global markets.</p>
                        </div>
                        <Link href="/login?mode=signup" className="inline-flex items-center gap-4 bg-secondary text-primary px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                            Sign Up Now <ArrowRight size={20} />
                        </Link>
                    </div>
                </section>
            </main>


        </div>
    );
}
