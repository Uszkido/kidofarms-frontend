"use client";

import { ArrowLeft, Star, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-cream/30 p-6 lg:p-12">
            <div className="max-w-[1000px] mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-neutral-50 transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black font-serif text-primary">Customer <span className="text-purple-500 italic">Voice</span></h1>
                            <p className="text-sm font-medium text-primary/40">Manage product reviews and ratings</p>
                        </div>
                    </div>
                </header>

                <div className="bg-white p-20 rounded-[3rem] border border-primary/5 text-center space-y-4">
                    <Star className="mx-auto text-purple-100" size={64} />
                    <h3 className="text-xl font-black font-serif text-primary uppercase">Moderation Queue</h3>
                    <p className="max-w-md mx-auto text-primary/40 text-sm font-medium">Product reviews are automatically verified. Content moderation is enabled for all community feedback.</p>
                </div>
            </div>
        </div>
    );
}
