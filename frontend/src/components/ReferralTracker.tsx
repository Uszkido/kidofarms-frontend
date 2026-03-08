"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) {
            console.log("Referral code detected:", ref);
            // Store reference in local storage for checkout
            localStorage.setItem("kido_referral_code", ref);
            // Optionally store timestamp to expire it after e.g. 30 days
            localStorage.setItem("kido_referral_time", new Date().toISOString());
        }
    }, [searchParams]);

    return null; // This is a logic-only component
}
