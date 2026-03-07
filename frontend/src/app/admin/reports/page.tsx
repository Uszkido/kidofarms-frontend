"use client";

import { ArrowLeft, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
    return (
        <div className="min-h-screen bg-cream/30 p-6 lg:p-12">
            <div className="max-w-[1000px] mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-neutral-50 transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black font-serif text-primary">Yield <span className="text-red-500 italic">Intelligence</span></h1>
                            <p className="text-sm font-medium text-primary/40">Exportable sales reports and growth trends</p>
                        </div>
                    </div>
                </header>

                <div className="bg-white p-20 rounded-[3rem] border border-primary/5 text-center space-y-4">
                    <TrendingUp className="mx-auto text-red-100" size={64} />
                    <h3 className="text-xl font-black font-serif text-primary uppercase">Analytics Engine Engaged</h3>
                    <p className="max-w-md mx-auto text-primary/40 text-sm font-medium">Export monthly CSV reports and visual growth trends from the main dashboard intelligence unit.</p>
                </div>
            </div>
        </div>
    );
}
