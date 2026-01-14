// Main entry point cho Cloudflare Workers
// Hono framework với các routes: auth, courses, ai, quizzes

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Env } from './types';

// Import routes
import authRoutes from './routes/auth';
import coursesRoutes from './routes/courses';
import aiRoutes from './routes/ai';
import quizzesRoutes from './routes/quizzes';

const app = new Hono<{ Bindings: Env }>();

// ==========================================
// MIDDLEWARE
// ==========================================

// CORS - cho phép frontend gọi API
app.use('*', cors({
    origin: ['http://localhost:3000', 'https://arduino-web.pages.dev'],
    credentials: true, // Cho phép gửi cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));

// Logger - ghi log request
app.use('*', logger());

// ==========================================
// ROUTES
// ==========================================

// Health check endpoint
app.get('/api/health', (c) => {
    return c.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: c.env.ENVIRONMENT || 'development',
    });
});

// Auth routes: /api/auth/*
app.route('/api/auth', authRoutes);

// Courses routes: /api/courses/*, /api/weeks/*, /api/lessons/*, /api/labs/*
app.route('/api', coursesRoutes);

// AI routes: /api/ai/*
app.route('/api/ai', aiRoutes);

// Quizzes routes: /api/quizzes/*
app.route('/api', quizzesRoutes);

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler
app.notFound((c) => {
    return c.json({
        error: { code: 'NOT_FOUND', message: 'Endpoint không tồn tại' }
    }, 404);
});

// Global error handler
app.onError((err, c) => {
    console.error('[error]', err);

    // Không trả stack trace trong production
    const isProduction = c.env.ENVIRONMENT === 'production';

    return c.json({
        error: {
            code: 'INTERNAL_ERROR',
            message: isProduction ? 'Lỗi server' : err.message,
        }
    }, 500);
});

export default app;
