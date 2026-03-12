"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ThumbsUp, Loader2, Send, Star, MessageSquare } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import StarRating from "@/components/StarRating";
import { motion, AnimatePresence } from "framer-motion";

import { ActionStatus } from "@/components/ActionStatus";

interface Props {
    productId: string;
    productName?: string;
}

export default function ProductReviews({ productId, productName }: Props) {
    const { data: session } = useSession();
    const [actionState, setActionState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        status: "processing" | "success" | "error";
    }>({
        isOpen: false,
        title: "",
        message: "",
        status: "processing"
    });
    const [reviews, setReviews] = useState<any[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ rating: 0, comment: "" });

    const fetchReviews = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/reviews/product/${productId}`));
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews || []);
                setAvgRating(data.avgRating || 0);
                setTotalCount(data.totalCount || 0);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = (session?.user as any)?.id;
        if (!userId) return;
        if (formData.rating === 0) {
            setActionState({
                isOpen: true,
                title: "Incomplete",
                message: "Please select a star rating.",
                status: "error"
            });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(getApiUrl("/api/reviews"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId, ...formData }),
            });
            if (res.ok) {
                setSubmitted(true);
                setShowForm(false);
                setFormData({ rating: 0, comment: "" });
                fetchReviews();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const markHelpful = async (id: string) => {
        await fetch(getApiUrl(`/api/reviews/${id}/helpful`), { method: "POST" });
        fetchReviews();
    };

    const ratingBars = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        pct: totalCount > 0 ? (reviews.filter(r => r.rating === star).length / totalCount) * 100 : 0
    }));

    return (
        <div className="space-y-10">
            <ActionStatus
                isOpen={actionState.isOpen}
                onClose={() => setActionState(prev => ({ ...prev, isOpen: false }))}
                title={actionState.title}
                message={actionState.message}
                status={actionState.status}
            />
            {/* Summary */}
            <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="bg-secondary/10 rounded-[2.5rem] p-10 text-center min-w-[180px] space-y-3 border border-secondary/20">
                    <p className="text-7xl font-black font-serif text-primary">{avgRating.toFixed(1)}</p>
                    <StarRating value={Math.round(avgRating)} size={20} readonly />
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">{totalCount} Reviews</p>
                </div>
                <div className="flex-grow space-y-3">
                    {ratingBars.map(({ star, count, pct }) => (
                        <div key={star} className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 w-6">{star}</span>
                            <Star size={12} className="text-secondary fill-secondary shrink-0" />
                            <div className="flex-grow h-2 bg-cream rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="h-full bg-secondary rounded-full"
                                />
                            </div>
                            <span className="text-[10px] font-black text-primary/30 w-6">{count}</span>
                        </div>
                    ))}
                </div>
                {session && !submitted && (
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="bg-primary text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center gap-3 shrink-0"
                    >
                        <Star size={16} /> Write Review
                    </button>
                )}
                {submitted && (
                    <div className="bg-green-50 border border-green-100 text-green-700 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shrink-0">
                        ✓ Review Submitted!
                    </div>
                )}
            </div>

            {/* Write Review Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleSubmit}
                        className="bg-white border border-primary/5 rounded-[3rem] p-10 space-y-8 shadow-xl"
                    >
                        <h3 className="text-2xl font-black font-serif uppercase italic tracking-tighter">
                            Your <span className="text-secondary">Review</span>
                            {productName && <span className="text-primary/30"> — {productName}</span>}
                        </h3>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-primary/40">Your Rating</label>
                            <StarRating value={formData.rating} onChange={v => setFormData(d => ({ ...d, rating: v }))} size={32} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-primary/40">Your Comment (optional)</label>
                            <textarea
                                rows={4}
                                value={formData.comment}
                                onChange={e => setFormData(d => ({ ...d, comment: e.target.value }))}
                                placeholder="Share your honest experience with this product..."
                                className="w-full bg-cream/30 border border-primary/5 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all text-sm font-medium text-primary resize-none"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" disabled={submitting || formData.rating === 0}
                                className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center gap-3 disabled:opacity-50">
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Submit Review</>}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="bg-cream px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-primary hover:bg-red-50 hover:text-red-500 transition-all">
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Reviews List */}
            {loading ? (
                <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-secondary opacity-20" size={40} /></div>
            ) : reviews.length === 0 ? (
                <div className="py-16 text-center bg-cream/20 rounded-[3rem] border-2 border-dashed border-primary/5 space-y-4">
                    <MessageSquare size={48} className="mx-auto text-primary/10" />
                    <p className="text-primary/20 font-black text-[10px] uppercase tracking-[0.3em]">No reviews yet. Be the first!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review, i) => (
                        <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                            className="bg-white border border-primary/5 rounded-[2.5rem] p-10 shadow-sm space-y-6 group hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center font-black text-sm">
                                            {review.userName?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <p className="font-black text-primary uppercase tracking-tight">{review.userName || 'Anonymous'}</p>
                                    </div>
                                    <StarRating value={review.rating} size={16} readonly />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-primary/20">
                                    {new Date(review.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                            {review.comment && (
                                <p className="text-sm text-primary/60 font-medium leading-relaxed">{review.comment}</p>
                            )}
                            <button onClick={() => markHelpful(review.id)}
                                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary/20 hover:text-secondary transition-colors">
                                <ThumbsUp size={14} /> Helpful ({review.helpfulCount || 0})
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
