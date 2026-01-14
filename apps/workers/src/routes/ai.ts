// AI Tutor routes
// POST /api/ai/tutor - SSE streaming với OpenRouter

import { Hono } from 'hono';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/d1';
import { aiChatLogs } from '../db/schema';
import { requireAuth } from '../middleware/auth';
import { generateId } from '../services/crypto';
import type { Env, AuthUser } from '../types';

// Validation schema
const tutorRequestSchema = z.object({
    mode: z.enum(['tutor', 'socratic', 'grader']),
    lessonId: z.string().optional(),
    labId: z.string().optional(),
    sectionKey: z.string().optional(),
    userQuestion: z.string().min(1, 'Vui lòng nhập câu hỏi'),
    selectedText: z.string().optional(),
    currentCode: z.string().optional(),
    errorLog: z.string().optional(),
});

// Rate limit: 10 requests per 10 minutes
const RATE_LIMIT = 10;
const RATE_WINDOW = 10 * 60; // 10 phút in seconds

// OpenRouter config
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'xiaomi/mimo-v2-flash:free';

// System prompts theo mode (từ rules.md)
const SYSTEM_PROMPTS: Record<string, string> = {
    tutor: `Bạn là trợ giảng AI cho môn Lập trình Arduino. Trả lời theo format:

1. **Giải thích ngắn** (≤ 6 câu)
2. **Ví dụ Arduino C/C++** (code block với comment tiếng Việt)
3. **Flowchart/pseudocode** (gạch đầu dòng)
4. **Lỗi thường gặp + checklist debug**

Quy tắc:
- Bám sát ngữ cảnh bài học/lab đang hỏi
- Không bịa thông số kỹ thuật phần cứng
- Ưu tiên dạy tư duy trước, code sau
- Checklist debug: nguồn/board/port → wiring → pin → code → timing → Serial`,

    socratic: `Bạn là giảng viên Arduino dùng phương pháp Socratic. Trả lời theo format:

1. **Giải thích ngắn, rõ ràng** (như giảng viên)
2. **3-5 câu hỏi gợi mở** để sinh viên tự suy luận
3. **1 bài tập nhỏ** (mini-exercise)
4. **Hint** (chỉ gợi ý, chưa đưa đáp án)

Chỉ khi sinh viên yêu cầu "cho đáp án" mới cung cấp lời giải đầy đủ.`,

    grader: `Bạn là AI chấm bài Arduino. Trả lời theo format:

1. **Kết luận**: Đạt/Chưa đạt
2. **Lỗi chính** theo mức độ: Critical / Major / Minor
3. **Đối chiếu rubric**: mục nào đạt, mục nào thiếu
4. **Gợi ý cải thiện** (≥ 3 điểm)
5. **Minimal patch** hoặc code sửa mẫu (sửa ít nhất có thể)
6. **Checklist test xác nhận**

Bám rubric của Lab/Exam, không tự bịa yêu cầu ngoài đề.`,
};

const aiRoutes = new Hono<{ Bindings: Env }>();

/**
 * POST /api/ai/tutor
 * AI trợ giảng với 3 chế độ, SSE streaming
 */
aiRoutes.post('/tutor', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;

    // Rate limiting
    const rateLimitKey = `ai:${user.id}`;
    const currentCount = await c.env.AI_RATE_LIMIT.get(rateLimitKey);
    const count = currentCount ? parseInt(currentCount, 10) : 0;

    if (count >= RATE_LIMIT) {
        return c.json({
            error: {
                code: 'RATE_LIMITED',
                message: `Bạn đã sử dụng hết ${RATE_LIMIT} lượt hỏi AI. Vui lòng chờ 10 phút.`
            }
        }, 429);
    }

    // Parse request
    let body: unknown;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: { code: 'INVALID_JSON', message: 'Body không hợp lệ' } }, 400);
    }

    const result = tutorRequestSchema.safeParse(body);
    if (!result.success) {
        return c.json({
            error: { code: 'VALIDATION_ERROR', message: result.error.errors[0].message }
        }, 400);
    }

    const { mode, lessonId, labId, userQuestion, selectedText, currentCode, errorLog } = result.data;

    // Build context
    let contextParts: string[] = [];
    if (selectedText) contextParts.push(`Đoạn text được chọn:\n${selectedText}`);
    if (currentCode) contextParts.push(`Code hiện tại:\n\`\`\`cpp\n${currentCode}\n\`\`\``);
    if (errorLog) contextParts.push(`Error log:\n${errorLog}`);

    const contextString = contextParts.length > 0
        ? `\n\nNgữ cảnh:\n${contextParts.join('\n\n')}`
        : '';

    // Build messages
    const messages = [
        { role: 'system', content: SYSTEM_PROMPTS[mode] },
        { role: 'user', content: userQuestion + contextString },
    ];

    // Check API key
    if (!c.env.OPENROUTER_API_KEY) {
        return c.json({
            error: { code: 'CONFIG_ERROR', message: 'API key chưa được cấu hình' }
        }, 500);
    }

    const startTime = Date.now();

    try {
        // Call OpenRouter
        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${c.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://arduino-web.pages.dev',
                'X-Title': 'Arduino Learning Hub',
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
                stream: false, // Non-streaming for simplicity first
                max_tokens: 2048,
            }),
        });

        if (!response.ok) {
            console.error('[ai] OpenRouter error:', response.status);
            return c.json({
                error: { code: 'AI_ERROR', message: 'Lỗi kết nối AI, vui lòng thử lại' }
            }, 502);
        }

        const data = await response.json() as {
            choices: Array<{ message: { content: string } }>;
            usage?: { total_tokens?: number };
        };
        const aiResponse = data.choices?.[0]?.message?.content || 'Không có phản hồi';
        const tokensUsed = data.usage?.total_tokens || 0;
        const latencyMs = Date.now() - startTime;

        // Update rate limit
        await c.env.AI_RATE_LIMIT.put(rateLimitKey, String(count + 1), {
            expirationTtl: RATE_WINDOW,
        });

        // Log to DB (không block response)
        db.insert(aiChatLogs).values({
            id: generateId(),
            userId: user.id,
            mode,
            lessonId: lessonId || null,
            labId: labId || null,
            userQuestion,
            aiResponse,
            contextData: contextParts.length > 0 ? JSON.stringify({ selectedText, currentCode, errorLog }) : null,
            tokensUsed,
            latencyMs,
        }).run().catch(err => console.error('[ai] Log error:', err));

        console.log('[ai] Response generated', { mode, latencyMs, tokensUsed });

        return c.json({
            response: aiResponse,
            mode,
            tokensUsed,
            remainingQuota: RATE_LIMIT - count - 1,
        });

    } catch (error) {
        console.error('[ai] Error:', error);
        return c.json({
            error: { code: 'AI_ERROR', message: 'Lỗi xử lý AI, vui lòng thử lại' }
        }, 500);
    }
});

export default aiRoutes;
