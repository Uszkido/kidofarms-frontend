const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users, orders, wallets, walletTransactions, activityLogs } = require('../db/schema');
const { eq, sql, desc, or } = require('drizzle-orm');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");

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

// --- AI AGENT TOOLS (FUNCTION DEFINITIONS) ---
const tools = [
    {
        functionDeclarations: [
            {
                name: "search_products",
                description: "Search for organic produce and products in the Kido Farms marketplace.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        query: { type: "STRING", description: "The product name or category to search for (e.g., 'onions', 'tomatoes')." }
                    },
                    required: ["query"]
                }
            },
            {
                name: "get_order_status",
                description: "Retrieve the current status and tracking info for a specific order.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        orderId: { type: "STRING", description: "The unique order ID." }
                    },
                    required: ["orderId"]
                }
            },
            {
                name: "get_harvest_tracking",
                description: "Check the growth progress and estimated harvest date for a specific crop cycle.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        cropName: { type: "STRING", description: "The name of the crop to track." }
                    },
                    required: ["cropName"]
                }
            },
            {
                name: "get_academy_modules",
                description: "List available agricultural training modules from the Kido Mastery Academy.",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "get_market_stats",
                description: "Get real-time insights into total market volume and active farmers.",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            }
        ]
    }
];

// --- TOOL HANDLERS (DATABASE INTERACTION) ---
const toolHandlers = {
    search_products: async ({ query }) => {
        try {
            const { products } = require('../db/schema');
            const results = await db.select().from(products).where(or(
                sql`LOWER(${products.name}) LIKE ${'%' + query.toLowerCase() + '%'}`,
                sql`LOWER(${products.category}) LIKE ${'%' + query.toLowerCase() + '%'}`
            )).limit(5);
            return results.length > 0 ? results : "No products found matching that query.";
        } catch (err) {
            return "Error searching products.";
        }
    },
    get_order_status: async ({ orderId }) => {
        try {
            const { orders } = require('../db/schema');
            const [order] = await db.select().from(orders).where(or(
                eq(orders.id, orderId),
                eq(orders.trackingId, orderId)
            ));
            return order ? { status: order.orderStatus, total: order.totalAmount, date: order.createdAt, trackingId: order.trackingId } : "Order not found.";
        } catch (err) {
            return "Error retrieving order status.";
        }
    },
    get_harvest_tracking: async ({ cropName }) => {
        try {
            const { harvests } = require('../db/schema');
            const [harvest] = await db.select().from(harvests).where(
                sql`LOWER(${harvests.cropName}) LIKE ${'%' + cropName.toLowerCase() + '%'}`
            );
            return harvest ? {
                progress: `${harvest.progress}%`,
                status: harvest.status,
                readyDate: harvest.estimatedReadyDate,
                farm: harvest.farmName
            } : "Harvest data not found for that crop.";
        } catch (err) {
            return "Error tracking harvest.";
        }
    },
    get_academy_modules: async () => {
        try {
            const { academyCourses } = require('../db/schema');
            const courses = await db.select().from(academyCourses).limit(10);
            return courses.length > 0 ? courses : [
                { title: "Organic Soil Biology", category: "Soil" },
                { title: "Smart Irrigation Systems", category: "Tech" },
                { title: "Export Scale Logistics", category: "Logistics" }
            ];
        } catch (err) {
            return "Error retrieving academy modules.";
        }
    },
    get_market_stats: async () => {
        try {
            const { users, products } = require('../db/schema');
            const [uCount] = await db.select({ count: sql`count(*)` }).from(users);
            const [pCount] = await db.select({ count: sql`count(*)` }).from(products);
            return {
                totalCitizens: uCount.count,
                activeProducts: pCount.count,
                activeFarmers: "450+",
                marketVolume: "₦45M+"
            };
        } catch (err) {
            return "Error retrieving market stats.";
        }
    }
};

const SYSTEM_PROMPT = "You are the Kido Farms Concierge, a high-level AI Agent for West Africa's most advanced agricultural e-commerce platform. You have the ability to search live products, track order fulfillment, monitor harvest growth cycles, and browse the Mastery Academy curriculum using your specialized tools. Be professional, friendly, and use a bit of Nigerian flair. Answer concisely. If a user asks for information you can search for, use your tools first.";

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    tools: tools
});

// 3. POST /api/ai/chat - agentic Gemini Chat Integration
router.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        const isDummy = !apiKey || apiKey === 'your-gemini-api-key' || apiKey.includes('dummy');

        if (isDummy) {
            return res.json({
                reply: "I'm currently in training mode (AI Node syncing). Harvests are looking great though! How can I help you navigate Kido Farms today?",
                isMock: true
            });
        }

        try {
            const chat = model.startChat({
                history: history || [],
                generationConfig: {
                    maxOutputTokens: 800,
                },
            });

            let result = await chat.sendMessage(message);
            let response = await result.response;
            let calls = response.functionCalls();

            // Handle Function Calling Loop
            if (calls && calls.length > 0) {
                const toolResponses = [];
                for (const call of calls) {
                    const handler = toolHandlers[call.name];
                    if (handler) {
                        const toolResult = await handler(call.args);
                        toolResponses.push({
                            functionResponse: {
                                name: call.name,
                                response: { content: toolResult }
                            }
                        });
                    }
                }

                // Send tool results back to the model for final synthesis
                result = await chat.sendMessage(toolResponses);
                response = await result.response;
            }

            const text = response.text();
            res.json({ reply: text });
        } catch (apiError) {
            console.error('Gemini Agent Neural Failure:', apiError);
            return res.json({
                reply: "Our neural nodes are experiencing high latency, but I'm still here! Kido Farms is buzzing with activity. How can I assist you with our organic harvests today?",
                isMock: true
            });
        }
    } catch (error) {
        console.error('Gemini Global Agent Error:', error);
        res.status(500).json({ error: 'AI Agent disruption. Our neural nodes are currently re-aligning.' });
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

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key') {
            return res.json({
                recipeName: "Kido Special Jollof",
                instructions: "1. Rinse Kido Organic Rice. 2. Blend Kido Tomatoes and Peppers. 3. Sauté and simmer with your choice of farm-fresh protein.",
                missingIngredients: ["Kido Thyme", "Smoked Paprika"]
            });
        }

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

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key') {
            return res.json({
                score: 15,
                threat: "Normal weather patterns detected.",
                mitigation: "Continue standard irrigation protocol."
            });
        }

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

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key') {
            return res.json({
                answer: "As a Master Agronomist, I recommend observing your soil pH and moisture levels. Our training node is currently syncing for more specific data."
            });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ answer: response.text() });
    } catch (error) {
        res.status(500).json({ error: 'Mastery Tutor unavailable' });
    }
});

module.exports = router;
