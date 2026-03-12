const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST /api/voice/parse (AI Voice-to-Listing Parsing)
router.post('/parse', async (req, res) => {
    try {
        const { transcript } = req.body;

        // If no transcript provided, we use a demo one (simulating captured audio)
        const activeTranscript = transcript || "Hey Kido, list 50 baskets of fresh tomatoes from Sector B. Price is 5000 naira each.";

        if (!process.env.GEMINI_API_KEY) {
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        res.json({ ...data, audioTranscript: activeTranscript });
    } catch (error) {
        console.error('Voice Parsing Error:', error);
        res.status(500).json({ error: 'Failed to interpret voice command' });
    }
});

module.exports = router;
