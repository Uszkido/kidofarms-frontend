const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER || 'dummy@ethereal.email',
        pass: process.env.EMAIL_PASS || 'dummy-pass',
    },
});

const sendOrderConfirmation = async (order, items) => {
    try {
        const itemsHtml = items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} x ${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
        `).join('');

        const html = `
            <div style="font-family: 'Outfit', sans-serif; color: #06120e; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden;">
                <div style="background-color: #06120e; padding: 40px; text-align: center;">
                    <img src="https://kido-farms.vercel.app/logo-kido.png" alt="Kido Farms" style="height: 40px;">
                    <h1 style="color: #C5A059; font-size: 24px; margin-top: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">Order Confirmed</h1>
                </div>
                <div style="padding: 40px;">
                    <p style="font-size: 16px;">Greetings, <b>${order.guestName || 'Kido Citizen'}</b>,</p>
                    <p style="color: #4b5563;">Your harvest node has been successfully reserved. Our carriers are currently prepping for dispatch.</p>
                    
                    <div style="background-color: #f9fafb; border-radius: 15px; padding: 25px; margin: 30px 0;">
                        <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">Tracking ID: ${order.trackingId || order.id}</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            ${itemsHtml}
                            <tr>
                                <td style="padding: 20px 10px 10px; font-weight: 900; font-size: 18px;">Total Harvest Liquidity</td>
                                <td style="padding: 20px 10px 10px; font-weight: 900; font-size: 18px; text-align: right; color: #C5A059;">₦${Number(order.totalAmount).toLocaleString()}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="border-left: 4px solid #C5A059; padding-left: 20px; margin: 30px 0;">
                        <p style="font-size: 12px; color: #6b7280; margin: 0;"><b>Shipping Destination:</b></p>
                        <p style="font-size: 14px; margin: 5px 0;">${order.street}, ${order.city}, ${order.state}</p>
                    </div>

                    <p style="font-size: 14px; color: #4b5563;">Status: <span style="color: #10b981; font-weight: bold;">[SECURED]</span></p>
                </div>
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">
                    Powered by Sovereign Kido Infrastructure &copy; 2026
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: '"Kido Farms" <no-reply@kidofarms.com>',
            to: order.guestEmail || order.userId, // fallback
            subject: `[CONFIRMED] Order #${order.id} - Kido Farms`,
            html: html,
        });

        console.log(`Order confirmation dispatched to ${order.guestEmail || order.userId}`);
    } catch (error) {
        console.error('Email Dispatch Error:', error);
    }
};

module.exports = { sendOrderConfirmation };
