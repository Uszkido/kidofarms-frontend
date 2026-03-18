import { BlogPostDetailClient } from "./BlogPostDetailClient";

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    return <BlogPostDetailClient params={params} />;
}
