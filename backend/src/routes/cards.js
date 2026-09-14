const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// GET /api/cards?userId=...
router.get('/', async (req, res) => {
    // Payment credentials are managed exclusively by Paystack. Do not expose
    // legacy card records while the data-purge migration is being applied.
    res.json([]);
});

// POST /api/cards
router.post('/', (_req, res) => {
    // Kido Farms uses Paystack's hosted checkout. This API must never receive a
    // PAN, CVV, OTP, or other payment credential.
    res.status(410).json({ error: 'Saved cards are unavailable. Use Paystack checkout to pay securely.' });
});

// DELETE /api/cards/:id
router.delete('/:id', async (req, res) => {
    res.status(410).json({ error: 'Saved cards are unavailable. Use Paystack checkout to pay securely.' });
});

module.exports = router;
