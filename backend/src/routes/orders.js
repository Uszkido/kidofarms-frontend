const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { orders, orderItems, affiliates, commissions, products, settings, coupons } = require('../db/schema');
const { desc, eq, inArray, and, or, sql } = require('drizzle-orm');
const { sendOrderToBot, sendTelegramAlert } = require('../lib/bot');
const { sendOrderConfirmation } = require('../lib/email');
const axios = require('axios');
const crypto = require('crypto');
const { authenticateToken, authenticateTokenOptional, authorizeRoles } = require('../middleware/authMiddleware');

const DEFAULT_DELIVERY_ZONES = [
    { state: 'Plateau', fee: 1500, estimate: '1–2 business days' },
    { state: 'Abuja', fee: 3000, estimate: '2–3 business days' },
    { state: 'Lagos', fee: 3500, estimate: '2–4 business days' },
    { state: 'Kano', fee: 4000, estimate: '2–4 business days' },
    { state: 'Rivers', fee: 4500, estimate: '3–5 business days' },
];

async function getDeliveryQuote(state) {
    const [siteSettings] = await db.select().from(settings).where(eq(settings.id, 'site_config')).limit(1);
    const configuredZones = siteSettings?.themeConfig?.deliveryZones;
    const zones = Array.isArray(configuredZones) && configuredZones.length > 0 ? configuredZones : DEFAULT_DELIVERY_ZONES;
    const zone = zones.find((item) => item?.state === state);
    const fee = Number(zone?.fee);
    return {
        state,
        fee: Number.isFinite(fee) && fee >= 0 ? fee : 5000,
        estimate: typeof zone?.estimate === 'string' && zone.estimate.trim() ? zone.estimate.trim().slice(0, 80) : '3–7 business days',
    };
}

async function priceOrderItems(items, state) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Your cart is empty.');
    }

    const quantities = new Map();
    for (const item of items) {
        const quantity = Number(item?.quantity);
        if (!item?.id || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
            throw new Error('One or more cart items is invalid.');
        }
        quantities.set(item.id, (quantities.get(item.id) || 0) + quantity);
    }

    const productIds = [...quantities.keys()];
    const catalogProducts = await db.query.products.findMany({
        where: inArray(products.id, productIds),
    });
    if (catalogProducts.length !== productIds.length) {
        throw new Error('A product in your cart is no longer available.');
    }

    const pricedItems = catalogProducts.map((product) => {
        const quantity = quantities.get(product.id);
        if (product.stock < quantity) {
            throw new Error(`${product.name} does not have enough stock available.`);
        }
        return { id: product.id, quantity, price: Number(product.price) };
    });
    const subtotal = pricedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = await getDeliveryQuote(state);
    return {
        items: pricedItems,
        subtotal: Number(subtotal.toFixed(2)),
        delivery,
        totalAmount: Number((subtotal + delivery.fee).toFixed(2)),
    };
}

async function applyCoupon(pricedOrder, couponCode) {
    const code = typeof couponCode === 'string' ? couponCode.trim().toUpperCase() : '';
    if (!code) return { ...pricedOrder, discount: 0, couponCode: null };
    const coupon = await db.query.coupons.findFirst({ where: eq(coupons.code, code) });
    const now = new Date();
    const expired = (coupon?.expiresAt && coupon.expiresAt <= now) || (coupon?.endsAt && coupon.endsAt <= now);
    const exhausted = coupon?.usageLimit && Number(coupon.usedCount || 0) >= coupon.usageLimit;
    if (!coupon || !coupon.isActive || expired || exhausted) throw new Error('This promo code is unavailable or has expired.');
    if (pricedOrder.subtotal < Number(coupon.minOrderAmount || 0)) {
        throw new Error(`This promo code requires a minimum cart subtotal of ₦${Number(coupon.minOrderAmount).toLocaleString()}.`);
    }
    const rawDiscount = coupon.discountType === 'percentage'
        ? pricedOrder.subtotal * (Number(coupon.discountValue) / 100)
        : Number(coupon.discountValue);
    const discount = Number(Math.min(pricedOrder.subtotal, Math.max(0, rawDiscount)).toFixed(2));
    return { ...pricedOrder, discount, couponCode: code, totalAmount: Number((pricedOrder.totalAmount - discount).toFixed(2)) };
}

