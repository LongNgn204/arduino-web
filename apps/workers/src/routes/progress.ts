// Progress routes
// GET /api/progress - Lấy tiến độ tổng thể
// GET /api/progress/week/:weekId - Tiến độ theo tuần

import { Hono } from 'hono';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, count, sql } from 'drizzle-orm';
import {
    progress, lessons, labs, quizAttempts, quizzes,
    weeks, aiChatLogs
} from '../db/schema';
import { requireAuth } from '../middleware/auth';
import type { Env, AuthUser } from '../types';

const progressRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /api/progress
 * Lấy tiến độ tổng thể của user
 */
progressRoutes.get('/progress', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;

    // Đếm lessons đã hoàn thành
    const completedLessons = await db.select({ count: count() })
        .from(progress)
        .where(
            and(
                eq(progress.userId, user.id),
                eq(progress.status, 'completed'),
                sql`${progress.lessonId} IS NOT NULL`
            )
        )
        .get();

    // Đếm labs đã hoàn thành  
    const completedLabs = await db.select({ count: count() })
        .from(progress)
        .where(
            and(
                eq(progress.userId, user.id),
                eq(progress.status, 'completed'),
                sql`${progress.labId} IS NOT NULL`
            )
        )
        .get();

    // Đếm quizzes đã pass
    const passedQuizzes = await db.select({ count: count() })
        .from(quizAttempts)
        .where(
            and(
                eq(quizAttempts.userId, user.id),
                eq(quizAttempts.passed, true)
            )
        )
        .get();

    // Tổng số lessons, labs, quizzes
    const totalLessons = await db.select({ count: count() })
        .from(lessons)
        .where(eq(lessons.isPublished, true))
        .get();

    const totalLabs = await db.select({ count: count() })
        .from(labs)
        .where(eq(labs.isPublished, true))
        .get();

    const totalQuizzes = await db.select({ count: count() })
        .from(quizzes)
        .where(eq(quizzes.isPublished, true))
        .get();

    // Tổng số câu hỏi AI đã hỏi
    const totalAIQuestions = await db.select({ count: count() })
        .from(aiChatLogs)
        .where(eq(aiChatLogs.userId, user.id))
        .get();

    // Điểm trung bình quiz
    const avgScore = await db.select({
        avg: sql<number>`AVG(CAST(${quizAttempts.score} AS FLOAT) / CAST(${quizAttempts.maxScore} AS FLOAT) * 100)`
    })
        .from(quizAttempts)
        .where(eq(quizAttempts.userId, user.id))
        .get();

    // Tính % hoàn thành
    const lessonsCompleted = completedLessons?.count || 0;
    const labsCompleted = completedLabs?.count || 0;
    const quizzesCompleted = passedQuizzes?.count || 0;

    const lessonsTotal = totalLessons?.count || 1;
    const labsTotal = totalLabs?.count || 1;
    const quizzesTotal = totalQuizzes?.count || 1;

    const overallProgress = Math.round(
        ((lessonsCompleted / lessonsTotal) * 40 +
            (labsCompleted / labsTotal) * 40 +
            (quizzesCompleted / quizzesTotal) * 20)
    );

    return c.json({
        progress: {
            overall: overallProgress,
            lessons: {
                completed: lessonsCompleted,
                total: lessonsTotal,
                percentage: Math.round((lessonsCompleted / lessonsTotal) * 100),
            },
            labs: {
                completed: labsCompleted,
                total: labsTotal,
                percentage: Math.round((labsCompleted / labsTotal) * 100),
            },
            quizzes: {
                passed: quizzesCompleted,
                total: quizzesTotal,
                percentage: Math.round((quizzesCompleted / quizzesTotal) * 100),
            },
            aiQuestions: totalAIQuestions?.count || 0,
            avgQuizScore: avgScore?.avg ? Math.round(avgScore.avg) : null,
        }
    });
});

/**
 * GET /api/progress/week/:weekId
 * Tiến độ chi tiết theo tuần
 */
