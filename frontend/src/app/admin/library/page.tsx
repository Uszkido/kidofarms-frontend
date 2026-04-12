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

    useEffect(() => {
        fetch(getApiUrl("/api/library"))
            .then(r => r.json())
            .then(setDocs)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const fetchDocContent = async (id: string) => {
        setDocLoading(true);
        try {
            const res = await fetch(getApiUrl(`/api/library/${id}`));
            const data = await res.json();
            setSelectedDoc(data);
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
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1600px] mx-auto p-10 space-y-12">

                {/* HEADER */}
                <header className="space-y-6">
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
                        {docLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                                <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 animate-pulse">Decrypting Protocol Content...</p>
                            </div>
                        ) : selectedDoc ? (
                            <div className="p-12 lg:p-20 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={18} className="text-secondary" />
                                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-secondary/60">Verified Kido Organic Protocol</span>
                                    </div>
                                    <h2 className="text-5xl lg:text-7xl font-black font-serif italic uppercase text-white tracking-tighter leading-none">
                                        {selectedDoc.id.split('_').join(' ')}
                                    </h2>
                                </div>

                                <div className="prose prose-invert prose-emerald max-w-none">
                                    <div className="bg-black/20 rounded-[3rem] p-10 lg:p-16 border border-white/5 leading-relaxed text-white/70 font-medium whitespace-pre-wrap font-sans text-lg">
                                        {selectedDoc.content}
                                    </div>
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
        </div>
    );
}
