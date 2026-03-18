import { WarehouseDetailClient } from "./WarehouseDetailClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page() {
    return <WarehouseDetailClient />;
}
