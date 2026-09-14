"use client";

import { useEffect, useMemo, useState } from 'react';
import { authenticatedFetch, fetcher } from '@/lib/api';
import { ArrowLeft, PackagePlus, Save } from 'lucide-react';
import Link from 'next/link';

type Product = { id: string; name: string; price: number };
type Bundle = { id: string; name: string; description?: string; image?: string; price: number; items: { productId: string; quantity: number }[]; isActive: boolean };

const emptyForm = { name: '', description: '', image: '', price: '', items: [] as { productId: string; quantity: number }[], isActive: true };

export default function AdminBundlesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  const productById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const load = async () => {
    const [catalog, bundleResponse] = await Promise.all([fetcher('/api/products'), authenticatedFetch('/api/bundles/admin')]);
    setProducts(Array.isArray(catalog) ? catalog : []);
    setBundles(bundleResponse.ok ? await bundleResponse.json() : []);
  };
  useEffect(() => { load().catch(() => setMessage('Unable to load bundle data.')); }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage('');
    if (!form.name.trim() || !form.price || form.items.length === 0) return setMessage('Add a name, price, and at least one product.');
    const response = await authenticatedFetch('/api/bundles', { method: 'POST', body: JSON.stringify({ ...form, price: Number(form.price) }) });
    if (!response.ok) return setMessage((await response.json().catch(() => ({ error: 'Unable to save bundle.' }))).error);
    setForm(emptyForm); setMessage('Bundle saved and ready to publish.'); await load();
  };
  const toggle = async (bundle: Bundle) => {
    const response = await authenticatedFetch(`/api/bundles/${bundle.id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !bundle.isActive }) });
    if (response.ok) await load(); else setMessage('Could not update this bundle.');
  };
  const addProduct = (productId: string) => {
    if (!productId || form.items.some((item) => item.productId === productId)) return;
    setForm({ ...form, items: [...form.items, { productId, quantity: 1 }] });
  };

  return <main className="min-h-screen bg-slate-50 p-5 text-slate-900 md:p-10"><div className="mx-auto max-w-6xl">
    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft size={16} /> Admin dashboard</Link>
    <div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-secondary">Merchandising</p><h1 className="mt-2 text-4xl font-black">Curated bundles</h1><p className="mt-2 text-slate-500">Create value packs that customers can discover from the shop.</p></div><PackagePlus className="text-secondary" size={42} /></div>
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]"><form onSubmit={save} className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black">New bundle</h2><div className="mt-5 grid gap-4"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Bundle name" className="rounded-xl border p-3" /><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" className="min-h-24 rounded-xl border p-3" /><input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Optional image URL" className="rounded-xl border p-3" /><input required type="number" min="0" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Bundle price (₦)" className="rounded-xl border p-3" />
        <label className="text-sm font-bold">Add a product<select defaultValue="" onChange={(e) => { addProduct(e.target.value); e.currentTarget.value = ''; }} className="mt-2 w-full rounded-xl border p-3"><option value="">Choose a product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
        {form.items.map((item) => <div key={item.productId} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"><span className="flex-1 font-bold">{productById.get(item.productId)?.name || 'Product'}</span><input aria-label="Quantity" type="number" min="1" value={item.quantity} onChange={(e) => setForm({ ...form, items: form.items.map((row) => row.productId === item.productId ? { ...row, quantity: Math.max(1, Number(e.target.value)) } : row) })} className="w-16 rounded border p-2" /><button type="button" onClick={() => setForm({ ...form, items: form.items.filter((row) => row.productId !== item.productId) })} className="font-bold text-red-700">Remove</button></div>)}
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Publish immediately</label><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary p-3 font-bold text-white"><Save size={17} /> Save bundle</button>{message && <p className="text-sm text-slate-600">{message}</p>}</div></form>
      <section><h2 className="text-xl font-black">Existing bundles</h2><div className="mt-5 space-y-4">{bundles.map((bundle) => <article key={bundle.id} className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h3 className="font-black">{bundle.name}</h3><p className="mt-1 text-sm text-slate-500">₦{Number(bundle.price).toLocaleString()} · {bundle.items?.length || 0} product types</p></div><button onClick={() => toggle(bundle)} className="rounded-lg border px-3 py-2 text-xs font-bold">{bundle.isActive ? 'Published' : 'Hidden'}</button></div></article>)}{bundles.length === 0 && <p className="rounded-2xl border border-dashed p-6 text-slate-500">No bundles yet.</p>}</div></section></div>
  </div></main>;
}
