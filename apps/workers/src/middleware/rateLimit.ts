// rateLimit.ts - Rate limiting middleware cho AI endpoints
// Sử dụng Cloudflare KV để lưu trữ request counts

import type { Context, Next } from 'hono';
import type { Env } from '../types';

interface RateLimitConfig {
    maxRequests: number;      // Số request tối đa
    windowSeconds: number;    // Thời gian window (giây)
    keyPrefix?: string;       // Prefix cho KV key
}

const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 20,         // 20 requests
    windowSeconds: 60,       // per 60 seconds
    keyPrefix: 'ratelimit'
};

/**
 * Rate limiting middleware sử dụng Cloudflare KV
 * 
 * Default: 20 requests per minute per user
 */
export async function rateLimitMiddleware(
    c: Context<{ Bindings: Env }>,
    next: Next
): Promise<Response | void> {
    const config = DEFAULT_CONFIG;

    // Lấy user identifier (user ID hoặc IP)
    const authHeader = c.req.header('Authorization');
    let userId = 'anonymous';

    if (authHeader?.startsWith('Bearer ')) {
        // Extract user ID từ token (simplified - trong thực tế cần decode JWT)
        const token = authHeader.substring(7);
        // Hash token để làm key
        userId = `user_${token.substring(0, 16)}`;
    } else {
        // Fallback to IP
        userId = `ip_${c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'}`;
    }

    const kvKey = `${config.keyPrefix}:${userId}`;

    try {
        // Lấy current count từ KV
        const kvBinding = c.env.AI_RATE_LIMIT;

        if (!kvBinding) {
            // KV không được cấu hình, skip rate limiting
            console.warn('[rateLimit] KV binding not found, skipping rate limit');
            return next();
        }

        const currentData = await kvBinding.get(kvKey);
        let count = 0;

        if (currentData) {
            count = parseInt(currentData, 10) || 0;
        }

        // Set rate limit headers
        c.header('X-RateLimit-Limit', config.maxRequests.toString());
        c.header('X-RateLimit-Remaining', Math.max(0, config.maxRequests - count - 1).toString());
        c.header('X-RateLimit-Reset', config.windowSeconds.toString());

        // Check limit
        if (count >= config.maxRequests) {
            return c.json({
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: `Quá nhiều request. Vui lòng thử lại sau ${config.windowSeconds} giây.`,
                    retryAfter: config.windowSeconds
                }
            }, 429);
        }

        // Increment count
        await kvBinding.put(kvKey, (count + 1).toString(), {
            expirationTtl: config.windowSeconds
        });

    } catch (error) {
        // Nếu có lỗi, vẫn cho phép request (fail open)
        console.error('[rateLimit] Error:', error);
    }

    return next();
}

/**
 * Stricter rate limit cho các endpoint nhạy cảm
 * 5 requests per minute
 */
export async function strictRateLimitMiddleware(
    c: Context<{ Bindings: Env }>,
    next: Next
): Promise<Response | void> {
    // Override config
    const config: RateLimitConfig = {
        maxRequests: 5,
        windowSeconds: 60,
        keyPrefix: 'strict_ratelimit'
    };

    // Same logic as above, simplified for brevity
    const kvBinding = c.env.AI_RATE_LIMIT;
    if (!kvBinding) return next();

    const userId = c.req.header('CF-Connecting-IP') || 'unknown';
    const kvKey = `${config.keyPrefix}:${userId}`;

    try {
        const currentData = await kvBinding.get(kvKey);
        const count = currentData ? parseInt(currentData, 10) : 0;

        if (count >= config.maxRequests) {
            return c.json({
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Quá nhiều request. Vui lòng thử lại sau.',
                    retryAfter: config.windowSeconds
                }
            }, 429);
        }

        await kvBinding.put(kvKey, (count + 1).toString(), {
            expirationTtl: config.windowSeconds
        });
    } catch (error) {
        console.error('[strictRateLimit] Error:', error);
    }

    return next();
}
