import { StaffTaskMatrixClient } from "./StaffTaskMatrixClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page() {
    return <StaffTaskMatrixClient />;
}
