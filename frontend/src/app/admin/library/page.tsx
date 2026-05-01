"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Search, Loader2, FileText, Globe, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminLibraryPage() {
    const [docs, setDocs] = useState<any[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [docLoading, setDocLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState<'protocol' | 'graph'>('protocol');
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");

    const [isInjecting, setIsInjecting] = useState(false);
    const [newProto, setNewProto] = useState({ id: "", content: "" });
    const [submitting, setSubmitting] = useState(false);

    const refreshDocs = () => {
        fetch(getApiUrl("/api/library"))
            .then(r => r.json())
            .then(setDocs)
            .catch(console.error);
    };

    useEffect(() => {
        setLoading(true);
        refreshDocs();
        setLoading(false);
    }, []);

    const handleInject = async () => {
        if (!newProto.id || !newProto.content) return;
        setSubmitting(true);
        try {
            const res = await fetch(getApiUrl("/api/library"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProto)
            });
            if (res.ok) {
                setIsInjecting(false);
                setNewProto({ id: "", content: "" });
                refreshDocs();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedDoc) return;
        setSubmitting(true);
        try {
            const res = await fetch(getApiUrl("/api/library"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedDoc.id, content: editContent })
            });
            if (res.ok) {
                setIsEditing(false);
                fetchDocContent(selectedDoc.id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently erase this protocol node?")) return;
        try {
            const res = await fetch(getApiUrl(`/api/library/${id}`), { method: "DELETE" });
            if (res.ok) {
                setSelectedDoc(null);
                refreshDocs();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDocContent = async (id: string) => {
        setDocLoading(true);
        try {
            const res = await fetch(getApiUrl(`/api/library/${id}`));
            const data = await res.json();
            setSelectedDoc(data);
            setEditContent(data.content);
        } catch (err) {
            console.error(err);
        } finally {
            setDocLoading(false);
        }
    };

    const filteredDocs = docs.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] font-sans selection:bg-secondary selection:text-primary relative">
            <div className="max-w-[1600px] mx-auto p-10 space-y-12">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> COMMAND CENTER
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Sovereign Data Repository</h2>
                        </div>
                        <h1 className="text-6xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Kido Internal <span className="text-secondary block">Library</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsInjecting(true)}
                        className="bg-secondary text-primary px-10 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all shadow-2xl flex items-center gap-3 active:scale-95"
                    >
                        <Zap size={16} fill="currentColor" /> Inject Protocol
                    </button>
                </header>

                <div className="grid lg:grid-cols-[400px_1fr] gap-10">
                    {/* LEFT: DOC LIST */}
                    <aside className="space-y-6">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                placeholder="Search Protocols..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm tracking-tight"
                            />
                        </div>

                        <div className="bg-white/5 rounded-[3rem] border border-white/10 p-4 space-y-2 max-h-[600px] overflow-y-auto">
                            {loading ? (
                                <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-secondary" /></div>
                            ) : filteredDocs.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => fetchDocContent(d.id)}
                                    className={`w-full text-left p-6 rounded-2xl flex items-center gap-4 transition-all group ${selectedDoc?.id === d.id ? 'bg-secondary text-primary shadow-xl' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}
                                >
                                    <div className={`p-3 rounded-xl ${selectedDoc?.id === d.id ? 'bg-black/20' : 'bg-white/5 group-hover:bg-secondary/10 group-hover:text-secondary'}`}>
                                        <FileText size={20} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black uppercase tracking-widest truncate">{d.title}</p>
                                        <p className="text-[8px] font-bold opacity-40 uppercase tracking-tighter mt-1">{d.fileName}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* RIGHT: CONTENT VIEWER */}
                    <main className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
                        <div className="flex justify-between items-center border-b border-white/10 pr-10">
                            <div className="flex">
                                <button
                                    onClick={() => setView('protocol')}
                                    className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'protocol' ? 'text-secondary border-b-2 border-secondary' : 'text-white/30 hover:text-white'}`}
                                >
                                    Protocol View
                                </button>
                                <button
                                    onClick={() => setView('graph')}
                                    className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'graph' ? 'text-secondary border-b-2 border-secondary' : 'text-white/30 hover:text-white'}`}
                                >
                                    Neural Graph
                                </button>
                            </div>
                            {selectedDoc && view === 'protocol' && (
                                <div className="flex gap-4">
                                    <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-black uppercase tracking-widest text-[#E6EDF3]/40 hover:text-secondary transition-all">
                                        {isEditing ? "Cancel" : "Edit Protocol"}
                                    </button>
                                    <button onClick={() => handleDelete(selectedDoc.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-all">
                                        Wipe Node
                                    </button>
                                </div>
                            )}
                        </div>

                        {docLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                                <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 animate-pulse">Decrypting Protocol Content...</p>
                            </div>
                        ) : view === 'graph' ? (
                            <div className="flex-1 p-12 lg:p-20 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10 pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-secondary/20 rounded-full animate-ping duration-[10s]" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-secondary/10 rounded-full animate-ping duration-[15s]" />
                                </div>
                                <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-10">
                                    {docs.map((d, i) => (
                                        <div key={d.id} className="relative group">
                                            <div className="absolute -inset-4 bg-secondary/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all" />
                                            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative z-10 hover:border-secondary/30 transition-all cursor-pointer" onClick={() => { fetchDocContent(d.id); setView('protocol'); }}>
                                                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-4">
                                                    <Globe size={24} />
                                                </div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">{d.title}</h4>
                                                <div className="flex gap-2 mt-4">
                                                    <span className="w-1 h-1 bg-secondary rounded-full animate-pulse" />
                                                    <span className="w-1 h-1 bg-secondary/40 rounded-full animate-pulse delay-75" />
                                                    <span className="w-1 h-1 bg-secondary/20 rounded-full animate-pulse delay-150" />
                                                </div>
                                            </div>
                                            {/* Decorative lines */}
                                            {i % 2 === 0 && <div className="absolute top-1/2 -right-10 w-10 h-px bg-gradient-to-r from-secondary/40 to-transparent hidden md:block" />}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-20 text-center">
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Mapping Sovereign Intelligence Clusters...</p>
                                </div>
                            </div>
                        ) : selectedDoc ? (
                            <div className="p-12 lg:p-20 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 flex-1 flex flex-col">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={18} className="text-secondary" />
                                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-secondary/60">Verified Kido Organic Protocol</span>
                                    </div>
                                    <h2 className="text-5xl lg:text-7xl font-black font-serif italic uppercase text-white tracking-tighter leading-none">
                                        {selectedDoc.id.split('_').join(' ')}
                                    </h2>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    {isEditing ? (
                                        <div className="flex-1 flex flex-col gap-6">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="flex-1 bg-black/40 rounded-[3rem] p-10 lg:p-16 border border-secondary/30 outline-none focus:border-secondary transition-all text-white/90 font-mono text-lg resize-none"
                                            />
                                            <button
                                                onClick={handleSaveEdit}
                                                disabled={submitting}
                                                className="bg-secondary text-primary py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all shadow-2xl active:scale-95 disabled:opacity-30"
                                            >
                                                {submitting ? "Processing..." : "Commit Changes"}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-black/20 rounded-[3rem] p-10 lg:p-16 border border-white/5 leading-relaxed text-white/70 font-medium whitespace-pre-wrap font-sans text-lg flex-1">
                                            {selectedDoc.content}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center gap-10 opacity-10">
                                <BookOpen size={120} strokeWidth={1} />
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-black uppercase tracking-[0.8em]">Archive Select</p>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Initialize sequence to access Sovereign Knowledge</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* INJECTION MODAL */}
            {isInjecting && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsInjecting(false)} />
                    <div className="relative z-10 w-full max-w-3xl bg-[#0a1a15] rounded-[4rem] border border-secondary/20 shadow-2xl p-10 lg:p-16 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black font-serif italic uppercase text-secondary">Sovereign Injection</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Author new organic protocols for the internal library</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-secondary/60 ml-4">Protocol ID (e.g. Avocado_Mastery)</label>
                                <input
                                    value={newProto.id}
                                    onChange={e => setNewProto({ ...newProto, id: e.target.value })}
                                    placeholder="Avocado_Mastery"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-secondary/60 ml-4">Protocol Content (Markdown)</label>
                                <textarea
                                    value={newProto.content}
                                    onChange={e => setNewProto({ ...newProto, content: e.target.value })}
                                    rows={10}
                                    placeholder="# Protocol Summary..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleInject}
                                disabled={submitting || !newProto.id || !newProto.content}
                                className="flex-1 bg-secondary text-primary py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all disabled:opacity-30"
                            >
                                {submitting ? "Processing..." : "Commit Protocol"}
                            </button>
                            <button
                                onClick={() => setIsInjecting(false)}
                                className="px-10 py-6 border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white"
                            >
                                Abort
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
