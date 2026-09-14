const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { wholesaleRequests } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/requests', authenticateToken, async (req, res) => {
    const { productId, productName, quantity, unit, city, state, requestedDeliveryDate, notes } = req.body || {};
    const quantityNumber = Number(quantity);
    if (!productName?.trim() || !Number.isInteger(quantityNumber) || quantityNumber < 1 || !city?.trim() || !state?.trim()) {
        return res.status(400).json({ error: 'Product, quantity, city, and state are required.' });
    }
    try {
        const [request] = await db.insert(wholesaleRequests).values({
            userId: req.user.id, productId: productId || null, productName: productName.trim().slice(0, 160),
            quantity: quantityNumber, unit: typeof unit === 'string' ? unit.slice(0, 30) : 'kg',
            city: city.trim().slice(0, 100), state: state.trim().slice(0, 100),
            requestedDeliveryDate: requestedDeliveryDate ? new Date(requestedDeliveryDate) : null,
            notes: typeof notes === 'string' ? notes.trim().slice(0, 1000) : null,
        }).returning();
        res.status(201).json(request);
    } catch (error) {
        console.error('Wholesale request error:', error);
        res.status(400).json({ error: 'Unable to submit wholesale request.' });
    }
});

router.get('/requests/mine', authenticateToken, async (req, res) => {
    const data = await db.select().from(wholesaleRequests).where(eq(wholesaleRequests.userId, req.user.id)).orderBy(desc(wholesaleRequests.createdAt));
    res.json(data);
});

router.get('/requests', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (_req, res) => {
    const data = await db.select().from(wholesaleRequests).orderBy(desc(wholesaleRequests.createdAt));
    res.json(data);
});

router.patch('/requests/:id/quote', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
    const { status, quotedAmount, quotedDeliveryFee, quoteNote } = req.body || {};
    if (!['quoted', 'declined', 'accepted'].includes(status)) return res.status(400).json({ error: 'Invalid quote status.' });
    const [request] = await db.update(wholesaleRequests).set({
        status, quotedAmount: quotedAmount === undefined ? undefined : String(Number(quotedAmount)),
        quotedDeliveryFee: quotedDeliveryFee === undefined ? undefined : String(Number(quotedDeliveryFee)),
        quoteNote: typeof quoteNote === 'string' ? quoteNote.slice(0, 1000) : null, updatedAt: new Date(),
    }).where(eq(wholesaleRequests.id, req.params.id)).returning();
    if (!request) return res.status(404).json({ error: 'Wholesale request not found.' });
    res.json(request);
});

module.exports = router;
