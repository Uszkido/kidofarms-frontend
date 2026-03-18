import { AdminTicketDetailClient } from "./AdminTicketDetailClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page() {
    return <AdminTicketDetailClient />;
}
