"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Lock, Bell, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSession } from "next-auth/react";

export default function SubscriberSettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="flex flex-col min-h-screen bg-cream/5">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link href="/dashboard/buyer" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-primary mb-10 transition-all">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>

                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tight italic">Account <span className="text-secondary">Nexus</span></h1>
                        <p className="text-primary/40 font-medium text-sm mt-2">Manage your harvest-linked digital identity.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="space-y-4">
                            {[
                                { id: "profile", label: "Harvest Profile", icon: User },
                                { id: "security", label: "Access Protocol", icon: Lock },
                                { id: "notifications", label: "Alert Nodes", icon: Bell },
                                { id: "preferences", label: "Site Hub", icon: ShieldCheck },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full p-6 rounded-2xl flex items-center gap-4 transition-all group ${activeTab === tab.id ? 'bg-primary text-secondary shadow-lg' : 'bg-white hover:bg-neutral-50 text-primary/40 border border-primary/5 hover:text-primary shadow-sm hover:shadow-md'}`}
                                >
                                    <tab.icon size={18} strokeWidth={activeTab === tab.id ? 3 : 2} />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="md:col-span-3">
                            <div className="bg-white rounded-[4rem] border border-primary/5 shadow-2xl p-10 md:p-16 space-y-12">
                                {activeTab === "profile" && (
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-full bg-secondary text-primary flex items-center justify-center text-3xl font-black font-serif shadow-xl">
                                                {session?.user?.name?.[0] || 'K'}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black font-serif text-primary">{session?.user?.name || "Kido Harvest Partner"}</h2>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1 italic">Tier: Elite Harvest Member</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-4">Full Identity</label>
                                                <div className="bg-neutral-50 border border-primary/5 p-6 rounded-2xl flex items-center gap-4">
                                                    <User size={16} className="text-secondary" />
                                                    <span className="text-xs font-black text-primary uppercase">{session?.user?.name}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-4">Email Channel</label>
                                                <div className="bg-neutral-50 border border-primary/5 p-6 rounded-2xl flex items-center gap-4">
                                                    <Mail size={16} className="text-secondary" />
                                                    <span className="text-xs font-black text-primary lowercase">{session?.user?.email}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-4">Mobile Link</label>
                                                <div className="bg-neutral-50 border border-primary/5 p-6 rounded-2xl flex items-center gap-4">
                                                    <Phone size={16} className="text-secondary" />
                                                    <span className="text-xs font-black text-primary uppercase">+234 •••• •••• 45</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-4">Current Node Location</label>
                                                <div className="bg-neutral-50 border border-primary/5 p-6 rounded-2xl flex items-center gap-4">
                                                    <MapPin size={16} className="text-secondary" />
                                                    <span className="text-xs font-black text-primary uppercase">Plateau, Jos</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">
                                            Update Profile Node
                                        </button>
                                    </div>
                                )}
                                {activeTab === "security" && (
                                    <div className="space-y-10">
                                        <h2 className="text-2xl font-black font-serif italic text-primary">Protocol Security</h2>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-4">Current Code</label>
                                                <input type="password" value="••••••••••••" readOnly className="w-full bg-neutral-50 border border-primary/5 p-6 rounded-2xl text-xs font-black" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-4">New Secret Code</label>
                                                <input type="password" placeholder="MIN 8 CHARACTERS" className="w-full bg-white border border-primary/5 p-6 rounded-2xl text-xs font-black focus:border-secondary outline-none transition-all" />
                                            </div>
                                        </div>
                                        <button className="w-full bg-secondary text-primary py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
                                            Rotate Protocol Keys
                                        </button>
                                    </div>
                                )}
                                {activeTab !== "profile" && activeTab !== "security" && (
                                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 opacity-40">
                                        <ShieldCheck size={48} className="text-secondary" />
                                        <p className="font-black text-[10px] uppercase tracking-widest">Protocol Syncing... <br />Feature node under initialization.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
