"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft, Save, Loader2, Layout,
    Zap, TrendingUp, ShieldCheck, Users,
    Plus, Trash2, Globe, MapPin
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminLandingPage() {
    const [activeTab, setActiveTab] = useState("hero");
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(getApiUrl("/api/landing"));
            if (!res.ok) throw new Error("Connection to CMS lost. Please check backend status.");
            const landingData = await res.json();
            setData(landingData || {});
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to sync with content origin.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (sectionId: string) => {
        setSaving(true);
        try {
            const content = data[sectionId] || {};
            const res = await fetch(getApiUrl(`/api/landing/${sectionId}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content })
            });
            if (res.ok) alert(`Section ${sectionId.toUpperCase()} synchronized!`);
            else throw new Error("Broadcast failed.");
        } catch (err) {
            console.error(err);
            alert("Failed to synchronize section.");
        } finally {
            setSaving(false);
        }
    };

    const updateField = (section: string, field: string, value: any) => {
        const sectionData = data[section] || {};
        setData({
            ...data,
            [section]: {
                ...sectionData,
                [field]: value
            }
        });
    };

    const updateListItem = (section: string, listField: string, index: number, field: string, value: any) => {
        const sectionData = data[section] || {};
        const list = [...(sectionData[listField] || [])];
        list[index] = { ...list[index], [field]: value };
        updateField(section, listField, list);
    };

    const addListItem = (section: string, listField: string, defaultValue: any) => {
        const sectionData = data[section] || {};
        const list = [...(sectionData[listField] || []), defaultValue];
        updateField(section, listField, list);
    };

    const removeListItem = (section: string, listField: string, index: number) => {
        const sectionData = data[section] || {};
        const list = (sectionData[listField] || []).filter((_: any, i: number) => i !== index);
        updateField(section, listField, list);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cream/30 p-12 flex flex-col items-center justify-center gap-4 text-primary/20">
                <Loader2 className="animate-spin" size={48} />
                <p className="font-black text-xs uppercase tracking-[0.3em]">Querying Content Nodes...</p>
            </div>
        );
    }

    const hero = data.hero || {
        badge: "", title: "", titleItalic: "", subtitle: "",
        btn1Text: "", btn1Link: "", btn2Text: "", btn2Link: ""
    };

    const harvesting = data.harvesting || {
        region: "", statusLabel: "", cycle: "", deliveryInfo: "", btnText: ""
    };

    const trends = data.trends || {
        label: "", title: "", titleItalic: "", subtitle: "",
        stat1Value: "", stat1Label: "", stat2Value: "", stat2Label: "", btnText: ""
    };

    const trending_list = data.trending_list || {
        title: "", items: []
    };

    const advantage = data.advantage || {
        title: "", titleItalic: "", subtitle: "", items: []
    };

    const farmer_cta = data.farmer_cta || {
        title: "", titleItalic: "", subtitle: "", btn1Text: "", btn2Text: ""
    };

    return (
        <div className="min-h-screen bg-cream/30 p-6 lg:p-12">
            <div className="max-w-[1200px] mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-neutral-50 transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black font-serif text-primary">Landing <span className="text-primary/40 italic">CMS</span></h1>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Master Node:</p>
                                <code className="text-[10px] bg-primary/5 px-2 py-0.5 rounded text-primary/40 font-mono italic">{getApiUrl("/api/landing")}</code>
                            </div>
                        </div>
                    </div>
                </header>

                {error && (
                    <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-start md:items-center gap-6 text-red-600 shadow-xl shadow-red-500/5 animate-in zoom-in-95 duration-300">
                        <div className="p-4 bg-red-100 rounded-2xl">
                            <ShieldCheck className="text-red-600" size={32} />
                        </div>
                        <div className="flex-grow space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-red-500/60">Node Connection Offline</p>
                            <h3 className="text-xl font-black font-serif">Master Link Disrupted</h3>
                            <p className="text-sm font-medium opacity-70">The frontend could not reach the content origin at <span className="font-mono text-xs font-bold underline bg-red-100/50 px-1">{getApiUrl("")}</span>. Check if your backend server is running or if the production environment variables are configured.</p>
                        </div>
                        <button onClick={fetchData} className="w-full md:w-auto bg-red-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">
                            Attempt Re-Sync
                        </button>
                    </div>
                )}

                {/* Section Tabs */}
                <div className="flex gap-2 p-1 bg-white rounded-2xl border border-primary/5 w-fit overflow-x-auto">
                    {[
                        { id: 'hero', icon: Zap, label: 'Hero' },
                        { id: 'harvesting', icon: MapPin, label: 'Harvesting' },
                        { id: 'trends', icon: TrendingUp, label: 'Market Trends' },
                        { id: 'advantage', icon: ShieldCheck, label: 'Advantage' },
                        { id: 'farmer_cta', icon: Users, label: 'Farmer CTA' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:text-primary'}`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-[3rem] border border-primary/5 shadow-xl p-10 min-h-[400px]">
                    {activeTab === 'hero' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-xl font-bold font-serif mb-6 border-b pb-4">Hero Section Configuration</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormItem label="Top Badge text" value={hero.badge} onChange={(v) => updateField('hero', 'badge', v)} />
                                <FormItem label="Main Title" value={hero.title} onChange={(v) => updateField('hero', 'title', v)} />
                                <FormItem label="Italicized Title Part" value={hero.titleItalic} onChange={(v) => updateField('hero', 'titleItalic', v)} />
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/20 block mb-2">Subtitle / Description</label>
                                    <textarea
                                        value={hero.subtitle}
                                        onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                                        className="w-full bg-neutral-50 border border-primary/5 p-4 rounded-xl font-bold h-32"
                                    />
                                </div>
                                <FormItem label="Button 1 Text" value={hero.btn1Text} onChange={(v) => updateField('hero', 'btn1Text', v)} />
                                <FormItem label="Button 1 Link" value={hero.btn1Link} onChange={(v) => updateField('hero', 'btn1Link', v)} />
                                <FormItem label="Button 2 Text" value={hero.btn2Text} onChange={(v) => updateField('hero', 'btn2Text', v)} />
                                <FormItem label="Button 2 Link" value={hero.btn2Link} onChange={(v) => updateField('hero', 'btn2Link', v)} />
                            </div>
                            <SaveButton onClick={() => handleSave('hero')} saving={saving} />
                        </div>
                    )}

                    {activeTab === 'harvesting' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-xl font-bold font-serif mb-6 border-b pb-4">Harvesting Now Widget</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormItem label="Region Name" value={harvesting.region} onChange={(v) => updateField('harvesting', 'region', v)} />
                                <FormItem label="Status Label" value={harvesting.statusLabel} onChange={(v) => updateField('harvesting', 'statusLabel', v)} />
                                <FormItem label="Current Cycle Items" value={harvesting.cycle} onChange={(v) => updateField('harvesting', 'cycle', v)} />
                                <FormItem label="Delivery Info text" value={harvesting.deliveryInfo} onChange={(v) => updateField('harvesting', 'deliveryInfo', v)} />
                                <FormItem label="Button Text" value={harvesting.btnText} onChange={(v) => updateField('harvesting', 'btnText', v)} />
                            </div>
                            <SaveButton onClick={() => handleSave('harvesting')} saving={saving} />
                        </div>
                    )}

                    {activeTab === 'trends' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                            <div>
                                <h2 className="text-xl font-bold font-serif mb-6 border-b pb-4">Market Trends Header</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormItem label="Small Label" value={trends.label} onChange={(v) => updateField('trends', 'label', v)} />
                                    <FormItem label="Section Title" value={trends.title} onChange={(v) => updateField('trends', 'title', v)} />
                                    <FormItem label="Italicized Title" value={trends.titleItalic} onChange={(v) => updateField('trends', 'titleItalic', v)} />
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/20 block mb-2">Description</label>
                                        <textarea
                                            value={trends.subtitle}
                                            onChange={(e) => updateField('trends', 'subtitle', e.target.value)}
                                            className="w-full bg-neutral-50 border border-primary/5 p-4 rounded-xl font-bold h-24"
                                        />
                                    </div>
                                    <FormItem label="Stat 1 Value" value={trends.stat1Value} onChange={(v) => updateField('trends', 'stat1Value', v)} />
                                    <FormItem label="Stat 1 Label" value={trends.stat1Label} onChange={(v) => updateField('trends', 'stat1Label', v)} />
                                    <FormItem label="Stat 2 Value" value={trends.stat2Value} onChange={(v) => updateField('trends', 'stat2Value', v)} />
                                    <FormItem label="Stat 2 Label" value={trends.stat2Label} onChange={(v) => updateField('trends', 'stat2Label', v)} />
                                    <FormItem label="CTA Button Text" value={trends.btnText} onChange={(v) => updateField('trends', 'btnText', v)} />
                                </div>
                                <div className="mt-6">
                                    <SaveButton onClick={() => handleSave('trends')} saving={saving} />
                                </div>
                            </div>

                            <div className="pt-8 border-t">
                                <h2 className="text-xl font-bold font-serif mb-6 border-b pb-4">Trending Near Lagos List</h2>
                                <div className="space-y-6">
                                    <FormItem label="List Title" value={trending_list.title} onChange={(v) => setData({ ...data, trending_list: { ...trending_list, title: v } })} />

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Trending Items</p>
                                        {trending_list.items.map((item: any, i: number) => (
                                            <div key={i} className="flex gap-4 items-end bg-neutral-50 p-6 rounded-2xl border border-primary/5">
                                                <div className="flex-grow grid grid-cols-3 gap-4">
                                                    <FormItem label="Item Name" value={item.name} onChange={(v) => updateListItem('trending_list', 'items', i, 'name', v)} />
                                                    <FormItem label="Available Qty" value={item.qty} onChange={(v) => updateListItem('trending_list', 'items', i, 'qty', v)} />
                                                    <FormItem label="Change (%)" value={item.change} onChange={(v) => updateListItem('trending_list', 'items', i, 'change', v)} />
                                                </div>
                                                <button onClick={() => removeListItem('trending_list', 'items', i)} className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all mb-1">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addListItem('trending_list', 'items', { name: "New Item", qty: "0 Units", change: "+0%" })}
                                            className="w-full py-4 border-2 border-dashed border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/30 hover:bg-neutral-50 hover:text-primary transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} /> Add Trending Item
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <SaveButton onClick={() => handleSave('trending_list')} saving={saving} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'advantage' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-xl font-bold font-serif mb-6 border-b pb-4">The Kido Advantage Section</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormItem label="Section Title" value={advantage.title} onChange={(v) => updateField('advantage', 'title', v)} />
                                <FormItem label="Italicized Part" value={advantage.titleItalic} onChange={(v) => updateField('advantage', 'titleItalic', v)} />
                                <div className="md:col-span-2">
                                    <FormItem label="Subtitle" value={advantage.subtitle} onChange={(v) => updateField('advantage', 'subtitle', v)} />
                                </div>
                            </div>

                            <div className="space-y-4 pt-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Feature Blocks (Max 3)</p>
                                {advantage.items.map((item: any, i: number) => (
                                    <div key={i} className="bg-neutral-50 p-6 rounded-2xl border border-primary/5 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormItem label="Feature Title" value={item.title} onChange={(v) => updateListItem('advantage', 'items', i, 'title', v)} />
                                            <div className="flex-grow">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/20 block mb-2">Description</label>
                                                <input
                                                    value={item.desc}
                                                    onChange={(e) => updateListItem('advantage', 'items', i, 'desc', e.target.value)}
                                                    className="w-full bg-white border border-primary/5 p-4 rounded-xl font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addListItem('advantage', 'items', { title: "New Advantage", desc: "Description here" })}
                                    className="w-full py-4 border-2 border-dashed border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/30 hover:bg-neutral-50 hover:text-primary transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Add Advantage block
                                </button>
                            </div>
                            <SaveButton onClick={() => handleSave('advantage')} saving={saving} />
                        </div>
                    )}

                    {activeTab === 'farmer_cta' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-xl font-bold font-serif mb-6 border-b pb-4">Farmer Onboarding Section</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormItem label="Main Title" value={farmer_cta.title} onChange={(v) => updateField('farmer_cta', 'title', v)} />
                                <FormItem label="Italicized Sub-Title" value={farmer_cta.titleItalic} onChange={(v) => updateField('farmer_cta', 'titleItalic', v)} />
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/20 block mb-2">Subtitle / CTA Description</label>
                                    <textarea
                                        value={farmer_cta.subtitle}
                                        onChange={(e) => updateField('farmer_cta', 'subtitle', e.target.value)}
                                        className="w-full bg-neutral-50 border border-primary/5 p-4 rounded-xl font-bold h-32"
                                    />
                                </div>
                                <FormItem label="Primary Button text" value={farmer_cta.btn1Text} onChange={(v) => updateField('farmer_cta', 'btn1Text', v)} />
                                <FormItem label="App Button text" value={farmer_cta.btn2Text} onChange={(v) => updateField('farmer_cta', 'btn2Text', v)} />
                            </div>
                            <SaveButton onClick={() => handleSave('farmer_cta')} saving={saving} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function FormItem({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary/20 block">{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-neutral-50 border border-primary/5 p-4 rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-secondary/10 transition-all outline-none"
            />
        </div>
    );
}

function SaveButton({ onClick, saving }: { onClick: () => void, saving: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={saving}
            className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-secondary transition-all shadow-xl disabled:opacity-50"
        >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Synchronize Node Section
        </button>
    );
}
