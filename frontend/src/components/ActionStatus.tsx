"use client";

import { CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ActionStatusProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    status: "processing" | "success" | "error";
}

export function ActionStatus({ isOpen, onClose, title, message, status }: ActionStatusProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-primary/5 text-center space-y-8 animate-in zoom-in-95 duration-300">
                <div className="flex justify-end -mt-6 -mr-6">
                    <button onClick={onClose} className="p-2 hover:bg-neutral-50 rounded-full transition-colors">
                        <X size={20} className="text-primary/20" />
                    </button>
                </div>

                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-neutral-50 mx-auto flex items-center justify-center border border-primary/5">
                        {status === "processing" ? (
                            <Loader2 size={48} className="text-secondary animate-spin" />
                        ) : status === "success" ? (
                            <CheckCircle2 size={48} className="text-green-500 animate-in zoom-in duration-500" />
                        ) : (
                            <X size={48} className="text-red-500" />
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-2xl font-black font-serif italic uppercase text-primary tracking-tighter">{title}</h3>
                    <p className="text-sm text-primary/40 font-medium leading-relaxed uppercase tracking-widest text-[10px]">{message}</p>
                </div>

                {status === "success" && (
                    <button
                        onClick={onClose}
                        className="w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-secondary hover:text-primary transition-all scale-in"
                    >
                        Return to Command Center
                    </button>
                )}
            </div>
        </div>
    );
}
