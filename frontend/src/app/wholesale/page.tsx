"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { authenticatedFetch } from "@/lib/api";
import { NIGERIAN_STATES } from "@/lib/constants";
import { Building2, Loader2, Send, CheckCircle2 } from "lucide-react";

export default function WholesalePage() {
    const { data: session } = useSession();
    const [form, setForm] = useState({ productName: "", quantity: "", unit: "kg", city: "", state: "Lagos", requestedDeliveryDate: "", notes: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!session?.user) { setError("Please sign in before requesting a wholesale quote."); return; }
        setLoading(true); setError(""); setMessage("");
        try {
            const response = await authenticatedFetch("/api/wholesale/requests", { method: "POST", body: JSON.stringify({ ...form, quantity: Number(form.quantity) }) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not submit your request.");
            setMessage("Request received. Our wholesale team will review stock, delivery, and pricing before sending your quote.");
            setForm({ productName: "", quantity: "", unit: "kg", city: "", state: "Lagos", requestedDeliveryDate: "", notes: "" });
        } catch (requestError: any) { setError(requestError.message || "Could not submit your request."); }
        finally { setLoading(false); }
    };

    return <div className="flex min-h-screen flex-col bg-cream/20"><Header />
        <main className="flex-grow px-6 py-28"><div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <section className="space-y-7"><div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-primary"><Building2 size={15} /> Wholesale procurement</div>
                <h1 className="font-serif text-5xl font-black leading-tight text-primary md:text-6xl">Buy farm produce <span className="text-secondary italic">at scale.</span></h1>
                <p className="max-w-lg text-lg leading-relaxed text-primary/65">For retailers, restaurants, distributors, and manufacturers. Tell us what you need; we confirm availability, delivery, and a written quote before you pay.</p>
                <div className="space-y-4 rounded-3xl bg-primary p-7 text-white"><p className="font-bold">How it works</p><ol className="space-y-3 text-sm text-white/75"><li>1. Submit your product and delivery requirement.</li><li>2. Kido Farms confirms availability and sends a quote.</li><li>3. Accept the quote and pay through a secure payment link.</li></ol></div>
            </section>
            <form onSubmit={submit} className="space-y-5 rounded-[2.5rem] bg-white p-7 shadow-2xl md:p-10"><div><h2 className="font-serif text-3xl font-black text-primary">Request a quote</h2><p className="mt-1 text-sm text-primary/50">No payment is taken with this form.</p></div>
                {error && <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}{message && <p className="flex gap-2 rounded-xl bg-green-50 p-4 text-sm font-bold text-green-700"><CheckCircle2 size={18} />{message}</p>}
                <input required value={form.productName} onChange={e => setForm({ ...form, productName: e.target.value })} placeholder="Product needed, e.g. Fresh tomatoes" className="w-full rounded-2xl border border-primary/10 p-4 font-medium outline-none focus:border-secondary" />
                <div className="grid grid-cols-2 gap-4"><input required min="1" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="Quantity" className="w-full rounded-2xl border border-primary/10 p-4 font-medium outline-none focus:border-secondary" /><select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="rounded-2xl border border-primary/10 p-4 font-bold outline-none focus:border-secondary"><option value="kg">kg</option><option value="bags">bags</option><option value="crates">crates</option><option value="tons">tons</option></select></div>
                <div className="grid grid-cols-2 gap-4"><input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Delivery city/LGA" className="w-full rounded-2xl border border-primary/10 p-4 font-medium outline-none focus:border-secondary" /><select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="rounded-2xl border border-primary/10 p-4 font-bold outline-none focus:border-secondary">{NIGERIAN_STATES.map(state => <option key={state}>{state}</option>)}</select></div>
                <label className="block text-sm font-bold text-primary/60">Preferred delivery date<input type="date" value={form.requestedDeliveryDate} onChange={e => setForm({ ...form, requestedDeliveryDate: e.target.value })} className="mt-2 w-full rounded-2xl border border-primary/10 p-4 font-medium outline-none focus:border-secondary" /></label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Quality, packaging, or delivery notes (optional)" maxLength={1000} className="min-h-28 w-full rounded-2xl border border-primary/10 p-4 font-medium outline-none focus:border-secondary" />
                <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-5 font-black text-white transition-colors hover:bg-secondary hover:text-primary disabled:opacity-50">{loading ? <Loader2 className="animate-spin" /> : <Send size={18} />} Submit quote request</button>
                {!session?.user && <p className="text-center text-xs text-primary/50"><Link href="/login" className="font-bold text-secondary underline">Sign in</Link> to submit this request.</p>}
            </form>
        </div></main><Footer /></div>;
}
