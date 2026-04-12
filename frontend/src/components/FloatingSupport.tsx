"use client";

import { MessageCircle, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import ReportIssueModal from "./ReportIssueModal";
import { useSession } from "next-auth/react";
import AdvancedKidoConcierge from "./AdvancedKidoConcierge";

export function FloatingSupport() {
    const { data: session } = useSession();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-4 pointer-events-none">
            {/* Kido AI Concierge Upgrade */}
            <AdvancedKidoConcierge />

            {/* Report Issue - Only for logged in users */}
            {session && (
                <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-14 h-14 bg-secondary text-primary rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(197,160,89,0.4)] hover:scale-110 active:scale-95 transition-all group relative pointer-events-auto"
                    title="Open Support Hub"
                >
                    <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-secondary text-primary text-[10px] font-black px-4 py-2 rounded-[12px] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl border border-primary/10">
                        REPORT ANOMALY
                    </span>
                </button>
            )}

            {/* Render Modal separately but triggered from here */}
            {isReportModalOpen && <ReportIssueModal forceOpen={true} onClose={() => setIsReportModalOpen(false)} />}
        </div>
    );
}
