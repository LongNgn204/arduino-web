// validation.ts - Zod validation middleware factory
// Dùng để validate request body trước khi xử lý

import type { Context, Next } from 'hono';
import { z, type ZodSchema } from 'zod';
import type { Env } from '../types';

/**
 * Tạo middleware validate request body với Zod schema
 * 
 * Usage:
 * ```ts
 * const schema = z.object({ name: z.string() });
 * app.post('/endpoint', validateBody(schema), (c) => {
 *   const data = c.get('validatedBody'); // typed data
 * });
 * ```
 */
export function validateBody<T extends ZodSchema>(schema: T) {
    return async (c: Context<{ Bindings: Env }>, next: Next) => {
        let body: unknown;

        try {
            body = await c.req.json();
        } catch {
            return c.json({
                error: {
                    code: 'INVALID_JSON',
                    message: 'Request body phải là JSON hợp lệ'
                }
            }, 400);
        }

        const result = schema.safeParse(body);

        if (!result.success) {
            const firstError = result.error.errors[0];
            return c.json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: firstError.message,
                    field: firstError.path.join('.') || undefined
                }
            }, 400);
        }

        // Attach validated data to context
        c.set('validatedBody', result.data);

        return next();
    };
}

/**
 * Validate query parameters
 */
export function validateQuery<T extends ZodSchema>(schema: T) {
    return async (c: Context<{ Bindings: Env }>, next: Next) => {
        const query = Object.fromEntries(new URL(c.req.url).searchParams);

        const result = schema.safeParse(query);

        if (!result.success) {
            const firstError = result.error.errors[0];
            return c.json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: firstError.message,
                    field: firstError.path.join('.') || undefined
                }
            }, 400);
        }

        c.set('validatedQuery', result.data);

        return next();
    };
}

/**
 * Validate route params
 */
export function validateParams<T extends ZodSchema>(schema: T) {
    return async (c: Context<{ Bindings: Env }>, next: Next) => {
        const params = c.req.param();

        const result = schema.safeParse(params);

        if (!result.success) {
            const firstError = result.error.errors[0];
            return c.json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: firstError.message,
                    field: firstError.path.join('.') || undefined
                }
            }, 400);
        }

        c.set('validatedParams', result.data);

        return next();
    };
}

// ==========================================
// COMMON SCHEMAS - Dùng lại nhiều nơi
// ==========================================

export const schemas = {
    // Pagination
    pagination: z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(20),
    }),

    // ID param
    idParam: z.object({
        id: z.string().min(1, 'ID không hợp lệ'),
    }),

    // Week ID
    weekIdParam: z.object({
        weekId: z.coerce.number().min(1).max(12),
    }),

    // Lesson ID
    lessonIdParam: z.object({
        lessonId: z.string().min(1),
    }),
};
