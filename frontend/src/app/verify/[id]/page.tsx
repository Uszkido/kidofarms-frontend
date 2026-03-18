import { TraceabilityVerificationClient } from "./TraceabilityVerificationClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page() {
    return <TraceabilityVerificationClient />;
}
