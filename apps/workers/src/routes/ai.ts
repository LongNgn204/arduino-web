// AI Tutor routes - với SSE Streaming
// POST /api/ai/tutor - streaming response
// POST /api/ai/feedback - đánh giá AI response

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
    stream: z.boolean().optional().default(true), // Mặc định bật streaming
});

const feedbackSchema = z.object({
    chatLogId: z.string(),
    helpful: z.boolean(),
    reason: z.string().optional(),
});

// Rate limit: 50 requests per 10 minutes (học tập cần tương tác nhiều)
const RATE_LIMIT = 50;
const RATE_WINDOW = 10 * 60;

// OpenRouter config
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'xiaomi/mimo-v2-flash:free';

// System prompts theo mode - Được tối ưu cho giảng dạy Arduino
const SYSTEM_PROMPTS: Record<string, string> = {
    tutor: `Bạn là trợ giảng AI chuyên môn Lập trình Arduino và Hệ thống Nhúng. 

## KIẾN THỨC CỐT LÕI:
- Arduino Uno: ATmega328P, 14 Digital I/O, 6 Analog, 5V logic
- Các hàm cơ bản: pinMode(), digitalWrite(), digitalRead(), analogWrite(), analogRead(), delay()
- Giao thức: Serial UART, I2C (Wire.h), SPI, 1-Wire
- Các cảm biến phổ biến: DHT11/22, HC-SR04, PIR, LDR, potentiometer
- Màn hình: LCD 16x2 (I2C), 7-segment, LED matrix

## FORMAT TRẢ LỜI:
1. **Giải thích ngắn gọn** (3-5 câu, dễ hiểu)
2. **Code mẫu Arduino** với comment tiếng Việt:
\`\`\`cpp
// Ví dụ code
void setup() {
  pinMode(13, OUTPUT);  // Cấu hình chân 13 là OUTPUT
}
\`\`\`
3. **Lưu ý quan trọng** hoặc lỗi thường gặp
4. **Bài tập nhỏ** (nếu phù hợp)

## QUY TẮC:
- Trả lời bằng tiếng Việt, thân thiện
- Code phải chạy được trên Arduino Uno
- Giải thích từng dòng code quan trọng
- Nếu câu hỏi mơ hồ, hỏi lại để làm rõ
- Khuyến khích sinh viên thử nghiệm và debug`,

    socratic: `Bạn là giảng viên Arduino dùng phương pháp Socratic - dẫn dắt sinh viên tự khám phá câu trả lời.

## CÁCH TRẢ LỜI:
1. **Công nhận câu hỏi** (ngắn gọn)
2. **Đặt 3-5 câu hỏi gợi mở** để sinh viên tự suy luận:
   - Câu hỏi từ dễ đến khó
   - Mỗi câu hỏi dẫn đến một khía cạnh của vấn đề
3. **Gợi ý nhỏ** (hint) nếu cần
4. **Mini-challenge**: Một bài tập nhỏ để áp dụng

## VÍ DỤ:
Sinh viên hỏi: "Làm sao để LED nhấp nháy?"

Trả lời:
"Câu hỏi hay! Để hiểu cách làm LED nhấp nháy, hãy suy nghĩ:

1. LED cần gì để sáng? (Điện áp, dòng điện?)
2. Hàm nào trong Arduino dùng để xuất tín hiệu HIGH/LOW?
3. Nếu bật LED và tắt ngay, mắt có thấy được không? Vậy cần thêm gì?
4. Hàm delay() nhận tham số gì? 1000 nghĩa là bao lâu?

💡 Hint: setup() chạy 1 lần, loop() chạy lặp lại...

🎯 Challenge: Viết code làm LED sáng 2 giây, tắt 1 giây!"

## QUY TẮC:
- KHÔNG cho đáp án trực tiếp trừ khi sinh viên yêu cầu "cho đáp án"
- Khen ngợi khi sinh viên suy luận đúng
- Nếu sinh viên bế tắc, cho thêm hint`,

    grader: `Bạn là AI chấm bài thực hành Arduino. Đánh giá code theo rubric chuẩn.

## FORMAT CHẤM ĐIỂM:
### 📊 KẾT QUẢ: [ĐẠT ✅ / CHƯA ĐẠT ❌]

### 🔍 PHÂN TÍCH CODE:
| Tiêu chí | Điểm | Nhận xét |
|----------|------|----------|
| Chức năng chính | /40 | ... |
| Code quality | /30 | ... |
| Comments & style | /15 | ... |
| Error handling | /15 | ... |

### ❌ LỖI CẦN SỬA:
1. **Critical**: [Lỗi nghiêm trọng - code không chạy]
2. **Major**: [Lỗi logic - chạy sai]
3. **Minor**: [Lỗi nhỏ - style, naming]

### ✨ GỢI Ý CẢI THIỆN:
1. ...
2. ...
3. ...

### 🔧 CODE SỬA MẪU (nếu cần):
\`\`\`cpp
// Chỉ sửa phần bị lỗi, giữ nguyên phần đúng
\`\`\`

## QUY TẮC:
- Bám sát rubric của bài lab/exam
- Không bịa thêm yêu cầu ngoài đề bài
- Chấm công bằng, có lý do rõ ràng
- Khuyến khích sinh viên sửa và nộp lại`,
};

