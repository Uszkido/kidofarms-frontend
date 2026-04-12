"use client";

import { MessageCircle, Send, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import ReportIssueModal from "./ReportIssueModal";
import { useSession } from "next-auth/react";
import AdvancedKidoConcierge from "./AdvancedKidoConcierge";

export function FloatingSupport() {
    const { data: session } = useSession();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);

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
                        onClick={() => setIsReportModalOpen(true)}
                        className="bg-secondary text-primary font-black uppercase text-[11px] tracking-[0.2em] px-10 py-5 rounded-full shadow-2xl border-2 border-black/5 hover:bg-white transition-all"
                    >
                        Report Anomaly
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
