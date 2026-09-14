import { getApiUrl } from "@/lib/api";

type ConversionEvent = "product_viewed" | "add_to_cart" | "checkout_started" | "payment_succeeded" | "payment_failed" | "coupon_entered";

export function trackConversion(event: ConversionEvent, details: { productId?: string; orderId?: string; value?: number } = {}) {
    if (typeof window === "undefined") return;
    void fetch(getApiUrl("/api/analytics/event"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, ...details }),
        keepalive: true,
    }).catch(() => undefined);
}
