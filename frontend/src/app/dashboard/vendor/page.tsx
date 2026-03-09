
import {
    LayoutDashboard,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    Package,
    Plus,
    ArrowRight,
    Search,
    Filter,
    Activity,
    Users,
    ChevronRight,
    Box,
    Clock,
    User,
    ArrowUpRight,
    CheckCircle,
    BarChart3,
    Wallet
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getApiUrl } from "@/lib/api";

export default async function VendorDashboard() {
    const stats = {
        totalSales: "₦1.2M",
        activeOrders: 12,
        stockItems: 45,
        growth: "+18%"
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-32 pb-24 bg-cream/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">

                        {/* Hero Section */}
                        <header className="relative py-12 px-10 bg-primary rounded-[3rem] overflow-hidden shadow-2xl group">
                            <div className="absolute top-0 right-0 w-[40%] h-full bg-secondary/10 -skew-x-12 translate-x-1/2 group-hover:bg-secondary/20 transition-all duration-700" />
                            <div className="absolute top-10 right-20 w-32 h-32 bg-secondary rounded-full blur-[100px] opacity-20" />

                            <div className="relative space-y-6">
                                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest backdrop-blur-md">
                                    <BarChart3 size={14} /> Performance Outlook
                                </div>
                                <h2 className="text-4xl md:text-7xl font-black font-serif text-white tracking-tight leading-none">
                                    Merchant <br />
                                    <span className="text-secondary italic">Control Node</span>
                                </h2>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Link href="/admin/inventory/new" className="bg-secondary text-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center gap-2">
                                        <Plus size={16} /> New Product
                                    </Link>
                                    <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                                        <Wallet size={16} /> Cash Out Details
                                    </button>
                                </div>
                            </div>
                        </header>

                        {/* Growth Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Growth Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 hover:shadow-xl transition-all">
                                    <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-primary">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif">{stats.totalSales}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">Total Revenue</p>
                                        <span className="inline-block mt-3 text-[10px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded">
                                            {stats.growth}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 hover:shadow-xl transition-all">
                                    <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-primary">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif">{stats.activeOrders}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">Active Orders</p>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 hover:shadow-xl transition-all">
                                    <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-primary">
                                        <Box size={24} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif">{stats.stockItems}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">Stock Items</p>
                                    </div>
                                </div>

                                <div className="bg-primary p-8 rounded-[2.5rem] shadow-xl text-white space-y-4 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-secondary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center relative">
                                        <TrendingUp size={24} className="text-secondary" />
                                    </div>
                                    <div className="relative">
                                        <p className="text-3xl font-black font-serif italic text-secondary leading-none">Scale Up</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-2">Elite Status</p>
                                        <ChevronRight className="absolute bottom-0 right-1 text-white/20 group-hover:text-secondary group-hover:translate-x-2 transition-all" size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Action Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <Link href="/dashboard/vendor/orders" className="bg-primary text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-20 -translate-y-1/2 translate-x-1/2 rounded-full blur-[60px]" />
                                    <Package className="text-secondary mb-6 group-hover:scale-110 transition-transform" size={40} />
                                    <div className="space-y-4">
                                        <h4 className="text-3xl font-black font-serif italic mb-2">Order Vault</h4>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">View all active and fulfilled sales from your unique stock node.</p>
                                    </div>
                                    <div className="mt-8 inline-flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-widest">
                                        Access Ledger <ArrowUpRight size={14} />
                                    </div>
                                </Link>

                                <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-2xl flex flex-col justify-between min-h-[300px]">
                                    <TrendingUp className="text-secondary" size={40} />
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black font-serif">Growth Matrix</h4>
                                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest leading-relaxed">Advanced analytics for your farm's performance and regional reach.</p>
                                    </div>
                                </div>

                                <div className="bg-secondary p-10 rounded-[3.5rem] shadow-2xl flex flex-col justify-between min-h-[300px]">
                                    <CheckCircle className="text-primary" size={40} />
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black font-serif italic">Support Node</h4>
                                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest leading-relaxed">Direct line to Kido Farms logistics and vendor success agents.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Catalog Section */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className="flex items-center justify-between px-4">
                                    <h2 className="text-3xl font-black font-serif text-primary">Product <span className="text-secondary italic">Lifecycle</span></h2>
                                    <button className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-neutral-50 transition-all">
                                        <Search size={20} className="text-primary/20" />
                                    </button>
                                </div>

                                <div className="bg-white rounded-[3rem] border border-primary/5 shadow-xl overflow-hidden p-8">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-primary/5 text-left text-[10px] font-black uppercase tracking-widest text-primary/20">
                                                <th className="px-4 py-4">Product</th>
                                                <th className="px-4 py-4">Inventory</th>
                                                <th className="px-4 py-4 text-right">Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-primary/5">
                                            {[
                                                { name: "Organic Honey Extract", stock: 124, price: "₦4,500", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80" },
                                                { name: "Dried Plantain Chips", stock: 56, price: "₦1,200", img: "https://images.unsplash.com/photo-1613511721526-78810e7b886c?auto=format&fit=crop&q=80" },
                                                { name: "Cold Pressed Palm Oil", stock: 12, price: "₦8,900", img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80" }
                                            ].map((item, i) => (
                                                <tr key={i} className="group hover:bg-neutral-50/50 transition-colors">
                                                    <td className="px-4 py-6 flex items-center gap-4">
                                                        <img src={item.img} className="w-14 h-14 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform" />
                                                        <div>
                                                            <p className="font-black text-primary font-serif uppercase tracking-tight">{item.name}</p>
                                                            <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Modified 2 days ago</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full ${item.stock < 20 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                                            <span className="text-xs font-black">{item.stock} Units</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-6 text-right font-black text-sm">{item.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <Link href="/admin/inventory" className="block w-full text-center py-5 text-[10px] font-black uppercase tracking-widest text-primary/20 hover:text-primary transition-all bg-neutral-50/50 rounded-b-[2rem]">
                                        View Complete Catalog
                                    </Link>
                                </div>
                            </div>

                            {/* Sidebar: Settlements & Network */}
                            <div className="lg:col-span-4 space-y-8">
                                <h2 className="text-3xl font-black font-serif px-4 text-primary">Payout <span className="text-secondary italic">Registry</span></h2>
                                <div className="bg-secondary rounded-[3rem] p-10 space-y-8 shadow-xl">
                                    <div className="space-y-6">
                                        {[
                                            { date: "Mar 08", amount: "₦240k", status: "Settled" },
                                            { date: "Feb 28", amount: "₦185k", status: "Settled" },
                                            { date: "Feb 14", amount: "₦410k", status: "Processing" }
                                        ].map((pay, i) => (
                                            <div key={i} className="flex justify-between items-center border-b border-primary/10 pb-4 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="text-xs font-black">{pay.date}</p>
                                                    <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Batch #{1024 - i}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-primary">{pay.amount}</p>
                                                    <p className={`text-[8px] font-black uppercase tracking-widest ${pay.status === 'Settled' ? 'text-green-600' : 'text-primary'}`}>{pay.status}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl">
                                        Request Summary
                                    </button>
                                </div>

                                <div className="bg-primary rounded-[3rem] p-10 text-white space-y-6 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
                                    <div className="relative space-y-4">
                                        <h4 className="text-xl font-black font-serif leading-tight">Need Support <br />From the Network?</h4>
                                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Connect with specialized logistics and supply chain experts.</p>
                                        <button className="flex items-center gap-2 font-black text-xs uppercase tracking-widest border-b-2 border-white/20 hover:border-white transition-all pb-1">
                                            Open Support Ticket <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
