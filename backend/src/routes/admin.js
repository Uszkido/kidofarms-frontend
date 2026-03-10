const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users, orders, otps, activityLogs, products, harvests, walletTransactions } = require('../db/schema');
const { desc, eq, sql } = require('drizzle-orm');
const bcrypt = require('bcryptjs');

// 1. GET /api/admin/stats - Super Admin Dashboard Statistics
router.get('/stats', async (req, res) => {
    try {
        const [userCount] = await db.select({ count: sql`count(*)` }).from(users);
        const [orderCount] = await db.select({ count: sql`count(*)` }).from(orders);
        const [totalRevenue] = await db.select({ sum: sql`sum(total_amount)` }).from(orders);
        const [pendingOrders] = await db.select({ count: sql`count(*)` }).from(orders).where(eq(orders.orderStatus, 'processing'));

        const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);

        // Mocking some network-specific health data
        res.json({
            users: userCount.count,
            orders: orderCount.count,
            revenue: totalRevenue.sum || 0,
            pending: pendingOrders.count,
            recentOrders,
            activeNodes: 1204, // Mock
            trustIndex: '98.2%', // Mock
            lastMonthGrowth: '+14%' // Mock
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch admin statistics' });
    }
});

// 2. GET /api/admin/otps - View all active OTPs (OTP Recall)
router.get('/otps', async (req, res) => {
    try {
        const data = await db.select().from(otps).orderBy(desc(otps.createdAt));
        res.json(data);
    } catch (error) {
        console.error('OTP Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch OTPs' });
    }
});

// 3. POST /api/admin/users/create - Direct registration of new users by Admin
router.post('/users/create', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role,
            isVerified: true
        }).returning();

        await db.insert(activityLogs).values({
            action: 'ADMIN_USER_CREATE',
            entity: 'users',
            details: { email, role },
            userId: newUser.id
        });

        res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, email: newUser.email } });
    } catch (error) {
        console.error('Admin User Create Error:', error);
        res.status(400).json({ error: error.message || 'Failed to create user' });
    }
});

// 4. POST /api/admin/orders/approve-payment - Approve a manual payment
router.post('/orders/approve-payment', async (req, res) => {
    const { orderId } = req.body;
    try {
        const [order] = await db.update(orders)
            .set({ orderStatus: 'confirmed', paymentStatus: 'paid' })
            .where(eq(orders.id, orderId))
            .returning();

        await db.insert(activityLogs).values({
            action: 'PAYMENT_APPROVE',
            entity: 'orders',
            details: { orderId },
        });

        res.json({ message: 'Payment approved and order confirmed', order });
    } catch (error) {
        console.error('Payment Approve Error:', error);
        res.status(400).json({ error: 'Failed to approve payment' });
    }
});

// 5. GET /api/admin/full-audit - Integrated view of everything
router.get('/full-audit', async (req, res) => {
    try {
        const recentUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(10);
        const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(10);
        const recentLogs = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(20);

        res.json({
            users: recentUsers,
            orders: recentOrders,
            logs: recentLogs
        });
    } catch (error) {
        res.status(500).json({ error: 'Audit failed' });
    }
});

module.exports = router;
