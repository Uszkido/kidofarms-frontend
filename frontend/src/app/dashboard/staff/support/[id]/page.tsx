import { SupportTicketDetailClient } from "./SupportTicketDetailClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page() {
    return <SupportTicketDetailClient />;
}
