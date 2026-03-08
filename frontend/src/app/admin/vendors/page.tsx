"use client";

import { useState, useEffect } from "react";
import { Users, Shield, ShieldAlert, CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function VendorsPage() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await fetch(getApiUrl("/api/vendors"));
            const data = await res.json();
            setVendors(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/vendors/${id}/status`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchVendors();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-cream/30 p-6 lg:p-12">
            <div className="max-w-[1200px] mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-neutral-50 transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black font-serif text-primary">Farmer <span className="text-secondary italic">Network</span></h1>
                            <p className="text-sm font-medium text-primary/40">Manage vendor applications and verification</p>
                        </div>
                    </div>
                </header>

                <div className="bg-white rounded-[3rem] border border-primary/5 shadow-xl overflow-hidden">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-secondary" size={40} />
                            <p className="font-black text-xs uppercase tracking-widest text-primary/20">Loading Growers...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50 border-b border-primary/5">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Business Name</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Owner</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Categories</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5">
                                    {vendors.map((vendor) => (
                                        <tr key={vendor.id} className="group hover:bg-neutral-50 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="font-black text-primary uppercase tracking-tight">{vendor.businessName}</p>
                                                <p className="text-[10px] text-primary/40 font-medium">Joined {new Date(vendor.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-sm text-primary">{vendor.userName}</p>
                                                <p className="text-[10px] text-primary/40 font-medium">{vendor.userEmail}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-1">
                                                    {vendor.categories && vendor.categories.length > 0 ? (
                                                        vendor.categories.map((cat: string) => (
                                                            <span key={cat} className="px-2 py-0.5 bg-primary/5 border border-primary/10 rounded text-[8px] font-black text-primary/60 uppercase">
                                                                {cat}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[8px] font-bold text-primary/20 italic">No categories</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${vendor.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                    vendor.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                                        'bg-red-100 text-red-600'
                                                    }`}>
                                                    {vendor.status === 'approved' ? <CheckCircle size={10} /> :
                                                        vendor.status === 'pending' ? <Shield size={10} /> :
                                                            <ShieldAlert size={10} />}
                                                    {vendor.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {vendor.status !== 'approved' && (
                                                        <button
                                                            onClick={() => updateStatus(vendor.id, 'approved')}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    {vendor.status !== 'suspended' && (
                                                        <button
                                                            onClick={() => updateStatus(vendor.id, 'suspended')}
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {vendors.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                <p className="text-primary/20 font-black uppercase tracking-widest">No vendors found.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
