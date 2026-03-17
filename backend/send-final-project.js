const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendFinalProject() {
    console.log('--- Initiating Global Transmission Protocol ---');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const recipients = ['usamaado36@gmail.com', 'Vexelvision@gmail.com'];

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { 
                font-family: 'Inter', sans-serif; 
                background-color: #040d0a; 
                color: #E6EDF3; 
                margin: 0; 
                padding: 40px; 
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: #0b1612; 
                border: 1px solid #c5a059; 
                border-radius: 40px; 
                padding: 60px;
                box-shadow: 0 0 50px rgba(197, 160, 89, 0.1);
            }
            h1 { 
                font-size: 48px; 
                font-weight: 900; 
                color: #ffffff; 
                margin-bottom: 20px; 
                text-transform: uppercase; 
                letter-spacing: -2px;
                font-style: italic;
            }
            .accent { color: #c5a059; }
            .badge {
                background: rgba(197, 160, 89, 0.1);
                color: #c5a059;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 10px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 2px;
                display: inline-block;
                margin-bottom: 30px;
            }
            p { font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.6); }
            .grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 20px; 
                margin: 40px 0; 
            }
            .card { 
                background: rgba(255, 255, 255, 0.03); 
                padding: 30px; 
                border-radius: 24px; 
                border: 1px solid rgba(255, 255, 255, 0.05); 
            }
            .card h3 { 
                font-size: 12px; 
                margin-bottom: 10px; 
                text-transform: uppercase; 
                color: #c5a059; 
                letter-spacing: 2px;
            }
            .card p { font-size: 14px; margin: 0; }
            .btn { 
                display: inline-block; 
                background: #c5a059; 
                color: #040d0a; 
                padding: 20px 40px; 
                border-radius: 30px; 
                text-decoration: none; 
                font-weight: 900; 
                text-transform: uppercase; 
                letter-spacing: 2px;
                font-size: 12px;
                margin-top: 30px;
                box-shadow: 0 10px 30px rgba(197, 160, 89, 0.2);
            }
            .footer { 
                margin-top: 60px; 
                padding-top: 40px; 
                border-top: 1px solid rgba(255, 255, 255, 0.05); 
                text-align: center; 
                font-size: 10px; 
                text-transform: uppercase; 
                letter-spacing: 3px; 
                color: rgba(255, 255, 255, 0.2);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="badge">Sovereign Protocol v5.0 Active</div>
            <h1>Orbit 5.0 <span class="accent">Handover</span></h1>
            <p>Greetings, usama. I have successfully concluded the full architectural deployment of <strong>Kido Farms: Mastery Academy & Global Marketplace</strong>. All neural nodes are synchronized and the system is fully operational.</p>
            
            <div class="grid">
                <div class="card">
                    <h3>GitHub Blueprint</h3>
                    <p>The entire source code, including the recent Orbit 5.0 features, is available at the unified repo.</p>
                </div>
                <div class="card">
                    <h3>Vercel Deployment</h3>
                    <p>The system is live in production. Future pushes to 'main' will trigger automatic synchronization.</p>
                </div>
                <div class="card">
                    <h3>Mastery Academy</h3>
                    <p>Gamified learning nodes (Soil Biology, Irrigation, Exports) are fully integrated with point systems.</p>
                </div>
                <div class="card">
                    <h3>Sovereign Energy</h3>
                    <p>The biomass-to-credit circular economic ledger is active and ready for farmer nodes.</p>
                </div>
            </div>

            <p style="margin-bottom: 40px;">Use the access key below to pull the latest codebase and access the Command Center.</p>
            
            <a href="https://github.com/Uszkido/kidofarms-frontend.git" class="btn">Access GitHub Archive</a>
            <a href="https://kidofarms.vercel.app" class="btn" style="background: rgba(255,255,255,0.05); color: #c5a059; margin-left: 10px; border: 1px solid #c5a059;">View Live Node</a>

            <div class="footer">
                Built by Antigravity AI &bull; Powered by Orbit 5.0 Engine &bull; Nigeria 2026
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: '"Orbit 5.0 Vision" <' + process.env.EMAIL_USER + '>',
            to: recipients.join(', '),
            subject: 'Project Complete: Kido Farms Orbit 5.0 Sovereign Handover 🚀',
            html: htmlContent
        });
        console.log('Handover sequence successful. ID:', info.messageId);
        process.exit(0);
    } catch (error) {
        console.error('Handover sequence failed:', error);
        process.exit(1);
    }
}

sendFinalProject();
