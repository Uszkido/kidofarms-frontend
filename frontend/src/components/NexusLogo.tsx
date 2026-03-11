"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";
import { Gift, Sun, Moon } from "lucide-react";
import Image from "next/image";

export default function NexusLogo({ className = "h-10 w-auto" }: { className?: string }) {
    const [logoConfig, setLogoConfig] = useState<any>(null);

    useEffect(() => {
        fetchLogo();
    }, []);

    const fetchLogo = async () => {
        try {
            const res = await fetch(getApiUrl("/api/admin/settings"));
            if (res.ok) {
                const data = await res.json();
                setLogoConfig(data.logoConfig || { mainLogo: "/logo-kido.png", overlayType: "none", isOverlayActive: false });
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!logoConfig) return <div className={className} />;

    return (
        <div className="relative group">
            <img src={logoConfig.mainLogo} alt="Kido Farms Sovereign" className={className} />

            {logoConfig.isOverlayActive && (
                <div className="absolute -top-3 -left-3 -rotate-12 animate-bounce">
                    {logoConfig.overlayType === 'christmas' && <Gift className="text-red-500 drop-shadow-lg" size={24} />}
                    {logoConfig.overlayType === 'halloween' && <Moon className="text-orange-500 drop-shadow-lg fill-orange-500" size={24} />}
                    {logoConfig.overlayType === 'ramadan' && <Sun className="text-emerald-400 drop-shadow-lg" size={24} />}
                </div>
            )}
        </div>
    );
}
