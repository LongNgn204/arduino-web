// Intent Classifier - Phân loại câu hỏi để chọn response strategy
// Chú thích: Giúp AI trả lời nhanh hơn bằng cách chọn đúng context

export type IntentType =
    | 'greeting'     // Chào hỏi - không cần AI
    | 'syntax'       // Hỏi cú pháp hàm - inject function docs
    | 'formula'      // Hỏi công thức - inject formulas
    | 'debug'        // Debug code/lỗi - inject common mistakes
    | 'hardware'     // Hỏi về phần cứng - inject hardware specs
    | 'code_request' // Yêu cầu viết code - full prompt
    | 'complex';     // Mặc định - full prompt

export interface ClassifiedIntent {
    type: IntentType;
    confidence: number; // 0-1
    keywords: string[];
    suggestedContext?: string;
}

// Patterns cho từng loại intent
const INTENT_PATTERNS: Record<IntentType, RegExp[]> = {
    greeting: [
        /^(xin chào|hello|hi|chào|hey|ê|ơi)/i,
        /cảm ơn|thank/i,
        /tạm biệt|bye/i
    ],
    syntax: [
        /cú pháp|syntax|hàm.*là gì|hàm nào|lệnh.*là gì/i,
        /dùng như thế nào|sử dụng.*thế nào|cách dùng/i,
        /\b(pinmode|digitalwrite|digitalread|analogread|analogwrite|delay|millis|serial)\b/i
    ],
    formula: [
        /công thức|tính|formula|calculate/i,
        /ohm|điện trở|resistance|voltage|current/i,
        /adc.*volt|chuyển đổi.*volt/i
    ],
    debug: [
        /lỗi|error|bug|không.*chạy|ko.*chạy|sai/i,
        /không.*sáng|ko.*sáng|không.*hoạt động/i,
        /fix|sửa|debug|giúp.*lỗi/i,
        /compile.*error|upload.*fail/i
    ],
    hardware: [
        /\b(led|servo|motor|sensor|cảm biến|màn hình|lcd|oled)\b/i,
        /\b(hc-?sr04|dht11|dht22|ultrasonic|siêu âm)\b/i,
        /\b(esp32|esp8266|uno|nano|mega)\b/i,
        /nối.*dây|kết nối|wiring|pinout|sơ đồ/i
    ],
    code_request: [
        /viết.*code|code.*cho|làm.*chương trình/i,
        /tạo.*project|project.*về/i,
        /giúp.*viết|code mẫu/i
    ],
    complex: [] // Mặc định
};

// Greeting responses - không cần gọi AI
export const GREETING_RESPONSES: Record<string, string> = {
    'hello': 'Xin chào! 👋 Mình là AI Trợ giảng Arduino. Bạn cần giúp gì về lập trình vi điều khiển?',
    'thanks': 'Không có gì! 😊 Nếu cần giúp thêm, cứ hỏi mình nhé!',
    'bye': 'Tạm biệt! Chúc bạn code vui vẻ! 🚀'
};

// Phân loại intent từ câu hỏi
export function classifyIntent(question: string): ClassifiedIntent {
    const q = question.toLowerCase().trim();
    const matchedKeywords: string[] = [];

    // Check từng loại intent theo thứ tự ưu tiên
    const priorityOrder: IntentType[] = ['greeting', 'debug', 'syntax', 'formula', 'hardware', 'code_request'];

    for (const intentType of priorityOrder) {
        const patterns = INTENT_PATTERNS[intentType];
        for (const pattern of patterns) {
            const match = q.match(pattern);
            if (match) {
                matchedKeywords.push(match[0]);
            }
        }

        if (matchedKeywords.length > 0) {
            // Tính confidence dựa trên số keywords match
            const confidence = Math.min(0.5 + matchedKeywords.length * 0.2, 0.95);

            return {
                type: intentType,
                confidence,
                keywords: matchedKeywords
            };
        }
    }

    // Default: complex
    return {
        type: 'complex',
        confidence: 0.5,
        keywords: []
    };
}

// Kiểm tra có phải greeting không
export function isGreeting(question: string): { isGreeting: boolean; response?: string } {
    const q = question.toLowerCase().trim();

    if (/^(xin chào|hello|hi|chào|hey)/i.test(q)) {
        return { isGreeting: true, response: GREETING_RESPONSES['hello'] };
    }
    if (/cảm ơn|thank/i.test(q)) {
        return { isGreeting: true, response: GREETING_RESPONSES['thanks'] };
    }
    if (/tạm biệt|bye/i.test(q)) {
        return { isGreeting: true, response: GREETING_RESPONSES['bye'] };
    }

    return { isGreeting: false };
}

// Tạo context phù hợp với intent
export function getContextForIntent(intent: ClassifiedIntent): string {
    switch (intent.type) {
        case 'syntax':
            return `[Người dùng hỏi về cú pháp. Trả lời ngắn gọn với code mẫu.]`;
        case 'formula':
            return `[Người dùng hỏi về công thức. Dùng LaTeX và giải thích rõ ràng.]`;
        case 'debug':
            return `[Người dùng cần debug. Phân tích lỗi, đưa ra nguyên nhân và cách sửa cụ thể.]`;
        case 'hardware':
            return `[Người dùng hỏi về phần cứng. Mô tả cách nối dây, thông số kỹ thuật.]`;
        case 'code_request':
            return `[Người dùng yêu cầu code. Viết code hoàn chỉnh với comment tiếng Việt.]`;
        default:
            return '';
    }
}
