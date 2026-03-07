import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper to check if user is admin
async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "admin";
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    try {
        let conditions = [];
        if (category && category !== 'All') {
            conditions.push(eq(products.category, category));
        }
        if (featured === 'true') {
            conditions.push(eq(products.isFeatured, true));
        }

        const data = await db.select().from(products)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(products.createdAt));

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    try {
        const body = await request.json();
        // Ensure values are numeric where needed
        const payload = {
            ...body,
            price: body.price.toString(),
            stock: parseInt(body.stock) || 0,
        };
        const [product] = await db.insert(products).values(payload).returning();
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 400 });
    }
}
