const axios = require('axios');

const sendTelegramAlert = async (title, content, emoji = '📢') => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken.includes('your-bot-token')) {
        return;
    }

    const message = `
${emoji} *${title}*
------------------------
${content}
------------------------
🌐 _Kido Farms Network Node_
    `;

    try {
        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });
    } catch (error) {
        console.error("Telegram Alert Error:", error.message);
    }
};

const sendOrderToBot = (order, items) => {
    const itemsText = items.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
    const content = `*Order ID:* ${order.id}\n*Amount:* ₦${Number(order.totalAmount).toLocaleString()}\n*Items:*\n${itemsText}\n\n*Destination:* ${order.city}`;
    return sendTelegramAlert("New Order Received!", content, "📦");
};

const sendWelcomeAlert = (user) => {
    const content = `*Name:* ${user.name}\n*Email:* ${user.email}\n*Role:* ${user.role}`;
    return sendTelegramAlert("New Citizen Joined!", content, "👤");
};

const sendReviewAlert = (review, productName) => {
    const content = `*Product:* ${productName}\n*Rating:* ${'⭐'.repeat(review.rating)}\n*Comment:* ${review.comment}`;
    return sendTelegramAlert("New Review Received!", content, "⭐");
};

const sendTicketAlert = (ticket, userName) => {
    const content = `*User:* ${userName}\n*Subject:* ${ticket.subject}\n*Priority:* ${ticket.priority}`;
    return sendTelegramAlert("New Support Ticket!", content, "🎫");
};

const sendVendorAlert = (vendor, businessName) => {
    const content = `*Business:* ${businessName}\n*User ID:* ${vendor.userId}\n*Status:* Pending Approval`;
    return sendTelegramAlert("New Vendor Registered!", content, "🚜");
};

const sendSensorAlert = (sensor) => {
    const content = `*Sensor:* ${sensor.type} (ID: ${sensor.entityId})\n*Value:* ${sensor.value}\n*Status:* ${sensor.status.toUpperCase()}`;
    return sendTelegramAlert("IoT Node Alert!", content, "⚠️");
};

module.exports = {
    sendOrderToBot,
    sendWelcomeAlert,
    sendReviewAlert,
    sendTicketAlert,
    sendVendorAlert,
    sendSensorAlert
};
