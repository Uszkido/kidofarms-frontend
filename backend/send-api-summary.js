require("dotenv").config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const htmlContent = `
<div style="font-family: 'Outfit', sans-serif; background: #06120e; color: #ffffff; padding: 40px; border-radius: 15px; max-width: 700px; margin: auto; border: 1px solid #1a3c34;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #C5A059; margin-bottom: 5px; font-size: 28px;">KIDO FARMS: ORBIT 5.0</h1>
        <p style="color: #888; letter-spacing: 2px; font-size: 12px; margin-top: 0;">SOVEREIGN FOOD SYSTEM API REGISTRY</p>
    </div>

    <div style="background: rgba(255, 255, 255, 0.03); padding: 25px; border-radius: 12px; border-left: 4px solid #C5A059; margin-bottom: 25px;">
        <h2 style="color: #C5A059; font-size: 18px; margin-top: 0;">1. The Market Grid (Core E-commerce)</h2>
        <ul style="color: #e0e0e0; line-height: 1.6;">
            <li><b>/api/products</b>: Product lifecycle, search, and "Direct-from-Source" pricing.</li>
            <li><b>/api/categories</b>: Produce categorization (Fruits, Grains, Livestock).</li>
            <li><b>/api/orders</b>: Checkout flows, escrow-held payments, and tracking.</li>
            <li><b>/api/reviews</b>: Citizen feedback loop for verified purchases.</li>
        </ul>
    </div>

    <div style="background: rgba(255, 255, 255, 0.03); padding: 25px; border-radius: 12px; border-left: 4px solid #1a3c34; margin-bottom: 25px;">
        <h2 style="color: #C5A059; font-size: 18px; margin-top: 0;">2. The Identity Archive (Auth & Roles)</h2>
        <ul style="color: #e0e0e0; line-height: 1.6;">
            <li><b>/api/auth</b>: JWT-based authentication, Social Logins, and OTPs.</li>
            <li><b>/api/users</b>: Profile management and Sovereignty status mapping.</li>
            <li><b>/api/security</b>: Immutable Audit Logs tracking every system edit.</li>
        </ul>
    </div>

    <div style="background: rgba(255, 255, 255, 0.03); padding: 25px; border-radius: 12px; border-left: 4px solid #C5A059; margin-bottom: 25px;">
        <h2 style="color: #C5A059; font-size: 18px; margin-top: 0;">3. Sovereign Finance (FinTech & Risk)</h2>
        <ul style="color: #e0e0e0; line-height: 1.6;">
            <li><b>/api/wallet</b>: Internal banking, tracking balances and liquidity.</li>
            <li><b>/api/horizon</b>: Yield-Shield parametric insurance management.</li>
            <li><b>/api/investments</b>: Agri-crowdfunding and farm expansion sponsorship.</li>
        </ul>
    </div>

    <div style="background: rgba(255, 255, 255, 0.03); padding: 25px; border-radius: 12px; border-left: 4px solid #1a3c34; margin-bottom: 25px;">
        <h2 style="color: #C5A059; font-size: 18px; margin-top: 0;">4. Neural Nodes (The AI Layer)</h2>
        <ul style="color: #e0e0e0; line-height: 1.6;">
            <li><b>/api/ai/chat</b>: Gemini-powered AI Concierge with tool-use capabilities.</li>
            <li><b>/api/ai/scan-trust</b>: Trust Oracle (calculates Trust Index & Credit limits).</li>
            <li><b>/api/ai/vision-audit</b>: Kido Vision for automated pest/disease detection.</li>
            <li><b>/api/ai/pricing-oracle</b>: AI-driven fair-trade pricing logic.</li>
        </ul>
    </div>

    <div style="background: rgba(255, 255, 255, 0.03); padding: 25px; border-radius: 12px; border-left: 4px solid #C5A059; margin-bottom: 25px;">
        <h2 style="color: #C5A059; font-size: 18px; margin-top: 0;">5. Orbit 5.0 Mission Control (Admin)</h2>
        <ul style="color: #e0e0e0; line-height: 1.6;">
            <li><b>/api/admin/registry</b>: Universal entity API for full cross-node inspection.</li>
            <li><b>/api/admin/impersonate</b>: Ghost Protocol (troubleshoot user dashboards).</li>
            <li><b>/api/admin/stats</b>: Real-time matrix of active nodes and growth indices.</li>
        </ul>
    </div>

    <div style="text-align: center; border-top: 1px solid #1a3c34; padding-top: 20px; font-size: 12px; color: #888;">
        <p>&copy; 2026 Kido Farms. Developed by Antigravity AI.</p>
        <p>Status: All Neural Nodes Operational [SYNCED]</p>
    </div>
</div>
`;

async function sendEmail() {
    const targetEmail = "usamaado36@gmail.com";
    try {
        console.log(`Attempting to send API Registry to: ${targetEmail}...`);
        const info = await transporter.sendMail({
            from: `"Kido Farms AI" <${process.env.EMAIL_USER}>`,
            to: targetEmail,
            subject: "Kido Farms: Orbit 5.0 API Summary & Architectural Nodes",
            html: htmlContent,
        });
        console.log("Email sent successfully! Message ID: %s", info.messageId);
        process.exit(0);
    } catch (error) {
        console.error("Failed to deliver API summary:", error);
        process.exit(1);
    }
}

sendEmail();
