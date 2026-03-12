const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users, orders, wallets, walletTransactions, activityLogs } = require('../db/schema');
const { eq, sql, desc, or } = require('drizzle-orm');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 1. POST /api/admin/ai/scan-trust - Master Trust Oracle Logic
router.post('/scan-trust', async (req, res) => {
    try {
        const allWallets = await db.select().from(wallets);
        const results = [];

        for (const wallet of allWallets) {
            let score = 50; // Baseline
            const userId = wallet.userId;

            // A. Analysis: Order History
            const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
            const successfulOrders = userOrders.filter(o => o.orderStatus === 'delivered').length;
            const cancelledOrders = userOrders.filter(o => o.orderStatus === 'cancelled').length;

            score += (successfulOrders * 5); // +5 for every successful delivery
            score -= (cancelledOrders * 10); // -10 for every cancellation

            // B. Analysis: Wallet Activity
            const transactions = await db.select().from(walletTransactions).where(eq(walletTransactions.walletId, wallet.id));
            const totalCredits = transactions.filter(t => t.type === 'credit').length;

            score += (totalCredits * 2); // Frequency of topping up reflects liquidity

            // C. Analysis: Tenure
            const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
            const monthsInSystem = Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30));
            score += (monthsInSystem * 2);

            // Cap score 0-100
            score = Math.max(10, Math.min(100, score));

            // D. Suggested Credit Limit Logic
            // Based on score and total order volume
            const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
            let suggestedLimit = (totalSpent * (score / 100)) * 0.2; // 20% of normalized spend

            // Apply Update
            await db.update(wallets)
                .set({
                    trustScore: score,
                    creditLimit: sql`${suggestedLimit.toFixed(2)}`,
                    updatedAt: new Date()
                })
                .where(eq(wallets.id, wallet.id));

            results.push({ userId, score, suggestedLimit });
        }

        await db.insert(activityLogs).values({
            action: 'AI_TRUST_ORACLE_SCAN',
            entity: 'system',
            details: { walletsScanned: results.length },
        });

        res.json({ message: 'Global Trust Ledger Synced', results });
    } catch (error) {
        console.error('AI Scan Error:', error);
        res.status(500).json({ error: 'Trust Oracle failed to simulate.' });
    }
});

// 2. GET /api/admin/ai/insights/:userId - Get specific AI insights for a user
router.get('/insights/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const wallet = await db.query.wallets.findFirst({ where: eq(wallets.userId, userId) });
        if (!wallet) return res.status(404).json({ error: 'No wallet node found' });

        // Build a mock narrative for the AI's "thought process"
        const insights = {
            trustScore: wallet.trustScore,
            creditLimit: wallet.creditLimit,
            narrative: "",
            status: wallet.trustScore > 70 ? 'elite' : wallet.trustScore > 40 ? 'stable' : 'high_risk'
        };

        if (wallet.trustScore > 80) {
            insights.narrative = "This citizen demonstrates peak liquidity and operational consistency. Recommended for high-tier B2B float.";
        } else if (wallet.trustScore > 50) {
            insights.narrative = "Stable network participant. Trust index is growing. Maintain current credit ceiling.";
        } else {
            insights.narrative = "High volatility detected in transaction nodes. Manual oversight recommended for any further credit injections.";
        }

        res.json(insights);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve AI data' });
    }
});

// 3. POST /api/ai/chat - Gemini Chat Integration
router.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                reply: "I'm currently in training mode (API key not configured). How can I help you with Kido Farms today?",
                isMock: true
            });
        }

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const systemPrompt = "You are the Kido Farms Concierge, a helpful assistant for an agricultural e-commerce platform in Nigeria. You help users find organic produce, track harvests, and manage their farm nodes. Be professional, friendly, and use a bit of Nigerian flair where appropriate (e.g., 'Welcome to the farm!').";

        const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${message}`);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Gemini Chat Error:', error);
        res.status(500).json({ error: 'AI Protocol disruption. Please try again later.' });
    }
});

// 4. POST /api/ai/describe-product - AI Freshness Concierge
router.post('/describe-product', async (req, res) => {
    try {
        const { productName, category } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                description: `Freshly harvested ${productName} from our verified organic fields.`,
                freshnessTip: "Keep in a cool, dry place for maximum flavor."
            });
        }

        const prompt = `Act as an expert agricultural copywriter for Kido Farms. 
        Product: ${productName}
        Category: ${category}
        
        Generate:
        1. A premium, appetizing product description (2-3 sentences).
        2. A "Freshness Hack" or storage tip specific to this item.
        
        Format as JSON: { "description": "...", "freshnessTip": "..." }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate description' });
    }
});

// 5. POST /api/ai/suggest-recipe - Smart Recipe Engine
router.post('/suggest-recipe', async (req, res) => {
    try {
        const { items } = req.body; // Array of item names

        const prompt = `I have these ingredients from Kido Farms: ${items.join(', ')}. 
        Suggest 1 traditional or modern Nigerian recipe I can make. 
        Provide:
        - Recipe Name
        - Brief instructions
        - Any missing Kido Farms ingredients I should add to my cart.
        
        Format as JSON: { "recipeName": "...", "instructions": "...", "missingIngredients": ["...", "..."] }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate recipe' });
    }
});

// 6. POST /api/ai/yield-shield - AI Yield Risk Assessment
router.post('/yield-shield', async (req, res) => {
    try {
        const { location, crop, month } = req.body;

        const prompt = `Analyze agricultural risk for:
        Location: ${location}
        Crop: ${crop}
        Time: ${month}
        
        Provide:
        - Risk Score (0-100, where 100 is extreme risk)
        - Key threat (e.g. "Early rains", "Heatwave")
        - Mitigation tip.
        
        Format as JSON: { "score": 85, "threat": "...", "mitigation": "..." }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Yield analysis failed' });
    }
});

// 7. POST /api/ai/mastery-tutor - AI Farmer Education
router.post('/mastery-tutor', async (req, res) => {
    try {
        const { question, topic } = req.body;

        const prompt = `You are a Master Agronomist at Kido Farms Academy. 
        Topic: ${topic}
        Question: ${question}
        
        Provide a detailed, practical answer for a Nigerian farmer. Use local context.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ answer: response.text() });
    } catch (error) {
        res.status(500).json({ error: 'Mastery Tutor unavailable' });
    }
});

module.exports = router;
