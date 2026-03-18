import { OrderDetailsClient } from "./OrderDetailsClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page({ params }: any) {
    return <OrderDetailsClient params={params} />;
}
