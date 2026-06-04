const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy-key" });

// POST /api/voice/parse (AI Voice-to-Listing Parsing)
router.post('/parse', async (req, res) => {
    try {
        const { transcript } = req.body;

        // If no transcript provided, we use a demo one (simulating captured audio)
        const activeTranscript = transcript || "Hey Kido, list 50 baskets of fresh tomatoes from Sector B. Price is 5000 naira each.";

        if (!process.env.GROQ_API_KEY) {
            return res.json({
                product: "Fresh Tomatoes",
                quantity: 50,
                unit: "basket",
                price: "5000",
                location: "Sector B",
                confidence: 0.98,
                audioTranscript: activeTranscript,
                isMock: true
            });
        }

        const prompt = `Act as an NLP engine for Kido Farms. 
        Convert this voice transcript into structured product listing data.
        
        Transcript: "${activeTranscript}"
        
        Format as JSON: { "product": "...", "quantity": 0, "unit": "...", "price": "...", "location": "...", "confidence": 0.0-1.0 }`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const data = JSON.parse(completion.choices[0].message.content);

        res.json({ ...data, audioTranscript: activeTranscript });
    } catch (error) {
        console.error('Voice Parsing Error:', error);
        res.status(500).json({ error: 'Failed to interpret voice command' });
    }
});

module.exports = router;
