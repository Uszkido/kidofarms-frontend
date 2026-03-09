"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HomeSearch() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="bg-primary/95 backdrop-blur-xl border-b border-white/10 py-3 sticky top-20 z-50 shadow-2xl">
            <div className="container mx-auto px-6">
                <form onSubmit={handleSearch} className="max-w-4xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none">
                        <Search size={18} className="text-secondary" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search organic..."
                        className="w-full bg-white/10 border border-white/20 rounded-full py-3 md:py-4 pl-10 md:pl-16 pr-24 md:pr-32 text-white placeholder:text-white/40 focus:bg-white focus:text-primary focus:ring-4 focus:ring-secondary/20 transition-all outline-none text-xs md:text-lg font-medium"
                    />
                    <button
                        type="submit"
                        className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 bg-secondary text-primary px-4 md:px-8 rounded-full font-bold text-xs md:text-sm hover:bg-white transition-all"
                    >
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
}
