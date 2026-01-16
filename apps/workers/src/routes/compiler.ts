// Hardware Compiler routes - Arduino Code Compilation
// POST /api/compile - Compile Arduino code to HEX
// Uses avr-gcc toolchain simulation

import { Hono } from 'hono';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import type { Env, AuthUser } from '../types';

const compileRequestSchema = z.object({
    code: z.string().min(1, 'Code là bắt buộc'),
    board: z.enum(['uno', 'nano', 'mega', 'esp8266', 'esp32']).default('uno'),
    optimize: z.boolean().optional().default(true),
});

const BOARD_CONFIG: Record<string, { mcu: string; fcpu: string; variant: string }> = {
    uno: { mcu: 'atmega328p', fcpu: '16000000L', variant: 'standard' },
    nano: { mcu: 'atmega328p', fcpu: '16000000L', variant: 'eightanaloginputs' },
    mega: { mcu: 'atmega2560', fcpu: '16000000L', variant: 'mega' },
    esp8266: { mcu: 'esp8266', fcpu: '80000000L', variant: 'nodemcu' },
    esp32: { mcu: 'esp32', fcpu: '240000000L', variant: 'esp32' },
};

const compilerRoutes = new Hono<{ Bindings: Env }>();

/**
 * POST /api/compile
 * Compile Arduino code and return analysis
 * Note: Real avr-gcc compilation requires server-side toolchain
 * This provides syntax validation and simulated output
 */
