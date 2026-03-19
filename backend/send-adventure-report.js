const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendAdventureReport() {
    console.log('--- Initiating Kido Farms Adventure Report Protocol ---');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const recipients = ['usamaado36@gmail.com', 'vexelvision@gmail.com'];

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
            body { 
                font-family: 'Outfit', sans-serif; 
                background-color: #fcf9f2; 
                color: #1a2e24; 
                margin: 0; 
                padding: 20px; 
            }
            .container { 
                max-width: 650px; 
                margin: 0 auto; 
                background: #ffffff; 
                border-radius: 40px; 
                padding: 40px;
                box-shadow: 0 20px 60px rgba(26, 46, 36, 0.08);
                border: 2px solid #e8dfc5;
            }
            .header-img {
                width: 100%;
                border-radius: 30px;
                margin-bottom: 30px;
            }
            h1 { 
                font-size: 36px; 
                font-weight: 900; 
                color: #1a2e24; 
                margin-bottom: 10px; 
                letter-spacing: -1px;
                text-align: center;
            }
            .adventure-badge {
                display: block;
                width: fit-content;
                margin: 0 auto 30px;
                background: #f7b733;
                color: #ffffff;
                padding: 8px 20px;
                border-radius: 50px;
                font-size: 11px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .section {
                padding: 25px;
                border-radius: 30px;
                margin-bottom: 25px;
                background: #fdfaf4;
                border: 1px solid #f0e9d6;
            }
            .section h2 {
                font-size: 22px;
                margin-top: 0;
                color: #2d5a27;
                display: flex;
                items-center: center;
                gap: 10px;
            }
            .section p {
                font-size: 15px;
                line-height: 1.6;
                color: #4a5d54;
                margin-bottom: 0;
            }
            .tech-report {
                background: #1a2e24;
                color: #ffffff;
                padding: 30px;
                border-radius: 30px;
                margin-top: 40px;
            }
            .tech-report h3 {
                color: #f7b733;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 2px;
                margin-top: 0;
            }
            .tech-list {
                list-style: none;
                padding: 0;
                font-size: 13px;
                opacity: 0.8;
            }
            .tech-list li {
                margin-bottom: 10px;
                border-left: 2px solid #f7b733;
                padding-left: 15px;
            }
            .footer { 
                margin-top: 40px; 
                text-align: center; 
                font-size: 12px; 
                color: #a0b0a8;
                font-weight: 700;
            }
            .btn {
                display: block;
                width: fit-content;
                margin: 30px auto 0;
                background: #2d5a27;
                color: #ffffff;
                padding: 18px 35px;
                border-radius: 20px;
                text-decoration: none;
                font-weight: 700;
                font-size: 14px;
                box-shadow: 0 10px 20px rgba(45, 90, 39, 0.2);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000" class="header-img" alt="Kido Farm Magic">
            <div class="adventure-badge">🌟 The Great Farm Adventure</div>
            <h1>The Kido Farms Story! 🚜</h1>
            <p style="text-align: center; color: #6b7c74; font-weight: 700;">Explained for our 7-year-old Chief Adventurer!</p>

            <div class="section">
                <h2>📦 Step 1: The Magic Treasure Box</h2>
                <p>Imagine a big box where we put all our treats. Before, only people with a "Kido Secret Code" could open it. Now, <b>ANYONE</b> can walk up and get a treat! We made the box smarter so it remembers your name even if you don't have a code!</p>
            </div>

            <div class="section">
                <h2>✨ Step 2: The Golden Key Coins</h2>
                <p>We fixed the shop so you can pay with your <b>Card</b> or a <b>Bank Transfer</b> easily! It's like having a magical wallet that always works. When you press the button, a secure Paystack shield pops up to keep your coins safe!</p>
            </div>

            <div class="section">
                <h2>🗺️ Step 3: The Super Speed Map</h2>
                <p>We found a super-cool, dark-themed map that never gets lost. It helps our delivery trucks find your house faster than ever! It's like having a superhero map that glows in the dark.</p>
            </div>

            <div class="section" style="background: #eef7ee; border-color: #d1e8d1;">
                <h2>🧠 Step 4: The Robot Brain Fix</h2>
                <p>The "Vercel Robot" was having a little trouble thinking, but we gave it a new <b>.npmrc</b> manual to help it learn. Now, it builds the whole farm perfectly every time we add something new!</p>
            </div>

            <div class="tech-report">
                <h3>🛠️ Technical Mission Briefing (For the Adults)</h3>
                <ul class="tech-list">
                    <li><b>Guest Checkout Implementation</b>: Refactored the 'orders' table in PostgreSQL (Neon) to allow null userId. Added guestName, guestEmail, and guestPhone columns.</li>
                    <li><b>Paystack Integration</b>: Unified the checkout flow using react-paystack. Enabled both Card and Bank Transfer channels within a single inline transaction popup.</li>
                    <li><b>Vercel Deployment Fixes</b>: Resolved 'react-paystack' peer dependency conflicts with React 19 using legacy-peer-deps. Fixed 'window is not defined' SSR errors in Leaflet map components.</li>
                    <li><b>UI Optimization</b>: Added Next.js redirects from /profile to /dashboard/buyer to eliminate 404s and improve user navigation.</li>
                </ul>
            </div>

            <a href="https://kidofarms.vercel.app" class="btn">🚀 Visit Your Live Farm Site</a>

            <div class="footer">
                Built with 💚 by Antigravity AI &bull; Kido Farms 2026
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: '"Kido Farms HQ" <' + process.env.EMAIL_USER + '>',
            to: recipients.join(', '),
            subject: '🌟 The Kido Farms Adventure Report: Mission Success!',
            html: htmlContent
        });
        console.log('Adventure Report sent successfully! ID:', info.messageId);
        process.exit(0);
    } catch (error) {
        console.error('Failed to send Adventure Report:', error);
        process.exit(1);
    }
}

sendAdventureReport();
