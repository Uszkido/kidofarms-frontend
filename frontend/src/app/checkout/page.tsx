"use client";

export const dynamic = "force-dynamic";


import { useEffect, useState } from "react";
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
import { authenticatedFetch, getApiUrl } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { NIGERIAN_STATES } from "@/lib/constants";
import { GeoapifyAutocomplete } from "@/components/GeoapifyAutocomplete";
import Script from "next/script";
import { trackConversion } from "@/lib/analytics";

type PaystackResponse = { reference: string };

declare global {
    interface Window {
        PaystackPop?: {
            setup: (config: {
                reference: string;
                email: string;
                amount: number;
                publicKey: string;
                onClose: () => void;
                callback: (response: PaystackResponse) => void;
            }) => { openIframe: () => void };
        };
    }
}

export default function CheckoutPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { cart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: session?.user?.email || "",
        street: "",
        city: "",
        state: "Lagos",
        phone: ""
    });

    const [deliveryQuote, setDeliveryQuote] = useState<{ fee: number; estimate: string } | null>(null);
    const [loadingQuote, setLoadingQuote] = useState(true);
    const [deliverySlots, setDeliverySlots] = useState<string[]>([]);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [saveAddress, setSaveAddress] = useState(false);
    const [deliverySlot, setDeliverySlot] = useState("");

    useEffect(() => {
        if (session?.user?.email) setForm((current) => current.email ? current : { ...current, email: session.user?.email || '' });
    }, [session?.user?.email]);

    useEffect(() => {
        let cancelled = false;
        setLoadingQuote(true);
        fetch(getApiUrl(`/api/orders/delivery-quote?state=${encodeURIComponent(form.state)}`))
            .then(async (res) => {
                if (!res.ok) throw new Error('Quote unavailable');
                return res.json();
            })
            .then((quote) => {
                if (!cancelled) setDeliveryQuote(quote);
            })
            .catch(() => {
                if (!cancelled) setDeliveryQuote(null);
            })
            .finally(() => {
                if (!cancelled) setLoadingQuote(false);
            });
        return () => { cancelled = true; };
    }, [form.state]);

    useEffect(() => {
        fetch(getApiUrl('/api/orders/delivery-slots')).then((response) => response.json()).then((data) => {
            const slots = Array.isArray(data.slots) ? data.slots : [];
            setDeliverySlots(slots); setDeliverySlot((current) => current || slots[0] || '');
        }).catch(() => undefined);
    }, []);

    useEffect(() => {
        if (!session?.user) return;
        void authenticatedFetch('/api/customers/addresses').then(async (response) => {
            if (!response.ok) return;
            const addresses = await response.json(); setSavedAddresses(addresses);
            const preferred = addresses.find((address: any) => address.isDefault) || addresses[0];
            if (preferred) { setSelectedAddressId(preferred.id); applyAddress(preferred); }
        }).catch(() => undefined);
    }, [session?.user]);

    const shippingFee = deliveryQuote?.fee ?? 0;
    const totalWithShipping = cartTotal + (cart.length > 0 ? shippingFee : 0);

    const handlePaystackSuccessAction = async (reference: PaystackResponse, orderId: string) => {
        setVerifying(true);
        try {
            const res = await fetch(getApiUrl("/api/orders/verify-payment"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reference: reference.reference,
                    orderId,
                })
            });

            if (res.ok) {
                trackConversion("payment_succeeded", { orderId, value: Number(cartTotal) });
                clearCart();
                router.push(`/track-order?reference=${encodeURIComponent(orderId)}`);
            } else {
                trackConversion("payment_failed", { orderId });
                setError("Payment verification failed. Please contact support.");
            }
        } catch (err) {
            trackConversion("payment_failed", { orderId });
            setError("Critical verification error.");
        } finally {
            setVerifying(false);
            setLoading(false);
        }
    };

    const handlePaystackCloseAction = () => {
        setLoading(false);
    };

    const initializePaystack = (order: { id: string; totalAmount: string; paystackReference: string }) => {
        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
        if (!publicKey) {
            setError("Payments are not configured yet. Please contact support.");
            setLoading(false);
            return;
        }

        if (window.PaystackPop) {
            const handler = window.PaystackPop.setup({
                reference: order.paystackReference,
                email: form.email,
                amount: Math.round(Number(order.totalAmount) * 100),
                publicKey,
                onClose: handlePaystackCloseAction,
                callback: (response) => handlePaystackSuccessAction(response, order.id),
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

    const applyAddress = (address: any) => setForm((current) => ({ ...current, firstName: address.recipientName?.split(' ')[0] || current.firstName, lastName: address.recipientName?.split(' ').slice(1).join(' ') || current.lastName, phone: address.phone || current.phone, street: address.street || current.street, city: address.city || current.city, state: address.state || current.state }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setLoading(true);
        setError("");
        trackConversion("checkout_started", { value: totalWithShipping });
        if (couponCode.trim()) trackConversion("coupon_entered");

        try {
            if (session?.user && saveAddress) {
                await authenticatedFetch('/api/customers/addresses', { method: 'POST', body: JSON.stringify({ label: 'Delivery address', recipientName: `${form.firstName} ${form.lastName}`.trim(), phone: form.phone, street: form.street, city: form.city, state: form.state, isDefault: savedAddresses.length === 0 }) });
            }
            // First create the order shell (Support Guest Fields)
            const res = await fetch(getApiUrl("/api/orders"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    zip: "00000",
                    paymentMethod: "card", // card/transfer are both handled by Paystack Popup
                    couponCode: couponCode.trim() || undefined,
                    guestName: `${form.firstName} ${form.lastName}`,
                    guestEmail: form.email,
                    guestPhone: form.phone,
                    deliverySlot,
                })
            });

            const order = await res.json();
            if (res.ok) {
                initializePaystack(order);
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
                    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.25em] text-secondary">Secure checkout</p><h1 className="mt-2 text-4xl font-bold font-serif md:text-5xl">Checkout</h1></div><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-primary/45"><span className="rounded-full bg-primary px-3 py-2 text-white">1 Delivery</span><span className="h-px w-5 bg-primary/15" /><span className="rounded-full bg-white px-3 py-2">2 Payment</span><span className="h-px w-5 bg-primary/15" /><span className="rounded-full bg-white px-3 py-2">3 Review</span></div></div>

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
                                    {savedAddresses.length > 0 && <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">Saved delivery address</label><select value={selectedAddressId} onChange={(event) => { setSelectedAddressId(event.target.value); const address = savedAddresses.find((item) => item.id === event.target.value); if (address) applyAddress(address); }} className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium"><option value="">Use a new address</option>{savedAddresses.map((address) => <option key={address.id} value={address.id}>{address.label} - {address.street}, {address.city}</option>)}</select></div>}
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
                                        <span>{loadingQuote ? "Calculating…" : `₦${shippingFee.toLocaleString()}`}</span>
                                    </div>
                                    {session?.user && <label className="md:col-span-2 flex items-center gap-3 rounded-2xl bg-white/60 px-5 py-4 text-sm font-medium text-primary/70"><input type="checkbox" checked={saveAddress} onChange={(event) => setSaveAddress(event.target.checked)} className="accent-secondary" /> Save this address for faster checkout next time</label>}
                                    <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2">Preferred delivery window</label><select required value={deliverySlot} onChange={(event) => setDeliverySlot(event.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium">{deliverySlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select><p className="px-2 text-[11px] text-primary/45">Your selected window is confirmed after payment and stock verification.</p></div>
                                    <p className="text-[11px] text-primary/40 flex items-center gap-2"><Truck size={13} className="text-secondary" /> {loadingQuote ? "Checking delivery availability" : `Estimated delivery: ${deliveryQuote?.estimate || 'confirmed after payment'}`}</p>
                                    <div className="flex justify-between font-bold text-2xl pt-4 border-t border-primary/5">
                                        <span>Grand Total</span>
                                        <span className="text-secondary font-serif">₦{totalWithShipping.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-primary/10 bg-white/50 p-4 space-y-2">
                                    <label htmlFor="coupon-code" className="text-[10px] font-bold uppercase tracking-widest text-primary/50">Promo code</label>
                                    <input id="coupon-code" value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="Optional promo code" maxLength={40} className="w-full rounded-xl border border-primary/10 bg-white px-4 py-3 text-sm font-bold uppercase tracking-wider outline-none focus:border-secondary" />
                                    <p className="text-[10px] text-primary/40">Eligible discounts are validated securely before payment.</p>
                                </div>

                                <button
                                    form="checkout-form"
                                    type="submit"
                                    disabled={loading || verifying || loadingQuote || cart.length === 0}
                                    className="w-full bg-primary text-white py-5 rounded-full font-bold hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3 text-lg disabled:opacity-50 active:scale-95"
                                >
                                    {loading || verifying ? <Loader2 className="animate-spin" size={24} /> : "Proceed to Secure Payment"}
                                </button>

                                <div className="rounded-2xl bg-primary/[.03] p-4 text-center"><p className="text-[11px] font-medium text-primary/55">You will review your final Paystack payment before it is completed.</p><p className="mt-1 text-[10px] text-primary/35">No hidden delivery fees — your delivery estimate is shown above.</p></div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
