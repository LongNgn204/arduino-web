// Auth middleware cho Hono
// requireAuth - yêu cầu đăng nhập
// requireAdmin - yêu cầu quyền admin

import type { Context, Next } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, gt } from 'drizzle-orm';
import { users, sessions } from '../db/schema';
import type { Env, AuthUser, Variables } from '../types';

const COOKIE_NAME = 'arduino_session';

// Type helper cho context với bindings và variables
type AppContext = Context<{ Bindings: Env; Variables: Variables }>;

/**
 * Lấy user từ session cookie
 * @returns User object hoặc null
 */
async function getUserFromSession(c: AppContext): Promise<AuthUser | null> {
    const db = drizzle(c.env.DB);

    // Parse cookie
    const cookieHeader = c.req.header('Cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(cookie => cookie.trim().split('='))
    );
    const sessionToken = cookies[COOKIE_NAME];

    if (!sessionToken) {
        return null;
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
        return null;
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

    if (!user) {
        return null;
    }

    return user as AuthUser;
}

/**
 * Middleware yêu cầu đăng nhập
 * Nếu chưa đăng nhập → 401 Unauthorized
 * Nếu đã đăng nhập → set c.set('user', user) và next()
 */
export function requireAuth() {
    return async (c: AppContext, next: Next) => {
        const user = await getUserFromSession(c);

        if (!user) {
            return c.json({
                error: { code: 'UNAUTHORIZED', message: 'Vui lòng đăng nhập' }
            }, 401);
        }

        // Lưu user vào context để sử dụng trong route handler
        c.set('user', user);
        await next();
    };
}

/**
 * Middleware yêu cầu quyền admin
 * Phải đăng nhập VÀ role = admin
 * Nếu không đủ quyền → 403 Forbidden
 */
export function requireAdmin() {
    return async (c: AppContext, next: Next) => {
        const user = await getUserFromSession(c);

        if (!user) {
            return c.json({
                error: { code: 'UNAUTHORIZED', message: 'Vui lòng đăng nhập' }
            }, 401);
        }

        if (user.role !== 'admin') {
            return c.json({
                error: { code: 'FORBIDDEN', message: 'Bạn không có quyền truy cập' }
            }, 403);
        }

        c.set('user', user);
        await next();
    };
}

/**
 * Middleware tùy chọn - set user nếu có session, không block nếu không có
 * Dùng cho các route public nhưng cần biết user đang đăng nhập
 */
export function optionalAuth() {
    return async (c: AppContext, next: Next) => {
        const user = await getUserFromSession(c);
        c.set('user', user); // null nếu chưa đăng nhập
        await next();
    };
}
