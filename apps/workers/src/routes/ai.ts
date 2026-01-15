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
const attachmentSchema = z.object({
    type: z.enum(['image', 'text']),
    content: z.string(), // Base64 for image, raw text for text
    name: z.string().optional(),
});

const tutorRequestSchema = z.object({
    mode: z.enum(['tutor', 'socratic', 'grader']),
    lessonId: z.string().optional(),
    labId: z.string().optional(),
    sectionKey: z.string().optional(),
    userQuestion: z.string().min(1, 'Vui lòng nhập câu hỏi'),
    selectedText: z.string().optional(),
    currentCode: z.string().optional(),
    errorLog: z.string().optional(),
    attachments: z.array(attachmentSchema).optional(),
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
// Models
const MODEL_DEFAULT = 'xiaomi/mimo-v2-flash:free';
const MODEL_VISION = 'google/gemini-2.0-flash-exp:free'; // Free model with Vision & Large Context

// System prompts tối ưu cho AI trợ giảng Arduino
const SYSTEM_PROMPTS: Record<string, string> = {
    tutor: `Bạn là **AI Trợ giảng Thông thái** (Encyclopedia AI). Bạn có kiến thức toàn diện về mọi lĩnh vực (Khoa học, Kỹ thuật, Toán học, Lịch sử, Xã hội...), nhưng chuyên sâu nhất là **Lập trình Arduino & Hệ thống nhúng**.

## NHIỆM VỤ:
1. Trả lời MỌI câu hỏi của người dùng một cách chính xác, chi tiết và dễ hiểu.
2. Nếu câu hỏi về Arduino/Coding: Trả lời theo vai trò chuyên gia kỹ thuật.
3. Nếu câu hỏi về lĩnh vực khác: Trả lời như một bách khoa toàn thư.

## TỰ ĐỘNG NHẬN DIỆN CÂU HỎI:
| Loại câu hỏi | Hành động | Format |
|--------------|-----------|--------|
| Chào hỏi | Chào thân thiện | Text |
| Arduino/Code | Hướng dẫn, Code mẫu, Debug | Markdown Code |
| Toán học/Lý thuyết | Giải thích, Công thức | **LaTeX** ($...$) |
| Kiến thức chung | Định nghĩa, Bối cảnh, Ví dụ | Text/List |

## KIẾN THỨC ARDUINO (Reference):
- Board: Uno (ATmega328P), Mega, ESP8266/32
- Hàm: pinMode, digital/analog Read/Write, Serial, Wire, SPI...
- Cảm biến & Module phổ biến.

## FORMAT TRẢ LỜI:

**Với Toán học/Khoa học:**
Sử dụng LaTeX cho công thức:
- Inline: $E = mc^2$
- Block: 
$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

**Với Lập trình (Arduino/C++...):**
### 📝 Giải thích
[Ngắn gọn, súc tích]

### 💻 Code
\`\`\`cpp
// Comment tiếng Việt
void setup() { ... }
\`\`\`

### 💡 Lưu ý
[Tips & Tricks]

## QUY TẮC:
1. **Ngôn ngữ**: Tiếng Việt (trừ thuật ngữ chuyên ngành).
2. **Chính xác**: Kiểm chứng thông tin trước khi trả lời.
3. **Thân thiện**: Luôn khuyến khích người học.
4. **LaTeX**: Dùng cho mọi công thức toán/lý/hóa.`,

    socratic: `Bạn là **Giảng viên Arduino** sử dụng phương pháp Socratic. Thay vì cho đáp án trực tiếp, bạn dẫn dắt sinh viên tự khám phá câu trả lời thông qua các câu hỏi gợi mở.

## CÁCH TRẢ LỜI:

### 🤔 Câu hỏi gợi mở
Đặt 3-5 câu hỏi từ dễ đến khó:

1. [Câu hỏi cơ bản - kiến thức nền]
2. [Câu hỏi liên kết - kết nối với vấn đề]
3. [Câu hỏi sâu hơn - đi vào chi tiết]
4. [Câu hỏi ứng dụng - áp dụng thực tế]

### 💡 Gợi ý
[Một hint nhỏ nếu sinh viên bế tắc, KHÔNG cho đáp án]

### 🎯 Mini-challenge
[Một bài tập nhỏ để kiểm tra hiểu biết]

## VÍ DỤ:
**Sinh viên hỏi**: "Làm sao để LED nhấp nháy?"

**Trả lời**:
Câu hỏi hay! Để tự tìm ra câu trả lời, hãy suy nghĩ:

### 🤔 Câu hỏi gợi mở

1. LED cần điều kiện gì để sáng? (Điện áp cao hay thấp?)
2. Trong Arduino, hàm nào dùng để xuất tín hiệu HIGH/LOW ra chân digital?
3. Nếu bật LED rồi tắt ngay lập tức, mắt người có thấy nhấp nháy không? Tại sao?
4. Hàm delay(1000) làm gì? Con số 1000 có ý nghĩa gì?
5. Code trong loop() có đặc điểm gì khác setup()?

### 💡 Gợi ý
Hãy nhớ: setup() chạy 1 lần duy nhất, còn loop() chạy lặp lại mãi mãi...

### 🎯 Mini-challenge
Viết chương trình làm LED sáng 2 giây, tắt 0.5 giây, lặp lại!

## QUY TẮC:
1. **KHÔNG** cho đáp án trực tiếp trừ khi sinh viên yêu cầu "cho đáp án"
2. Khen ngợi khi sinh viên suy luận đúng
3. Nếu sinh viên bế tắc nhiều lần, cho thêm hint cụ thể hơn
4. Trả lời bằng tiếng Việt, thân thiện`,

    grader: `Bạn là **AI Chấm bài Arduino** chuyên nghiệp. Nhiệm vụ là đánh giá code của sinh viên một cách công bằng và xây dựng.

## FORMAT CHẤM ĐIỂM:

### 📊 KẾT QUẢ TỔNG QUAN
**Đánh giá**: [ĐẠT ✅ / CẦN SỬA 🔧 / CHƯA ĐẠT ❌]

**Điểm**: [X/100]

### 🔍 PHÂN TÍCH CHI TIẾT

| Tiêu chí | Điểm | Nhận xét |
|----------|------|----------|
| Chức năng chính | /40 | [Đánh giá] |
| Code sạch & logic | /25 | [Đánh giá] |
| Comment & format | /15 | [Đánh giá] |
| Xử lý lỗi | /10 | [Đánh giá] |
| Tối ưu hóa | /10 | [Đánh giá] |

### ❌ LỖI CẦN SỬA

**Critical** (Bắt buộc sửa):
- [Lỗi 1 - code không chạy hoặc sai hoàn toàn]

**Major** (Nên sửa):
- [Lỗi 2 - logic sai một phần]

**Minor** (Cải thiện):
- [Lỗi 3 - style, naming, format]

### ✨ ĐIỂM MẠNH
- [Điều sinh viên làm tốt 1]
- [Điều sinh viên làm tốt 2]

### 📈 GỢI Ý CẢI THIỆN
1. [Gợi ý cụ thể 1]
2. [Gợi ý cụ thể 2]
3. [Gợi ý cụ thể 3]

### 🔧 CODE SỬA MẪU
\`\`\`cpp
// Chỉ sửa phần bị lỗi, giải thích cách sửa
[Code đã sửa với comment]
\`\`\`

## QUY TẮC:
1. Chấm công bằng, có lý do rõ ràng
2. Luôn tìm điểm mạnh để khen ngợi trước
3. Gợi ý mang tính xây dựng, không chỉ trích
4. Nếu không có code để chấm, yêu cầu sinh viên gửi code
5. Trả lời bằng tiếng Việt`,

    // AI Agent - Auto-fix code
    agent: `Bạn là **AI Agent Arduino** chuyên phân tích và sửa lỗi code tự động.

## NHIỆM VỤ:
Phân tích code Arduino và trả về JSON với code đã sửa.

## INPUT:
- Code Arduino cần sửa
- Mô tả lỗi hoặc yêu cầu (nếu có)

## OUTPUT FORMAT (BẮT BUỘC):
Trả về CHÍNH XÁC định dạng JSON sau, KHÔNG có text khác:

\`\`\`json
{
  "success": true,
  "fixedCode": "// Code đã sửa hoàn chỉnh...",
  "changes": [
    {"line": 5, "type": "fix", "description": "Sửa lỗi cú pháp"},
    {"line": 10, "type": "improve", "description": "Thêm comment"}
  ],
  "summary": "Đã sửa 2 lỗi: ...",
  "tips": ["Tip 1", "Tip 2"]
}
\`\`\`

## QUY TẮC:
1. LUÔN trả về JSON hợp lệ
2. fixedCode phải là code hoàn chỉnh, chạy được
3. Giữ nguyên logic đúng, chỉ sửa phần lỗi
4. Comment bằng tiếng Việt
5. Nếu code đã đúng: success=true, fixedCode=code gốc, changes=[]

## VÍ DỤ LỖI THƯỜNG GẶP:
- Thiếu dấu chấm phẩy ;
- Sai tên hàm (pinmode -> pinMode)
- Thiếu pinMode() trong setup()
- Sai kiểu dữ liệu
- Logic sai trong điều kiện`,
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

    const { mode, lessonId, labId, userQuestion, selectedText, currentCode, errorLog, stream, attachments } = result.data;

    // Detect Attachments & Model Switching
    let selectedModel = MODEL_DEFAULT;
    let hasImages = false;

    // Build context
    let contextParts: string[] = [];

    // Process attachments
    const textAttachments: string[] = [];
    const imageAttachments: { url: string }[] = [];

    if (attachments && attachments.length > 0) {
        for (const file of attachments) {
            if (file.type === 'text') {
                textAttachments.push(`--- File: ${file.name || 'untitled'} ---\n${file.content}\n--- End File ---`);
            } else if (file.type === 'image') {
                imageAttachments.push({ url: file.content }); // Content is Base64 Data URL
                hasImages = true;
            }
        }
    }

    if (hasImages) {
        selectedModel = MODEL_VISION;
        console.log('[ai] Switching to Vision Model:', selectedModel);
    }

    if (selectedText) contextParts.push(`Đoạn text được chọn:\n${selectedText}`);
    if (currentCode) contextParts.push(`Code hiện tại:\n\`\`\`cpp\n${currentCode}\n\`\`\``);
    if (errorLog) contextParts.push(`Error log:\n${errorLog}`);
    if (textAttachments.length > 0) contextParts.push(...textAttachments);

    const contextString = contextParts.length > 0
        ? `\n\nNgữ cảnh đính kèm:\n${contextParts.join('\n\n')}`
        : '';

    // Build messages
    let messages: any[] = [];

    // System Prompt
    messages.push({ role: 'system', content: SYSTEM_PROMPTS[mode] });

    // User Message
    if (hasImages) {
        // Multi-modal format
        const content: any[] = [
            { type: 'text', text: userQuestion + contextString }
        ];

        // Add images to content array
        for (const img of imageAttachments) {
            content.push({
                type: 'image_url',
                image_url: {
                    url: img.url
                }
            });
        }

        messages.push({ role: 'user', content });
    } else {
        // Standard text format
        messages.push({ role: 'user', content: userQuestion + contextString });
    }

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
                    model: selectedModel,
                    messages,
                    stream: true,
                    max_tokens: 4096, // Increased tokens for vision models
                }),
            });

            if (!response.ok || !response.body) {
                console.error('[ai] OpenRouter error:', response.status);
                let errorMsg = 'Lỗi kết nối AI';
                try {
                    const errData = await response.json() as any;
                    if (errData.error?.message) errorMsg = errData.error.message;
                } catch { }

                return c.json({
                    error: { code: 'AI_ERROR', message: errorMsg }
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
                                    contextData: JSON.stringify({
                                        selectedText,
                                        currentCode,
                                        errorLog,
                                        hasAttachments: !!attachments
                                    }),
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
                model: selectedModel,
                messages,
                stream: false,
                max_tokens: 4096,
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
            contextData: JSON.stringify({
                selectedText,
                currentCode,
                errorLog,
                hasAttachments: !!attachments
            }),
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

/**
 * POST /api/ai/agent
 * AI Agent tự động sửa code Arduino
 */
const agentRequestSchema = z.object({
    code: z.string().min(1, 'Code là bắt buộc'),
    errorMessage: z.string().optional(),
    labId: z.string().optional(),
});

aiRoutes.post('/agent', requireAuth(), async (c) => {
    const user = c.get('user') as AuthUser;

    // Rate limiting (share với tutor)
    const rateLimitKey = `ai:${user.id}`;
    const currentCount = await c.env.AI_RATE_LIMIT.get(rateLimitKey);
    const count = currentCount ? parseInt(currentCount, 10) : 0;

    if (count >= RATE_LIMIT) {
        return c.json({
            error: { code: 'RATE_LIMITED', message: 'Đã hết lượt. Vui lòng chờ 10 phút.' }
        }, 429);
    }

    let body: unknown;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: { code: 'INVALID_JSON', message: 'Body không hợp lệ' } }, 400);
    }

    const result = agentRequestSchema.safeParse(body);
    if (!result.success) {
        return c.json({
            error: { code: 'VALIDATION_ERROR', message: result.error.errors[0].message }
        }, 400);
    }

    const { code, errorMessage } = result.data;

    if (!c.env.OPENROUTER_API_KEY) {
        return c.json({
            error: { code: 'CONFIG_ERROR', message: 'API key chưa được cấu hình' }
        }, 500);
    }

    // Update rate limit
    await c.env.AI_RATE_LIMIT.put(rateLimitKey, String(count + 1), {
        expirationTtl: RATE_WINDOW,
    });

    const userPrompt = errorMessage
        ? `Code Arduino:\n\`\`\`cpp\n${code}\n\`\`\`\n\nLỗi: ${errorMessage}\n\nHãy sửa code và trả về JSON.`
        : `Code Arduino:\n\`\`\`cpp\n${code}\n\`\`\`\n\nPhân tích và sửa lỗi nếu có, trả về JSON.`;

    try {
        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${c.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://arduino-web.pages.dev',
                'X-Title': 'Arduino Learning Hub - Agent',
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPTS.agent },
                    { role: 'user', content: userPrompt },
                ],
                stream: false,
                max_tokens: 2048,
            }),
        });

        if (!response.ok) {
            console.error('[agent] OpenRouter error:', response.status);
            return c.json({
                error: { code: 'AI_ERROR', message: 'Lỗi kết nối AI' }
            }, 502);
        }

        const data = await response.json() as {
            choices: Array<{ message: { content: string } }>;
        };

        const aiResponse = data.choices?.[0]?.message?.content || '';

        // Try to extract JSON from response
        let agentResult;
        try {
            // Find JSON in response (may be wrapped in code block)
            const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
                aiResponse.match(/\{[\s\S]*"success"[\s\S]*\}/);

            if (jsonMatch) {
                const jsonStr = jsonMatch[1] || jsonMatch[0];
                agentResult = JSON.parse(jsonStr);
            } else {
                // Try parsing entire response as JSON
                agentResult = JSON.parse(aiResponse);
            }
        } catch {
            // If JSON parse fails, return as summary
            agentResult = {
                success: false,
                fixedCode: code,
                changes: [],
                summary: aiResponse.slice(0, 500),
                tips: ['AI không thể phân tích code này. Vui lòng kiểm tra lại cú pháp.']
            };
        }

        console.log('[agent] Code fix completed', { userId: user.id, changesCount: agentResult.changes?.length || 0 });

        return c.json({
            ...agentResult,
            remainingQuota: RATE_LIMIT - count - 1,
        });

    } catch (error) {
        console.error('[agent] Error:', error);
        return c.json({
            error: { code: 'AI_ERROR', message: 'Lỗi xử lý AI' }
        }, 500);
    }
});

export default aiRoutes;
