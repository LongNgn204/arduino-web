// Auth routes cho Arduino Learning Hub
// POST /api/auth/register, /api/auth/login, /api/auth/logout, GET /api/auth/me

import { Hono } from 'hono';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, gt } from 'drizzle-orm';
import { users, sessions } from '../db/schema';
import { hashPassword, verifyPassword, generateSessionToken, generateId } from '../services/crypto';
import type { Env } from '../types';

// Validation schemas
const registerSchema = z.object({
    username: z.string()
        .min(3, 'Username tối thiểu 3 ký tự')
        .max(20, 'Username tối đa 20 ký tự')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username chỉ chứa chữ cái, số và dấu gạch dưới'),
    password: z.string()
        .min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

const loginSchema = z.object({
    username: z.string().min(1, 'Vui lòng nhập username'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

// Cookie config
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 ngày
const COOKIE_NAME = 'arduino_session';

const auth = new Hono<{ Bindings: Env }>();

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
auth.post('/register', async (c) => {
    const db = drizzle(c.env.DB);

    // Parse và validate body
    let body: unknown;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: { code: 'INVALID_JSON', message: 'Body không hợp lệ' } }, 400);
    }

    const result = registerSchema.safeParse(body);
    if (!result.success) {
        return c.json({
            error: {
                code: 'VALIDATION_ERROR',
                message: result.error.errors[0].message
            }
        }, 400);
    }

    const { username, password } = result.data;
    const normalizedUsername = username.toLowerCase();

    // Kiểm tra username tồn tại
    const existingUser = await db.select()
        .from(users)
        .where(eq(users.username, normalizedUsername))
        .get();

    if (existingUser) {
        return c.json({
            error: { code: 'USERNAME_EXISTS', message: 'Username đã tồn tại' }
        }, 409);
    }

    // Hash password và tạo user
    const passwordHash = await hashPassword(password);
    const userId = generateId();

    await db.insert(users).values({
        id: userId,
        username: normalizedUsername,
        passwordHash,
        role: 'student',
        displayName: username, // Giữ case gốc cho display
    });

    // Tạo session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION);

    await db.insert(sessions).values({
        id: sessionToken,
        userId,
        expiresAt,
    });

    // Set cookie
    c.header('Set-Cookie',
        `${COOKIE_NAME}=${sessionToken}; ` +
        `Path=/; ` +
        `HttpOnly; ` +
        `Secure; ` +
        `SameSite=Lax; ` +
        `Expires=${expiresAt.toUTCString()}`
    );

    console.log('[auth] User registered:', normalizedUsername);

    return c.json({
        user: {
            id: userId,
            username: normalizedUsername,
            displayName: username,
            role: 'student',
        }
    }, 201);
});

/**
 * POST /api/auth/login
 * Đăng nhập
 */
auth.post('/login', async (c) => {
    const db = drizzle(c.env.DB);

    // Parse và validate body
    let body: unknown;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: { code: 'INVALID_JSON', message: 'Body không hợp lệ' } }, 400);
    }

    const result = loginSchema.safeParse(body);
    if (!result.success) {
        return c.json({
            error: { code: 'VALIDATION_ERROR', message: result.error.errors[0].message }
        }, 400);
    }

    const { username, password } = result.data;
    const normalizedUsername = username.toLowerCase();

    // Tìm user
    const user = await db.select()
        .from(users)
        .where(eq(users.username, normalizedUsername))
        .get();

    if (!user) {
        return c.json({
            error: { code: 'INVALID_CREDENTIALS', message: 'Username hoặc mật khẩu không đúng' }
        }, 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
        return c.json({
            error: { code: 'INVALID_CREDENTIALS', message: 'Username hoặc mật khẩu không đúng' }
        }, 401);
    }

    // Tạo session mới
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION);

    await db.insert(sessions).values({
        id: sessionToken,
        userId: user.id,
        expiresAt,
    });

    // Set cookie
    c.header('Set-Cookie',
        `${COOKIE_NAME}=${sessionToken}; ` +
        `Path=/; ` +
        `HttpOnly; ` +
        `Secure; ` +
        `SameSite=Lax; ` +
        `Expires=${expiresAt.toUTCString()}`
    );

    console.log('[auth] User logged in:', normalizedUsername);

    return c.json({
        user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            role: user.role,
        }
    });
});

/**
 * POST /api/auth/logout
 * Đăng xuất - xóa session
 */
auth.post('/logout', async (c) => {
    const db = drizzle(c.env.DB);

    // Lấy session từ cookie
    const cookieHeader = c.req.header('Cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => c.trim().split('='))
    );
    const sessionToken = cookies[COOKIE_NAME];

    if (sessionToken) {
        // Xóa session trong DB
        await db.delete(sessions).where(eq(sessions.id, sessionToken));
        console.log('[auth] Session deleted');
    }

    // Clear cookie
    c.header('Set-Cookie',
        `${COOKIE_NAME}=; ` +
        `Path=/; ` +
        `HttpOnly; ` +
        `Secure; ` +
        `SameSite=Lax; ` +
        `Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    );

    return c.json({ success: true });
});

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại từ session
 */
auth.get('/me', async (c) => {
    const db = drizzle(c.env.DB);

    // Lấy session từ cookie
    const cookieHeader = c.req.header('Cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => c.trim().split('='))
    );
    const sessionToken = cookies[COOKIE_NAME];

    if (!sessionToken) {
        return c.json({ user: null });
    }

    // Tìm session còn hiệu lực
    const session = await db.select()
        .from(sessions)
        .where(
            and(
                eq(sessions.id, sessionToken),
                gt(sessions.expiresAt, new Date())
            )
        )
        .get();

    if (!session) {
        // Session không tồn tại hoặc hết hạn
        return c.json({ user: null });
    }

    // Lấy thông tin user
    const user = await db.select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        role: users.role,
    })
        .from(users)
        .where(eq(users.id, session.userId))
        .get();

    return c.json({ user });
});

export default auth;
