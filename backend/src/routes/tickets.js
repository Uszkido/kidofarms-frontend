const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { tickets, ticketMessages, users } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

// 1. Create a Ticket
router.post('/', async (req, res) => {
    try {
        const { userId, subject, message } = req.body;
        const [newTicket] = await db.insert(tickets).values({
            userId,
            subject,
            status: 'open'
        }).returning();

        await db.insert(ticketMessages).values({
            ticketId: newTicket.id,
            senderId: userId,
            message
        });

        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Reply to a Ticket
router.post('/:id/reply', async (req, res) => {
    try {
        const { senderId, message } = req.body;
        const ticketId = req.params.id;

        const [newMessage] = await db.insert(ticketMessages).values({
            ticketId,
            senderId,
            message
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
router.get('/user/:userId', async (req, res) => {
    try {
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
router.get('/admin/all', async (req, res) => {
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
router.get('/:id', async (req, res) => {
    try {
        const [ticket] = await db.select().from(tickets).where(eq(tickets.id, req.params.id)).limit(1);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

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
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
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
