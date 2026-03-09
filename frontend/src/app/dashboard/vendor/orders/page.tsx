"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Package,
    Search,
    Filter,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Clock,
    Truck,
    ArrowUpRight,
    MessageSquare,
    DollarSign,
    User
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function VendorOrdersPage() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if ((session?.user as any)?.id) {
            fetchOrders();
        }
    }, [session]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/orders/vendor/${(session?.user as any)?.id}`));
            if (res.ok) setOrders(await res.json());
        } catch (err) {
            console.error("Failed to fetch vendor orders", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(item =>
        item.order?.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.order?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-6">
                <Loader2 className="animate-spin text-secondary" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF9] pb-24 px-6 md:px-10">
            <div className="max-w-[1400px] mx-auto space-y-12">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-12">
                    <div className="space-y-4">
                        <Link href="/dashboard/vendor" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 hover:text-primary transition-all mb-4">
                            <ArrowLeft size={14} /> Back to Command
                        </Link>
                        <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest border border-secondary/20">
                            <Clock size={14} /> Live Fulfillment Stream
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black font-serif text-primary leading-none">Order <br /><span className="text-secondary italic">Registry</span></h1>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:w-80">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                            <input
                                type="text"
                                placeholder="Filter by Order ID or Customer..."
                                className="w-full bg-white border-2 border-primary/5 rounded-2xl pl-16 pr-6 py-4 font-bold text-primary focus:border-secondary transition-all outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {/* Orders table / list */}
                <div className="bg-white rounded-[3.5rem] border border-primary/5 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-primary/5">
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Order Info</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Customer</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Product Details</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Quantity</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Subtotal</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5 font-bold">
                                {filteredOrders.map((item) => (
                                    <tr key={item.id} className="hover:bg-cream/20 transition-all group cursor-pointer">
                                        <td className="px-10 py-8">
                                            <div className="space-y-1">
                                                <p className="text-primary group-hover:text-secondary transition-colors uppercase tracking-tighter">#{item.order?.id.split('-')[0]}</p>
                                                <p className="text-[10px] text-primary/20 uppercase tracking-widest">{new Date(item.order?.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-primary/40">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-primary">{item.order?.user?.name || "Anonymous"}</p>
                                                    <p className="text-[10px] text-primary/20 uppercase tracking-widest leading-none">Verified Buyer</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                                                    className="w-12 h-12 rounded-xl object-cover"
                                                    alt={item.product?.name}
                                                />
                                                <p className="text-sm text-primary max-w-[200px] truncate">{item.product?.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-primary/40 text-center">x{item.quantity}</td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2 text-primary">
                                                <DollarSign size={14} className="text-secondary" />
                                                {(item.quantity * parseFloat(item.price)).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                <CheckCircle2 size={12} /> {item.order?.status || 'Active'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="py-24 flex flex-col items-center justify-center gap-6">
                            <Package size={64} strokeWidth={1} className="text-primary/10" />
                            <p className="font-black text-xs uppercase tracking-widest text-primary/20">No orders detected in the registry.</p>
                        </div>
                    )}
                </div>

                {/* Growth Stats Footer */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-primary text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-20 -translate-y-1/2 translate-x-1/2 rounded-full blur-[60px]" />
                        <ArrowUpRight className="text-secondary mb-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" size={32} />
                        <h4 className="text-4xl font-black font-serif italic mb-2">Fulfilled</h4>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total units delivered this month</p>
                    </div>
                    <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-4">
                        <MessageSquare className="text-secondary" size={32} />
                        <h4 className="text-2xl font-black font-serif">Support Matrix</h4>
                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest leading-relaxed">Need help with an order? Contact our regional logistics node.</p>
                    </div>
                    <div className="bg-secondary p-10 rounded-[3.5rem] shadow-2xl space-y-4">
                        <Truck className="text-primary" size={32} />
                        <h4 className="text-2xl font-black font-serif italic">Dispatch Log</h4>
                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest leading-relaxed">Download manifest for today's pickup.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
