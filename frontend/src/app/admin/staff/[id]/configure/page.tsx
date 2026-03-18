import { ConfigureStaffRoleClient } from "./ConfigureStaffRoleClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page() {
    return <ConfigureStaffRoleClient />;
}
