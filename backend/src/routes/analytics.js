const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { orders, users, products, reviews } = require('../db/schema');
const { sql, eq, and, gte, lte } = require('drizzle-orm');

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

module.exports = router;
