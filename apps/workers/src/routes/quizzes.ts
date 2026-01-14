// Quiz routes
// GET /api/quizzes/:id, POST /api/quizzes/:id/submit

import { Hono } from 'hono';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/d1';
import { eq, asc, and, desc } from 'drizzle-orm';
import { quizzes, questions, quizAttempts, weeks } from '../db/schema';
import { requireAuth } from '../middleware/auth';
import { generateId } from '../services/crypto';
import type { Env, AuthUser } from '../types';

const quizzesRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /api/quizzes/:id
 * Lấy chi tiết quiz với các câu hỏi
 */
quizzesRoutes.get('/quizzes/:id', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const quizId = c.req.param('id');

    // Lấy quiz
    const quiz = await db.select()
        .from(quizzes)
        .where(eq(quizzes.id, quizId))
        .get();

    if (!quiz) {
        return c.json({
            error: { code: 'NOT_FOUND', message: 'Quiz không tồn tại' }
        }, 404);
    }

    // Lấy questions (không trả correctAnswer và explanation)
    const quizQuestions = await db.select({
        id: questions.id,
        orderIndex: questions.orderIndex,
        type: questions.type,
        content: questions.content,
        options: questions.options,
        points: questions.points,
    })
        .from(questions)
        .where(eq(questions.quizId, quizId))
        .orderBy(asc(questions.orderIndex))
        .all();

    // Parse options JSON
    const parsedQuestions = quizQuestions.map(q => ({
        ...q,
        options: JSON.parse(q.options) as string[],
    }));

    // Lấy thông tin week
    const week = await db.select({
        id: weeks.id,
        weekNumber: weeks.weekNumber,
        title: weeks.title,
    })
        .from(weeks)
        .where(eq(weeks.id, quiz.weekId))
        .get();

    return c.json({
        quiz: {
            ...quiz,
            questions: parsedQuestions,
        },
        week,
    });
});

// Submit schema
const submitSchema = z.object({
    answers: z.record(z.string(), z.union([z.number(), z.array(z.number())])),
    // answers: { questionId: answerIndex hoặc [answerIndexes] }
});

/**
 * POST /api/quizzes/:id/submit
 * Nộp bài quiz và chấm điểm
 */
quizzesRoutes.post('/quizzes/:id/submit', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;
    const quizId = c.req.param('id');

    // Parse request
    let body: unknown;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: { code: 'INVALID_JSON', message: 'Body không hợp lệ' } }, 400);
    }

    const result = submitSchema.safeParse(body);
    if (!result.success) {
        return c.json({
            error: { code: 'VALIDATION_ERROR', message: 'Dữ liệu không hợp lệ' }
        }, 400);
    }

    const { answers } = result.data;

    // Lấy quiz
    const quiz = await db.select()
        .from(quizzes)
        .where(eq(quizzes.id, quizId))
        .get();

    if (!quiz) {
        return c.json({
            error: { code: 'NOT_FOUND', message: 'Quiz không tồn tại' }
        }, 404);
    }

    // Lấy tất cả questions với đáp án
    const quizQuestions = await db.select()
        .from(questions)
        .where(eq(questions.quizId, quizId))
        .orderBy(asc(questions.orderIndex))
        .all();

    // Chấm điểm
    let score = 0;
    let maxScore = 0;
    const results: Array<{
        questionId: string;
        correct: boolean;
        userAnswer: number | number[];
        correctAnswer: number | number[];
        explanation: string | null;
        points: number;
        earnedPoints: number;
    }> = [];

    for (const question of quizQuestions) {
        maxScore += question.points;
        const userAnswer = answers[question.id];
        const correctAnswer = JSON.parse(question.correctAnswer);

        let isCorrect = false;

        if (question.type === 'multiple') {
            // Multiple choice - so sánh arrays
            const userArr = Array.isArray(userAnswer) ? userAnswer.sort() : [];
            const correctArr = Array.isArray(correctAnswer) ? correctAnswer.sort() : [];
            isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr);
        } else {
            // Single choice hoặc true/false
            isCorrect = userAnswer === correctAnswer;
        }

        const earnedPoints = isCorrect ? question.points : 0;
        score += earnedPoints;

        results.push({
            questionId: question.id,
            correct: isCorrect,
            userAnswer: userAnswer ?? -1,
            correctAnswer,
            explanation: question.explanation,
            points: question.points,
            earnedPoints,
        });
    }

    // Tính phần trăm và pass/fail
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    // Lưu attempt
    await db.insert(quizAttempts).values({
        id: generateId(),
        userId: user.id,
        quizId,
        answers: JSON.stringify(answers),
        score,
        maxScore,
        passed,
        startedAt: new Date(), // Tạm thời dùng submit time
    });

    console.log('[quiz] Submitted', { quizId, userId: user.id, score, maxScore, passed });

    return c.json({
        score,
        maxScore,
        percentage,
        passed,
        passingScore: quiz.passingScore,
        results,
    });
});

/**
 * GET /api/quizzes/:id/attempts
 * Lịch sử làm quiz của user hiện tại
 */
quizzesRoutes.get('/quizzes/:id/attempts', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;
    const quizId = c.req.param('id');

    // Chỉ lấy attempts của user hiện tại
    const userAttempts = await db.select({
        id: quizAttempts.id,
        score: quizAttempts.score,
        maxScore: quizAttempts.maxScore,
        passed: quizAttempts.passed,
        submittedAt: quizAttempts.submittedAt,
    })
        .from(quizAttempts)
        .where(
            and(
                eq(quizAttempts.quizId, quizId),
                eq(quizAttempts.userId, user.id)
            )
        )
        .orderBy(desc(quizAttempts.submittedAt))
        .all();

    return c.json({ attempts: userAttempts });
});

export default quizzesRoutes;
