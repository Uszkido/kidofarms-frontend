"use client";

import { MessageCircle, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import ReportIssueModal from "./ReportIssueModal";
import { useSession } from "next-auth/react";
import KidoConcierge from "./KidoConcierge";

export function FloatingSupport() {
    const { data: session } = useSession();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-4 pointer-events-none">
            {/* Kido AI Concierge */}
            <KidoConcierge isStacked={true} />

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

            {/* Telegram */}
            <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-[#229ED9] text-white rounded-full flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(34,158,217,0.5)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 group relative pointer-events-auto"
                title="Contact us on Telegram"
            >
                <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#229ED9] text-white text-[10px] font-black px-4 py-2 rounded-[12px] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl">
                    TELEGRAM NODE
                </span>
            </a>

            {/* WhatsApp */}
            <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-[#25D366] text-white rounded-[20px] flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(37,211,102,0.5)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 group relative pointer-events-auto"
                title="Contact us on WhatsApp"
            >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#25D366] text-white text-[10px] font-black px-4 py-2 rounded-[12px] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl">
                    WHATSAPP NODE
                </span>
            </a>

            {/* Render Modal separately but triggered from here */}
            {isReportModalOpen && <ReportIssueModal forceOpen={true} onClose={() => setIsReportModalOpen(false)} />}
        </div>
    );
}
