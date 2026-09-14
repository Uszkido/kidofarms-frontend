const axios = require('axios');

// Provider-neutral hook. Configure WHATSAPP_API_URL and WHATSAPP_API_TOKEN
// (or replace this adapter for your chosen BSP). Nothing is sent when absent.
async function sendWhatsAppUpdate(phone, message) {
    if (!phone || !process.env.WHATSAPP_API_URL || !process.env.WHATSAPP_API_TOKEN) return false;
    try {
        await axios.post(process.env.WHATSAPP_API_URL, { to: phone, message }, { headers: { Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`, 'Content-Type': 'application/json' }, timeout: 8000 });
        return true;
    } catch (error) { console.error('WhatsApp update failed:', error.response?.data || error.message); return false; }
}
module.exports = { sendWhatsAppUpdate };
