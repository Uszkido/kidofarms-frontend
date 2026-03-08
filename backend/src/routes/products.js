const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { products } = require('../db/schema');
const { eq, and, desc } = require('drizzle-orm');

// GET /api/products
router.get('/', async (req, res) => {
    const { category, featured } = req.query;

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

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await db.query.products.findFirst({
            where: eq(products.id, req.params.id)
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// POST /api/products (Admin only - middleware skipped for now)
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const payload = {
            ...body,
            price: body.price.toString(),
            stock: parseInt(body.stock) || 0,
        };
        const [product] = await db.insert(products).values(payload).returning();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to create product' });
    }
});

// PATCH /api/products/:id
router.patch('/:id', async (req, res) => {
    try {
        const body = req.body;
        const [updated] = await db.update(products)
            .set(body)
            .where(eq(products.id, req.params.id))
            .returning();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    try {
        await db.delete(products).where(eq(products.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;
