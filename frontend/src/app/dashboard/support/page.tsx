"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SupportRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.push("/dashboard/staff");
    }, [router]);

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Redirecting to Unified Staff Portal...</p>
            </div>
        </div>
    );
}