// Helper to handle order completion tasks (stock, commission, notifications)
async function completeOrderProcessing(orderId, items, totalAmount, referralCode, couponCode) {
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
        const productId = item.productId || item.id;
        // Decrement Stock
        try {
            const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
            if (product) {
                const newStock = Math.max(0, (product.stock || 0) - item.quantity);
                await db.update(products).set({ stock: newStock }).where(eq(products.id, productId));

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
        const productIds = items.map(i => i.productId || i.id);
        const productDetails = await db.query.products.findMany({
            where: inArray(products.id, productIds)
        });
        const enrichedItems = items.map(item => {
            const productId = item.productId || item.id;
            const p = productDetails.find(p => p.id === productId);
            return { ...item, name: p ? p.name : `Product ${productId}` };
        });
        await sendOrderToBot(orderData, enrichedItems);
        // 4. Email Confirmation
        await sendOrderConfirmation(orderData, enrichedItems);
    } catch (err) {
        console.error("Bot/Email update failed:", err);
    }
}

router.get('/', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
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

// Public, server-authoritative quote used by checkout before payment.
router.get('/delivery-quote', async (req, res) => {
    const state = typeof req.query.state === 'string' ? req.query.state.trim() : '';
    if (!state) return res.status(400).json({ error: 'A delivery state is required.' });
    try {
        res.json(await getDeliveryQuote(state));
    } catch (error) {
        console.error('Delivery quote error:', error);
        res.status(503).json({ error: 'Delivery estimates are temporarily unavailable.' });
    }

    if (couponCode) {
        await db.update(coupons)
            .set({ usedCount: sql`${coupons.usedCount} + 1` })
            .where(eq(coupons.code, couponCode));
    }
});

router.post('/', authenticateTokenOptional, async (req, res) => {
    try {
        const { items, street, city, state, zip, paymentMethod, referralCode, couponCode, guestName, guestEmail, guestPhone } = req.body;
        if (!street || !city || !state || !guestName || !guestEmail || !guestPhone) {
            return res.status(400).json({ error: 'Please complete all delivery details.' });
        }

        const pricedOrder = await applyCoupon(await priceOrderItems(items, state), couponCode);
        const paystackReference = `KIDO-${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;

        const [order] = await db.insert(orders).values({
            userId: req.user?.id || null,
            guestName,
            guestEmail,
            guestPhone,
            totalAmount: pricedOrder.totalAmount.toFixed(2),
            orderStatus: 'processing', // Aligning with DB Enum (processing/shipped/delivered/cancelled)
            paymentStatus: 'pending',
            street,
            city,
            state,
            zip,
            paymentMethod,
            referralCode,
            couponCode: pricedOrder.couponCode,
            paystackReference
        }).returning();

        await db.insert(orderItems).values(pricedOrder.items.map((item) => ({
            orderId: order.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price.toFixed(2),
        })));

        if (paymentMethod !== 'card') {
            await completeOrderProcessing(order.id, pricedOrder.items, pricedOrder.totalAmount, referralCode, pricedOrder.couponCode);
        }

        res.status(201).json({
            ...order,
            subtotal: pricedOrder.subtotal,
            shippingFee: pricedOrder.delivery.fee,
            discount: pricedOrder.discount,
            deliveryWindow: pricedOrder.delivery.estimate,
        });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(400).json({ error: error.message || 'Order Creation Failed' });
    }
});

// PAYSTACK VERIFICATION
router.post('/verify-payment', async (req, res) => {
    try {
        const { reference, orderId } = req.body;
        if (!reference || !orderId) return res.status(400).json({ error: 'Payment reference and order are required.' });

        const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
        if (!order || order.paystackReference !== reference) {
            return res.status(400).json({ error: 'Payment reference does not match this order.' });
        }
        if (order.paymentStatus === 'paid') {
            return res.json({ status: true, message: 'Payment already verified.' });
        }
        if (!process.env.PAYSTACK_SECRET_KEY) {
            return res.status(503).json({ error: 'Payments are not configured.' });
        }

        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        const transaction = response.data?.data;
        const expectedAmount = Math.round(Number(order.totalAmount) * 100);
        if (response.data.status && transaction?.status === 'success' && transaction.currency === 'NGN' && transaction.amount === expectedAmount) {
            const [paidOrder] = await db.update(orders).set({
                paymentStatus: 'paid',
                orderStatus: 'processing',
                paystackReference: reference
            }).where(and(eq(orders.id, orderId), eq(orders.paymentStatus, 'pending'))).returning();

            if (!paidOrder) {
                return res.json({ status: true, message: 'Payment already verified.' });
            }

            const orderItemsForProcessing = await db.query.orderItems.findMany({ where: eq(orderItems.orderId, orderId) });
            await completeOrderProcessing(orderId, orderItemsForProcessing, Number(order.totalAmount), order.referralCode, order.couponCode);

            return res.json({ status: true, message: "Payment Verified" });
        } else {
            return res.status(400).json({ status: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.error("Paystack Verification Error:", error.response?.data || error.message);
        res.status(500).json({ error: 'Verification System Failure' });
    }
});

// Guest-safe order lookup. Matching the email used at checkout prevents an
// order reference from becoming a public source of customer information.
router.post('/lookup', async (req, res) => {
    const reference = typeof req.body?.reference === 'string' ? req.body.reference.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!reference || !email) return res.status(400).json({ error: 'Order reference and email are required.' });

    try {
        const order = await db.query.orders.findFirst({
            where: and(
                eq(orders.guestEmail, email),
                or(eq(orders.id, reference), eq(orders.paystackReference, reference), eq(orders.trackingId, reference))
            )
        });
        if (!order) return res.status(404).json({ error: 'We could not find an order with those details.' });

        res.json({
            orderId: order.id,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            trackingId: order.trackingId,
            createdAt: order.createdAt,
        });
    } catch (error) {
        console.error('Order lookup failed:', error);
        res.status(500).json({ error: 'Order lookup is temporarily unavailable.' });
    }
});

router.get('/vendor/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'sub-admin' && req.user.id !== req.params.id) {
        return res.status(403).json({ error: 'Access denied.' });
    }
    try {
        const data = await db.query.orders.findMany({
            with: { items: { with: { product: true } } },
            orderBy: [desc(orders.createdAt)],
        });
        const vendorOrders = data.flatMap((order) => order.items
            .filter((item) => item.product?.ownerId === req.params.id)
            .map((item) => ({ order, product: item.product, quantity: item.quantity, price: item.price })));
        res.json(vendorOrders);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

router.get('/:id', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
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

router.patch('/:id', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
    const permittedFields = ['orderStatus', 'paymentStatus', 'trackingId'];
    const updates = Object.fromEntries(
        permittedFields
            .filter((field) => req.body[field] !== undefined)
            .map((field) => [field, req.body[field]])
    );
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No permitted order updates supplied.' });
    }

    try {
        const [updatedOrder] = await db.update(orders)
            .set(updates)
            .where(eq(orders.id, req.params.id))
            .returning();
        if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: 'Could not update the order.' });
    }
});

module.exports = router;
