"use client";

import { useState, useEffect } from "react";
import {
    Database,
    Search,
    Filter,
    ArrowLeft,
    Loader2,
    Edit3,
    Trash2,
    Save,
    X,
    ChevronDown,
    Zap,
    ShieldCheck,
    RefreshCcw,
    Table,
    FileJson,
    Settings,
    BookOpen
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";

export default function GlobalRegistryPage() {
    const { data: session }: any = useSession();
    const [entities] = useState([
        { id: 'users', label: 'Citizens (Users)', icon: <RefreshCcw size={16} /> },
        { id: 'orders', label: 'Network Traffic (Orders)', icon: <Zap size={16} /> },
        { id: 'products', label: 'Validated Assets (Products)', icon: <Table size={16} /> },
        { id: 'farmers', label: 'Agro Nodes (Farmers)', icon: <Settings size={16} /> },
        { id: 'vendors', label: 'Commercial Guilds (Vendors)', icon: <ShieldCheck size={16} /> },
        { id: 'carriers', label: 'Logistics Nodes (Carriers)', icon: <RefreshCcw size={16} /> },
        { id: 'shipments', label: 'Active Shipments (Logistics)', icon: <Database size={16} /> },
        { id: 'energyMarketplace', label: 'Energy Node (Waste/Credits)', icon: <Zap size={16} /> },
        { id: 'harvests', label: 'Biomass Tracker (Harvests)', icon: <Table size={16} /> },
        { id: 'sensors', label: 'IoT Stream (Sensors)', icon: <Zap size={16} /> },
        { id: 'tasks', label: 'Directives (Tasks)', icon: <Settings size={16} /> },
        { id: 'tickets', label: 'Nexus Support (Tickets)', icon: <RefreshCcw size={16} /> },
        { id: 'blogPosts', label: 'Knowledge Hub (Articles)', icon: <BookOpen size={16} /> },
        { id: 'jobApplications', label: 'Human Talent (Applications)', icon: <FileJson size={16} /> },
        { id: 'affiliates', label: 'Neural Links (Affiliates)', icon: <Zap size={16} /> },
        { id: 'storageNodes', label: 'Network Storage (Warehouses)', icon: <Database size={16} /> },
        { id: 'warehouseInventory', label: 'Stock Nodes (Inventory)', icon: <Table size={16} /> },
        { id: 'academyCourses', label: 'Knowledge Nodes (Academy)', icon: <BookOpen size={16} /> }
    ]);

    const [selectedEntity, setSelectedEntity] = useState('users');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [addingRecord, setAddingRecord] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, [selectedEntity]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl(`/api/admin/entities/${selectedEntity}`));
            if (res.ok) setData(await res.json());
            else setData([]);
        } catch (err) {
            console.error(err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (id: string, payload: any) => {
        setIsSaving(true);
        try {
            const res = await fetch(getApiUrl(`/api/admin/entities/${selectedEntity}/${id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert("Protocol sequence committed to global ledger.");
                setEditingRecord(null);
                fetchData();
            } else {
                const err = await res.json();
                alert(err.error || "Override failed.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleInject = async (payload: any) => {
        setIsSaving(true);
        try {
            const res = await fetch(getApiUrl(`/api/admin/entities/${selectedEntity}`), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert("New node injected into the matrix successfully.");
                setAddingRecord(null);
                fetchData();
            } else {
                const err = await res.json();
                alert(err.error || "Injection failed. Verify schema constraints.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("CRITICAL WARNING: Are you sure you want to permanently execute this node from the entire network?")) return;
        try {
            const res = await fetch(getApiUrl(`/api/admin/entities/${selectedEntity}/${id}`), {
                method: "DELETE"
            });
            if (res.ok) {
                fetchData();
                alert("Node removed successfully");
            } else {
                const err = await res.json();
                alert(err.error || "Execution failed.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredData = data.filter(item =>
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const canEdit = session?.user?.role === 'admin' || session?.user?.permissions?.includes('global_data_command');

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans selection:bg-secondary selection:text-primary relative overflow-hidden">
            {/* 🌌 BACKGROUND NEBULA */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[150px] -z-10 animate-pulse" />
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />

            <div className="max-w-[1800px] mx-auto space-y-12 relative z-10">

                {/* 🛡️ COMMAND HEADER */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> COMMAND CENTER
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60 italic">Core Data Registry v5.0</h2>
                        </div>
                        <h1 className="text-6xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Universal <span className="text-secondary block">Console</span>
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full lg:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                placeholder={`Deep Scan ${selectedEntity.toUpperCase()} ledger...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-[400px] bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm tracking-tight"
                            />
                        </div>
                        <button onClick={fetchData} className="bg-white/5 border border-white/10 text-white/40 px-8 py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                            <RefreshCcw size={16} /> Sync
                        </button>
                        {canEdit && (
                            <button
                                onClick={() => {
                                    if (data.length > 0) {
                                        const template = { ...data[0] };
                                        delete template.id;
                                        delete template.createdAt;
                                        delete template.updatedAt;
                                        setAddingRecord(template);
                                    } else {
                                        setAddingRecord({ title: "", description: "" });
                                    }
                                }}
                                className="bg-secondary text-primary px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-secondary/10"
                            >
                                <Table size={16} /> Inject Node
                            </button>
                        )}
                    </div>
                </header>

                <div className="grid lg:grid-cols-[350px_1fr] gap-10">
                    {/* 🧬 ENTITY SELECTOR */}
                    <aside className="space-y-4">
                        <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl space-y-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 border-b border-white/5 pb-4">Data Stream Selector</h3>
                            {entities.map(e => (
                                <button
                                    key={e.id}
                                    onClick={() => setSelectedEntity(e.id)}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 group ${selectedEntity === e.id ? 'bg-secondary text-primary border-secondary shadow-[0_0_30px_rgba(197,160,89,0.2)]' : 'bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedEntity === e.id ? 'bg-black/20 text-primary' : 'bg-white/5 text-white/20 group-hover:text-secondary'}`}>
                                            {e.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{e.label}</span>
                                    </div>
                                    <ChevronDown size={14} className={`transition-transform duration-500 ${selectedEntity === e.id ? 'rotate-0' : '-rotate-90 opacity-20'}`} />
                                </button>
                            ))}
                        </div>

                        <div className="p-8 bg-[#1a3c34]/40 rounded-[3rem] border border-secondary/20 space-y-4">
                            <div className="flex items-center gap-3 text-secondary">
                                <ShieldCheck size={20} />
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Admin Authorization</h4>
                            </div>
                            <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
                                Global Data Command is active. Any changes here will be committed instantly to the production ledger. Use with supreme caution.
                            </p>
                        </div>
                    </aside>

                    {/* 📊 DATA TABLE */}
                    <main className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
                        {loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                                <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 animate-pulse">Syncing ${selectedEntity.toUpperCase()} Ledger...</p>
                            </div>
                        ) : data.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-8 opacity-20">
                                <Database size={80} strokeWidth={1} />
                                <p className="text-[10px] font-black uppercase tracking-[0.6em]">No records found for ${selectedEntity.toUpperCase()}</p>
                            </div>
                        ) : (
                            <div className="overflow-auto border-t border-white/5">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/[0.02] border-b border-white/10">
                                            {Object.keys(data[0]).map(key => (
                                                <th key={key} className="px-8 py-8 text-[9px] font-black uppercase tracking-widest text-white/30">{key}</th>
                                            ))}
                                            {canEdit && <th className="px-8 py-8 text-[9px] font-black uppercase tracking-widest text-right text-secondary">Command</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredData.map((row, idx) => (
                                            <tr key={idx} className="group hover:bg-white/[0.03] transition-colors">
                                                {Object.values(row).map((val: any, vIdx) => (
                                                    <td key={vIdx} className="px-8 py-6 text-[10px] font-medium text-white/60 tracking-tight max-w-[200px] truncate">
                                                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                                    </td>
                                                ))}
                                                {canEdit && (
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => setEditingRecord(row)}
                                                                className="p-3 bg-white/5 text-white/20 hover:bg-secondary hover:text-primary rounded-xl transition-all"
                                                            >
                                                                <Edit3 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(row.id)}
                                                                className="p-3 bg-white/5 text-white/20 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* 🛠️ EDIT OVERRIDE MODAL */}
            {editingRecord && (
                <div className="fixed inset-0 z-[200] flex items-center justify-end p-6 lg:p-10 overflow-hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingRecord(null)} />

                    <div className="w-full max-w-2xl bg-[#0b1612] h-full rounded-[4rem] border-l-2 border-secondary/20 relative z-10 animate-in slide-in-from-right duration-500 shadow-2xl flex flex-col">
                        <div className="p-10 border-b border-white/5 flex justify-between items-center">
                            <div className="space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Dynamic Schema Override</h2>
                                <h3 className="text-4xl font-black font-serif italic text-white uppercase leading-none truncate w-[400px]">Edit Record</h3>
                            </div>
                            <button onClick={() => setEditingRecord(null)} className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:bg-red-500/10 hover:text-red-500 transition-all">
                                <X size={32} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 space-y-10">
                            {Object.entries(editingRecord).map(([key, val]) => (
                                <div key={key} className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-4">{key}</label>
                                    {typeof val === 'boolean' ? (
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setEditingRecord({ ...editingRecord, [key]: true })}
                                                className={`flex-1 py-4 rounded-xl border font-black text-[10px] transition-all ${editingRecord[key] ? 'bg-secondary text-primary border-secondary' : 'bg-white/5 border-white/5 text-white/20'}`}
                                            >
                                                TRUE
                                            </button>
                                            <button
                                                onClick={() => setEditingRecord({ ...editingRecord, [key]: false })}
                                                className={`flex-1 py-4 rounded-xl border font-black text-[10px] transition-all ${!editingRecord[key] ? 'bg-secondary text-primary border-secondary' : 'bg-white/5 border-white/5 text-white/20'}`}
                                            >
                                                FALSE
                                            </button>
                                        </div>
                                    ) : (
                                        <textarea
                                            value={typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
                                            onChange={(e) => {
                                                const newval = e.target.value;
                                                if (typeof val === 'object') {
                                                    try {
                                                        setEditingRecord({ ...editingRecord, [key]: JSON.parse(newval) });
                                                    } catch (err) { }
                                                } else if (typeof val === 'number') {
                                                    setEditingRecord({ ...editingRecord, [key]: Number(newval) });
                                                } else {
                                                    setEditingRecord({ ...editingRecord, [key]: newval });
                                                }
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all text-sm font-bold h-24 resize-none"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-6">
                            <button
                                onClick={() => handleSave(editingRecord.id, editingRecord)}
                                disabled={isSaving}
                                className="flex-1 bg-secondary text-primary py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs shadow-xl flex items-center justify-center gap-4 transition-transform active:scale-95"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <> <Save size={18} /> Commit Changes </>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🛡️ INJECT NODE MODAL */}
            {addingRecord && (
                <div className="fixed inset-0 z-[200] flex items-center justify-end p-6 lg:p-10 overflow-hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setAddingRecord(null)} />

                    <div className="w-full max-w-2xl bg-[#0b1612] h-full rounded-[4rem] border-l-2 border-green-500/20 relative z-10 animate-in slide-in-from-right duration-500 shadow-2xl flex flex-col">
                        <div className="p-10 border-b border-white/5 flex justify-between items-center">
                            <div className="space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-green-400">Node Injection Protocol</h2>
                                <h3 className="text-4xl font-black font-serif italic text-white uppercase leading-none truncate w-[400px]">New {selectedEntity} Node</h3>
                            </div>
                            <button onClick={() => setAddingRecord(null)} className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:bg-red-500/10 hover:text-red-500 transition-all">
                                <X size={32} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 space-y-10">
                            {Object.entries(addingRecord).map(([key, val]) => (
                                <div key={key} className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-4">{key}</label>
                                    <textarea
                                        value={typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
                                        onChange={(e) => {
                                            const newval = e.target.value;
                                            if (typeof val === 'object') {
                                                try {
                                                    setAddingRecord({ ...addingRecord, [key]: JSON.parse(newval) });
                                                } catch (err) { }
                                            } else if (typeof val === 'number') {
                                                setAddingRecord({ ...addingRecord, [key]: Number(newval) });
                                            } else {
                                                setAddingRecord({ ...addingRecord, [key]: newval });
                                            }
                                        }}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-green-400/40 transition-all text-sm font-bold h-24 resize-none"
                                        placeholder={`Enter ${key}...`}
                                    />
                                </div>
                            ))}
                            <div className="p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-3xl">
                                <p className="text-[9px] font-black uppercase tracking-widest text-yellow-500 flex items-center gap-2">
                                    <ShieldCheck size={12} /> Schema Warning
                                </p>
                                <p className="text-[8px] font-bold text-white/30 mt-2 leading-relaxed">
                                    Ensure all required fields for the {selectedEntity} table are provided. Missing fields or invalid types will cause the injection sequence to abort.
                                </p>
                            </div>
                        </div>

                        <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-6">
                            <button
                                onClick={() => handleInject(addingRecord)}
                                disabled={isSaving}
                                className="flex-1 bg-green-500 text-[#040d0a] py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs shadow-xl flex items-center justify-center gap-4 transition-transform active:scale-95"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <> <Database size={18} /> Authorize Injection </>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