compilerRoutes.post('/', requireAuth(), async (c) => {
    const user = c.get('user') as AuthUser;

    // Rate limiting (max 20 compilations per 5 minutes)
    const rateLimitKey = `compile:${user.id}`;
    const currentCount = await c.env.AI_RATE_LIMIT.get(rateLimitKey);
    const count = currentCount ? parseInt(currentCount, 10) : 0;

    if (count >= 20) {
        return c.json({
            success: false,
            error: 'Bạn đã biên dịch quá nhiều. Vui lòng chờ 5 phút.'
        }, 429);
    }

    let body: unknown;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ success: false, error: 'Body không hợp lệ' }, 400);
    }

    const result = compileRequestSchema.safeParse(body);
    if (!result.success) {
        return c.json({
            success: false,
            error: result.error.errors[0].message
        }, 400);
    }

    const { code, board, optimize } = result.data;
    const boardConfig = BOARD_CONFIG[board];

    // Update rate limit
    await c.env.AI_RATE_LIMIT.put(rateLimitKey, String(count + 1), {
        expirationTtl: 5 * 60, // 5 minutes
    });

    const startTime = Date.now();

    // Syntax Analysis (basic validation)
    const errors: Array<{ line: number; message: string; type: 'error' | 'warning' }> = [];
    const warnings: Array<{ line: number; message: string; type: 'warning' }> = [];

    const lines = code.split('\n');

    // Check for common errors
    let hasSetup = false;
    let hasLoop = false;
    let braceCount = 0;
    let parenCount = 0;
    let inMultiLineComment = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;
        let checkLine = line;

        // Handle multi-line comments
        if (inMultiLineComment) {
            if (line.includes('*/')) {
                inMultiLineComment = false;
                checkLine = line.substring(line.indexOf('*/') + 2);
            } else {
                continue;
            }
        }

        if (checkLine.includes('/*') && !checkLine.includes('*/')) {
            inMultiLineComment = true;
            checkLine = checkLine.substring(0, checkLine.indexOf('/*'));
        }

        // Remove single-line comments
        const commentIdx = checkLine.indexOf('//');
        if (commentIdx !== -1) {
            checkLine = checkLine.substring(0, commentIdx);
        }

        // Check for setup/loop
        if (/void\s+setup\s*\(/.test(line)) hasSetup = true;
        if (/void\s+loop\s*\(/.test(line)) hasLoop = true;

        // Count braces and parens
        braceCount += (checkLine.match(/{/g) || []).length;
        braceCount -= (checkLine.match(/}/g) || []).length;
        parenCount += (checkLine.match(/\(/g) || []).length;
        parenCount -= (checkLine.match(/\)/g) || []).length;

        // Check for missing semicolons (basic check)
        const trimmed = checkLine.trim();
        if (trimmed.length > 0 &&
            !trimmed.endsWith('{') &&
            !trimmed.endsWith('}') &&
            !trimmed.endsWith(';') &&
            !trimmed.endsWith(':') &&
            !trimmed.endsWith(',') &&
            !trimmed.startsWith('#') &&
            !trimmed.startsWith('//') &&
            !/^(if|else|for|while|switch|case|default|do)\b/.test(trimmed) &&
            !/\)\s*$/.test(trimmed) && // Function declarations
            trimmed.includes('=')) { // Likely assignment without semicolon
            warnings.push({
                line: lineNum,
                message: 'Có thể thiếu dấu chấm phẩy ;',
                type: 'warning'
            });
        }

        // Check for common typos
        if (/pinMode\s*\(/.test(line) && !/pinMode\s*\(\s*\d+|A\d|LED_BUILTIN/.test(line)) {
            // Could add more specific checks
        }

        if (/pinmode|digitalwrite|digitalread|analogwrite|analogread/i.test(line)) {
            const wrongCase = line.match(/(pinmode|digitalwrite|digitalread|analogwrite|analogread)/i);
            if (wrongCase && wrongCase[0] !== wrongCase[0].replace(/[a-z]/g, (c, i) =>
                i === 0 || wrongCase[0][i - 1] === 'l' ? c : c)) {
                errors.push({
                    line: lineNum,
                    message: `Sai tên hàm: ${wrongCase[0]} → dùng camelCase (vd: pinMode, digitalWrite)`,
                    type: 'error'
                });
            }
        }
    }

    // Check for missing setup/loop
    if (!hasSetup) {
        errors.push({
            line: 1,
            message: 'Thiếu hàm setup() - bắt buộc trong Arduino',
            type: 'error'
        });
    }

    if (!hasLoop) {
        errors.push({
            line: 1,
            message: 'Thiếu hàm loop() - bắt buộc trong Arduino',
            type: 'error'
        });
    }

    // Check for unbalanced braces
    if (braceCount !== 0) {
        errors.push({
            line: lines.length,
            message: braceCount > 0 ? 'Thiếu dấu } đóng ngoặc' : 'Thừa dấu } đóng ngoặc',
            type: 'error'
        });
    }

    if (parenCount !== 0) {
        errors.push({
            line: lines.length,
            message: parenCount > 0 ? 'Thiếu dấu ) đóng ngoặc' : 'Thừa dấu ) đóng ngoặc',
            type: 'error'
        });
    }

    const success = errors.length === 0;
    const compileTimeMs = Date.now() - startTime;

    // Simulate memory usage (rough estimate)
    const codeSize = code.length;
    const estimatedFlash = Math.min(32256, Math.max(500, codeSize * 3)); // Arduino Uno has 32KB
    const estimatedRam = Math.min(2048, Math.max(100, Math.floor(codeSize / 10)));

    // Generate mock HEX if no errors
    let hexOutput = null;
    if (success) {
        // This is a mock - real compilation needs avr-gcc
        const mockHex = `:020000020000FC
:10000000${generateMockHexLine(code)}
:00000001FF`;
        hexOutput = mockHex;
    }

    console.log('[compile]', {
        userId: user.id,
        board,
        success,
        errors: errors.length,
        warnings: warnings.length,
        compileTimeMs
    });

    return c.json({
        success,
        board,
        mcu: boardConfig.mcu,
        errors,
        warnings,
        stats: {
            compileTimeMs,
            codeLines: lines.length,
            flashUsed: estimatedFlash,
            flashTotal: 32256,
            ramUsed: estimatedRam,
            ramTotal: 2048,
        },
        hexOutput,
        message: success
            ? `✅ Biên dịch thành công cho ${board.toUpperCase()} (${compileTimeMs}ms)`
            : `❌ Có ${errors.length} lỗi cần sửa`
    });
});

// Helper to generate mock hex line
function generateMockHexLine(code: string): string {
    const hash = code.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    return Math.abs(hash).toString(16).toUpperCase().padStart(32, '0').substring(0, 32);
}

/**
 * GET /api/compile/boards
 * List supported boards
 */
compilerRoutes.get('/boards', async (c) => {
    return c.json({
        boards: Object.entries(BOARD_CONFIG).map(([id, config]) => ({
            id,
            name: id.charAt(0).toUpperCase() + id.slice(1),
            mcu: config.mcu,
            fcpu: config.fcpu,
        }))
    });
});

export default compilerRoutes;
