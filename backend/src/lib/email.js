const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOtpEmail = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: `"Kido Farms" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Kido Farms OTP Verification Code",
            text: `Your OTP is ${otp}. It expires in 15 minutes.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                    <h2 style="color: #2c5e1b;">Welcome to Kido Farms</h2>
                    <p>Verify your account with the One-Time Password (OTP) below:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #f2c94c; padding: 20px 0; text-align: center;">
                        ${otp}
                    </div>
                    <p>This code will expire in 15 minutes.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });
        console.log("OTP Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending OTP email:", error);
        return false;
    }
};

const sendBroadcastEmail = async (emails, subject, message, link = null) => {
    try {
        if (!emails || emails.length === 0) return true;

        const info = await transporter.sendMail({
            from: `"Kido Farms Official" <${process.env.EMAIL_USER}>`,
            bcc: emails.join(','), // Using BCC for mass broadcast
            subject: subject,
            text: message + (link ? `\n\nLink: ${link}` : ""),
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background-color: #f8f9fa;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;">
                        <div style="background-color: #06120e; padding: 30px; text-align: center;">
                            <h1 style="color: #C5A059; margin: 0; font-family: serif; font-style: italic; font-size: 28px;">Kido Farms Network</h1>
                        </div>
                        <div style="padding: 40px; color: #333333; line-height: 1.6;">
                            <h2 style="margin-top: 0; color: #06120e; font-size: 22px;">${subject}</h2>
                            <p style="font-size: 16px; color: #555555;">${message}</p>
                            ${link ? `
                                <div style="margin-top: 30px; text-align: center;">
                                    <a href="${link}" style="display: inline-block; padding: 15px 35px; background-color: #C5A059; color: #06120e; text-decoration: none; border-radius: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 13px;">View Update</a>
                                </div>
                            ` : ''}
                        </div>
                        <div style="background-color: #f1f3f5; padding: 25px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0; font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 2px;">Powering the West African Harvest</p>
                            <p style="margin: 10px 0 0 0; font-size: 10px; color: #ced4da;">© 2026 Kido Farms & Orchard. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            `,
        });
        console.log("Broadcast Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending broadcast email:", error);
        return false;
    }
};

module.exports = { sendOtpEmail, sendBroadcastEmail };

