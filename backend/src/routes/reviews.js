const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { reviews, users, products } = require('../db/schema');
const { desc, eq, sql } = require('drizzle-orm');
const { sendReviewAlert } = require('../lib/bot');

// 1. GET /api/reviews/product/:productId - Public: get approved reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const data = await db.select({
            id: reviews.id,
            rating: reviews.rating,
            comment: reviews.comment,
            status: reviews.status,
            helpfulCount: reviews.helpfulCount,
            createdAt: reviews.createdAt,
            userName: users.name,
        })
            .from(reviews)
            .leftJoin(users, eq(reviews.userId, users.id))
            .where(eq(reviews.productId, req.params.productId))
            .orderBy(desc(reviews.createdAt));

        const approved = data.filter(r => r.status === 'approved' || r.status === 'pending');
        const avgRating = approved.length > 0
            ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
            : 0;

        res.json({ reviews: approved, avgRating: parseFloat(avgRating.toFixed(1)), totalCount: approved.length });
    } catch (error) {
        console.error('Reviews Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// 2. POST /api/reviews - User: submit a review
router.post('/', async (req, res) => {
    const { userId, productId, rating, comment } = req.body;
    if (!userId || !productId || !rating) {
        return res.status(400).json({ error: 'userId, productId, and rating are required' });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    try {
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        });

        const [review] = await db.insert(reviews).values({
            userId,
            productId,
            rating: parseInt(rating),
            comment: comment || null,
            status: 'pending',
        }).returning();

        // Send Notification
        await sendReviewAlert(review, product ? product.name : 'Unknown Product');

        res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (error) {
        console.error('Review Submit Error:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

// 3. GET /api/reviews/admin/all - Admin: get all reviews with user + product info
router.get('/admin/all', async (req, res) => {
    try {
        const data = await db.select({
            id: reviews.id,
            rating: reviews.rating,
            comment: reviews.comment,
            status: reviews.status,
            adminNote: reviews.adminNote,
            helpfulCount: reviews.helpfulCount,
            createdAt: reviews.createdAt,
            userName: users.name,
            userEmail: users.email,
            productName: products.name,
        })
            .from(reviews)
            .leftJoin(users, eq(reviews.userId, users.id))
            .leftJoin(products, eq(reviews.productId, products.id))
            .orderBy(desc(reviews.createdAt));

        res.json(data);
    } catch (error) {
        console.error('Admin Reviews Error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// 4. PATCH /api/reviews/:id - Admin: approve, reject, or add note
router.patch('/:id', async (req, res) => {
    const { status, adminNote } = req.body;
    try {
        const [updated] = await db.update(reviews)
            .set({
                ...(status ? { status } : {}),
                ...(adminNote !== undefined ? { adminNote } : {})
            })
            .where(eq(reviews.id, req.params.id))
            .returning();
        res.json({ message: 'Review updated', review: updated });
    } catch (error) {
        console.error('Review Update Error:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
});

// 5. DELETE /api/reviews/:id - Admin: delete a review
router.delete('/:id', async (req, res) => {
    try {
        await db.delete(reviews).where(eq(reviews.id, req.params.id));
        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error('Review Delete Error:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

// 6. POST /api/reviews/:id/helpful - User: mark review as helpful
router.post('/:id/helpful', async (req, res) => {
    try {
        const [updated] = await db.update(reviews)
            .set({ helpfulCount: sql`helpful_count + 1` })
            .where(eq(reviews.id, req.params.id))
            .returning();
        res.json({ helpfulCount: updated.helpfulCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark helpful' });
    }
});

module.exports = router;
