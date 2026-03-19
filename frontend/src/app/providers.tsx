"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", function () {
                navigator.serviceWorker.register("/sw.js").then(
                    function (registration) {
                        console.log("Service Worker registered with scope: ", registration.scope);
                    },
                    function (err) {
                        console.log("Service Worker registration failed: ", err);
                    }
                );
            });
        }
    }, []);

    return (
        <SessionProvider>
            <CartProvider>{children}</CartProvider>
        </SessionProvider>
    );
}
