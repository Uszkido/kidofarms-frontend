import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "./ProductDetailsClient";

import { Metadata } from 'next';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await db.query.products.findFirst({
        where: eq(products.id, id)
    });

    if (!product) return { title: 'Product Not Found | Kido Farms' };

    return {
        title: `${product.name} | Kido Farms Market`,
        description: product.description?.substring(0, 160) || `Buy fresh ${product.name} directly from our organic fields.`,
        openGraph: {
            title: `${product.name} - Fresh Harvest`,
            description: product.description,
            images: product.images?.[0] ? [{ url: product.images[0] }] : [],
        },
    };
}

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
