const express = require('express');
const router = express.Router();

// POST /api/voice/parse (Simulated Voice-to-Listing Parsing)
router.post('/parse', async (req, res) => {
    // Simulate AI voice processing delay
    await new Promise(r => setTimeout(r, 1500));

    const transcript = "Hey Kido, list 50 baskets of fresh tomatoes from Sector B. Price is 5000 naira each.";

    // Extracted entities
    const result = {
        product: "Fresh Tomatoes",
        quantity: 50,
        unit: "basket",
        price: "5000",
        location: "Sector B",
        confidence: 0.98,
        audioTranscript: transcript
    };

    res.json(result);
});

module.exports = router;
