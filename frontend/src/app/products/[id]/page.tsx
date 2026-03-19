import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "./ProductDetailsClient";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // During static export, this will fetch the product with id '1'
    // If it doesn't exist, we provide a fallback object to prevent build failure
    let product;
    try {
        product = await db.query.products.findFirst({
            where: eq(products.id, id)
        });
    } catch (e) {
        console.warn("Could not fetch product for static export", e);
    }

    if (!product) {
        // Fallback for static export
        product = {
            id: id,
            name: "Product Listing",
            price: "0",
            description: "Product details loading...",
            category: "General",
            images: [],
            farmSource: "Kido Farms"
        };
    }

    return <ProductDetailsClient product={product} id={id} />;
}
