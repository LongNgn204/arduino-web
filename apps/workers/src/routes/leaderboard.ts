
import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { desc, eq, sql } from 'drizzle-orm';
import { users, quizAttempts, labSubmissions, progress, drillSubmissions } from '../db/schema';
import type { Env } from '../types';

const leaderboardRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /api/leaderboard
 * Lấy danh sách Top 10 học sinh có điểm cao nhất
 * 
 * Cách tính điểm (XP):
 * - Quiz: Tổng điểm score của các bài quiz đã pass (max attempts taken).
 * - Lab: 100 XP cho mỗi bài lab được chấm "PASS" hoặc hoàn thành.
 * - Drill: 200 XP cho mỗi bài thi drill đạt passing score.
 * 
 * (Hiện tại tính đơn giản: Quiz Score + Số lab completed * 100)
 */
leaderboardRoutes.get('/leaderboard', async (c) => {
    const db = drizzle(c.env.DB);

    // 1. Lấy tổng điểm Quiz của từng user
    // Chỉ lấy điểm cao nhất của mỗi quiz nếu làm nhiều lần? 
    // Ở đây ta cộng dồn tất cả quiz đã pass (đơn giản hóa). 
    // Đúng ra: Group by user_id, quiz_id -> Max(score) -> Sum
    const quizScores = await db
        .select({
            userId: quizAttempts.userId,
            totalQuizScore: sql<number>`sum(${quizAttempts.score})`
        })
        .from(quizAttempts)
        .where(eq(quizAttempts.passed, true))
        .groupBy(quizAttempts.userId)
        .all();

    // 2. Lấy số bài Lab đã hoàn thành
    const completedLabs = await db
        .select({
            userId: progress.userId,
            labCount: sql<number>`count(${progress.labId})`
        })
        .from(progress)
        .where(
            sql`${progress.status} = 'completed' AND ${progress.labId} IS NOT NULL`
        )
        .groupBy(progress.userId)
        .all();

    // 3. Lấy số bài Drill đã hoàn thành (New)
    const completedDrills = await db
        .select({
            userId: drillSubmissions.userId,
            drillCount: sql<number>`count(${drillSubmissions.drillId})`
        })
        .from(drillSubmissions)
        .where(eq(drillSubmissions.passed, true))
        .groupBy(drillSubmissions.userId)
        .all();

    // 4. Merge data & Get User Info
    const allStudents = await db
        .select({
            id: users.id,
            displayName: users.displayName,
            username: users.username,
        })
        .from(users)
        .where(eq(users.role, 'student'))
        .all();

    // Tính toán XP
    const leaderboard = allStudents.map(user => {
        const qScore = quizScores.find(q => q.userId === user.id)?.totalQuizScore || 0;
        const lCount = completedLabs.find(l => l.userId === user.id)?.labCount || 0;
        const dCount = completedDrills.find(d => d.userId === user.id)?.drillCount || 0;

        // Formula: XP = QuizScore + (LabCount * 100) + (DrillCount * 200)
        const totalXP = qScore + (lCount * 100) + (dCount * 200);

        return {
            id: user.id,
            displayName: user.displayName || user.username,
            avatar: `https://ui-avatars.com/api/?name=${user.displayName || user.username}&background=random`,
            xp: totalXP,
            stats: {
                quizzes: qScore,
                labs: lCount + (dCount * 2) // Bonus stat view? Or just keep simple
            }
        };
    });

    // Sort desc by XP & Top 10
    leaderboard.sort((a, b) => b.xp - a.xp);
    const top10 = leaderboard.slice(0, 10);

    // Thêm rank
    const rankedData = top10.map((item, index) => ({
        rank: index + 1,
        ...item
    }));

    return c.json({
        leaderboard: rankedData
    });
});

export default leaderboardRoutes;
