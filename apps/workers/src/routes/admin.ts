// Admin routes cho Arduino Learning Hub
// GET /api/admin/users, PUT /api/admin/users/:id/password, GET /api/admin/progress

import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, count, sql } from 'drizzle-orm';
import { users, sessions, progress, quizAttempts, labSubmissions, drillSubmissions } from '../db/schema';
import { hashPassword } from '../services/crypto';
import type { Env } from '../types';

const admin = new Hono<{ Bindings: Env }>();

// ==========================================
// MIDDLEWARE: Kiểm tra quyền admin
// ==========================================
admin.use('*', async (c, next) => {
    // Lấy session từ cookie
    const cookieHeader = c.req.header('Cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => c.trim().split('='))
    );
    const sessionToken = cookies['arduino_session'];

    if (!sessionToken) {
        return c.json({ error: { code: 'UNAUTHORIZED', message: 'Chưa đăng nhập' } }, 401);
    }

    const db = drizzle(c.env.DB);

    // Tìm session
    const session = await db.select()
        .from(sessions)
        .where(eq(sessions.id, sessionToken))
        .get();

    if (!session || session.expiresAt < new Date()) {
        return c.json({ error: { code: 'UNAUTHORIZED', message: 'Session hết hạn' } }, 401);
    }

    // Tìm user và kiểm tra role
    const user = await db.select()
        .from(users)
        .where(eq(users.id, session.userId))
        .get();

    if (!user || user.role !== 'admin') {
        return c.json({ error: { code: 'FORBIDDEN', message: 'Không có quyền admin' } }, 403);
    }

    // User đã được xác thực là admin, cho phép tiếp tục
    return next();
});

// ==========================================
// GET /api/admin/users - Danh sách users
// ==========================================
admin.get('/users', async (c) => {
    const db = drizzle(c.env.DB);

    const allUsers = await db.select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        role: users.role,
        createdAt: users.createdAt,
    })
        .from(users)
        .orderBy(desc(users.createdAt));

    return c.json({ users: allUsers });
});

// ==========================================
// PUT /api/admin/users/:id/password - Đổi mật khẩu
// ==========================================
admin.put('/users/:id/password', async (c) => {
    const db = drizzle(c.env.DB);
    const userId = c.req.param('id');

    let body: { newPassword?: string };
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: { code: 'INVALID_JSON', message: 'Body không hợp lệ' } }, 400);
    }

    if (!body.newPassword || body.newPassword.length < 6) {
        return c.json({ error: { code: 'VALIDATION_ERROR', message: 'Mật khẩu mới phải >= 6 ký tự' } }, 400);
    }

    // Kiểm tra user tồn tại
    const user = await db.select().from(users).where(eq(users.id, userId)).get();
    if (!user) {
        return c.json({ error: { code: 'NOT_FOUND', message: 'User không tồn tại' } }, 404);
    }

    // Hash và update password
    const newHash = await hashPassword(body.newPassword);
    await db.update(users)
        .set({ passwordHash: newHash, updatedAt: new Date() })
        .where(eq(users.id, userId));

    // Xóa tất cả sessions của user này (force re-login)
    await db.delete(sessions).where(eq(sessions.userId, userId));

    console.log('[admin] Password changed for user:', user.username);

    return c.json({ success: true, message: 'Đã đổi mật khẩu thành công' });
});

// ==========================================
// DELETE /api/admin/users/:id - Xóa user
// ==========================================
admin.delete('/users/:id', async (c) => {
    const db = drizzle(c.env.DB);
    const userId = c.req.param('id');

    // Kiểm tra user tồn tại và không phải admin
    const user = await db.select().from(users).where(eq(users.id, userId)).get();
    if (!user) {
        return c.json({ error: { code: 'NOT_FOUND', message: 'User không tồn tại' } }, 404);
    }
    if (user.role === 'admin') {
        return c.json({ error: { code: 'FORBIDDEN', message: 'Không thể xóa admin' } }, 403);
    }

    // Xóa user (cascade sẽ xóa sessions, progress, etc.)
    await db.delete(users).where(eq(users.id, userId));

    console.log('[admin] User deleted:', user.username);

    return c.json({ success: true, message: 'Đã xóa user' });
});

// ==========================================
// GET /api/admin/progress - Tiến độ học tập
// ==========================================
admin.get('/progress', async (c) => {
    const db = drizzle(c.env.DB);

    // Lấy tiến độ của tất cả users
    const userProgress = await db.select({
        userId: users.id,
        username: users.username,
        displayName: users.displayName,
        lessonsCompleted: sql<number>`(
            SELECT COUNT(*) FROM progress 
            WHERE progress.user_id = users.id 
            AND progress.lesson_id IS NOT NULL 
            AND progress.status = 'completed'
        )`,
        labsCompleted: sql<number>`(
            SELECT COUNT(*) FROM progress 
            WHERE progress.user_id = users.id 
            AND progress.lab_id IS NOT NULL 
            AND progress.status = 'completed'
        )`,
        quizzesPassed: sql<number>`(
            SELECT COUNT(*) FROM quiz_attempts 
            WHERE quiz_attempts.user_id = users.id 
            AND quiz_attempts.passed = 1
        )`,
        drillsPassed: sql<number>`(
            SELECT COUNT(*) FROM drill_submissions 
            WHERE drill_submissions.user_id = users.id 
            AND drill_submissions.passed = 1
        )`,
        lastActivity: sql<string>`(
            SELECT MAX(submitted_at) FROM quiz_attempts 
            WHERE quiz_attempts.user_id = users.id
        )`,
    })
        .from(users)
        .where(eq(users.role, 'student'))
        .orderBy(users.username);

    return c.json({ progress: userProgress });
});

// ==========================================
// GET /api/admin/stats - Thống kê tổng quan
// ==========================================
admin.get('/stats', async (c) => {
    const db = drizzle(c.env.DB);

    const [userCount] = await db.select({ count: count() }).from(users);
    const [quizCount] = await db.select({ count: count() }).from(quizAttempts);
    const [labCount] = await db.select({ count: count() }).from(labSubmissions);

    return c.json({
        totalUsers: userCount.count,
        totalQuizAttempts: quizCount.count,
        totalLabSubmissions: labCount.count,
    });
});

export default admin;
