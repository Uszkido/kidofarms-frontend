import { EditBlogClient } from "./EditBlogClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page() {
    return <EditBlogClient />;
}
