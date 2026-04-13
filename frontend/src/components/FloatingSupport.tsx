"use client";

import { MessageCircle, Send, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import ReportIssueModal from "./ReportIssueModal";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import AdvancedKidoConcierge from "./AdvancedKidoConcierge";

export function FloatingSupport() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isReporting, setIsReporting] = useState(false);

    // Suppress on specific professional/clean routes
    const excludedRoutes = ['/login', '/register', '/admin', '/forgot-password', '/verify-account'];
    const isExcluded = excludedRoutes.some(route => pathname?.startsWith(route));

    if (isExcluded) return null;

    const handleAnomaly = async () => {
        setIsReporting(true);
        try {
            await fetch(getApiUrl("/api/tickets"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: (session?.user as any)?.id || "00000000-0000-0000-0000-000000000000",
                    subject: "Anomaly Detected: UI Logic Node",
                    message: "User initiated anomaly protocol via Floating Support Hub. Potential system variance detected."
                })
            });
            alert("Sovereign Ticket Issued. Deployment squad alerted.");
        } catch (err) {
            console.error("Anomaly Protocol Failed", err);
        } finally {
            setIsReporting(false);
        }
    };

    return (
        <div className="fixed bottom-12 right-12 z-[1001] flex flex-col items-end gap-6 pointer-events-none">
            {/* Unified AI Chat Window */}
            <AdvancedKidoConcierge forceOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

            {/* Unified Action Pill Trigger */}
            <div className="flex items-center gap-4 pointer-events-auto group">
                {session && (
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAnomaly}
                        disabled={isReporting}
                        className="bg-secondary text-primary font-black uppercase text-[11px] tracking-[0.2em] px-10 py-5 rounded-full shadow-2xl border-2 border-black/5 hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isReporting ? "Issuing..." : "Report Anomaly"}
                    </motion.button>
                )}

                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAiOpen(!isAiOpen)}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all relative ${isAiOpen ? "bg-white text-primary border border-primary/5" : "bg-secondary text-primary border-4 border-black/5"
                        }`}
                >
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-[9px] font-black shadow-lg border-2 border-secondary">
                        AI
                    </div>
                    {isAiOpen ? <X size={28} strokeWidth={2.5} /> : <MessageSquare size={32} strokeWidth={2.5} />}
                </motion.button>
            </div>

            {/* Support Modal */}
            {isReportModalOpen && <ReportIssueModal forceOpen={true} onClose={() => setIsReportModalOpen(false)} />}
        </div>
    );
}
