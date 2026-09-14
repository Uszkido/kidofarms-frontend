const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { tickets, ticketMessages, users } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { sendTicketAlert } = require('../lib/bot');
const { authenticateToken, authenticateTokenOptional, authorizeRoles } = require('../middleware/authMiddleware');

const supportRoles = ['admin', 'sub-admin', 'team_member', 'staff'];
const canSupport = (user) => supportRoles.includes(user?.role);

// 1. Create a Ticket
router.post('/', authenticateTokenOptional, async (req, res) => {
    try {
        const { subject, message, guestName, guestEmail, priority, category, orderId, attachmentUrl } = req.body;
        const userId = req.user?.id || null;
        if (!subject?.trim() || !message?.trim()) {
            return res.status(400).json({ error: 'Subject and message are required' });
        }
        if (!userId && (!guestName?.trim() || !guestEmail?.trim())) {
            return res.status(400).json({ error: 'Name and email are required for guest tickets' });
        }
        const [newTicket] = await db.insert(tickets).values({
            userId,
            guestName: userId ? null : guestName.trim().slice(0, 120),
            guestEmail: userId ? null : guestEmail.trim().toLowerCase().slice(0, 254),
            subject: subject.trim().slice(0, 200),
            priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
            category: ['support', 'delivery_issue', 'return_request'].includes(category) ? category : 'support',
            orderId: typeof orderId === 'string' ? orderId : null,
            status: 'open',
        }).returning();

        await db.insert(ticketMessages).values({
            ticketId: newTicket.id,
            senderId: userId,
            message: message.trim().slice(0, 5000),
            attachmentUrl: typeof attachmentUrl === 'string' ? attachmentUrl.slice(0, 1000) : null,
        });

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        // Send Notification
        await sendTicketAlert(newTicket, user ? user.name : 'Unknown User');

        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Reply to a Ticket
router.post('/:id/reply', authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        const ticketId = req.params.id;
        if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });
        const [ticket] = await db.select().from(tickets).where(eq(tickets.id, ticketId)).limit(1);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        if (!canSupport(req.user) && ticket.userId !== req.user.id) {
            return res.status(403).json({ error: 'You do not have access to this ticket' });
        }

        const [newMessage] = await db.insert(ticketMessages).values({
            ticketId,
            senderId: req.user.id,
            message: message.trim().slice(0, 5000)
        }).returning();

        // Update ticket's updatedAt
        await db.update(tickets)
            .set({ updatedAt: new Date() })
            .where(eq(tickets.id, ticketId));

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Get User Tickets
router.get('/user/:userId', authenticateToken, async (req, res) => {
    try {
        if (!canSupport(req.user) && req.user.id !== req.params.userId) {
            return res.status(403).json({ error: 'You do not have access to these tickets' });
        }
        const userTickets = await db.select()
            .from(tickets)
            .where(eq(tickets.userId, req.params.userId))
            .orderBy(desc(tickets.createdAt));
        res.json(userTickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Get All Tickets (Admin)
router.get('/admin/all', authenticateToken, authorizeRoles('admin', 'sub-admin', 'team_member'), async (req, res) => {
    try {
        const allTickets = await db.select({
            id: tickets.id,
            subject: tickets.subject,
            status: tickets.status,
            priority: tickets.priority,
            createdAt: tickets.createdAt,
            updatedAt: tickets.updatedAt,
            userName: users.name,
            userEmail: users.email
        })
            .from(tickets)
            .leftJoin(users, eq(tickets.userId, users.id))
            .orderBy(desc(tickets.createdAt));
        res.json(allTickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Get Ticket Details (including messages)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [ticket] = await db.select().from(tickets).where(eq(tickets.id, req.params.id)).limit(1);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        if (!canSupport(req.user) && ticket.userId !== req.user.id) {
            return res.status(403).json({ error: 'You do not have access to this ticket' });
        }

        const messages = await db.select({
            id: ticketMessages.id,
            message: ticketMessages.message,
            createdAt: ticketMessages.createdAt,
            senderId: ticketMessages.senderId,
            senderName: users.name,
            senderRole: users.role
        })
            .from(ticketMessages)
            .leftJoin(users, eq(ticketMessages.senderId, users.id))
            .where(eq(ticketMessages.ticketId, req.params.id))
            .orderBy(ticketMessages.createdAt);

        res.json({ ...ticket, messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Update Ticket Status
router.patch('/:id/status', authenticateToken, authorizeRoles('admin', 'sub-admin', 'team_member'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid ticket status' });
        }
        const [updatedTicket] = await db.update(tickets)
            .set({ status, updatedAt: new Date() })
            .where(eq(tickets.id, req.params.id))
            .returning();
        res.json(updatedTicket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
