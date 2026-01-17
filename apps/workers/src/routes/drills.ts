// Exam Drills routes
// GET /api/drills/:id, POST /api/drills/:id/submit

import { Hono } from 'hono';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { examDrills, weeks } from '../db/schema';
import { requireAuth } from '../middleware/auth';
import type { Env, AuthUser } from '../types';

const drillsRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /api/drills
 * Lấy danh sách tất cả exam drills
 */
drillsRoutes.get('/drills', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);

    const allDrills = await db.select({
        id: examDrills.id,
        title: examDrills.title,
        description: examDrills.description,
        difficulty: examDrills.difficulty,
        timeLimit: examDrills.timeLimit,
        weekId: examDrills.weekId,
        weekNumber: weeks.weekNumber,
        weekTitle: weeks.title,
    })
        .from(examDrills)
        .leftJoin(weeks, eq(examDrills.weekId, weeks.id))
        .where(eq(examDrills.isPublished, true))
        .all();

    return c.json({ drills: allDrills });
});

/**
 * GET /api/drills/:id
 * Lấy chi tiết exam drill
 */
drillsRoutes.get('/drills/:id', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const drillId = c.req.param('id');

    const drill = await db.select()
        .from(examDrills)
        .where(eq(examDrills.id, drillId))
        .get();

    if (!drill) {
        return c.json({
            error: { code: 'NOT_FOUND', message: 'Exam drill không tồn tại' }
        }, 404);
    }

    // Lấy week info
    const week = await db.select({
        id: weeks.id,
        weekNumber: weeks.weekNumber,
        title: weeks.title,
    })
        .from(weeks)
        .where(eq(weeks.id, drill.weekId))
        .get();

    return c.json({
        drill: {
            id: drill.id,
            title: drill.title,
            description: drill.description,
            content: drill.content,
            difficulty: drill.difficulty,
            timeLimit: drill.timeLimit,
        },
        week,
    });
});

// Submit drill schema
const submitDrillSchema = z.object({
    code: z.string().min(1, 'Vui lòng nhập code'),
    wiring: z.string().optional(),
    timeSpentMinutes: z.number().optional(),
});

/**
 * POST /api/drills/:id/submit
 * Nộp bài exam drill - sẽ được chấm bởi AI grader
 */
drillsRoutes.post('/drills/:id/submit', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;
    const drillId = c.req.param('id');

    // Parse request
    let body: unknown;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: { code: 'INVALID_JSON', message: 'Body không hợp lệ' } }, 400);
    }

    const result = submitDrillSchema.safeParse(body);
    if (!result.success) {
        return c.json({
            error: { code: 'VALIDATION_ERROR', message: result.error.errors[0].message }
        }, 400);
    }

    const { code, wiring, timeSpentMinutes } = result.data;

    // Lấy drill và rubric
    const drill = await db.select()
        .from(examDrills)
        .where(eq(examDrills.id, drillId))
        .get();

    if (!drill) {
        return c.json({
            error: { code: 'NOT_FOUND', message: 'Exam drill không tồn tại' }
        }, 404);
    }

    console.log('[drill] Submitted', { drillId, userId: user.id, timeSpentMinutes });

    // TODO: Gọi AI grader mode để chấm bài
    // Tạm thời trả về placeholder
    return c.json({
        success: true,
        message: 'Đã nộp bài thành công! Bài sẽ được chấm trong giây lát.',
        drillId,
        // Placeholder result
        grading: {
            status: 'pending', // pending | graded
            score: null,
            feedback: null,
        },
    });
});

export default drillsRoutes;
