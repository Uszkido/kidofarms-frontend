import { Suspense } from "react";
import { TraceContent } from "./TraceClient";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading DNA...</div>}>
            <TraceContent />
        </Suspense>
    );
}
