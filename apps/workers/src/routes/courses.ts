// Courses routes
// GET /api/courses, /api/weeks/:id, /api/lessons/:id, /api/labs/:id

import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, asc } from 'drizzle-orm';
import { courses, weeks, lessons, labs } from '../db/schema';
import { optionalAuth } from '../middleware/auth';
import type { Env } from '../types';

const coursesRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /api/courses
 * Lấy danh sách khóa học (public)
 */
coursesRoutes.get('/courses', optionalAuth(), async (c) => {
    const db = drizzle(c.env.DB);

    const allCourses = await db.select()
        .from(courses)
        .where(eq(courses.isPublished, true))
        .all();

    // Lấy weeks cho mỗi course
    const result = await Promise.all(allCourses.map(async (course) => {
        const courseWeeks = await db.select({
            id: weeks.id,
            weekNumber: weeks.weekNumber,
            title: weeks.title,
        })
            .from(weeks)
            .where(eq(weeks.courseId, course.id))
            .orderBy(asc(weeks.weekNumber))
            .all();

        return {
            ...course,
            weeks: courseWeeks,
        };
    }));

    return c.json({ courses: result });
});

/**
 * GET /api/weeks/:id
 * Lấy chi tiết tuần học với lessons và labs
 */
coursesRoutes.get('/weeks/:id', optionalAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const weekId = c.req.param('id');

    // Lấy week
    const week = await db.select()
        .from(weeks)
        .where(eq(weeks.id, weekId))
        .get();

    if (!week) {
        return c.json({
            error: { code: 'NOT_FOUND', message: 'Tuần học không tồn tại' }
        }, 404);
    }

    // Lấy lessons
    const weekLessons = await db.select({
        id: lessons.id,
        orderIndex: lessons.orderIndex,
        title: lessons.title,
        duration: lessons.duration,
    })
        .from(lessons)
        .where(eq(lessons.weekId, weekId))
        .orderBy(asc(lessons.orderIndex))
        .all();

    // Lấy labs
    const weekLabs = await db.select({
        id: labs.id,
        orderIndex: labs.orderIndex,
        title: labs.title,
        duration: labs.duration,
        simulatorUrl: labs.simulatorUrl,
    })
        .from(labs)
        .where(eq(labs.weekId, weekId))
        .orderBy(asc(labs.orderIndex))
        .all();

    // Parse JSON fields
    let objectives: string[] = [];
    let examChecklist: string[] = [];
    try {
        if (week.objectives) objectives = JSON.parse(week.objectives);
        if (week.examChecklist) examChecklist = JSON.parse(week.examChecklist);
    } catch {
        // Ignore JSON parse errors
    }

    return c.json({
        week: {
            ...week,
            objectives,
            examChecklist,
            lessons: weekLessons,
            labs: weekLabs,
        }
    });
});

/**
 * GET /api/lessons/:id
 * Lấy chi tiết bài giảng
 */
coursesRoutes.get('/lessons/:id', optionalAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const lessonId = c.req.param('id');

    const lesson = await db.select()
        .from(lessons)
        .where(eq(lessons.id, lessonId))
        .get();

    if (!lesson) {
        return c.json({
            error: { code: 'NOT_FOUND', message: 'Bài giảng không tồn tại' }
        }, 404);
    }

    // Lấy thông tin week để navigation
    const week = await db.select({
        id: weeks.id,
        weekNumber: weeks.weekNumber,
        title: weeks.title,
    })
        .from(weeks)
        .where(eq(weeks.id, lesson.weekId))
        .get();

    return c.json({ lesson, week });
});

/**
 * GET /api/labs/:id
 * Lấy chi tiết bài lab
 */
coursesRoutes.get('/labs/:id', optionalAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const labId = c.req.param('id');

    const lab = await db.select()
        .from(labs)
        .where(eq(labs.id, labId))
        .get();

    if (!lab) {
        return c.json({
            error: { code: 'NOT_FOUND', message: 'Bài lab không tồn tại' }
        }, 404);
    }

    // Lấy thông tin week
    const week = await db.select({
        id: weeks.id,
        weekNumber: weeks.weekNumber,
        title: weeks.title,
    })
        .from(weeks)
        .where(eq(weeks.id, lab.weekId))
        .get();

    // Parse rubric JSON
    let rubric = null;
    try {
        if (lab.rubric) rubric = JSON.parse(lab.rubric);
    } catch {
        // Ignore
    }

    // Không trả solution code cho student
    const user = c.get('user');
    const isAdmin = user?.role === 'admin';

    return c.json({
        lab: {
            ...lab,
            rubric,
            solutionCode: isAdmin ? lab.solutionCode : undefined,
        },
        week,
    });
});

export default coursesRoutes;
