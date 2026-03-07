"use client";

import { ArrowLeft, Bell, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
    return (
        <div className="min-h-screen bg-cream/30 p-6 lg:p-12">
            <div className="max-w-[1000px] mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-3 bg-white rounded-xl border border-primary/5 hover:bg-neutral-50 transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black font-serif text-primary">Farm <span className="text-amber-500 italic">Alerts</span></h1>
                            <p className="text-sm font-medium text-primary/40">System notifications and inventory warnings</p>
                        </div>
                    </div>
                </header>

                <div className="bg-white p-20 rounded-[3rem] border border-primary/5 text-center space-y-4">
                    <Bell className="mx-auto text-amber-100" size={64} />
                    <h3 className="text-xl font-black font-serif text-primary uppercase">Broadcast System Ready</h3>
                    <p className="max-w-md mx-auto text-primary/40 text-sm font-medium">Critical inventory alerts and system status updates are automatically synchronized with the Command Center.</p>
                </div>
            </div>
        </div>
    );
}
