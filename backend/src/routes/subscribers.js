const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { subscribers } = require('../db/schema');
const { desc, eq } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const axios = require('axios');
const crypto = require('crypto');

const subscriptionPlanCode = () => process.env.PAYSTACK_SUBSCRIPTION_PLAN_CODE;

router.get('/', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
    try {
        const data = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// POST /api/subscribers
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { phone, street, city, state, zip, plan } = req.body;
        const email = req.user.email;
        const userId = req.user.id;

        if (!email || !phone || !street || !city || !state || !plan) {
            return res.status(400).json({ error: 'Please provide your contact details, delivery address, and plan.' });
        }

        // Check if subscriber already exists
        const existing = await db.select().from(subscribers).where(eq(subscribers.email, email));

        if (existing.length > 0) {
            // Update existing subscriber
            const [updated] = await db.update(subscribers)
                .set({ phone, street, city, state, zip, plan, userId, status: 'pending', paymentStatus: 'pending', paystackPlanCode: subscriptionPlanCode() || null })
                .where(eq(subscribers.email, email))
                .returning();
            return res.json(updated);
        }

        const [sub] = await db.insert(subscribers).values({
            email, phone, street, city, state, zip, plan, userId,
            status: 'pending',
            paymentStatus: 'pending',
            paystackPlanCode: subscriptionPlanCode() || null,
        }).returning();

        res.status(201).json(sub);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to process subscription' });
    }
});

// Create a hosted Paystack checkout for an already-created subscription request.
// Card details never pass through Kido Farms.
router.post('/:id/initialize-payment', authenticateToken, async (req, res) => {
    try {
        const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.id, req.params.id)).limit(1);
        if (!subscriber) return res.status(404).json({ error: 'Subscription request not found.' });
        if (subscriber.userId !== req.user.id && !['admin', 'sub-admin'].includes(req.user.role)) return res.status(403).json({ error: 'Access denied.' });
        if (subscriber.paymentStatus === 'paid') return res.status(400).json({ error: 'This subscription is already active.' });
        if (!process.env.PAYSTACK_SECRET_KEY || !subscriptionPlanCode()) {
            return res.status(503).json({ error: 'Subscription payments are not configured. Contact support.' });
        }

        const reference = `KIDO-SUB-${Date.now()}-${crypto.randomBytes(5).toString('hex')}`;
        const callbackUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/subscriber?payment=processing`;
        const response = await axios.post('https://api.paystack.co/transaction/initialize', {
            email: subscriber.email,
            plan: subscriptionPlanCode(),
            reference,
            callback_url: callbackUrl,
            metadata: { subscriptionId: subscriber.id, userId: subscriber.userId, planName: subscriber.plan },
        }, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });

        const authorizationUrl = response.data?.data?.authorization_url;
        if (!response.data?.status || !authorizationUrl) throw new Error('Paystack did not return a payment URL.');
        await db.update(subscribers).set({ paystackReference: reference, paystackPlanCode: subscriptionPlanCode(), paymentStatus: 'pending', status: 'pending' })
            .where(eq(subscribers.id, subscriber.id));
        res.json({ authorizationUrl, reference });
    } catch (error) {
        console.error('Subscription payment initialization failed:', error.response?.data || error.message);
        res.status(502).json({ error: 'Unable to start subscription payment. Please try again.' });
    }
});

// Paystack signs events with HMAC SHA512. This is the source of truth for
// subscription activation; browser redirects are only a convenience to buyers.
router.post('/webhook/paystack', async (req, res) => {
    const signature = req.headers['x-paystack-signature'];
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret || !req.rawBody) return res.status(503).send('Webhook unavailable');
    const expected = crypto.createHmac('sha512', secret).update(req.rawBody).digest('hex');
    const receivedSignature = Buffer.from(String(signature));
    const expectedSignature = Buffer.from(expected);
    if (!signature || receivedSignature.length !== expectedSignature.length || !crypto.timingSafeEqual(receivedSignature, expectedSignature)) {
        return res.status(401).send('Invalid signature');
    }

    try {
        const event = req.body;
        const subscriptionId = event?.data?.metadata?.subscriptionId;
        if (event?.event === 'charge.success' && subscriptionId) {
            await db.update(subscribers).set({ status: 'active', paymentStatus: 'paid', paystackReference: event.data.reference })
                .where(eq(subscribers.id, subscriptionId));
        }
        if (event?.event === 'invoice.payment_failed' && subscriptionId) {
            await db.update(subscribers).set({ paymentStatus: 'failed' }).where(eq(subscribers.id, subscriptionId));
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Subscription webhook processing failed:', error);
        res.sendStatus(500);
    }
});

// PATCH /api/subscribers/:id
router.patch('/:id', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
    try {
        const [updated] = await db.update(subscribers)
            .set(req.body)
            .where(eq(subscribers.id, req.params.id))
            .returning();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// DELETE /api/subscribers/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
    try {
        await db.delete(subscribers).where(eq(subscribers.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

module.exports = router;
