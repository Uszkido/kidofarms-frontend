const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { orders, users, products, reviews, activityLogs } = require('../db/schema');
const { sql, eq, and, gte, lte } = require('drizzle-orm');
const { authenticateToken, authenticateTokenOptional, authorizeRoles } = require('../middleware/authMiddleware');

const conversionEvents = new Set(['product_viewed', 'add_to_cart', 'checkout_started', 'payment_succeeded', 'payment_failed', 'coupon_entered']);

// This accepts only a small, non-personal event payload. It provides a useful
// conversion funnel without collecting addresses, names, emails, or card data.
router.post('/event', authenticateTokenOptional, async (req, res) => {
    const { event, productId, orderId, value } = req.body || {};
    if (!conversionEvents.has(event)) return res.status(400).json({ error: 'Unknown conversion event.' });
    const details = {
        ...(typeof productId === 'string' ? { productId } : {}),
        ...(typeof orderId === 'string' ? { orderId } : {}),
        ...(Number.isFinite(Number(value)) ? { value: Number(value) } : {}),
    };
    try {
        await db.insert(activityLogs).values({
            userId: req.user?.id || null,
            action: `conversion:${event}`,
            entity: 'storefront',
            details,
        });
        res.status(202).json({ accepted: true });
    } catch (error) {
        console.error('Conversion event error:', error);
        res.status(503).json({ error: 'Analytics temporarily unavailable.' });
    }
});

router.use(authenticateToken);
router.use(authorizeRoles('admin', 'sub-admin'));

// Get overview analytics
router.get('/overview', async (req, res) => {
    try {
        // 1. Total Sales & Revenue (All time)
        const salesData = await db.select({
            count: sql`count(*)`,
            revenue: sql`sum(${orders.totalAmount})`
        }).from(orders).where(eq(orders.paymentStatus, 'paid'));

        // 2. Total Customers
        const customerCount = await db.select({
            count: sql`count(*)`
        }).from(users).where(eq(users.role, 'customer'));

        // 3. Total Products
        const productCount = await db.select({
            count: sql`count(*)`
        }).from(products);

        // 4. Low Stock Products
        const lowStock = await db.select().from(products).where(sql`${products.stock} < 10`).limit(5);

        // 5. Recent Orders
        const recentOrders = await db.select().from(orders).orderBy(sql`${orders.createdAt} desc`).limit(5);

        res.json({
            totalSales: Number(salesData[0]?.count || 0),
            totalRevenue: Number(salesData[0]?.revenue || 0),
            totalCustomers: Number(customerCount[0]?.count || 0),
            totalProducts: Number(productCount[0]?.count || 0),
            lowStock,
            recentOrders
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

router.get('/conversion-funnel', async (_req, res) => {
    try {
        const rows = await db.select({ action: activityLogs.action, count: sql`count(*)` })
            .from(activityLogs)
            .where(sql`${activityLogs.action} like 'conversion:%'`)
            .groupBy(activityLogs.action);
        const funnel = Object.fromEntries(rows.map((row) => [String(row.action).replace('conversion:', ''), Number(row.count)]));
        res.json(funnel);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch conversion funnel.' });
    }
});

module.exports = router;
