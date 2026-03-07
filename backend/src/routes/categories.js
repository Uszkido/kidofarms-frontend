const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { categories } = require('../db/schema');

router.get('/', async (req, res) => {
    try {
        const data = await db.select().from(categories);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

router.post('/init', async (req, res) => {
    try {
        const { products } = require('../db/schema');
        const { eq } = require('drizzle-orm');

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

        // Migrate existing Catfish products to Fishes if any
        await db.update(products)
            .set({ category: 'Fishes' })
            .where(eq(products.category, 'Catfish'));

        res.json({ message: 'Categories initialized successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;
