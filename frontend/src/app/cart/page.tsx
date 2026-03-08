"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow flex items-center justify-center py-32">
                    <div className="text-center space-y-8">
                        <div className="w-32 h-32 bg-cream rounded-full flex items-center justify-center mx-auto text-primary/20">
                            <ShoppingBag size={64} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold font-serif">Your cart is empty</h1>
                            <p className="text-primary/60">Looks like you haven't added any fresh harvest yet.</p>
                        </div>
                        <Link href="/shop" className="inline-block bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-secondary hover:text-primary transition-all">
                            Go to Shop
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow py-24 bg-cream/30">
                <div className="container mx-auto px-6">
                    <h1 className="text-5xl font-bold font-serif mb-12">Your Shopping Cart</h1>

                    <div className="grid lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="glass p-6 rounded-[2rem] flex gap-8 items-center border border-primary/5 shadow-sm">
                                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>

                                    <div className="flex-grow space-y-2">
                                        <div className="flex justify-between">
                                            <h3 className="text-xl font-bold font-serif">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-primary/20 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-primary/40">{item.category}</p>

                                        <div className="flex justify-between items-end pt-4">
                                            <div className="flex items-center border border-primary/10 rounded-full px-4 py-2 bg-white gap-4">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="font-bold text-primary/40 hover:text-primary">-</button>
                                                <span className="font-bold text-sm">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="font-bold text-primary/40 hover:text-primary">+</button>
                                            </div>
                                            <p className="text-xl font-bold text-secondary">₦{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <aside className="space-y-8">
                            <div className="glass p-10 rounded-[2.5rem] border border-primary/5 shadow-xl space-y-8 sticky top-32">
                                <h2 className="text-2xl font-bold font-serif">Order Summary</h2>

                                <div className="space-y-4 pt-4 border-t border-primary/5">
                                    <div className="flex justify-between text-primary/70">
                                        <span>Subtotal</span>
                                        <span className="font-bold">₦{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-primary/70">
                                        <span>Shipping</span>
                                        <span className="font-bold text-accent">Free</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold pt-4 border-t border-primary/5">
                                        <span>Total</span>
                                        <span className="text-secondary font-serif">₦{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Link href="/checkout" className="w-full bg-primary text-white py-4 rounded-full font-bold hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-3 shadow-lg">
                                    Proceed to Checkout
                                    <ArrowRight size={20} />
                                </Link>

                                <p className="text-center text-[10px] uppercase font-bold tracking-widest text-primary/30">
                                    Secure Checkout Guaranteed
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
