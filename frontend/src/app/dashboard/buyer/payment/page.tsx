"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, ShieldCheck, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SubscriberPaymentPage() {
    return (
        <div className="flex flex-col min-h-screen bg-cream/5">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link href="/dashboard/buyer" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-primary mb-10 transition-all">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>

                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tight">Payment <span className="text-secondary italic">Vault</span></h1>
                        <p className="text-primary/40 font-medium text-sm mt-2">Manage your subscription billing methods and security.</p>
                    </div>

                    <div className="space-y-8">
                        {/* Primary Card */}
                        <div className="bg-primary rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group">
                            <ShieldCheck size={200} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                        <CreditCard size={14} /> Primary Method
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-3xl font-mono tracking-[0.3em]">•••• •••• •••• 4029</p>
                                        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
                                            <span>Exp: 12/28</span>
                                            <span>Visa Classic</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"><Trash2 size={24} /></button>
                                    <button className="bg-secondary text-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">Update</button>
                                </div>
                            </div>
                        </div>

                        {/* Security Info */}
                        <div className="bg-white rounded-[3rem] border border-primary/5 shadow-xl p-10 flex items-center gap-8">
                            <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center text-secondary">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black font-serif">Escrow Shield Active</h4>
                                <p className="text-xs text-primary/40 font-medium leading-relaxed">Your payments are protected by Kido Escrow. Funds are only released to farmers after successful delivery verification.</p>
                            </div>
                        </div>

                        {/* Add New Method */}
                        <button className="w-full h-40 rounded-[3rem] border-4 border-dashed border-primary/10 bg-white/50 flex flex-col items-center justify-center gap-4 group hover:border-secondary transition-all">
                            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all">
                                <Plus size={32} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Securely Add Payment Node</span>
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
