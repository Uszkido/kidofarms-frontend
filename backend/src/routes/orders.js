const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { orders, orderItems, affiliates, commissions, products } = require('../db/schema');
const { desc, eq, inArray } = require('drizzle-orm');
const { sendOrderToBot, sendTelegramAlert } = require('../lib/bot');
const axios = require('axios');

// Helper to handle order completion tasks (stock, commission, notifications)
async function completeOrderProcessing(orderId, items, totalAmount, referralCode) {
    // 1. Handle Commissions
    if (referralCode) {
        const affiliateResult = await db.select().from(affiliates).where(eq(affiliates.referralCode, referralCode)).limit(1);
        if (affiliateResult.length > 0) {
            const affiliate = affiliateResult[0];
            const commissionAmount = (parseFloat(totalAmount) * (parseFloat(affiliate.commissionRate) / 100)).toFixed(2);
            await db.insert(commissions).values({
                affiliateId: affiliate.id,
                orderId: orderId,
                amount: commissionAmount,
                status: 'pending'
            });
        }
    }

    // 2. Handle Order Items & Stock
    for (const item of items) {
        await db.insert(orderItems).values({
            orderId: orderId,
            productId: item.id,
            quantity: item.quantity,
            price: item.price.toString()
        });

        // Decrement Stock
        try {
            const product = await db.query.products.findFirst({ where: eq(products.id, item.id) });
            if (product) {
                const newStock = Math.max(0, (product.stock || 0) - item.quantity);
                await db.update(products).set({ stock: newStock }).where(eq(products.id, item.id));

                if (newStock < 5) {
                    await sendTelegramAlert("Low Stock Warning! 📉", `Product: ${product.name}\nRemaining: ${newStock}`, "🚨");
                }
            }
        } catch (err) {
            console.error("Stock sync failed:", err);
        }
    }

    // 3. Bot Notifications
    try {
        const orderData = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
        const productIds = items.map(i => i.id);
        const productDetails = await db.query.products.findMany({
            where: inArray(products.id, productIds)
        });
        const enrichedItems = items.map(item => {
            const p = productDetails.find(p => p.id === item.id);
            return { ...item, name: p ? p.name : `Product ${item.id}` };
        });
        await sendOrderToBot(orderData, enrichedItems);
    } catch (err) {
        console.error("Bot update failed:", err);
    }
}

router.get('/', async (req, res) => {
    try {
        const data = await db.query.orders.findMany({
            with: {
                items: { with: { product: true } }
            },
            orderBy: [desc(orders.createdAt)]
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { items, totalAmount, street, city, state, zip, paymentMethod, userId, referralCode, guestName, guestEmail, guestPhone } = req.body;

        const [order] = await db.insert(orders).values({
            userId: userId || null,
            guestName,
            guestEmail,
            guestPhone,
            totalAmount: totalAmount.toString(),
            orderStatus: paymentMethod === 'card' ? 'pending' : 'processing',
            paymentStatus: 'pending',
            street,
            city,
            state,
            zip,
            paymentMethod,
            referralCode
        }).returning();

        if (paymentMethod !== 'card') {
            await completeOrderProcessing(order.id, items, totalAmount, referralCode);
        }

        res.status(201).json(order);
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(400).json({ error: error.message || 'Order Creation Failed' });
    }
});

// PAYSTACK VERIFICATION
router.post('/verify-payment', async (req, res) => {
    try {
        const { reference, orderId, items, totalAmount, referralCode } = req.body;

        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        if (response.data.status && response.data.data.status === 'success') {
            await db.update(orders).set({
                paymentStatus: 'paid',
                orderStatus: 'processing',
                paystackReference: reference
            }).where(eq(orders.id, orderId));

            await completeOrderProcessing(orderId, items, totalAmount, referralCode);

            return res.json({ status: true, message: "Payment Verified" });
        } else {
            return res.status(400).json({ status: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.error("Paystack Verification Error:", error.response?.data || error.message);
        res.status(500).json({ error: 'Verification System Failure' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await db.query.orders.findFirst({
            where: eq(orders.id, req.params.id),
            with: { items: { with: { product: true } } }
        });
        if (!data) return res.status(404).json({ error: 'Order not found' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;
