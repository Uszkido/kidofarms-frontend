"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, RefreshCw, ShoppingBasket, Save, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ActionStatus } from "@/components/ActionStatus";

export default function BasketConfigPage() {
    const [loading, setLoading] = useState(false);
    const [actionState, setActionState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        status: "processing" | "success" | "error";
    }>({
        isOpen: false,
        title: "",
        message: "",
        status: "processing"
    });

    const [selectedItems, setSelectedItems] = useState([
        "Sweet Potatoes", "Carrots", "Onions", "Organic Honey"
    ]);

    const availableItems = [
        "Sweet Potatoes", "Carrots", "Onions", "Organic Honey",
        "Green Pepper", "Cabbage", "Irish Potatoes", "Ginger",
        "Red Chilies", "Plantain", "Garden Egg", "Wild Berries"
    ];

    const toggleItem = (item: string) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
        } else if (selectedItems.length < 5) {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleSave = () => {
        setLoading(true);
        setActionState({
            isOpen: true,
            title: "Basket Update",
            message: "Saving configuration...",
            status: "processing"
        });
        setTimeout(() => {
            setLoading(false);
            setActionState({
                isOpen: true,
                title: "Updated",
                message: "Basket configuration saved for your next delivery!",
                status: "success"
            });
        }, 1500);
    };

    return (
        <div className="flex flex-col min-h-screen bg-cream/5">
            <Header />
            <ActionStatus
                isOpen={actionState.isOpen}
                onClose={() => setActionState(prev => ({ ...prev, isOpen: false }))}
                title={actionState.title}
                message={actionState.message}
                status={actionState.status}
            />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link href="/dashboard/subscriber" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-primary mb-10 transition-all">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>

                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tight">Basket <span className="text-secondary italic">Configurator</span></h1>
                        <p className="text-primary/40 font-medium text-sm mt-2">Select up to 5 premium items for your weekly farm box.</p>
                    </div>

                    <div className="bg-white rounded-[3rem] border border-primary/5 shadow-2xl p-10 md:p-16 space-y-12">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {availableItems.map((item) => {
                                const isSelected = selectedItems.includes(item);
                                return (
                                    <button
                                        key={item}
                                        onClick={() => toggleItem(item)}
                                        className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 text-center group ${isSelected ? "border-secondary bg-secondary/5" : "border-primary/5 hover:border-primary/20 bg-neutral-50"}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSelected ? "bg-secondary text-primary" : "bg-white text-primary/10 group-hover:text-primary/40"}`}>
                                            {isSelected ? <Check size={20} /> : <ShoppingBasket size={20} />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{item}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="pt-10 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Selection Slot</p>
                                <p className="text-xl font-black font-serif">{selectedItems.length} <span className="text-primary/20">/ 5 items</span></p>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={loading || selectedItems.length === 0}
                                className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl disabled:opacity-50 flex items-center gap-3"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {loading ? "Syncing Choice..." : "Update Next Basket"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
