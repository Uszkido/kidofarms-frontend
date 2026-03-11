"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
    value: number;           // current rating (0-5)
    onChange?: (v: number) => void; // if interactive
    size?: number;
    readonly?: boolean;
}

export default function StarRating({ value, onChange, size = 24, readonly = false }: StarRatingProps) {
    const [hovered, setHovered] = useState(0);

    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex items-center gap-1">
            {stars.map(star => {
                const filled = (hovered || value) >= star;
                return (
                    <button
                        key={star}
                        type="button"
                        disabled={readonly}
                        onClick={() => onChange?.(star)}
                        onMouseEnter={() => !readonly && setHovered(star)}
                        onMouseLeave={() => !readonly && setHovered(0)}
                        className={`transition-transform ${readonly ? 'cursor-default' : 'hover:scale-125 active:scale-95'}`}
                        aria-label={`Rate ${star} stars`}
                    >
                        <Star
                            size={size}
                            className={`transition-colors ${filled ? 'text-secondary fill-secondary' : 'text-gray-200 fill-gray-100'}`}
                        />
                    </button>
                );
            })}
            {!readonly && value > 0 && (
                <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-primary/40">
                    {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][value]}
                </span>
            )}
        </div>
    );
}
