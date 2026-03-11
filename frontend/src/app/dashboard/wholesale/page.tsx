"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function WholesaleRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/dashboard/wholesaler");
    }, [router]);
    return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <Loader2 className="animate-spin text-secondary" size={64} />
        </div>
    );
}