progressRoutes.get('/progress/week/:weekId', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;
    const weekId = c.req.param('weekId');

    // Lấy lessons của tuần
    const weekLessons = await db.select({
        id: lessons.id,
        title: lessons.title,
        orderIndex: lessons.orderIndex,
    })
        .from(lessons)
        .where(eq(lessons.weekId, weekId))
        .all();

    // Lấy labs của tuần
    const weekLabs = await db.select({
        id: labs.id,
        title: labs.title,
        orderIndex: labs.orderIndex,
    })
        .from(labs)
        .where(eq(labs.weekId, weekId))
        .all();

    // Lấy progress của user
    const userProgress = await db.select()
        .from(progress)
        .where(eq(progress.userId, user.id))
        .all();

    const progressMap = new Map(
        userProgress.map(p => [p.lessonId || p.labId, p.status])
    );

    // Lấy quiz attempts
    const weekQuizzes = await db.select({
        id: quizzes.id,
        title: quizzes.title,
    })
        .from(quizzes)
        .where(eq(quizzes.weekId, weekId))
        .all();

    const userAttempts = await db.select()
        .from(quizAttempts)
        .where(eq(quizAttempts.userId, user.id))
        .all();

    const attemptMap = new Map<string, { score: number; maxScore: number; passed: boolean }>();
    for (const attempt of userAttempts) {
        const existing = attemptMap.get(attempt.quizId);
        if (!existing || attempt.score > existing.score) {
            attemptMap.set(attempt.quizId, {
                score: attempt.score,
                maxScore: attempt.maxScore,
                passed: !!attempt.passed,
            });
        }
    }

    return c.json({
        weekId,
        lessons: weekLessons.map(l => ({
            ...l,
            status: progressMap.get(l.id) || 'not_started',
        })),
        labs: weekLabs.map(l => ({
            ...l,
            status: progressMap.get(l.id) || 'not_started',
        })),
        quizzes: weekQuizzes.map(q => ({
            ...q,
            bestScore: attemptMap.get(q.id)?.score || null,
            maxScore: attemptMap.get(q.id)?.maxScore || null,
            passed: attemptMap.get(q.id)?.passed || false,
        })),
    });
});

/**
 * POST /api/progress/mark
 * Đánh dấu lesson/lab là đã hoàn thành
 */
// Mark progress schema
const markProgressSchema = z.object({
    lessonId: z.string().optional(),
    labId: z.string().optional(),
    status: z.enum(['not_started', 'in_progress', 'completed']),
});

/**
 * POST /api/progress/mark
 * Đánh dấu lesson/lab là đã hoàn thành
 */
progressRoutes.post('/progress/mark', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;

    let body: unknown;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: { code: 'INVALID_JSON' } }, 400);
    }

    const result = markProgressSchema.safeParse(body);
    if (!result.success) {
        return c.json({
            error: { code: 'VALIDATION_ERROR', message: result.error.errors[0].message }
        }, 400);
    }

    const { lessonId, labId, status } = result.data;

    if (!lessonId && !labId) {
        return c.json({ error: { code: 'MISSING_ID', message: 'Cần lessonId hoặc labId' } }, 400);
    }

    // Tìm progress hiện có
    const existing = await db.select()
        .from(progress)
        .where(
            and(
                eq(progress.userId, user.id),
                lessonId ? eq(progress.lessonId, lessonId) : eq(progress.labId, labId!)
            )
        )
        .get();

    const now = new Date();

    if (existing) {
        await db.update(progress)
            .set({
                status: status as 'not_started' | 'in_progress' | 'completed',
                completedAt: status === 'completed' ? now : null,
            })
            .where(eq(progress.id, existing.id))
            .run();
    } else {
        const { generateId } = await import('../services/crypto');
        await db.insert(progress).values({
            id: generateId(),
            userId: user.id,
            lessonId: lessonId || null,
            labId: labId || null,
            status: status as 'not_started' | 'in_progress' | 'completed',
            completedAt: status === 'completed' ? now : null,
        }).run();
    }

    return c.json({ success: true });
});

export default progressRoutes;