const aiRoutes = new Hono<{ Bindings: Env }>();

/**
 * POST /api/ai/tutor
 * AI trợ giảng với SSE streaming
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

    const { mode, lessonId, labId, userQuestion, selectedText, currentCode, errorLog, stream } = result.data;

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
    const chatLogId = generateId();

    // Update rate limit trước
    await c.env.AI_RATE_LIMIT.put(rateLimitKey, String(count + 1), {
        expirationTtl: RATE_WINDOW,
    });

    // Nếu streaming được bật
    if (stream) {
        try {
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
                    stream: true,
                    max_tokens: 2048,
                }),
            });

            if (!response.ok || !response.body) {
                console.error('[ai] OpenRouter error:', response.status);
                return c.json({
                    error: { code: 'AI_ERROR', message: 'Lỗi kết nối AI, vui lòng thử lại' }
                }, 502);
            }

            // Biến lưu full response để log vào DB sau
            let fullResponse = '';

            // Transform stream
            const transformStream = new TransformStream({
                async transform(chunk, controller) {
                    const text = new TextDecoder().decode(chunk);
                    const lines = text.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                // Stream kết thúc - gửi metadata
                                const latencyMs = Date.now() - startTime;
                                controller.enqueue(new TextEncoder().encode(
                                    `data: ${JSON.stringify({
                                        done: true,
                                        chatLogId,
                                        remainingQuota: RATE_LIMIT - count - 1,
                                        latencyMs
                                    })}\n\n`
                                ));

                                // Log to DB (không block)
                                db.insert(aiChatLogs).values({
                                    id: chatLogId,
                                    userId: user.id,
                                    mode,
                                    lessonId: lessonId || null,
                                    labId: labId || null,
                                    userQuestion,
                                    aiResponse: fullResponse,
                                    contextData: contextParts.length > 0 ? JSON.stringify({ selectedText, currentCode, errorLog }) : null,
                                    tokensUsed: 0, // Không có trong streaming
                                    latencyMs,
                                }).run().catch(err => console.error('[ai] Log error:', err));

                                continue;
                            }

                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices?.[0]?.delta?.content || '';
                                if (content) {
                                    fullResponse += content;
                                    controller.enqueue(new TextEncoder().encode(
                                        `data: ${JSON.stringify({ content })}\n\n`
                                    ));
                                }
                            } catch {
                                // Ignore parse errors
                            }
                        }
                    }
                },
            });

            const streamedResponse = response.body.pipeThrough(transformStream);

            return new Response(streamedResponse, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': '*',
                },
            });

        } catch (error) {
            console.error('[ai] Streaming error:', error);
            return c.json({
                error: { code: 'AI_ERROR', message: 'Lỗi xử lý AI, vui lòng thử lại' }
            }, 500);
        }
    }

    // Non-streaming fallback
    try {
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
                stream: false,
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

        // Log to DB
        db.insert(aiChatLogs).values({
            id: chatLogId,
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
            chatLogId,
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

/**
 * POST /api/ai/feedback
 * Đánh giá câu trả lời AI (helpful/not helpful)
 */
aiRoutes.post('/feedback', requireAuth(), async (c) => {
    const db = drizzle(c.env.DB);
    const user = c.get('user') as AuthUser;

    let body: unknown;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: { code: 'INVALID_JSON', message: 'Body không hợp lệ' } }, 400);
    }

    const result = feedbackSchema.safeParse(body);
    if (!result.success) {
        return c.json({
            error: { code: 'VALIDATION_ERROR', message: result.error.errors[0].message }
        }, 400);
    }

    const { chatLogId, helpful, reason } = result.data;

    // Cập nhật feedback vào ai_chat_logs (cần thêm column feedback)
    // Tạm thời log console
    console.log('[ai] Feedback received', { chatLogId, helpful, reason, userId: user.id });

    return c.json({ success: true, message: 'Cảm ơn bạn đã đánh giá!' });
});

export default aiRoutes;
