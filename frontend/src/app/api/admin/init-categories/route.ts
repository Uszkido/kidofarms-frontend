import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "admin";
}

export async function POST() {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('--- Initializing Categories ---');

        // 1. Add new categories
        const newCats = [
            { name: 'Fishes', description: 'Freshwater and saltwater fish' },
            { name: 'Chicken', description: 'Organic farm-raised chicken' },
            { name: 'Beef', description: 'Premium grass-fed beef' },
            { name: 'Fruits', description: 'Seasonal fresh fruits' },
            { name: 'Vegetables', description: 'Organic vegetables' },
            { name: 'Grains', description: 'Local grains and cereals' }
        ];

        for (const cat of newCats) {
            await db.insert(categories).values(cat).onConflictDoNothing();
        }

        // 2. Migrate existing Catfish products to Fishes
        await db.update(products)
            .set({ category: 'Fishes' })
            .where(eq(products.category, 'Catfish'));

        return NextResponse.json({ message: 'Categories initialized successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
