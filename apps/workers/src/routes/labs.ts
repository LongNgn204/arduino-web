// Labs routes - với save/load code từ server
// GET /api/labs/:id, POST /api/labs/:id/save, GET /api/labs/:id/submissions

import { Hono } from 'hono';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, desc } from 'drizzle-orm';
import { labs, weeks, labSubmissions } from '../db/schema';
import { requireAuth } from '../middleware/auth';
import { generateId } from '../services/crypto';
import type { Env, AuthUser } from '../types';

const labsRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /api/labs/:id
 * Lấy chi tiết lab + code đã lưu của user
 */
labsRoutes.get('/labs/:id', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;
    const labId = c.req.param('id');

    // Lấy lab
    const lab = await db.select()
        .from(labs)
        .where(eq(labs.id, labId))
        .get();

    if (!lab) {
        return c.json({
            error: { code: 'NOT_FOUND', message: 'Lab không tồn tại' }
        }, 404);
    }

    // Lấy thông tin week
    const week = await db.select({
        id: weeks.id,
        weekNumber: weeks.weekNumber,
        title: weeks.title,
    })
        .from(weeks)
        .where(eq(weeks.id, lab.weekId))
        .get();

    // Lấy code đã lưu của user (nếu có)
    const submission = await db.select()
        .from(labSubmissions)
        .where(
            and(
                eq(labSubmissions.labId, labId),
                eq(labSubmissions.userId, user.id)
            )
        )
        .orderBy(desc(labSubmissions.updatedAt))
        .get();

    // Parse rubric JSON
    let parsedRubric = null;
    if (lab.rubric) {
        try {
            parsedRubric = JSON.parse(lab.rubric);
        } catch {
            parsedRubric = null;
        }
    }

    return c.json({
        lab: {
            ...lab,
            rubric: parsedRubric,
        },
        week,
        savedCode: submission?.code || null,
        submissionId: submission?.id || null,
        isSubmitted: submission?.isSubmitted || false,
    });
});

// Save code schema
const saveCodeSchema = z.object({
    code: z.string(),
    submit: z.boolean().optional().default(false), // Nếu true, đánh dấu là đã nộp bài
});

/**
 * POST /api/labs/:id/save
 * Lưu code của user lên server (autosave)
 */
labsRoutes.post('/labs/:id/save', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;
    const labId = c.req.param('id');

    // Parse request
    let body: unknown;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: { code: 'INVALID_JSON', message: 'Body không hợp lệ' } }, 400);
    }

    const result = saveCodeSchema.safeParse(body);
    if (!result.success) {
        return c.json({
            error: { code: 'VALIDATION_ERROR', message: result.error.errors[0].message }
        }, 400);
    }

    const { code, submit } = result.data;

    // Kiểm tra lab tồn tại
    const lab = await db.select({ id: labs.id })
        .from(labs)
        .where(eq(labs.id, labId))
        .get();

    if (!lab) {
        return c.json({
            error: { code: 'NOT_FOUND', message: 'Lab không tồn tại' }
        }, 404);
    }

    // Tìm submission hiện có
    const existingSubmission = await db.select()
        .from(labSubmissions)
        .where(
            and(
                eq(labSubmissions.labId, labId),
                eq(labSubmissions.userId, user.id)
            )
        )
        .get();

    const now = new Date();

    if (existingSubmission) {
        // Update existing
        await db.update(labSubmissions)
            .set({
                code,
                isSubmitted: submit ? true : existingSubmission.isSubmitted,
                updatedAt: now,
            })
            .where(eq(labSubmissions.id, existingSubmission.id))
            .run();

        console.log('[lab] Code updated', { labId, userId: user.id, submit });

        return c.json({
            success: true,
            submissionId: existingSubmission.id,
            isSubmitted: submit || existingSubmission.isSubmitted,
            message: submit ? 'Đã nộp bài thành công!' : 'Đã lưu code',
        });
    } else {
        // Create new
        const submissionId = generateId();
        await db.insert(labSubmissions).values({
            id: submissionId,
            userId: user.id,
            labId,
            code,
            isSubmitted: submit ? true : false,
            createdAt: now,
            updatedAt: now,
        }).run();

        console.log('[lab] Code saved', { labId, userId: user.id, submissionId, submit });

        return c.json({
            success: true,
            submissionId,
            isSubmitted: submit,
            message: submit ? 'Đã nộp bài thành công!' : 'Đã lưu code',
        });
    }
});

/**
 * GET /api/labs/:id/submissions
 * Lấy lịch sử submissions của user cho lab này
 */
labsRoutes.get('/labs/:id/submissions', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;
    const labId = c.req.param('id');

    const submissions = await db.select({
        id: labSubmissions.id,
        isSubmitted: labSubmissions.isSubmitted,
        grade: labSubmissions.grade,
        feedback: labSubmissions.feedback,
        gradedAt: labSubmissions.gradedAt,
        updatedAt: labSubmissions.updatedAt,
    })
        .from(labSubmissions)
        .where(
            and(
                eq(labSubmissions.labId, labId),
                eq(labSubmissions.userId, user.id)
            )
        )
        .orderBy(desc(labSubmissions.updatedAt))
        .all();

    return c.json({ submissions });
});

export default labsRoutes;
