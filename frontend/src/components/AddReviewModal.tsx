"use client";

import { useState } from "react";
import { X, Star, Loader2, Send, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "@/lib/api";
import StarRating from "./StarRating";

interface Props {
    productId: string;
    productName: string;
    userId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddReviewModal({ productId, productName, userId, isOpen, onClose, onSuccess }: Props) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return alert("Please select a star rating.");

        setSubmitting(true);
        try {
            const res = await fetch(getApiUrl("/api/reviews"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId, rating, comment }),
            });
            if (res.ok) {
                if (onSuccess) onSuccess();
                onClose();
                setRating(0);
                setComment("");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit review");
            }
        } catch (err) {
            console.error(err);
            alert("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 pb-32 md:pb-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-xl rounded-[3rem] p-10 md:p-14 shadow-2xl relative z-10 overflow-hidden"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl pointer-events-none" />

                        <button onClick={onClose} className="absolute top-8 right-8 text-primary/20 hover:text-primary transition-colors">
                            <X size={24} />
                        </button>

                        <div className="space-y-10 relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="w-12 h-1 bg-secondary rounded-full" />
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Sovereign Voice Protocol</h2>
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black font-serif italic uppercase text-primary leading-none">
                                    Rate <span className="text-secondary">Product</span>
                                </h3>
                                <p className="text-xs font-bold text-primary/30 uppercase tracking-widest">{productName}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-2">Rating Intensity</label>
                                    <div className="bg-cream/30 p-6 rounded-[2rem] border border-primary/5 shadow-inner inline-block">
                                        <StarRating value={rating} onChange={setRating} size={40} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center ml-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Review Narrative</label>
                                        <span className="text-[8px] font-black text-primary/20 uppercase tracking-widest italic">Optional Verification</span>
                                    </div>
                                    <div className="relative">
                                        <MessageSquare className="absolute top-6 left-6 text-primary/10" size={20} />
                                        <textarea
                                            rows={5}
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                            placeholder="Share your detailed experience with the Kido network..."
                                            className="w-full bg-cream/10 border border-primary/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all text-sm font-medium text-primary resize-none placeholder:text-primary/20"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting || rating === 0}
                                        className="w-full bg-primary text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-secondary hover:text-primary transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3 group"
                                    >
                                        {submitting ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                Authorize Review Submission
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
