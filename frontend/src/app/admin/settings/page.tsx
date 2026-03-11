"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft,
    Palette,
    Image as ImageIcon,
    Loader2,
    Shield,
    Activity,
    Save,
    Settings,
    Moon,
    Sun,
    Layers,
    Check,
    Gift,
    Zap,
    Layout
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

const DEFAULT_SETTINGS = {
    themeConfig: {
        primaryColor: "#06120e",
        secondaryColor: "#C5A059",
        accentColor: "#1a3c34",
        fontFamily: "Outfit, sans-serif"
    },
    logoConfig: {
        mainLogo: "/logo-kido.png",
        overlayType: "none",
        isOverlayActive: false
    }
};

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<any>(null);
    const [previewTheme, setPreviewTheme] = useState<any>(DEFAULT_SETTINGS.themeConfig);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(getApiUrl("/api/admin/settings"));
            if (res.ok) {
                const data = await res.json();
                // Merge with defaults to prevent crashes
                const mergedSettings = {
                    ...DEFAULT_SETTINGS,
                    ...data,
                    themeConfig: { ...DEFAULT_SETTINGS.themeConfig, ...data.themeConfig },
                    logoConfig: { ...DEFAULT_SETTINGS.logoConfig, ...data.logoConfig }
                };
                setSettings(mergedSettings);
                setPreviewTheme(mergedSettings.themeConfig);
            } else {
                setSettings(DEFAULT_SETTINGS);
            }
        } catch (err) {
            console.error(err);
            setSettings(DEFAULT_SETTINGS);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/settings"), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert("Global Nexus reconfigured. Refreshing dashboard...");
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const updateThemeField = (field: string, value: string) => {
        if (!settings) return;
        const newTheme = { ...settings.themeConfig, [field]: value };
        setSettings({
            ...settings,
            themeConfig: newTheme
        });
        setPreviewTheme(newTheme);
    };

    const toggleOverlay = (type: string) => {
        if (!settings) return;
        setSettings({
            ...settings,
            logoConfig: {
                ...settings.logoConfig,
                overlayType: type,
                isOverlayActive: type !== 'none'
            }
        });
    };

    if (loading || !settings) return (
        <div className="min-h-screen bg-[#040d0a] flex items-center justify-center">
            <Loader2 size={64} className="animate-spin text-secondary opacity-10" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-16">
                <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                    <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Command
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-1 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-secondary">Aesthetic Governance</h2>
                        </div>
                        <h1 className="text-7xl font-black font-serif uppercase tracking-tighter text-white italic">
                            Site <span className="text-secondary">Nexus <br /> Stylist</span>
                        </h1>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-secondary text-primary px-10 py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-4"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <> <Save size={20} /> Authorize Changes </>}
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 pb-20">

                    {/* 🎨 THEME RECONFIG */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-12">
                        <section className="bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />
                            <div className="relative z-10 space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-secondary/10 rounded-2xl text-secondary">
                                        <Palette size={24} />
                                    </div>
                                    <h3 className="text-3xl font-black font-serif italic text-white uppercase">Neural <span className="text-secondary">Colors</span></h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <ColorInput
                                        label="Primary Hub (Background)"
                                        value={settings.themeConfig?.primaryColor || DEFAULT_SETTINGS.themeConfig.primaryColor}
                                        onChange={(v: string) => updateThemeField('primaryColor', v)}
                                    />
                                    <ColorInput
                                        label="Secondary Payout (Buttons/Accents)"
                                        value={settings.themeConfig?.secondaryColor || DEFAULT_SETTINGS.themeConfig.secondaryColor}
                                        onChange={(v: string) => updateThemeField('secondaryColor', v)}
                                    />
                                    <ColorInput
                                        label="Surface Node (Cards/Modals)"
                                        value={settings.themeConfig?.accentColor || DEFAULT_SETTINGS.themeConfig.accentColor}
                                        onChange={(v: string) => updateThemeField('accentColor', v)}
                                    />
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Neural Font Stack</label>
                                        <select
                                            value={settings.themeConfig?.fontFamily || DEFAULT_SETTINGS.themeConfig.fontFamily}
                                            onChange={(e) => updateThemeField('fontFamily', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all text-sm font-black uppercase tracking-widest appearance-none"
                                        >
                                            <option value="Outfit, sans-serif">Outfit (Default Sovereign)</option>
                                            <option value="Inter, sans-serif">Inter (Precision)</option>
                                            <option value="Playfair Display, serif">Playfair (Heritage)</option>
                                            <option value="Space Grotesk, sans-serif">Space (Futuristic)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 🛡️ LOGO OVERLAYS */}
                        <section className="bg-[#1a3c34]/20 border border-secondary/10 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                            <div className="relative z-10 space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-secondary/10 rounded-2xl text-secondary">
                                        <Gift size={24} />
                                    </div>
                                    <h3 className="text-3xl font-black font-serif italic text-white uppercase">Seasonal <span className="text-secondary">Logo Ops</span></h3>
                                </div>

                                <div className="grid md:grid-cols-4 gap-6">
                                    <OverlayCard
                                        label="No Ghosting"
                                        type="none"
                                        active={settings.logoConfig?.overlayType === 'none'}
                                        onClick={() => toggleOverlay('none')}
                                        icon={<ImageIcon size={24} />}
                                    />
                                    <OverlayCard
                                        label="Christmas Cap"
                                        type="christmas"
                                        active={settings.logoConfig?.overlayType === 'christmas'}
                                        onClick={() => toggleOverlay('christmas')}
                                        icon={<Gift size={24} className="text-red-500" />}
                                    />
                                    <OverlayCard
                                        label="Halloween Soul"
                                        type="halloween"
                                        active={settings.logoConfig?.overlayType === 'halloween'}
                                        onClick={() => toggleOverlay('halloween')}
                                        icon={<Moon size={24} className="text-orange-500" />}
                                    />
                                    <OverlayCard
                                        label="Ramadan Moon"
                                        type="ramadan"
                                        active={settings.logoConfig?.overlayType === 'ramadan'}
                                        onClick={() => toggleOverlay('ramadan')}
                                        icon={<Sun size={24} className="text-emerald-400" />}
                                    />
                                </div>

                                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Main Site Logo URL</label>
                                    <div className="flex gap-4">
                                        <input
                                            value={settings.logoConfig?.mainLogo || DEFAULT_SETTINGS.logoConfig.mainLogo}
                                            onChange={(e) => setSettings({ ...settings, logoConfig: { ...settings.logoConfig, mainLogo: e.target.value } })}
                                            className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-xs font-mono"
                                        />
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                                            <img src={settings.logoConfig?.mainLogo || DEFAULT_SETTINGS.logoConfig.mainLogo} className="w-full h-full object-contain p-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* 🧬 LIVE PREVIEW HUD */}
                    <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                        <div className="sticky top-10 space-y-8">
                            <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] shadow-2xl space-y-8">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Sovereign Preview</h4>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                </div>

                                <div className="space-y-6">
                                    {/* Mock Logo Preview */}
                                    <div className="p-8 bg-gray-900 rounded-[2.5rem] border border-white/10 flex items-center justify-center relative overflow-hidden">
                                        <div className="relative group">
                                            <img src={settings.logoConfig?.mainLogo} className="h-10 w-auto" />
                                            {settings.logoConfig?.overlayType === 'christmas' && (
                                                <div className="absolute -top-3 -left-3 -rotate-12 animate-bounce">
                                                    <Gift className="text-red-500" size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                                    </div>

                                    {/* Component Previews */}
                                    <div className="space-y-4">
                                        <div className="h-10 rounded-xl flex items-center justify-center p-4 text-[9px] font-black uppercase tracking-widest border border-white/5" style={{ backgroundColor: previewTheme?.secondaryColor, color: previewTheme?.primaryColor }}>
                                            Primary Action Button
                                        </div>
                                        <div className="p-6 rounded-2xl border border-white/10 space-y-3" style={{ backgroundColor: previewTheme?.accentColor }}>
                                            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: previewTheme?.secondaryColor + '20' }} />
                                            <div className="h-2 w-full bg-white/10 rounded-full" />
                                            <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-secondary rounded-[3rem] p-10 text-primary shadow-2xl relative overflow-hidden group">
                                <Zap className="absolute -bottom-10 -right-10 text-primary/10 w-48 h-48 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                <div className="relative z-10 space-y-6">
                                    <h3 className="text-3xl font-black font-serif italic uppercase">Sync Portal</h3>
                                    <p className="text-primary/60 text-[10px] font-black uppercase tracking-widest leading-relaxed">Changes will propagate to all endpoints instantly upon authorization.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ColorInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">{label}</label>
            <div className="flex gap-4">
                <input
                    type="color"
                    value={value || "#000000"}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-14 h-14 bg-transparent border-none cursor-pointer rounded-2xl overflow-hidden"
                />
                <input
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-mono"
                />
            </div>
        </div>
    );
}

interface OverlayCardProps {
    label: string;
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    type: string;
}

function OverlayCard({ label, active, onClick, icon }: OverlayCardProps) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 text-center ${active ? 'bg-secondary text-primary border-secondary shadow-xl scale-105' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
        >
            <div className={`p-3 rounded-xl ${active ? 'bg-primary/10' : 'bg-white/5'}`}>
                {icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            {active && <Check size={14} className="mt-1" />}
        </div>
    );
}
