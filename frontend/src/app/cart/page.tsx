"use client";
import { useState } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag, ArrowRight, Sparkles, Loader2, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { getApiUrl } from "@/lib/api";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [recipeLoading, setRecipeLoading] = useState(false);
    const [recipe, setRecipe] = useState<any>(null);

    const handleSuggestRecipe = async () => {
        setRecipeLoading(true);
        try {
            const res = await axios.post(getApiUrl("/api/ai/suggest-recipe"), {
                items: cart.map(i => i.name)
            });
            setRecipe(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setRecipeLoading(false);
        }
    };

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

                            {/* AI Recipe Suggestions */}
                            <div className="bg-primary rounded-[2.5rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                                <div className="space-y-2 relative">
                                    <h3 className="text-xl font-black font-serif flex items-center gap-3 italic">
                                        <Sparkles size={20} className="text-secondary" />
                                        Recipe <span className="text-secondary">AI</span>
                                    </h3>
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Powered by Gemini</p>
                                </div>

                                {recipe ? (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                            <h4 className="text-2xl font-black font-serif text-secondary">{recipe.recipeName}</h4>
                                            <p className="text-xs font-medium leading-relaxed text-white/70">{recipe.instructions}</p>
                                        </div>
                                        {recipe.missingIngredients?.length > 0 && (
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black uppercase text-secondary tracking-widest">Complete the meal:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {recipe.missingIngredients.map((ing: string, i: number) => (
                                                        <span key={i} className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-black">{ing}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setRecipe(null)}
                                            className="text-[10px] font-black uppercase text-white/30 hover:text-white transition-colors"
                                        >
                                            Reset Suggestions
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <p className="text-sm font-medium leading-relaxed text-white/60">
                                            Want to cook something special with these ingredients? Let our AI suggest a recipe.
                                        </p>
                                        <button
                                            onClick={handleSuggestRecipe}
                                            disabled={recipeLoading}
                                            className="w-full bg-secondary text-primary py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3"
                                        >
                                            {recipeLoading ? <Loader2 size={18} className="animate-spin" /> : <UtensilsCrossed size={18} />}
                                            {recipeLoading ? "Brewing Ideas..." : "Suggest a Recipe"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
