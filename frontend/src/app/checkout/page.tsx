"use client";

export const dynamic = "force-dynamic";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSession } from "next-auth/react";
import {
    ShieldCheck,
    CreditCard,
    Truck,
    Loader2,
} from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { NIGERIAN_STATES } from "@/lib/constants";
import { GeoapifyAutocomplete } from "@/components/GeoapifyAutocomplete";
import Script from "next/script";

export default function CheckoutPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { cart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: session?.user?.email || "",
        street: "",
        city: "",
        state: "Lagos",
        phone: ""
    });

    const getShippingFee = (stateName: string) => {
        const fees: Record<string, number> = {
            "Plateau": 1500, // Home base
            "Lagos": 3500,
            "Abuja": 3000,
            "Rivers": 4500,
            "Kano": 4000
        };
        return fees[stateName] || 5000; // Default for others
    };

    const shippingFee = getShippingFee(form.state);
    const totalWithShipping = cartTotal + (cart.length > 0 ? shippingFee : 0);

    const config = {
        reference: (new Date()).getTime().toString(),
        email: form.email || "guest@kidofarms.com",
        amount: Math.round(totalWithShipping * 100), // Paystack works in Kobo
        publicKey: 'pk_live_b5974af483a0af6838df8dcad9f24b07bdd09365',
    };

    const handlePaystackSuccessAction = async (reference: any, orderId: string) => {
        setVerifying(true);
        try {
            const res = await fetch(getApiUrl("/api/orders/verify-payment"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reference: reference.reference,
                    orderId,
                    items: cart,
                    totalAmount: totalWithShipping,
                })
            });

            if (res.ok) {
                clearCart();
                router.push("/dashboard/buyer?success=true");
            } else {
                setError("Payment verification failed. Please contact support.");
            }
        } catch (err) {
            setError("Critical verification error.");
        } finally {
            setVerifying(false);
        }
    };

    const handlePaystackCloseAction = () => {
        setLoading(false);
    };

    const initializePaystack = (orderId: string) => {
        // @ts-ignore
        if (typeof window.PaystackPop !== 'undefined') {
            // @ts-ignore
            const handler = window.PaystackPop.setup({
                ...config,
                onClose: handlePaystackCloseAction,
                callback: (response: any) => handlePaystackSuccessAction(response, orderId),
            });
            handler.openIframe();
        } else {
            setError("Payment gateway (Paystack) failed to load. Please refresh.");
            setLoading(false);
        }
    };

    const handleAddressSelect = (address: any) => {
        setForm(prev => ({
            ...prev,
            street: address.address_line1 || address.formatted,
            city: address.city || address.suburb || address.village || prev.city,
            state: address.state || prev.state
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setLoading(true);
        setError("");

        try {
            // First create the order shell (Support Guest Fields)
            const res = await fetch(getApiUrl("/api/orders"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    totalAmount: cartTotal,
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    zip: "00000",
                    paymentMethod: "card", // card/transfer are both handled by Paystack Popup
                    userId: (session?.user as any)?.id || null, // Optional for Guest
                    guestName: `${form.firstName} ${form.lastName}`,
                    guestEmail: form.email,
                    guestPhone: form.phone
                })
            });

            const order = await res.json();
            if (res.ok) {
                initializePaystack(order.id);
            } else {
                setError(order.error || "Order creation failed.");
                setLoading(false);
            }
        } catch (err) {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
            <Header />
            <main className="flex-grow py-24 bg-cream/30">
                <div className="container mx-auto px-6">
                    <h1 className="text-5xl font-bold font-serif mb-12">Checkout</h1>

                    {(error || verifying) && (
                        <div className={`mb-8 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${verifying ? 'bg-secondary/10 border border-secondary/20 text-secondary' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                            {verifying ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                            {verifying ? "Verifying Transaction with Kido Node..." : error}
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-20">
                        <div className="space-y-12">
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                                    <h2 className="text-2xl font-bold font-serif">Shipping Details</h2>
                                </div>

                                <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">First Name</label>
                                        <input
                                            type="text" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">Last Name</label>
                                        <input
                                            type="text" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">Email Address</label>
                                        <input
                                            type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">Shipping Address (Automated)</label>
                                        <GeoapifyAutocomplete
                                            onSelect={handleAddressSelect}
                                            placeholder="Enter your street address..."
                                            initialValue={form.street}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">City / LGA</label>
                                        <input
                                            type="text" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">State</label>
                                        <select
                                            required
                                            value={form.state}
                                            onChange={e => setForm({ ...form, state: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium appearance-none"
                                        >
                                            {NIGERIAN_STATES.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">Phone Number</label>
                                        <input
                                            type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium"
                                        />
                                    </div>
                                </form>
                            </section>

                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                                    <h2 className="text-2xl font-bold font-serif">Payment Method</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex items-center justify-center gap-3 p-6 rounded-3xl border-2 border-secondary bg-white shadow-sm transition-all hover:scale-[1.02]">
                                        <CreditCard className="text-secondary" />
                                        <span className="font-bold">Card or Transfer</span>
                                    </button>
                                    <div className="flex flex-col items-center justify-center p-6 rounded-3xl border border-primary/5 bg-white/50 opacity-60">
                                        <ShieldCheck className="text-secondary/40" />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter mt-1">Paystack Secured</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-primary/40 px-2">Selecting "Paystack" allows you to pay via Card, Bank Transfer, USSD, or QR Code securely.</p>
                            </section>
                        </div>

                        <aside>
                            <div className="glass p-12 rounded-[3rem] border border-primary/5 shadow-2xl space-y-8 sticky top-32">
                                <h2 className="text-2xl font-bold font-serif">Order Summary</h2>

                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {cart.length === 0 && <p className="text-sm text-primary/60 italic">Your cart is empty.</p>}
                                </div>

                                <div className="space-y-4 pt-8 border-t border-primary/5">
                                    <div className="flex justify-between text-sm font-medium text-primary/60">
                                        <span>Cart Subtotal</span>
                                        <span>₦{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-primary/60">
                                        <span>Logistics ({form.state})</span>
                                        <span>₦{shippingFee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-2xl pt-4 border-t border-primary/5">
                                        <span>Grand Total</span>
                                        <span className="text-secondary font-serif">₦{totalWithShipping.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    form="checkout-form"
                                    type="submit"
                                    disabled={loading || verifying || cart.length === 0}
                                    className="w-full bg-primary text-white py-5 rounded-full font-bold hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3 text-lg disabled:opacity-50 active:scale-95"
                                >
                                    {loading || verifying ? <Loader2 className="animate-spin" size={24} /> : "Proceed to Secure Payment"}
                                </button>

                                <div className="text-center">
                                    <p className="text-[11px] text-primary/40">Secured with Yield-Shield™ Encryption Technology</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
