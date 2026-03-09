"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10 rounded-xl bg-primary/5" />;
    }

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all flex items-center justify-center overflow-hidden group shadow-sm"
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait">
                {resolvedTheme === "dark" ? (
                    <motion.div
                        key="moon"
                        initial={{ y: 20, opacity: 0, rotate: -45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.3, ease: "backOut" }}
                    >
                        <Moon size={20} className="text-secondary" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ y: 20, opacity: 0, rotate: 45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: -45 }}
                        transition={{ duration: 0.3, ease: "backOut" }}
                    >
                        <Sun size={20} className="text-secondary" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors duration-500" />
        </button>
    );
}
