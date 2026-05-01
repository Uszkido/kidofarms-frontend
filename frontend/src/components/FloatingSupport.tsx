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
        setIsAiOpen(true);
        // Give the AI window a tiny moment to mount and animate before dropping the text in
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('ai-trigger-message', { detail: 'Report Anomaly: ' }));
        }, 100);
    };

    return (
        <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-[1001] flex flex-col items-end gap-3 md:gap-6 pointer-events-none">
            {/* Unified AI Chat Window */}
            <AdvancedKidoConcierge forceOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

            {/* Unified Action Pill Trigger */}
            <div className="flex flex-col-reverse items-end md:flex-row md:items-center gap-3 md:gap-4 pointer-events-auto group">
                {session && (
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAnomaly}
                        disabled={isReporting}
                        className="bg-secondary text-primary font-black uppercase text-[9px] md:text-[11px] tracking-[0.2em] px-6 md:px-10 py-3 md:py-5 rounded-full shadow-2xl border-2 border-black/5 hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                    >
                        {isReporting ? "Issuing..." : "Report Anomaly"}
                    </motion.button>
                )}

                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAiOpen(!isAiOpen)}
                    className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl transition-all relative ${isAiOpen ? "bg-white text-primary border border-primary/5" : "bg-secondary text-primary border-4 border-black/5"
                        }`}
                >
                    <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center text-white text-[8px] md:text-[9px] font-black shadow-lg border-2 border-secondary">
                        AI
                    </div>
                    {isAiOpen ? <X size={20} className="md:w-[28px] md:h-[28px]" strokeWidth={2.5} /> : <MessageSquare size={24} className="md:w-[32px] md:h-[32px]" strokeWidth={2.5} />}
                </motion.button>
            </div>

            {/* Support Modal */}
            {isReportModalOpen && <ReportIssueModal forceOpen={true} onClose={() => setIsReportModalOpen(false)} />}
        </div>
    );
}
