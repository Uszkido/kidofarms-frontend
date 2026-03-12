const axios = require('axios');

const sendOrderToBot = async (order, items) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.warn("Telegram bot token or chat ID missing. Skipping bot notification.");
        return;
    }

    const itemsText = items.map(item => `- ${item.name} (x${item.quantity}) - ₦${item.price}`).join('\n');

    const message = `
📦 *New Order Received!*
------------------------
*Order ID:* ${order.id}
*Customer:* ${order.userId} (ID)
*Total Amount:* ₦${order.totalAmount}
*Payment Method:* ${order.paymentMethod}

*Items:*
${itemsText}

*Delivery Address:*
${order.street}, ${order.city}, ${order.state} ${order.zip}
------------------------
🌐 _Keep Kido Farms growing!_
    `;

    try {
        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });
        console.log("Order sent to bot successfully.");
    } catch (error) {
        console.error("Error sending order to bot:", error.response ? error.response.data : error.message);
    }
};

module.exports = { sendOrderToBot };
