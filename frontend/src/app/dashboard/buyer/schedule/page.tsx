"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SubscriberSchedulePage() {
    const [selectedSlot, setSelectedSlot] = useState("Tuesday Morning (8am - 12pm)");

    const slots = [
        "Monday Afternoon (1pm - 5pm)",
        "Tuesday Morning (8am - 12pm)",
        "Wednesday Morning (8am - 12pm)",
        "Thursday Evening (5pm - 8pm)",
        "Saturday Morning (9am - 1pm)"
    ];

    return (
        <div className="flex flex-col min-h-screen bg-cream/5">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link href="/dashboard/buyer" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-primary mb-10 transition-all">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>

                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tight">Delivery <span className="text-secondary italic">Schedule</span></h1>
                        <p className="text-primary/40 font-medium text-sm mt-2">Optimize your harvest arrival flow.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="md:col-span-2 space-y-8">
                            <div className="bg-white rounded-[3rem] p-10 border border-primary/5 shadow-xl space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                                        <Clock size={24} />
                                    </div>
                                    <h2 className="text-xl font-black font-serif uppercase">Select Protocol Slot</h2>
                                </div>
                                <div className="space-y-4">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${selectedSlot === slot ? 'border-secondary bg-secondary/5' : 'border-primary/5 hover:border-primary/10 bg-white'}`}
                                        >
                                            <span className={`text-xs font-black uppercase tracking-widest ${selectedSlot === slot ? 'text-primary' : 'text-primary/40 group-hover:text-primary'}`}>{slot}</span>
                                            {selectedSlot === slot && <CheckCircle2 size={20} className="text-secondary" />}
                                        </button>
                                    ))}
                                </div>
                                <button className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">
                                    Confirm Schedule Shift
                                </button>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl space-y-6">
                                <MapPin size={40} className="text-secondary" />
                                <h3 className="text-xl font-black font-serif uppercase leading-tight italic">Current Destination</h3>
                                <p className="text-cream/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">Jos South Branch, Plateau State</p>
                                <div className="pt-4 border-t border-white/10">
                                    <button className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-white transition-colors underline underline-offset-4">Modify Node Address</button>
                                </div>
                            </div>

                            <div className="bg-secondary/10 border border-secondary/20 rounded-[2.5rem] p-8 space-y-4">
                                <div className="flex items-center gap-2 text-secondary">
                                    <AlertCircle size={16} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Notice</span>
                                </div>
                                <p className="text-[10px] font-bold text-primary/60 leading-relaxed uppercase">Changes made to schedule will take effect from the next billing cycle.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
