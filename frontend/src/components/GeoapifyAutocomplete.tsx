"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GeoapifyAutocompleteProps {
    onSelect: (address: any) => void;
    placeholder?: string;
    className?: string;
    initialValue?: string;
}

export function GeoapifyAutocomplete({ onSelect, placeholder, className, initialValue = "" }: GeoapifyAutocompleteProps) {
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
                );
                const data = await response.json();
                if (data.features) {
                    setSuggestions(data.features);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Geoapify Autocomplete Error:", error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (feature: any) => {
        const address = feature.properties;
        setQuery(address.formatted);
        setSuggestions([]);
        setIsOpen(false);
        onSelect(address);
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 3 && setIsOpen(true)}
                    placeholder={placeholder || "Search for address..."}
                    className="w-full px-12 py-4 rounded-2xl bg-white border-none focus:ring-1 focus:ring-secondary outline-none shadow-sm font-medium pr-10"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30">
                    {loading ? <Loader2 size={18} className="animate-spin text-secondary" /> : <Search size={18} />}
                </div>
                {query && (
                    <button
                        onClick={() => { setQuery(""); setSuggestions([]); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20 hover:text-primary transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-[100] left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-primary/5 overflow-hidden max-h-[300px] overflow-y-auto no-scrollbar"
                    >
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelect(suggestion)}
                                className="w-full px-6 py-4 flex items-start gap-4 hover:bg-secondary/10 transition-colors text-left border-b border-primary/5 last:border-none group"
                            >
                                <div className="mt-1 p-2 bg-cream rounded-xl text-primary/40 group-hover:bg-secondary group-hover:text-primary transition-all">
                                    <MapPin size={14} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-primary uppercase tracking-tight leading-none group-hover:text-secondary transition-colors">
                                        {suggestion.properties.name || suggestion.properties.address_line1}
                                    </p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary/30">
                                        {suggestion.properties.address_line2}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
