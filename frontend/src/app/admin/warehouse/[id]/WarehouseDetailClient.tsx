"use client";

import { useState, useEffect } from "react";
import {
    Warehouse as WarehouseIcon,
    ArrowLeft,
    Plus,
    Search,
    ChevronRight,
    Activity,
    User,
    Package,
    ArrowUpRight,
    Loader2,
    Shield,
    Trash2,
    Edit2,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getApiUrl } from "@/lib/api";

export function WarehouseDetailClient() {
    const { id } = useParams();
    const [node, setNode] = useState<any>(null);
    const [inventory, setInventory] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [allStaff, setAllStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingStock, setIsAddingStock] = useState(false);
    const [isAssigningManager, setIsAssigningManager] = useState(false);

    const [stockForm, setStockForm] = useState({ productId: "", quantity: "" });
    const [managerId, setManagerId] = useState("");

    const fetchData = async () => {
        if (!id) return;
        try {
            const [nodeRes, invRes, prodRes, staffRes] = await Promise.all([
                fetch(getApiUrl(`/api/admin/storage`)),
                fetch(getApiUrl(`/api/admin/storage/${id}/inventory`)),
                fetch(getApiUrl("/api/products")),
                fetch(getApiUrl("/api/admin/users"))
            ]);

            if (nodeRes.ok) {
                const nodes = await nodeRes.json();
                setNode(nodes.find((n: any) => n.id === id));
            }
            if (invRes.ok) setInventory(await invRes.json());
            if (prodRes.ok) {
                const prods = await prodRes.json();
                setAllProducts(prods);
            }
            if (staffRes.ok) {
                const users = await staffRes.json();
                setAllStaff(users.filter((u: any) => u.role === 'staff' || u.role === 'admin' || u.role === 'sub-admin'));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleUpdateStock = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(getApiUrl(`/api/admin/storage/${id}/inventory`), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(stockForm)
            });
            if (res.ok) {
                setIsAddingStock(false);
                setStockForm({ productId: "", quantity: "" });
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssignManager = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/admin/storage/${id}/manager`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ managerId })
            });
            if (res.ok) {
                setIsAssigningManager(false);
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#040d0a] flex items-center justify-center">
            <Loader2 className="animate-spin text-secondary" size={64} />
        </div>
    );

    if (!node) return (
        <div className="min-h-screen bg-[#040d0a] text-white flex flex-col items-center justify-center space-y-6">
            <WarehouseIcon size={80} className="text-white/10" />
            <h1 className="text-4xl font-black font-serif italic uppercase">Node Not Found</h1>
            <Link href="/admin/warehouse" className="text-secondary uppercase tracking-[0.3em] font-black text-[10px] hover:underline">Return to Hub</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-white p-6 lg:p-12 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin/warehouse" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back to Matrix
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Node Operations Control</h2>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            {node.name} <br /><span className="text-secondary">Terminal</span>
                        </h1>
                        <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                            <Activity size={14} className="text-secondary animate-pulse" /> Status: {node.isActive ? 'Active Node' : 'Suspended'} | Location: {node.location}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsAssigningManager(true)}
                            className="bg-white/5 border border-white/10 hover:border-secondary px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3"
                        >
                            <User size={18} /> {node.managerId ? 'Re-Assign Manager' : 'Assign Manager'}
                        </button>
                        <button
                            onClick={() => setIsAddingStock(true)}
                            className="bg-secondary text-primary px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl"
                        >
                            <Plus size={18} /> Sync Inventory
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-3xl font-black font-serif italic uppercase text-white">Stock <span className="text-secondary">Registry</span></h3>
                                <div className="p-4 rounded-2xl bg-white/5">
                                    <Package size={24} className="text-white/20" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {inventory.length > 0 ? inventory.map((item) => (
                                    <div key={item.id} className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-secondary transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center text-secondary relative overflow-hidden shadow-inner">
                                                {item.productImage ? <img src={item.productImage} className="w-full h-full object-cover" alt="" /> : <Package size={28} />}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black font-serif italic text-white uppercase">{item.productName}</h4>
                                                <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">ID: {item.productId.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black font-serif text-white italic">{item.quantity} <span className="text-xs font-sans not-italic text-white/20">Units</span></p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-secondary">Verified Inventory</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-20">
                                        <Shield size={48} />
                                        <p className="font-black font-serif italic uppercase tracking-widest text-sm">No Stock Detected in Node</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-secondary rounded-[3.5rem] p-10 text-primary shadow-2xl relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
                            <div className="absolute -bottom-10 -right-10 text-primary/10 w-48 h-48 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                <Shield size={192} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">Designated Manager</h4>
                                {node.managerId ? (
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black font-serif italic uppercase leading-tight">
                                            {allStaff.find(s => s.id === node.managerId)?.name || 'Loading...'}
                                        </h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{allStaff.find(s => s.id === node.managerId)?.email}</p>
                                        <div className="bg-primary/10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20">
                                            <CheckCircle2 size={12} />
                                            <span className="text-[9px] font-black uppercase tracking-widest uppercase">Verified Custodian</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black font-serif italic uppercase leading-tight">Unassigned</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic leading-relaxed">Infrastructure requires a designated staff node for full compliance.</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsAssigningManager(true)}
                                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl relative z-10"
                            >
                                {node.managerId ? 'Rotate Staff' : 'Initialize Staffing'}
                            </button>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Node Telemetry</h4>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Temperature</span>
                                    <span className="text-lg font-black font-serif italic text-white">{node.temperature || '2.4'}°C</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Hydration Level</span>
                                    <span className="text-lg font-black font-serif italic text-white">{node.humidity || '68'}%</span>
                                </div>
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Units Capacity</span>
                                    <span className="text-lg font-black font-serif italic text-white">{node.capacity || '1000'}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary" style={{ width: '45%' }} />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 text-center uppercase">450 / {node.capacity || '1000'} Utilization</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sync Stock Modal */}
            {isAddingStock && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
                    <div className="bg-[#0a1612] border border-white/10 w-full max-w-xl rounded-[3rem] p-12 shadow-[0_32px_128px_-32px_rgba(197,160,89,0.3)] animate-in zoom-in-95 duration-300">
                        <div className="mb-10 text-center">
                            <h2 className="text-4xl font-black font-serif italic uppercase text-secondary mb-2">Sync Inventory</h2>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Manually update physical asset counts</p>
                        </div>
                        <form onSubmit={handleUpdateStock} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4">Select Asset</label>
                                <select
                                    required
                                    value={stockForm.productId}
                                    onChange={(e) => setStockForm({ ...stockForm, productId: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-sm outline-none focus:border-secondary appearance-none"
                                >
                                    <option value="">Choose Product...</option>
                                    {allProducts.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4">Current Count (Units)</label>
                                <input
                                    type="number"
                                    required
                                    value={stockForm.quantity}
                                    onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-sm outline-none focus:border-secondary"
                                    placeholder="Enter verified quantity..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsAddingStock(false)} className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all text-white/40">Abort Protocol</button>
                                <button type="submit" className="flex-1 bg-secondary text-primary py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Confirm Registry</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Manager Modal */}
            {isAssigningManager && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
                    <div className="bg-[#0a1612] border border-white/10 w-full max-w-xl rounded-[3rem] p-12 shadow-[0_32px_128px_-32px_rgba(197,160,89,0.3)] animate-in zoom-in-95 duration-300">
                        <div className="mb-10 text-center">
                            <h2 className="text-4xl font-black font-serif italic uppercase text-secondary mb-2">Staff Assignment</h2>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Designate custodian for node infrastructure</p>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4">Certified Personnel</label>
                                <select
                                    required
                                    value={managerId}
                                    onChange={(e) => setManagerId(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-sm outline-none focus:border-secondary appearance-none"
                                >
                                    <option value="">Select Staff Member...</option>
                                    {allStaff.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsAssigningManager(false)} className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all text-white/40">Abort</button>
                                <button onClick={handleAssignManager} className="flex-1 bg-secondary text-primary py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Authorize Assignment</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
