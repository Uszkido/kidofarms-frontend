const PDFDocument = require('pdfkit');

const currency = (amount) => `NGN ${Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const date = (value) => new Date(value).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });

function addHeader(doc, title, reference) {
    doc.save();
    doc.rect(0, 0, doc.page.width, 112).fill('#0b2a20');
    doc.restore();
    doc.fillColor('#d5ad56').font('Helvetica-Bold').fontSize(25).text('KIDO FARMS', 48, 35);
    doc.fillColor('#ffffff').font('Helvetica').fontSize(9).text('PREMIUM FARM COMMERCE', 49, 66);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(18).text(title.toUpperCase(), 385, 38, { width: 178, align: 'right' });
    doc.fillColor('#ffffff').font('Helvetica').fontSize(8).text(reference, 385, 67, { width: 178, align: 'right' });
}

function addFooter(doc) {
    doc.font('Helvetica').fontSize(8).fillColor('#6b7280').text('Kido Farms - Fresh produce, clear pricing, and traceable delivery.', 48, 742, { width: 516, align: 'center' });
}

function streamOrderInvoice(res, order, items) {
    const document = new PDFDocument({ size: 'A4', margin: 48, info: { Title: `Kido Farms invoice ${order.id}` } });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="kido-farms-${order.paymentStatus === 'paid' ? 'receipt' : 'invoice'}-${order.id}.pdf"`);
    document.pipe(res);
    addHeader(document, order.paymentStatus === 'paid' ? 'Payment receipt' : 'Order invoice', `Order ${order.id.slice(0, 8).toUpperCase()}`);
    const detailTop = 140;
    document.fillColor('#14231c').font('Helvetica-Bold').fontSize(11).text('BILLED TO', 48, detailTop);
    document.font('Helvetica').fontSize(10).text(order.guestName || 'Kido Farms customer', 48, detailTop + 20).text(order.guestEmail || '', 48, detailTop + 35).text(order.guestPhone || '', 48, detailTop + 50);
    document.font('Helvetica-Bold').text('DELIVERY ADDRESS', 340, detailTop);
    document.font('Helvetica').text([order.street, order.city, order.state].filter(Boolean).join(', '), 340, detailTop + 20, { width: 210, lineGap: 2 });
    document.moveTo(48, 230).lineTo(564, 230).strokeColor('#d8dfda').stroke();
    document.fillColor('#14231c').font('Helvetica-Bold').fontSize(9).text('ITEM', 48, 247).text('QTY', 345, 247).text('AMOUNT', 445, 247, { width: 110, align: 'right' });
    let y = 273;
    items.forEach((item) => {
        const amount = Number(item.price) * Number(item.quantity);
        document.font('Helvetica').fontSize(10).fillColor('#14231c').text(item.product?.name || item.name || 'Farm product', 48, y, { width: 270 });
        document.text(String(item.quantity), 345, y);
        document.text(currency(amount), 445, y, { width: 110, align: 'right' });
        y += 27;
    });
    document.moveTo(48, y + 4).lineTo(564, y + 4).strokeColor('#d8dfda').stroke();
    document.font('Helvetica-Bold').fontSize(12).text('TOTAL', 345, y + 22).fillColor('#b28b38').text(currency(order.totalAmount), 445, y + 22, { width: 110, align: 'right' });
    document.fillColor('#14231c').font('Helvetica').fontSize(9).text(`Order placed: ${date(order.createdAt)}`, 48, y + 62);
    document.text(`Payment status: ${order.paymentStatus === 'paid' ? 'PAID' : 'PENDING PAYMENT'}`, 48, y + 78);
    document.text(`Order status: ${order.orderStatus}`, 48, y + 94);
    document.fillColor('#4b5563').fontSize(9).text(order.paymentStatus === 'paid' ? 'Thank you. Keep this receipt for your records.' : 'This invoice is payable only through Kido Farms secure checkout.', 48, y + 130, { width: 500 });
    addFooter(document);
    document.end();
}

function streamWholesaleQuote(res, request) {
    const document = new PDFDocument({ size: 'A4', margin: 48, info: { Title: `Kido Farms wholesale quote ${request.id}` } });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="kido-farms-wholesale-quote-${request.id}.pdf"`);
    document.pipe(res);
    addHeader(document, 'Wholesale quote', `Request ${request.id.slice(0, 8).toUpperCase()}`);
    document.fillColor('#14231c').font('Helvetica-Bold').fontSize(11).text('REQUEST');
    document.font('Helvetica').fontSize(10).text(`${request.productName} - ${request.quantity} ${request.unit}`).text(`Delivery: ${request.city}, ${request.state}`).text(`Requested: ${date(request.createdAt)}`);
    document.moveTo(48, 230).lineTo(564, 230).strokeColor('#d8dfda').stroke();
    document.font('Helvetica-Bold').fontSize(10).fillColor('#14231c').text('PRODUCT QUOTE', 48, 250).text(currency(request.quotedAmount), 420, 250, { width: 135, align: 'right' });
    document.text('DELIVERY FEE', 48, 280).text(currency(request.quotedDeliveryFee), 420, 280, { width: 135, align: 'right' });
    const total = Number(request.quotedAmount || 0) + Number(request.quotedDeliveryFee || 0);
    document.fontSize(13).text('TOTAL QUOTE', 48, 328).fillColor('#b28b38').text(currency(total), 420, 328, { width: 135, align: 'right' });
    document.fillColor('#14231c').font('Helvetica-Bold').fontSize(10).text('QUOTE NOTES', 48, 388);
    document.font('Helvetica').fontSize(10).text(request.quoteNote || 'A Kido Farms representative will confirm the next step with you.', 48, 407, { width: 510, lineGap: 3 });
    document.fillColor('#4b5563').fontSize(9).text('This quote is not a payment request. Kido Farms will provide a secure payment link once the quote is accepted.', 48, 510, { width: 500 });
    addFooter(document);
    document.end();
}

module.exports = { streamOrderInvoice, streamWholesaleQuote };
