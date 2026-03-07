import { ShieldCheck, Leaf, RefreshCw } from "lucide-react";

export function FreshBadge() {
    return (
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 rounded-full">
            <Leaf className="text-accent" size={16} />
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Farm Fresh Guarantee</span>
        </div>
    );
}

export function TrustSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-b border-primary/5">
            <div className="flex items-start gap-4">
                <ShieldCheck className="text-secondary shrink-0" size={32} />
                <div>
                    <h4 className="font-bold font-serif">Verified Organic</h4>
                    <p className="text-xs text-primary/40">Grown without synthetic pesticides or fertilizers.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <Leaf className="text-secondary shrink-0" size={32} />
                <div>
                    <h4 className="font-bold font-serif">Harvested on Order</h4>
                    <p className="text-xs text-primary/40">We harvest only when you purchase for peak nutrients.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <RefreshCw className="text-secondary shrink-0" size={32} />
                <div>
                    <h4 className="font-bold font-serif">No-Questions Refund</h4>
                    <p className="text-xs text-primary/40">Not satisfied with the freshness? We'll refund you.</p>
                </div>
            </div>
        </div>
    );
}
