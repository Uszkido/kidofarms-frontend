const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { savedAddresses, orders, orderItems, products } = require('../db/schema');
const { eq, and, desc, inArray } = require('drizzle-orm');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/addresses', async (req, res) => {
    const data = await db.select().from(savedAddresses).where(eq(savedAddresses.userId, req.user.id)).orderBy(desc(savedAddresses.isDefault), desc(savedAddresses.createdAt));
    res.json(data);
});

router.post('/addresses', async (req, res) => {
    const { label, recipientName, phone, street, city, state, isDefault } = req.body || {};
    if (![label, recipientName, phone, street, city, state].every((value) => typeof value === 'string' && value.trim())) return res.status(400).json({ error: 'Complete all address fields.' });
    if (isDefault) await db.update(savedAddresses).set({ isDefault: false }).where(eq(savedAddresses.userId, req.user.id));
    const [address] = await db.insert(savedAddresses).values({ userId: req.user.id, label: label.trim().slice(0, 40), recipientName: recipientName.trim().slice(0, 120), phone: phone.trim().slice(0, 40), street: street.trim().slice(0, 250), city: city.trim().slice(0, 100), state: state.trim().slice(0, 100), isDefault: Boolean(isDefault) }).returning();
    res.status(201).json(address);
});

router.delete('/addresses/:id', async (req, res) => {
    await db.delete(savedAddresses).where(and(eq(savedAddresses.id, req.params.id), eq(savedAddresses.userId, req.user.id)));
    res.status(204).end();
});

// A reorder returns only live products and current server prices. The cart is
// never reconstructed from old prices or unavailable products.
router.get('/orders/:id/reorder', async (req, res) => {
    const [order] = await db.select().from(orders).where(eq(orders.id, req.params.id)).limit(1);
    if (!order || order.userId !== req.user.id) return res.status(404).json({ error: 'Order not found.' });
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    const catalog = await db.select().from(products).where(inArray(products.id, items.map((item) => item.productId)));
    const available = items.map((item) => {
        const product = catalog.find((candidate) => candidate.id === item.productId);
        return product && product.stock > 0 ? { id: product.id, name: product.name, price: Number(product.price), image: product.images?.[0] || '', quantity: Math.min(item.quantity, product.stock), category: product.category } : null;
    }).filter(Boolean);
    res.json({ items: available });
});

module.exports = router;
