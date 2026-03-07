import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

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
    try {
        const body = await request.json();
        const [product] = await db.insert(products).values(body).returning();
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 400 });
    }
}
