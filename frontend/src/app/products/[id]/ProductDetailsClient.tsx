"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Star, Leaf, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductReviews from "@/components/ProductReviews";
import { ActionStatus } from "@/components/ActionStatus";

export function ProductDetailsClient({ product, id }: { product: any, id: string }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [actionState, setActionState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        status: "processing" | "success" | "error";
    }>({
        isOpen: false,
        title: "",
        message: "",
        status: "processing"
    });

    const defaultImages = ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"];
    const displayImages = product.images && (product.images as string[]).length > 0 ? (product.images as string[]) : defaultImages;

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: displayImages[0],
            quantity: quantity,
            category: product.category
        });

        setActionState({
            isOpen: true,
            title: "Added to Cart",
            message: `${quantity}x ${product.name} has been added to your cart.`,
            status: "success"
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50">
            <ActionStatus
                isOpen={actionState.isOpen}
                onClose={() => setActionState(prev => ({ ...prev, isOpen: false }))}
                title={actionState.title}
                message={actionState.message}
                status={actionState.status}
            />

            <main className="flex-grow py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <Link href="/shop" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-10 transition-colors w-fit">
                        <ArrowLeft size={14} /> Back to Shop
                    </Link>

                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-primary/5 shadow-xl bg-white">
                                <Image
                                    src={displayImages[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
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
                                        <span className="text-sm font-bold text-primary">{product.rating || "4.8"}</span>
                                        <span className="text-sm text-primary/40">({product.numReviews || "124"} reviews)</span>
                                    </div>
                                </div>
                                <h1 className="text-5xl font-bold font-serif">{product.name}</h1>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-secondary">₦{Number(product.price).toLocaleString()}</p>
                                    <p className="text-sm font-bold text-primary/30 uppercase">per {product.unit || "unit"}</p>
                                </div>
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
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="text-xl font-bold text-primary/40 hover:text-primary transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="text-xl font-bold text-primary/40 hover:text-primary transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-grow bg-primary text-white rounded-full font-bold px-8 hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/10 active:scale-95"
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button className="w-16 h-16 rounded-full border border-primary/10 flex items-center justify-center text-primary/40 hover:text-red-500 hover:border-red-100 transition-all active:scale-95 bg-white">
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

                {/* Customer Reviews */}
                <div className="container mx-auto px-6 max-w-7xl mt-20 pt-16 border-t border-primary/5">
                    <h2 className="text-4xl font-black font-serif uppercase tracking-tighter mb-12">
                        Customer <span className="text-secondary italic">Reviews</span>
                    </h2>
                    <ProductReviews productId={id} productName={product.name} />
                </div>
            </main>
        </div>
    );
}

