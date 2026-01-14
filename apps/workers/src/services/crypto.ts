// Crypto utilities cho password hashing
// Sử dụng WebCrypto API (native trong Cloudflare Workers)
// Format hash: pbkdf2$iterations$salt_base64$hash_base64

const ITERATIONS = 100000;
const HASH_LENGTH = 32; // 256 bits
const ALGORITHM = 'PBKDF2';

/**
 * Tạo salt ngẫu nhiên
 * @returns Base64 encoded salt
 */
function generateSalt(): string {
    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);
    return btoa(String.fromCharCode(...salt));
}

/**
 * Chuyển string thành ArrayBuffer
 */
function stringToArrayBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer as ArrayBuffer;
}

/**
 * Hash password sử dụng PBKDF2
 * @param password - Mật khẩu plaintext
 * @returns Hash string format: pbkdf2$iterations$salt$hash
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = generateSalt();
    const saltBuffer = Uint8Array.from(atob(salt), c => c.charCodeAt(0));

    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        stringToArrayBuffer(password),
        ALGORITHM,
        false,
        ['deriveBits']
    );

    // Derive key using PBKDF2
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: ALGORITHM,
            salt: saltBuffer,
            iterations: ITERATIONS,
            hash: 'SHA-256',
        },
        keyMaterial,
        HASH_LENGTH * 8 // bits
    );

    // Convert to base64
    const hashArray = new Uint8Array(derivedBits);
    const hashBase64 = btoa(String.fromCharCode(...hashArray));

    return `pbkdf2$${ITERATIONS}$${salt}$${hashBase64}`;
}

/**
 * Xác minh password với hash đã lưu
 * @param password - Mật khẩu plaintext cần kiểm tra
 * @param storedHash - Hash đã lưu trong DB
 * @returns true nếu password đúng
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    try {
        const parts = storedHash.split('$');
        if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
            // Hash format không đúng
            console.error('[crypto] Invalid hash format');
            return false;
        }

        const [, iterationsStr, salt, expectedHash] = parts;
        const iterations = parseInt(iterationsStr, 10);
        const saltBuffer = Uint8Array.from(atob(salt), c => c.charCodeAt(0));

        // Import password as key material
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            stringToArrayBuffer(password),
            ALGORITHM,
            false,
            ['deriveBits']
        );

        // Derive key với cùng parameters
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: ALGORITHM,
                salt: saltBuffer,
                iterations: iterations,
                hash: 'SHA-256',
            },
            keyMaterial,
            HASH_LENGTH * 8
        );

        // So sánh hash
        const hashArray = new Uint8Array(derivedBits);
        const computedHash = btoa(String.fromCharCode(...hashArray));

        return computedHash === expectedHash;
    } catch (error) {
        console.error('[crypto] Verify password error:', error);
        return false;
    }
}

/**
 * Tạo session token ngẫu nhiên
 * @returns Token string (32 bytes hex)
 */
export function generateSessionToken(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Tạo UUID v4
 * @returns UUID string
 */
export function generateId(): string {
    return crypto.randomUUID();
}
