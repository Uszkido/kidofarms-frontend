const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
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

module.exports = { sendOtpEmail };
