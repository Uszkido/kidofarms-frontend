import { SupportTicketClient } from "./SupportTicketClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page() {
    return <SupportTicketClient />;
}
