"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, MessageSquare, Plus, Edit3, Trash2, ShieldCheck, Globe, Zap, Database, ArrowRight, Save, Loader2, Radio } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface ContentItem {
    id: string;
    title: string;
    body: string;
    type: string;
    category: string;
    section: "vault" | "exchange";
    status: string;
    isLive: boolean;
    createdAt?: string;
}

export default function AdminSovereigntyManager({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<"vault" | "exchange">("vault");
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [items, setItems] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedItem, setSelectedItem] = useState<Partial<ContentItem>>({});

    const fetchIntel = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:5001/api/admin/intel?section=${activeTab}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch intel", error);
            toast.error("Failed to fetch node registry");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (isOpen) fetchIntel();
    }, [activeTab, isOpen]);

    const handleCreateNew = () => {
        setSelectedItem({
            title: "", body: "", type: "Technical", category: "General", section: activeTab, status: "draft"
        });
        setIsCreating(true);
        setIsEditing(true);
    };

    const handleEdit = (item: ContentItem) => {
        setSelectedItem(item);
        setIsCreating(false);
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const url = isCreating
                ? "http://localhost:5001/api/admin/intel"
                : `http://localhost:5001/api/admin/intel/${selectedItem.id}`;
            const method = isCreating ? "POST" : "PATCH";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(selectedItem)
            });

            if (res.ok) {
                toast.success(`Node ${isCreating ? 'Initialized' : 'Updated'}`);
                setIsEditing(false);
                fetchIntel();
            } else {
                toast.error("Protocol violation during save");
            }
        } catch (error) {
            toast.error("API link severed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Confirm catastrophic wipe of this intelligence root?")) return;
        try {
            const res = await fetch(`http://localhost:5001/api/admin/intel/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success("Intelligence erased.")
                fetchIntel();
            }
        } catch (error) {
            toast.error("Failed to erase node");
        }
    };

    const handleGoLiveToggle = async (id: string, currentLive: boolean) => {
        try {
            const res = await fetch(`http://localhost:5001/api/admin/intel/${id}/golive`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success(currentLive ? "Protocol suppressed (Offline)" : "Protocol LIVE across mesh");
                fetchIntel();
            } else {
                toast.error("Failed to toggle live state");
            }
        } catch (error) {
            toast.error("Signal lost");
        }
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
                    <div className="w-80 bg-neutral-50 border-r border-primary/5 p-8 space-y-12 shrink-0">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase opacity-30 tracking-widest pl-4">Network Nodes</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setActiveTab("vault")}
                                    className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === "vault" ? "bg-primary text-secondary hover:scale-105" : "hover:bg-cream text-primary/40"}`}
                                >
                                    <BookOpen size={20} />
                                    <span className="text-[11px] font-black uppercase">Sovereign Vault</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("exchange")}
                                    className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === "exchange" ? "bg-primary text-secondary hover:scale-105" : "hover:bg-cream text-primary/40"}`}
                                >
                                    <MessageSquare size={20} />
                                    <span className="text-[11px] font-black uppercase">Intel Exchange</span>
                                </button>
                            </div>
                        </div>

                        <button onClick={handleCreateNew} className="w-full bg-secondary text-primary p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all">
                            <Plus size={18} /> New Protocol Node
                        </button>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 p-10 md:p-16 overflow-y-auto space-y-12 bg-white relative">
                        <div className="flex justify-between items-end relative z-10">
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none">Registry Interface</h3>
                                <h2 className="text-4xl font-black font-serif italic text-primary uppercase tracking-tighter flex items-center gap-4">
                                    {activeTab === "vault" ? "Knowledge Repository" : "Community Advisories"}
                                    {isLoading && <Loader2 size={24} className="animate-spin text-secondary" />}
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {(!isLoading && items.length === 0) && (
                                <div className="p-12 border-2 border-dashed border-primary/10 rounded-3xl text-center flex flex-col items-center">
                                    <ShieldCheck size={48} className="text-primary/20 mb-4" />
                                    <p className="text-sm font-black uppercase tracking-widest text-primary/40">No Intelligence Modules Initialized</p>
                                </div>
                            )}

                            <AnimatePresence mode="popLayout">
                                {items.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                        className="bg-neutral-50 p-8 rounded-[2.5rem] border border-primary/5 flex items-center justify-between group hover:border-secondary transition-all"
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-primary shadow-sm group-hover:bg-secondary transition-colors">
                                                {activeTab === "vault" ? <Globe size={24} /> : <Zap size={24} />}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-primary/20 mb-1">{item.type} • {item.category}</p>
                                                <h4 className="text-xl font-black font-serif text-primary uppercase italic tracking-tighter">{item.title}</h4>
                                                <div className="flex gap-4 mt-2">
                                                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${item.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                        {item.status}
                                                    </span>
                                                    {item.isLive && (
                                                        <span className="px-3 py-1 rounded-lg bg-red-100/50 text-red-600 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                                            <Radio size={10} className="animate-pulse" /> LIVE STREAMING
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleGoLiveToggle(item.id, item.isLive)}
                                                className={`p-4 rounded-2xl hover:scale-110 transition-all shadow-lg ${item.isLive ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                                title={item.isLive ? "Take Offline" : "Go Live"}
                                            >
                                                <Radio size={18} />
                                            </button>
                                            <button onClick={() => handleEdit(item)} className="p-4 bg-primary text-secondary rounded-2xl hover:scale-110 transition-all shadow-lg"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:scale-110 transition-all shadow-lg"><Trash2 size={18} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* EDIT/CREATE MODAL OVERLAY */}
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
                                    <h3 className="text-3xl font-black font-serif italic text-primary uppercase tracking-tighter">
                                        {isCreating ? 'Initialize New Node' : 'Edit Intelligence Node'}
                                    </h3>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="p-3 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"><X size={20} /></button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Content Title</label>
                                    <input
                                        value={selectedItem.title}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/5 rounded-2xl p-6 outline-none focus:border-secondary transition-all font-serif italic font-black text-xl text-primary"
                                        placeholder="e.g. Army Worm Resistance Tactics..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Classification</label>
                                        <input
                                            value={selectedItem.category}
                                            onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })}
                                            className="w-full bg-neutral-50 border border-primary/5 rounded-2xl p-5 outline-none font-black uppercase text-[10px] tracking-widest text-primary/60"
                                            placeholder="E.g Alert, General, Advisory..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Sovereignty Status</label>
                                        <select
                                            value={selectedItem.status}
                                            onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
                                            className="w-full bg-neutral-50 border border-primary/5 rounded-2xl p-5 outline-none font-black uppercase text-[10px] tracking-widest text-primary/60 appearance-none cursor-pointer"
                                        >
                                            <option value="draft">Draft - Logic Review</option>
                                            <option value="published">Published - Hub Sync</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-primary/30 ml-4">Core Intel (Text / Markdown)</label>
                                    <textarea
                                        value={selectedItem.body}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, body: e.target.value })}
                                        className="w-full bg-neutral-50 border border-primary/5 rounded-2xl p-6 outline-none focus:border-secondary transition-all font-sans text-sm h-40 resize-none text-primary/80"
                                        placeholder="Enter the sovereign data..."
                                    />
                                </div>
                            </div>

                            <div className="pt-10 flex gap-4">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-primary text-secondary py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                                >
                                    <Save size={18} /> {isCreating ? 'Initialize Module' : 'Sync To Mesh'}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-primary/40 py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border border-primary/5 transition-colors"
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
