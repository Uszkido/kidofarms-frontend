const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { products } = require('../db/schema');
const { eq, and, desc } = require('drizzle-orm');
const crypto = require('crypto');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const { withCache, cacheDel } = require('../lib/cache');

const generateTrackingId = () => `KD-PROD-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

// GET /api/products
router.get('/', async (req, res) => {
    const { category, featured, search } = req.query;

    try {
        const cacheKey = `products:cat-${category || 'all'}:feat-${featured || 'false'}:search-${search || 'none'}`;

        const data = await withCache(cacheKey, async () => {
            const { ilike, or } = require('drizzle-orm');
            let conditions = [];
            if (category && category !== 'All') {
                conditions.push(eq(products.category, category));
            }
            if (featured === 'true') {
                conditions.push(eq(products.isFeatured, true));
            }
            if (search) {
                conditions.push(or(
                    ilike(products.name, `%${search}%`),
                    ilike(products.description, `%${search}%`)
                ));
            }

            return await db.select().from(products)
                .where(conditions.length > 0 ? and(...conditions) : undefined)
                .orderBy(desc(products.createdAt));
        }, 120); // Cache for 2 minutes

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
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

// POST /api/products (Protected)
router.post('/', authenticateToken, authorizeRoles('admin', 'sub-admin', 'vendor', 'farmer'), async (req, res) => {
    try {
        const body = req.body;
        const payload = {
            ...body,
            price: body.price.toString(),
            stock: parseInt(body.stock) || 0,
            trackingId: generateTrackingId(),
            ownerId: req.user.id, // Assigned from auth middleware
        };
        const [product] = await db.insert(products).values(payload).returning();
        await cacheDel('products:*');
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to create product' });
    }
});

// PATCH /api/products/:id (Protected)
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const product = await db.query.products.findFirst({ where: eq(products.id, req.params.id) });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Ownership check
        if (req.user.role !== 'admin' && req.user.id !== product.ownerId) {
            return res.status(403).json({ error: 'Access denied: Node ownership missing.' });
        }

        const body = req.body;
        const [updated] = await db.update(products)
            .set(body)
            .where(eq(products.id, req.params.id))
            .returning();
        await cacheDel('products:*');
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// DELETE /api/products/:id (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const product = await db.query.products.findFirst({ where: eq(products.id, req.params.id) });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        if (req.user.role !== 'admin' && req.user.id !== product.ownerId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        await db.delete(products).where(eq(products.id, req.params.id));
        await cacheDel('products:*');
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

router.post('/init', async (req, res) => {
    try {
        const count = await db.select().from(products);
        if (count.length === 0) {
            const initialProducts = [
                {
                    name: "Bulbous Onions (5kg)",
                    price: "4500",
                    description: "Freshly harvested organic bulbous onions from our Kano fields.",
                    category: "Vegetables",
                    images: ["https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=2000"],
                    farmSource: "Kano Valley Organics",
                    origin: "Kano",
                    rating: "4.9",
                    isFeatured: true,
                    isFlashSale: true,
                    flashPrice: "3800",
                    stock: 500
                },
                {
                    name: "Organic Strawberries",
                    price: "12000",
                    description: "Juicy, hand-picked strawberries from the cool highlands of Jos.",
                    category: "Fruits",
                    images: ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=2000"],
                    farmSource: "Plateau Greens",
                    origin: "Jos",
                    rating: "5.0",
                    isFeatured: true,
                    isFlashSale: true,
                    flashPrice: "9500",
                    stock: 100
                },
                {
                    name: "Fresh Catfish (Large)",
                    price: "3500",
                    description: "Live catfish harvested from sustainable Jos ponds.",
                    category: "Fishes",
                    images: ["https://images.unsplash.com/photo-1555074213-911855e4be62?q=80&w=2000"],
                    farmSource: "Kido Fishery",
                    origin: "Jos",
                    rating: "4.8",
                    isFeatured: true,
                    stock: 200
                },
                {
                    name: "Benue Yams (King Size)",
                    price: "15000",
                    description: "Premium poundable yams directly from Benue riverbanks.",
                    category: "Grains",
                    images: ["https://images.unsplash.com/photo-1596450514735-2d937089146a?q=80&w=2000"],
                    farmSource: "Riverbank Farms",
                    origin: "Benue",
                    rating: "4.7",
                    isFeatured: true,
                    stock: 80,
                    trackingId: generateTrackingId()
                }
            ].map(p => ({ ...p, trackingId: p.trackingId || generateTrackingId() }));

            await db.insert(products).values(initialProducts);
        }
        res.json({ message: 'Products initialized' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;
