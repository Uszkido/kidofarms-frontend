"use client";

import { useEffect, useState } from "react";
import { authenticatedFetch } from "@/lib/api";
import { Loader2, Building2, Save, Download } from "lucide-react";

export default function AdminWholesalePage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState<string | null>(null);

    const load = async () => {
        setLoading(true); setError("");
        try { const response = await authenticatedFetch("/api/wholesale/requests"); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not load requests."); setRequests(data); }
        catch (loadError: any) { setError(loadError.message || "Could not load requests."); }
        finally { setLoading(false); }
    };
    useEffect(() => { void load(); }, []);
    const updateField = (id: string, field: string, value: string) => setRequests(current => current.map(request => request.id === id ? { ...request, [field]: value } : request));
    const saveQuote = async (request: any) => {
        setSaving(request.id);
        try { const response = await authenticatedFetch(`/api/wholesale/requests/${request.id}/quote`, { method: "PATCH", body: JSON.stringify({ status: request.status, quotedAmount: request.quotedAmount, quotedDeliveryFee: request.quotedDeliveryFee, quoteNote: request.quoteNote }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not save quote."); setRequests(current => current.map(item => item.id === data.id ? data : item)); }
        catch (saveError: any) { setError(saveError.message || "Could not save quote."); }
        finally { setSaving(null); }
    };
    const downloadQuote = async (requestId: string) => {
        try {
            const response = await authenticatedFetch(`/api/invoices/wholesale/${requestId}/pdf`);
            if (!response.ok) throw new Error('Could not generate quote PDF.');
            const blobUrl = URL.createObjectURL(await response.blob());
            const link = document.createElement('a');
            link.href = blobUrl; link.download = `kido-farms-wholesale-quote-${requestId}.pdf`; link.click();
            URL.revokeObjectURL(blobUrl);
        } catch (downloadError: any) { setError(downloadError.message || 'Could not download quote PDF.'); }
    };

    return <main className="min-h-screen bg-[#07140f] px-5 py-10 text-white md:px-10"><div className="mx-auto max-w-7xl space-y-8"><header><div className="mb-3 flex items-center gap-2 text-secondary"><Building2 size={18} /><span className="text-xs font-black uppercase tracking-widest">B2B operations</span></div><h1 className="font-serif text-4xl font-black">Wholesale quote requests</h1><p className="mt-2 text-sm text-white/55">Review demand and provide a written quote before asking a buyer to pay.</p></header>{error && <p className="rounded-xl bg-red-500/15 p-4 text-sm text-red-200">{error}</p>}{loading ? <div className="flex justify-center p-20"><Loader2 className="animate-spin text-secondary" size={36} /></div> : <div className="space-y-5">{requests.length === 0 && <p className="rounded-3xl border border-white/10 p-10 text-center text-white/55">No wholesale requests yet.</p>}{requests.map(request => <article key={request.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"><div className="flex flex-col justify-between gap-3 md:flex-row"><div><h2 className="text-xl font-black">{request.productName}</h2><p className="text-sm text-white/60">{request.quantity} {request.unit} · {request.city}, {request.state}</p><p className="mt-2 text-xs text-white/40">Requested {new Date(request.createdAt).toLocaleDateString('en-NG')}{request.requestedDeliveryDate ? ` · preferred delivery ${new Date(request.requestedDeliveryDate).toLocaleDateString('en-NG')}` : ''}</p></div><span className="h-fit rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold capitalize text-secondary">{request.status}</span></div>{request.notes && <p className="mt-5 rounded-xl bg-black/20 p-4 text-sm text-white/75">{request.notes}</p>}<div className="mt-6 grid gap-4 md:grid-cols-4"><select value={request.status} onChange={e => updateField(request.id, 'status', e.target.value)} className="rounded-xl bg-black/25 p-3 text-sm font-bold outline-none"><option value="quoted">Quoted</option><option value="declined">Declined</option><option value="accepted">Accepted</option></select><input type="number" min="0" value={request.quotedAmount || ''} onChange={e => updateField(request.id, 'quotedAmount', e.target.value)} placeholder="Product quote (₦)" className="rounded-xl bg-black/25 p-3 text-sm outline-none"/><input type="number" min="0" value={request.quotedDeliveryFee || ''} onChange={e => updateField(request.id, 'quotedDeliveryFee', e.target.value)} placeholder="Delivery fee (₦)" className="rounded-xl bg-black/25 p-3 text-sm outline-none"/><button onClick={() => saveQuote(request)} disabled={saving === request.id} className="flex items-center justify-center gap-2 rounded-xl bg-secondary p-3 text-sm font-black text-primary disabled:opacity-50">{saving === request.id ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save quote</button></div><textarea value={request.quoteNote || ''} onChange={e => updateField(request.id, 'quoteNote', e.target.value)} placeholder="Message to buyer (availability, delivery window, terms)" className="mt-4 min-h-20 w-full rounded-xl bg-black/25 p-3 text-sm outline-none" />{['quoted', 'accepted'].includes(request.status) && <button onClick={() => downloadQuote(request.id)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-white"><Download size={16} /> Download quote PDF</button>}</article>)}</div>}</div></main>;
}
