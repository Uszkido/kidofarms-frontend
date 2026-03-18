import { VendorProfileClient } from "./VendorProfileClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    return <VendorProfileClient params={params} />;
}
