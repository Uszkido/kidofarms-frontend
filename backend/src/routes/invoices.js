const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { orders, orderItems, wholesaleRequests } = require('../db/schema');
const { eq } = require('drizzle-orm');
const { authenticateTokenOptional } = require('../middleware/authMiddleware');
const { streamOrderInvoice, streamWholesaleQuote } = require('../lib/invoicePdf');

router.get('/orders/:id/pdf', authenticateTokenOptional, async (req, res) => {
    try {
        const order = await db.query.orders.findFirst({ where: eq(orders.id, req.params.id), with: { items: { with: { product: true } } } });
        if (!order) return res.status(404).json({ error: 'Order not found.' });
        const email = typeof req.query.email === 'string' ? req.query.email.trim().toLowerCase() : '';
        const allowed = req.user?.role === 'admin' || req.user?.role === 'sub-admin' || req.user?.id === order.userId || (email && email === String(order.guestEmail || '').toLowerCase());
        if (!allowed) return res.status(403).json({ error: 'Use the email from checkout to download this invoice.' });
        streamOrderInvoice(res, order, order.items || []);
    } catch (error) { console.error('Order invoice error:', error); res.status(500).json({ error: 'Unable to generate invoice.' }); }
});

router.get('/wholesale/:id/pdf', authenticateTokenOptional, async (req, res) => {
    try {
        const [request] = await db.select().from(wholesaleRequests).where(eq(wholesaleRequests.id, req.params.id)).limit(1);
        if (!request) return res.status(404).json({ error: 'Wholesale request not found.' });
        const allowed = req.user?.role === 'admin' || req.user?.role === 'sub-admin' || req.user?.id === request.userId;
        if (!allowed) return res.status(403).json({ error: 'Access denied.' });
        if (!['quoted', 'accepted'].includes(request.status)) return res.status(400).json({ error: 'A quote has not been issued yet.' });
        streamWholesaleQuote(res, request);
    } catch (error) { console.error('Wholesale invoice error:', error); res.status(500).json({ error: 'Unable to generate quote PDF.' }); }
});

module.exports = router;
