require('dotenv').config();
const { db } = require('./src/db');
const { products, categories } = require('./src//db/schema');
const { eq, notInArray, like, or } = require('drizzle-orm');

async function run() {
    console.log('--- Cleaning Up Categories ---');

    try {
        const canonicalCategories = [
            'Fishes',
            'Beef',
            'Fruits',
            'Vegetables',
            'Grains',
            'Herbs & Specialty Crops',
            'Livestock & Poultry Products',
            'Nuts & Other Produce'
        ];

        // 1. Move products from "Chicken" or "Poultry" to "Livestock & Poultry Products"
        console.log('Migrating products from old categories to canonical ones...');

        const migrationMap = {
            'Chicken': 'Livestock & Poultry Products',
            'Poultry': 'Livestock & Poultry Products',
            'Catfish': 'Fishes',
            'Livestock & Poultry Products ': 'Livestock & Poultry Products' // trailing space fix
        };

        for (const [old, canonical] of Object.entries(migrationMap)) {
            const updated = await db.update(products)
                .set({ category: canonical })
                .where(or(eq(products.category, old), like(products.category, old.trim() + '%')));
            console.log(`- Migrated products from "${old}" to "${canonical}"`);
        }

        // 2. Remove all non-canonical categories from categories table
        console.log('Cleaning categories table...');

        // Fetch current list to identify non-canonical items (manual filtering to be safe)
        const allCurrent = await db.select().from(categories);
        for (const cat of allCurrent) {
            if (!canonicalCategories.includes(cat.name)) {
                await db.delete(categories).where(eq(categories.id, cat.id));
                console.log(`- Removed non-canonical category: "${cat.name}"`);
            }
        }

        // 3. Ensure canonical categories exist (with trimmed names)
        const newCats = [
            { name: 'Fishes', description: 'Freshwater and saltwater fish' },
            { name: 'Beef', description: 'Premium grass-fed beef' },
            { name: 'Fruits', description: 'Seasonal fresh fruits' },
            { name: 'Vegetables', description: 'Organic vegetables' },
            { name: 'Grains', description: 'Local grains and cereals' },
            { name: 'Herbs & Specialty Crops', description: 'Aromatic herbs and special crops' },
            { name: 'Livestock & Poultry Products', description: 'Chicken, turkey, eggs and more' },
            { name: 'Nuts & Other Produce', description: 'Nuts, seeds and other farm produce' }
        ];

        for (const cat of newCats) {
            const existing = await db.query.categories.findFirst({
                where: eq(categories.name, cat.name)
            });
            if (!existing) {
                await db.insert(categories).values(cat);
                console.log(`- Created canonical category: ${cat.name}`);
            } else {
                console.log(`- Canonical category exists: ${cat.name}`);
            }
        }

        console.log('--- Cleanup Complete ---');
    } catch (err) {
        console.error('Error during cleanup:', err);
    }
    process.exit(0);
}

run();
