// Main entry point cho Cloudflare Workers
// Hono framework với các routes: auth, courses, ai, quizzes, labs, progress

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Env } from './types';

// ==========================================
// IMPORT ROUTES (organized at top)
// ==========================================
import authRoutes from './routes/auth';
import coursesRoutes from './routes/courses';
import aiRoutes from './routes/ai';
import quizzesRoutes from './routes/quizzes';
import labsRoutes from './routes/labs';
import progressRoutes from './routes/progress';
import drillsRoutes from './routes/drills';
import leaderboardRoutes from './routes/leaderboard';
import certificateRoutes from './routes/certificate';
import projectsRoutes from './routes/projects';
import personalizationRoutes from './routes/personalization';
import adminRoutes from './routes/admin';
import compilerRoutes from './routes/compiler';

// Import middleware
import { rateLimitMiddleware } from './middleware/rateLimit';

const app = new Hono<{ Bindings: Env }>();

// ==========================================
// MIDDLEWARE
// ==========================================

// CORS - cho phép frontend gọi API
app.use('*', cors({
    origin: [
        // Localhost variants
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:4000',
        'http://localhost:4173',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5500',
        'http://localhost:8000',
        'http://localhost:8080',
        'http://localhost:8787',
        // 127.0.0.1 variants
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:4000',
        'http://127.0.0.1:4173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
        'http://127.0.0.1:5500',
        'http://127.0.0.1:8000',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:8787',
        // File protocol
        'null',
        // Production
        'https://arduino-web.pages.dev',
        'https://hocarduinohnue.pages.dev'
    ],
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

// Courses routes: /api/courses/*, /api/weeks/*, /api/lessons/*
app.route('/api', coursesRoutes);

// Labs routes: /api/labs/*
app.route('/api', labsRoutes);

// AI routes: /api/ai/* - với rate limiting
app.use('/api/ai/*', rateLimitMiddleware);
app.route('/api/ai', aiRoutes);

// Quizzes routes: /api/quizzes/*
app.route('/api', quizzesRoutes);

// Progress routes: /api/progress/*
app.route('/api', progressRoutes);

// Drills routes: /api/drills/*
app.route('/api', drillsRoutes);

// Leaderboard routes: /api/leaderboard/*
app.route('/api', leaderboardRoutes);

// Certificate routes: /api/certificate/*
app.route('/api', certificateRoutes);

// Projects routes: /api/projects/*
app.route('/api', projectsRoutes);

// Personalization routes: /api/saved, /api/save
app.route('/api', personalizationRoutes);

// Admin routes: /api/admin/*
app.route('/api/admin', adminRoutes);

// Compiler routes: /api/compile/*
app.route('/api/compile', compilerRoutes);

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
