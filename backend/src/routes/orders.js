const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { orders, orderItems, affiliates, commissions, products } = require('../db/schema');
const { desc, eq, and, inArray } = require('drizzle-orm');

router.get('/', async (req, res) => {
    try {
        const data = await db.query.orders.findMany({
            with: {
                items: {
                    with: { product: true }
                },
                user: true
            },
            orderBy: [desc(orders.createdAt)]
        });
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { items, totalAmount, street, city, state, zip, paymentMethod, userId, referralCode } = req.body;

        const [order] = await db.insert(orders).values({
            userId,
            totalAmount: totalAmount.toString(),
            orderStatus: 'processing',
            street,
            city,
            state,
            zip,
            paymentMethod,
            referralCode
        }).returning();

        // Handle Referral Commission
        if (referralCode) {
            const affiliate = await db.select().from(affiliates).where(eq(affiliates.referralCode, referralCode)).limit(1);
            if (affiliate.length > 0) {
                const commissionAmount = (parseFloat(totalAmount) * (parseFloat(affiliate[0].commissionRate) / 100)).toFixed(2);
                await db.insert(commissions).values({
                    affiliateId: affiliate[0].id,
                    orderId: order.id,
                    amount: commissionAmount,
                    status: 'pending'
                });
            }
        }

        for (const item of items) {
            await db.insert(orderItems).values({
                orderId: order.id,
                productId: item.id,
                quantity: item.quantity,
                price: item.price.toString()
            });
        }

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        const { id } = req.params;
        const { status, orderStatus } = req.body;
        const finalStatus = status || orderStatus;

        const [updated] = await db.update(orders)
            .set({ orderStatus: finalStatus })
            .where(eq(orders.id, id))
            .returning();
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed' });
    }
});

// POST /api/orders/:id/release (Escrow Shield: Release Funds to Vendor)
router.post('/:id/release', async (req, res) => {
    try {
        const { id } = req.params;
        const [order] = await db.update(orders)
            .set({ escrowStatus: 'released' })
            .where(eq(orders.id, id))
            .returning();

        // In a real app, this would trigger a payout to the vendor's real bank account
        res.json({ message: 'Funds released to vendor successfully!', order });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to release funds' });
    }
});

// GET /api/orders/vendor/:userId
// Fetches only order items that belong to the vendor's products
router.get('/vendor/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // 1. Get all products owned by this vendor
        const vendorProducts = await db.select({ id: products.id })
            .from(products)
            .where(eq(products.ownerId, userId));

        if (vendorProducts.length === 0) return res.json([]);

        const productIds = vendorProducts.map(p => p.id);

        // 2. Find all order items matching these products
        const items = await db.query.orderItems.findMany({
            where: inArray(orderItems.productId, productIds),
            with: {
                order: {
                    with: { user: true }
                },
                product: true
            }
        });

        res.json(items);
    } catch (error) {
        console.error('Vendor Orders Error:', error);
        res.status(500).json({ error: 'Failed to fetch vendor orders' });
    }
});

module.exports = router;
