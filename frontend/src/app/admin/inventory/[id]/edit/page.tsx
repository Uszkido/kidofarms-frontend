import { EditProductClient } from "./EditProductClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page() {
    return <EditProductClient />;
}
