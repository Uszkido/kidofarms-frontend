const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { academyCourses, userAchievements, activityLogs } = require('../db/schema');
const { eq, desc, and } = require('drizzle-orm');
const { authenticateToken } = require('../middleware/authMiddleware');

// 1. GET /api/academy/courses - List all published modules
router.get('/courses', async (req, res) => {
    try {
        const courses = await db.select().from(academyCourses).where(eq(academyCourses.isPublished, true)).orderBy(desc(academyCourses.createdAt));
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve academy nodes' });
    }
});

// 2. GET /api/academy/achievements - Get user progress
router.get('/achievements', authenticateToken, async (req, res) => {
    try {
        const records = await db.select({
            id: userAchievements.id,
            courseId: userAchievements.courseId,
            pointsEarned: userAchievements.pointsEarned,
            status: userAchievements.status,
            courseTitle: academyCourses.title,
            courseCategory: academyCourses.category
        })
            .from(userAchievements)
            .leftJoin(academyCourses, eq(userAchievements.courseId, academyCourses.id))
            .where(eq(userAchievements.userId, req.user.id));

        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch achievement ledger' });
    }
});

// 3. POST /api/academy/complete/:courseId - Mark course as completed and earn points
router.post('/complete/:courseId', authenticateToken, async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await db.query.academyCourses.findFirst({ where: eq(academyCourses.id, courseId) });
        if (!course) return res.status(404).json({ error: 'Module not found' });

        // Check if already completed
        const existing = await db.query.userAchievements.findFirst({
            where: and(eq(userAchievements.userId, req.user.id), eq(userAchievements.courseId, courseId))
        });

        if (existing && existing.status === 'completed') {
            return res.status(400).json({ error: 'Node already synchronized. Points already awarded.' });
        }

        const points = course.points || 10;

        if (existing) {
            await db.update(userAchievements)
                .set({ status: 'completed', pointsEarned: points })
                .where(eq(userAchievements.id, existing.id));
        } else {
            await db.insert(userAchievements).values({
                userId: req.user.id,
                courseId: courseId,
                pointsEarned: points,
                status: 'completed'
            });
        }

        await db.insert(activityLogs).values({
            action: 'ACADEMY_COURSE_COMPLETE',
            entity: 'academy_courses',
            details: { courseId, pointsAwarded: points },
            userId: req.user.id
        });

        res.json({ message: `Mastery increased. +${points} points awarded.`, points });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process completion' });
    }
});

module.exports = router;
