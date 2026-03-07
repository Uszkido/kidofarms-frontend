import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Star, Leaf, ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const product = await db.query.products.findFirst({
        where: eq(products.id, id)
    });

    if (!product) {
        notFound();
    }

    const defaultImages = ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"];
    const displayImages = product.images && (product.images as string[]).length > 0 ? (product.images as string[]) : defaultImages;

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 px-6">
            <main className="flex-grow py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <Link href="/shop" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-10 transition-colors w-fit">
                        <ArrowLeft size={14} /> Back to Shop
                    </Link>

                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-primary/5 shadow-xl">
                                <Image src={displayImages[0]} alt={product.name} fill className="object-cover" />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="bg-cream px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">
                                        {product.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-secondary">
                                        <Star size={14} fill="currentColor" />
                                        <span className="text-sm font-bold text-primary">4.8</span>
                                        <span className="text-sm text-primary/40">(124 reviews)</span>
                                    </div>
                                </div>
                                <h1 className="text-5xl font-bold font-serif">{product.name}</h1>
                                <p className="text-3xl font-bold text-secondary">₦{Number(product.price).toLocaleString()}</p>
                            </div>

                            <p className="text-primary/70 leading-relaxed text-lg">
                                {product.description}
                            </p>

                            <div className="space-y-4 pt-6 border-t border-primary/5">
                                <h3 className="font-bold uppercase text-[12px] tracking-widest text-primary/40">The Farm Source</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-primary">
                                        <Truck size={20} />
                                    </div>
                                    <span className="font-medium">{product.farmSource || "Kido Farms Network"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {["Rich in Vitamin C", "High Fiber Content", "Zero Pesticides", "Locally Grown"].map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm font-medium text-accent">
                                        <Leaf size={16} />
                                        {benefit}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-8">
                                <div className="flex items-center border border-primary/10 rounded-full px-6 py-4 bg-cream/30 gap-6">
                                    <button className="text-xl font-bold text-primary/40 hover:text-primary">-</button>
                                    <span className="font-bold text-lg w-4 text-center">1</span>
                                    <button className="text-xl font-bold text-primary/40 hover:text-primary">+</button>
                                </div>
                                <button className="flex-grow bg-primary text-white rounded-full font-bold px-8 hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-3">
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button className="w-16 h-16 rounded-full border border-primary/10 flex items-center justify-center text-primary/40 hover:text-red-500 hover:border-red-100 transition-all">
                                    <Heart size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-primary/5">
                                <div className="flex gap-3">
                                    <ShieldCheck className="text-secondary" size={24} />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">Secure Delivery</p>
                                        <p className="text-xs text-primary/40">Hygienic packaging & tracking.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <RefreshCw className="text-secondary" size={24} />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">Freshness Refund</p>
                                        <p className="text-xs text-primary/40">If not fresh, we replace it.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
