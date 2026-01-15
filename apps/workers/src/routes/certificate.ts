
import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, sql, and } from 'drizzle-orm';
import { users, progress, lessons, labs } from '../db/schema';
import { requireAuth } from '../middleware/auth';
import type { Env, AuthUser } from '../types';

const certificateRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /api/certificate
 * Kiểm tra điều kiện và trả về thông tin chứng chỉ
 */
certificateRoutes.get('/certificate', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;

    // 1. Tính tổng số bài học và bài lab trong hệ thống
    const totalLessons = await db.select({ count: sql<number>`count(*)` }).from(lessons).get();
    const totalLabs = await db.select({ count: sql<number>`count(*)` }).from(labs).get();

    const grandTotal = (totalLessons?.count || 0) + (totalLabs?.count || 0);

    if (grandTotal === 0) {
        return c.json({ eligible: false, progress: 0, message: "Chưa có nội dung khóa học." });
    }

    // 2. Tính số lượng user đã completed
    const userCompleted = await db.select({ count: sql<number>`count(*)` })
        .from(progress)
        .where(
            and(
                eq(progress.userId, user.id),
                eq(progress.status, 'completed')
            )
        )
        .get();

    const completedCount = userCompleted?.count || 0;
    const percentage = Math.round((completedCount / grandTotal) * 100);

    // 3. Kiểm tra điều kiện (Ví dụ: > 80%)
    const isEligible = percentage >= 80;

    if (!isEligible) {
        return c.json({
            eligible: false,
            progress: percentage,
            message: `Bạn mới hoàn thành ${percentage}% khóa học. Cần đạt 80% để nhận chứng chỉ.`
        });
    }

    // 4. Trả về thông tin chứng chỉ (Mock dynamic generation)
    return c.json({
        eligible: true,
        progress: percentage,
        certificate: {
            id: `CERT-${user.id.substring(0, 8).toUpperCase()}-${new Date().getFullYear()}`,
            studentName: user.displayName || user.username,
            courseName: "Lập trình hệ thống nhúng & IoT (TECH476)",
            issueDate: new Date().toISOString(),
            instructor: "Giảng viên phụ trách"
        }
    });
});

export default certificateRoutes;
