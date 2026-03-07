import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    ArrowLeft,
    Edit,
    Trash2,
    AlertTriangle
} from "lucide-react";
import { db } from "@/db";
import { products as productSchema } from "@/db/schema";
import { desc } from "drizzle-orm";
import Image from "next/image";

// Fetch products from DB
async function getProducts() {
    const data = await db.select().from(productSchema).orderBy(desc(productSchema.createdAt));
    return data;
}

export default async function InventoryPage() {
    const products = await getProducts();

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-4 transition-colors">
                                <ArrowLeft size={14} /> Back to Hub
                            </Link>
                            <h1 className="text-4xl font-black font-serif uppercase tracking-tighter">Inventory <span className="text-secondary italic">Control</span></h1>
                            <p className="text-primary/40 font-medium text-sm mt-2">Manage your marketplace listings and stock levels.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0 hidden md:block">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
                                <input
                                    type="text"
                                    placeholder="Search SKU or Name..."
                                    className="w-full md:w-64 bg-white border border-primary/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none shadow-sm"
                                />
                            </div>
                            <button className="bg-white border border-primary/10 p-4 rounded-2xl text-primary hover:bg-neutral-100 transition-all shadow-sm">
                                <Filter size={20} />
                            </button>
                            <Link href="/admin/inventory/new" className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 whitespace-nowrap">
                                <Plus size={18} /> New Item
                            </Link>
                        </div>
                    </div>

                    {/* Inventory Table Container */}
                    <div className="bg-white rounded-[3rem] border border-primary/5 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-primary/5 bg-neutral-50/50">
                                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Product Info</th>
                                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Category / Source</th>
                                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Stock Status</th>
                                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Price</th>
                                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-primary/40 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-b border-primary/5 hover:bg-neutral-50/50 transition-colors group">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 relative overflow-hidden shrink-0 border border-primary/5">
                                                        {(product.images as string[])?.[0] ? (
                                                            <Image src={(product.images as string[])[0]} alt={product.name} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-primary/20">img</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-primary text-lg">{product.name}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-secondary/10 text-secondary">{product.unit || 'piece'}</span>
                                                            {product.isFeatured && (
                                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-100 text-blue-600">Featured</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <p className="font-bold text-sm text-primary">{product.category}</p>
                                                <p className="text-xs font-medium text-primary/40 mt-1">{product.farmSource || 'Unknown Farm'}</p>
                                            </td>
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-2">
                                                    {product.stock > 10 ? (
                                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                                    ) : product.stock > 0 ? (
                                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                    ) : (
                                                        <span className="w-2 h-2 rounded-full bg-red-500" />
                                                    )}
                                                    <div>
                                                        <p className="font-black text-sm">{product.stock}</p>
                                                        <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">
                                                            {product.stock === 0 ? 'Out of Stock' : 'Available'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <p className="font-black font-serif text-xl">₦{(Number(product.price)).toLocaleString()}</p>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 text-primary/40 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button className="p-2 text-primary/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <button className="p-2 text-primary/40 hover:text-primary hover:bg-neutral-100 rounded-xl transition-all hidden md:block">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center justify-center text-primary/30">
                                                    <AlertTriangle size={48} className="mb-4 text-amber-500/50" />
                                                    <p className="font-black text-lg">No Inventory Found</p>
                                                    <p className="text-sm font-medium mt-1">Add your first product to get started.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination footer */}
                        <div className="p-6 border-t border-primary/5 flex items-center justify-between bg-neutral-50/30">
                            <p className="text-xs font-black uppercase tracking-widest text-primary/40">Showing {products.length} Items</p>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 rounded-xl text-xs font-black uppercase border border-primary/10 text-primary/40 hover:bg-white hover:text-primary transition-all disabled:opacity-50">Prev</button>
                                <button className="px-4 py-2 rounded-xl text-xs font-black uppercase border border-primary/10 text-primary/40 hover:bg-white hover:text-primary transition-all disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
