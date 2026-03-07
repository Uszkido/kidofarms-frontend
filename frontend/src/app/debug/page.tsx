"use client";

import { useSession } from "next-auth/react";

export default function DebugPage() {
    const { data: session, status } = useSession();

    return (
        <div className="p-12 space-y-8 bg-cream/30 min-h-screen">
            <h1 className="text-3xl font-black font-serif text-primary">Session Debug</h1>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-primary/5 space-y-4">
                <p><strong>Status:</strong> {status}</p>
                {session ? (
                    <pre className="bg-neutral-50 p-6 rounded-2xl overflow-auto text-xs">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                ) : (
                    <p className="text-red-500">No session found.</p>
                )}
            </div>
            <a href="/" className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest">
                Back to Home
            </a>
        </div>
    );
}
