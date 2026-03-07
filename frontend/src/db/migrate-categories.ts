import { db } from './index';
import { categories, products } from './schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('--- Reseeding Categories ---');

    // Clear old categories if needed or just add new ones
    const newCats = [
        { name: 'Fruits', description: 'Fresh orchard fruits' },
        { name: 'Vegetables', description: 'Farm fresh vegetables' },
        { name: 'Grains', description: 'Healthy grains and cereals' },
        { name: 'Fishes', description: 'Various varieties of fresh fish' },
        { name: 'Chicken', description: 'Premium poultry' },
        { name: 'Beef', description: 'High quality beef' }
    ];

    for (const cat of newCats) {
        await db.insert(categories).values(cat).onConflictDoUpdate({
            target: categories.name,
            set: { description: cat.description }
        });
    }

    console.log('Categories synced.');

    // Update existing products that were 'Catfish' to 'Fishes'
    await db.update(products)
        .set({ category: 'Fishes' })
        .where(eq(products.category, 'Catfish'));

    console.log('Migration complete.');
}

main().catch(console.error);
