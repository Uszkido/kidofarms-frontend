"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Star, Leaf, ArrowLeft, Loader2, User, ArrowRight, Activity } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductReviews from "@/components/ProductReviews";
import { ActionStatus } from "@/components/ActionStatus";
import { GrowthJourney } from "@/components/GrowthJourney";
import FarmerStoryModal from "@/components/FarmerStoryModal";
import KidoTraceQR from "@/components/KidoTraceQR";
import { trackConversion } from "@/lib/analytics";
import { getApiUrl } from "@/lib/api";
import { NIGERIAN_STATES } from "@/lib/constants";

export function ProductDetailsClient({ product, id }: { product: any, id: string }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);
    const [deliveryState, setDeliveryState] = useState("Lagos");
    const [deliveryQuote, setDeliveryQuote] = useState<{ fee: number; estimate: string } | null>(null);
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

    useEffect(() => {
        trackConversion("product_viewed", { productId: product.id });
    }, [product.id]);

    useEffect(() => {
        let cancelled = false;
        fetch(getApiUrl(`/api/orders/delivery-quote?state=${encodeURIComponent(deliveryState)}`))
            .then((response) => response.ok ? response.json() : null)
            .then((quote) => { if (!cancelled) setDeliveryQuote(quote); })
            .catch(() => { if (!cancelled) setDeliveryQuote(null); });
        return () => { cancelled = true; };
    }, [deliveryState]);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: displayImages[0],
            quantity: quantity,
            category: product.category
        });
        trackConversion("add_to_cart", { productId: product.id, value: Number(product.price) * quantity });

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

            <main className="flex-grow py-24 pb-32 md:pb-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <Link href="/shop" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-10 transition-colors w-fit">
                        <ArrowLeft size={14} /> Back to Shop
                    </Link>

                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-primary/5 shadow-xl bg-white">
                                <Image
                                    src={displayImages[selectedImage]}
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
                                <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight">{product.name}</h1>
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
                                <button
                                    onClick={() => setIsFarmerModalOpen(true)}
                                    className="flex items-center gap-3 group text-left"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary group-hover:bg-secondary transition-colors">
                                        <User size={24} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-primary italic uppercase tracking-tighter group-hover:text-secondary transition-colors">{product.farmSource || "Kido Verified Producer"}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-primary/30 flex items-center gap-2">
                                            View Biotic Signature <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                        </p>
                                    </div>
                                </button>
                            </div>

                            <FarmerStoryModal
                                isOpen={isFarmerModalOpen}
                                onClose={() => setIsFarmerModalOpen(false)}
                                farmerName={product.farmSource}
                                bio={product.farmerBio}
                                location={product.farmLocation}
                                years={product.yearsActive}
                                specialty={product.category}
                                experience="Master Producer"
                            />

                            <div className="grid sm:grid-cols-2 gap-4">
                                {["Farm-source verified", "Traceable batch", "Carefully packed", "Locally sourced"].map((benefit, i) => (
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
                                        onClick={() => setQuantity(Math.min(Number(product.stock) || 1, quantity + 1))}
                                        disabled={quantity >= Number(product.stock)}
                                        className="text-xl font-bold text-primary/40 hover:text-primary transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={Number(product.stock) < 1}
                                    className="flex-grow bg-primary text-white rounded-full font-bold px-8 hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/10 active:scale-95"
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button className="w-16 h-16 rounded-full border border-primary/10 flex items-center justify-center text-primary/40 hover:text-red-500 hover:border-red-100 transition-all active:scale-95 bg-white">
                                    <Heart size={24} />
                                </button>
                            </div>
                            {displayImages.length > 1 && <div className="flex gap-3 overflow-x-auto pb-1">{displayImages.map((image, index) => <button key={image} type="button" onClick={() => setSelectedImage(index)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${selectedImage === index ? 'border-secondary' : 'border-transparent'}`}><Image src={image} alt={`${product.name} view ${index + 1}`} fill className="object-cover" /></button>)}</div>}
                            <Link href={`/wholesale?product=${encodeURIComponent(product.name)}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary/65 underline decoration-secondary decoration-2 underline-offset-4 hover:text-primary"><Truck size={16} /> Need a bulk quantity? Request a wholesale quote</Link>

                            <div className="pt-8 border-t border-primary/5 flex flex-wrap gap-4">
                                <KidoTraceQR
                                    batchId={`NOD-${id.slice(-4).toUpperCase()}`}
                                    productName={product.name}
                                    farmSource={product.farmSource}
                                />
                                <div className="flex-grow bg-white border border-primary/5 p-6 rounded-2xl flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase text-primary/30">Stock Availability</p>
                                        <p className="text-xs font-black text-primary uppercase">{Number(product.stock) > 0 ? `${product.stock} ${product.unit || 'units'} available` : "Currently out of stock"}</p>
                                    </div>
                                    <Activity className="text-secondary animate-pulse" size={18} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-primary/5">
                                <div className="flex gap-3">
                                    <ShieldCheck className="text-secondary" size={24} />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">Secure Delivery</p>
                                        <p className="text-xs text-primary/40">Delivery cost and timing confirmed at checkout.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <RefreshCw className="text-secondary" size={24} />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">Freshness Refund</p>
                                        <p className="text-xs text-primary/40">Contact support promptly if your order arrives damaged.</p>
                                    </div>
                                </div>
                            </div>

                            <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm space-y-4">
                                <div className="flex items-center gap-3"><Truck className="text-secondary" size={20} /><h3 className="text-sm font-black text-primary">Delivery to your location</h3></div>
                                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                                    <label htmlFor="product-delivery-state" className="text-xs font-bold text-primary/60">Deliver to</label>
                                    <select id="product-delivery-state" value={deliveryState} onChange={(event) => setDeliveryState(event.target.value)} className="min-w-0 rounded-xl border border-primary/10 bg-cream/30 px-4 py-3 text-sm font-bold text-primary outline-none focus:border-secondary">
                                        {NIGERIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                                    </select>
                                </div>
                                <p className="text-sm text-primary/70">{deliveryQuote ? <>Delivery is <strong>₦{Number(deliveryQuote.fee).toLocaleString()}</strong> to {deliveryState}, estimated <strong>{deliveryQuote.estimate}</strong>.</> : "Check delivery availability at checkout."}</p>
                                <p className="text-[11px] text-primary/45">Order cutoff and final delivery slot are confirmed during checkout.</p>
                            </section>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-5 gap-12 mt-24">
                        <div className="md:col-span-3">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary mb-4">Farm Transparency</h2>
                            <h3 className="text-4xl font-black font-serif italic mb-10 text-primary">The <span className="text-secondary tracking-tighter">Harvest</span> Journey</h3>
                            <GrowthJourney stages={product.growthJournal} />
                        </div>
                        <div className="md:col-span-2 space-y-8">
                            <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                                <div className="space-y-6 relative">
                                    <div className="flex items-center gap-2 text-secondary text-[10px] font-black uppercase tracking-widest">
                                        <div className="w-2 h-2 rounded-full bg-secondary" /> Node_Audit-PH-09
                                    </div>
                                    <h4 className="text-3xl font-black font-serif uppercase tracking-tighter italic">Freshness <br /><span className="text-secondary">Certificate</span></h4>

                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        {[
                                            { label: "Harvest Date", value: product.harvestDate ? new Date(product.harvestDate).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) : "Verified on request" },
                                            { label: "Source", value: product.farmSource || "Kido verified producer" },
                                            { label: "Farm source", value: product.farmSource || "Kido verified producer" },
                                            { label: "Storage", value: "Keep chilled after delivery" },
                                            { label: "Need help?", value: "Contact support" },
                                        ].map((stat: any, i) => (
                                            <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase">
                                                <span className="text-white/40">{stat.label}</span>
                                                <span className="text-secondary">{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 group hover:bg-white/10 cursor-pointer transition-all">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Verify Batch Authenticity</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[3rem] p-10 border border-primary/5 shadow-xl space-y-6">
                                <h4 className="text-xl font-black font-serif italic text-primary">Sustainability <span className="text-secondary tracking-tighter">Score</span></h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black font-serif text-primary italic">A+</span>
                                    <span className="text-[10px] font-black uppercase text-primary/30">Top 5% Eco-Impact</span>
                                </div>
                                <p className="text-[10px] font-medium leading-relaxed text-primary/60">
                                    This product contributed to a 12% reduction in water usage compared to standard farming practices in Kano State.
                                </p>
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
            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden"><div className="mx-auto flex max-w-lg items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-primary">{product.name}</p><p className="font-serif text-lg font-black text-secondary">₦{Number(product.price).toLocaleString()}</p></div><button onClick={handleAddToCart} disabled={Number(product.stock) < 1} className="rounded-full bg-primary px-5 py-3 text-xs font-black text-white disabled:opacity-40">Add to cart</button></div></div>
        </div>
    );
}

