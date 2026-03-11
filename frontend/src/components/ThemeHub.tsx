"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

export default function ThemeHub({ children }: { children: React.ReactNode }) {
    const [themeConfig, setThemeConfig] = useState<any>(null);

    useEffect(() => {
        fetchTheme();
    }, []);

    const fetchTheme = async () => {
        try {
            const res = await fetch(getApiUrl("/api/admin/settings"));
            if (res.ok) {
                const data = await res.json();
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
            console.error("Theme Sync Error:", err);
        }
    };

    return (
        <div style={{ fontFamily: themeConfig?.fontFamily }}>
            {children}
        </div>
    );
}
