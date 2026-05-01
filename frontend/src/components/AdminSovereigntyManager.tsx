"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, MessageSquare, Plus, Edit3, Trash2, ShieldCheck, Globe, Zap, Database, ArrowRight, Save } from "lucide-react";
import { useState } from "react";

interface ContentItem {
    id: string;
    title: string;
    type: string;
    category: string;
    status: "Published" | "Draft";
    date: string;
}

export default function AdminSovereigntyManager({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<"vault" | "exchange">("vault");
    const [isEditing, setIsEditing] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [vaultContent, setVaultContent] = useState<ContentItem[]>([
        { id: "V-101", title: "Organic Soil Remediation Protocol", type: "Technical", category: "Soil Health", status: "Published", date: "April 12" },
        { id: "V-102", title: "NDVI Biomass Interpretation", type: "Research", category: "GIS Data", status: "Published", date: "April 15" },
        { id: "V-103", title: "Carbon-Sync Harvest Timing", type: "Advisory", category: "Yield Sync", status: "Draft", date: "April 20" },
    ]);

    const [exchangeContent, setExchangeContent] = useState<ContentItem[]>([
        { id: "E-501", title: "Army Worm Warning: Jos Hub", type: "Community", category: "Alert", status: "Published", date: "April 28" },
        { id: "E-502", title: "New Cold-Storage Node in Kano", type: "Admin", category: "Logistics", status: "Published", date: "April 29" },
    ]);

    const items = activeTab === "vault" ? vaultContent : exchangeContent;

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setIsEditing(true);
    };

    const handleSave = () => {
        // Mock save logic
        setIsEditing(false);
        setSelectedItem(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 md:p-12">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-primary/95 backdrop-blur-3xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-6xl bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col h-[85vh]"
            >
                {/* HEADER */}
                <div className="bg-secondary p-10 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary text-secondary rounded-2xl flex items-center justify-center">
                            <Database size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black font-serif italic text-primary uppercase tracking-tighter leading-none">Intelligence CMS</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Manage Sovereign Vault & Exchange Content</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-4 bg-primary/5 hover:bg-primary/10 rounded-full transition-all">
                        <X size={24} className="text-primary" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* SIDEBAR */}
                    <div className="w-80 bg-neutral-50 border-r border-primary/5 p-8 space-y-12">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase opacity-30 tracking-widest pl-4">Network Nodes</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setActiveTab("vault")}
                                    className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === "vault" ? "bg-primary text-secondary" : "hover:bg-cream text-primary/40"}`}
                                >
                                    <BookOpen size={20} />
                                    <span className="text-[11px] font-black uppercase">Sovereign Vault</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("exchange")}
                                    className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === "exchange" ? "bg-primary text-secondary" : "hover:bg-cream text-primary/40"}`}
                                >
                                    <MessageSquare size={20} />
                                    <span className="text-[11px] font-black uppercase">Intel Exchange</span>
                                </button>
                            </div>
                        </div>

                        <button className="w-full bg-secondary text-primary p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all">
                            <Plus size={18} /> New Broadcast
                        </button>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 p-10 md:p-16 overflow-y-auto space-y-12 bg-white">
                        <div className="flex justify-between items-end">
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none">Registry Interface</h3>
                                <h2 className="text-4xl font-black font-serif italic text-primary uppercase tracking-tighter">
                                    {activeTab === "vault" ? "Knowledge Repository" : "Community Advisories"}
                                </h2>
                            </div>
                            <div className="flex bg-neutral-100 p-1 rounded-xl">
                                <button className="px-5 py-2 bg-white rounded-lg text-[9px] font-black uppercase shadow-sm">All Nodes</button>
                                <button className="px-5 py-2 text-[9px] font-black uppercase text-primary/30">Drafts</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="wait">
                                {items.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-neutral-50 p-8 rounded-[2.5rem] border border-primary/5 flex items-center justify-between group hover:border-secondary transition-all"
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-primary shadow-sm group-hover:bg-secondary transition-colors">
                                                {activeTab === "vault" ? <Globe size={24} /> : <Zap size={24} />}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-primary/20 mb-1">{item.id} • {item.category}</p>
                                                <h4 className="text-xl font-black font-serif text-primary uppercase italic tracking-tighter">{item.title}</h4>
                                                <div className="flex gap-4 mt-2">
                                                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${item.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                        {item.status}
                                                    </span>
                                                    <span className="text-[8px] font-black text-primary/20 uppercase tracking-widest underline underline-offset-4 decoration-secondary">{item.date} Node Sync</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(item)} className="p-4 bg-primary text-secondary rounded-2xl hover:scale-110 transition-all shadow-lg"><Edit3 size={18} /></button>
                                            <button className="p-4 bg-red-50 text-red-500 rounded-2xl hover:scale-110 transition-all shadow-lg"><Trash2 size={18} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* EDIT MODAL OVERLAY */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[2100] flex items-center justify-center p-12 bg-primary/40 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[4rem] w-full max-w-2xl p-16 space-y-10 shadow-3xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Protocol Editor</h4>
                                    <h3 className="text-3xl font-black font-serif italic text-primary uppercase tracking-tighter">Edit Content Node</h3>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="p-3 bg-neutral-100 rounded-full"><X size={20} /></button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Content Title</label>
                                    <input
                                        defaultValue={selectedItem?.title}
                                        className="w-full bg-neutral-50 border border-primary/5 rounded-2xl p-6 outline-none focus:border-secondary transition-all font-serif italic font-black text-xl text-primary"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Classification</label>
                                        <select className="w-full bg-neutral-50 border border-primary/5 rounded-2xl p-5 outline-none font-black uppercase text-[10px] tracking-widest text-primary/60 appearance-none">
                                            <option>Technical Protocol</option>
                                            <option>Community Advisory</option>
                                            <option>Network Alert</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Sovereignty Status</label>
                                        <select className="w-full bg-neutral-50 border border-primary/5 rounded-2xl p-5 outline-none font-black uppercase text-[10px] tracking-widest text-primary/60 appearance-none">
                                            <option>Published - Hub Sync</option>
                                            <option>Draft - Logic Review</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Core Intel (Markdown)</label>
                                    <textarea
                                        className="w-full bg-neutral-50 border border-primary/5 rounded-2xl p-6 outline-none focus:border-secondary transition-all font-sans text-sm h-40 resize-none"
                                        placeholder="Enter the sovereign data..."
                                    />
                                </div>
                            </div>

                            <div className="pt-10 flex gap-4">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-primary text-secondary py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                                >
                                    <Save size={18} /> Update Node Registry
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-neutral-100 text-primary/40 py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border border-primary/5"
                                >
                                    Discard Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
