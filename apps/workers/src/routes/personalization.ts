import { Hono } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { savedItems, projects, lessons } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';
import type { Env } from '../types';

const personalRouter = new Hono<{ Bindings: Env }>();

// POST /api/save - Toggle save item
personalRouter.post('/save', async (c) => {
    try {
        const { userId, itemType, itemId } = await c.req.json<{ userId: string; itemType: 'lesson' | 'project'; itemId: string }>();

        if (!userId || !itemType || !itemId) {
            return c.json({ error: 'Missing required fields' }, 400);
        }

        const db = drizzle(c.env.DB);

        // Check if already saved
        const existing = await db.select()
            .from(savedItems)
            .where(and(
                eq(savedItems.userId, userId),
                eq(savedItems.itemType, itemType),
                eq(savedItems.itemId, itemId)
            ))
            .get();

        if (existing) {
            // Unsave
            await db.delete(savedItems).where(eq(savedItems.id, existing.id));
            return c.json({ saved: false });
        } else {
            // Save
            await db.insert(savedItems).values({
                id: uuidv4(),
                userId,
                itemType,
                itemId
            });
            return c.json({ saved: true });
        }

    } catch (error) {
        console.error('Error toggling save:', error);
        return c.json({ error: 'Failed to toggle save' }, 500);
    }
});

// GET /api/saved - List user saved items
personalRouter.get('/saved', async (c) => {
    try {
        const userId = c.req.query('userId');
        if (!userId) {
            return c.json({ error: 'Missing userId' }, 400);
        }

        const db = drizzle(c.env.DB);

        const saved = await db.select()
            .from(savedItems)
            .where(eq(savedItems.userId, userId))
            .orderBy(desc(savedItems.createdAt))
            .all();

        // Optional: Hydrate data? For now return IDs and clients fetch details or we fetch here.
        // Let's just return the list. Frontend can fetch details or we enhance this later.

        return c.json({ saved });

    } catch (error) {
        console.error('Error fetching saved items:', error);
        return c.json({ error: 'Failed to fetch saved items' }, 500);
    }
});

export default personalRouter;
