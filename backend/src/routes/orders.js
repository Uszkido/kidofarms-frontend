const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { orders, orderItems } = require('../db/schema');
const { desc } = require('drizzle-orm');

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
        const { items, totalAmount, street, city, state, zip, paymentMethod, userId } = req.body;

        const [order] = await db.insert(orders).values({
            userId,
            totalAmount: totalAmount.toString(),
            status: 'processing',
            street,
            city,
            state,
            zip,
            paymentMethod
        }).returning();

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
            .set({ status: finalStatus })
            .where(eq(orders.id, id))
            .returning();
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed' });
    }
});

module.exports = router;
