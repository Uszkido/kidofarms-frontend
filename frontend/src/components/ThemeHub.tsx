"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

import { useSession } from "next-auth/react";
import { ZapOff, ShieldAlert } from "lucide-react";
import ReportIssueModal from "./ReportIssueModal";

export default function ThemeHub({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [themeConfig, setThemeConfig] = useState<any>(null);
    const [isMaintenance, setIsMaintenance] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(getApiUrl("/api/admin/settings"));
            if (res.ok) {
                const data = await res.json();
                setIsMaintenance(data.isMaintenanceMode || false);
                if (data.themeConfig) {
                    setThemeConfig(data.themeConfig);

                    // Inject CSS Variables
                    const root = document.documentElement;
                    root.style.setProperty('--primary-color', data.themeConfig.primaryColor);
                    root.style.setProperty('--secondary-color', data.themeConfig.secondaryColor);
                    root.style.setProperty('--accent-color', data.themeConfig.accentColor);
                    root.style.setProperty('--font-family', data.themeConfig.fontFamily);
                }
            }
        } catch (err) {
            console.error("Settings Sync Error:", err);
        }
    };

    const isAdmin = (session?.user as any)?.role === 'admin';

    if (isMaintenance && !isAdmin) {
        return (
            <div className="fixed inset-0 z-[1000] bg-[#06120e] flex items-center justify-center p-10 font-sans">
                <div className="max-w-2xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-1000">
                    <div className="w-32 h-32 rounded-full bg-secondary/10 mx-auto flex items-center justify-center text-secondary shadow-[0_0_80px_rgba(197,160,89,0.2)] animate-pulse">
                        <ZapOff size={64} />
                    </div>
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black font-serif italic text-white uppercase tracking-tighter leading-none">
                            Protocol <span className="text-secondary">Zero</span> <br />Active
                        </h1>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-3">
                            <ShieldAlert size={14} className="text-secondary" /> Network Infrastructure Maintenance
                        </p>
                        <p className="text-white/30 text-xs font-bold leading-relaxed max-w-sm mx-auto uppercase tracking-widest">
                            The Kido Farms network nodes are currently undergoing critical infrastructure synchronization. Citizen access is temporarily suspended by Administrative Order.
                        </p>
                    </div>
                    <div className="pt-10 border-t border-white/5">
                        <p className="text-[8px] font-black text-white/10 uppercase tracking-[1em]">Kido Farms | Horizon v5.2.x</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: themeConfig?.fontFamily }}>
            {children}
        </div>
    );
}
