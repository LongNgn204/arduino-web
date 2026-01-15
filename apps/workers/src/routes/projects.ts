import { Hono } from 'hono';
import { eq, desc, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { projects } from '../db/schema';
import type { Env } from '../types';

const projectsRouter = new Hono<{ Bindings: Env }>();

// GET /api/projects - Lấy danh sách dự án
projectsRouter.get('/projects', async (c) => {
    try {
        const db = drizzle(c.env.DB);

        // Lấy tất cả dự án đã publish
        const allProjects = await db.select()
            .from(projects)
            .where(eq(projects.isPublished, true))
            .orderBy(desc(projects.createdAt))
            .all();

        return c.json({ projects: allProjects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return c.json({ error: 'Failed to fetch projects' }, 500);
    }
});

// GET /api/projects/:id - Chi tiết dự án
projectsRouter.get('/projects/:id', async (c) => {
    try {
        const projectId = c.req.param('id');
        const db = drizzle(c.env.DB);

        const project = await db.select()
            .from(projects)
            .where(and(eq(projects.id, projectId), eq(projects.isPublished, true)))
            .get();

        if (!project) {
            return c.json({ error: 'Project not found' }, 404);
        }

        return c.json({ project });
    } catch (error) {
        console.error('Error fetching project:', error);
        return c.json({ error: 'Failed to fetch project' }, 500);
    }
});

export default projectsRouter;
