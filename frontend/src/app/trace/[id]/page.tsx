import { Suspense } from "react";
import { TraceContent } from "./TraceClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading DNA...</div>}>
            <TraceContent />
        </Suspense>
    );
}
