// create-admin.js - Script tạo tài khoản admin
// Chạy: node scripts/create-admin.js

const crypto = require('crypto');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123123';
const ITERATIONS = 100000;
const HASH_LENGTH = 32;

// Tạo salt ngẫu nhiên
function generateSalt() {
    const salt = crypto.randomBytes(16);
    return salt.toString('base64');
}

// Hash password với PBKDF2
async function hashPassword(password) {
    const salt = generateSalt();
    const saltBuffer = Buffer.from(salt, 'base64');

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, saltBuffer, ITERATIONS, HASH_LENGTH, 'sha256', (err, derivedKey) => {
            if (err) reject(err);
            const hashBase64 = derivedKey.toString('base64');
            resolve(`pbkdf2$${ITERATIONS}$${salt}$${hashBase64}`);
        });
    });
}

// Generate UUID
function generateId() {
    return crypto.randomUUID();
}

async function main() {
    const userId = generateId();
    const passwordHash = await hashPassword(ADMIN_PASSWORD);
    const now = Math.floor(Date.now() / 1000);

    console.log('=== ADMIN ACCOUNT DETAILS ===');
    console.log('Username:', ADMIN_USERNAME);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('User ID:', userId);
    console.log('Password Hash:', passwordHash);
    console.log('');
    console.log('=== SQL TO RUN ===');
    console.log('');

    const sql = `INSERT INTO users (id, username, password_hash, role, display_name, created_at, updated_at) 
VALUES ('${userId}', '${ADMIN_USERNAME}', '${passwordHash}', 'admin', 'Admin', ${now}, ${now});`;

    console.log(sql);
    console.log('');
    console.log('=== HOW TO RUN ===');
    console.log('1. Copy the SQL above');
    console.log('2. Run: npx wrangler d1 execute arduino-db --remote --command="<SQL>"');
    console.log('   Or paste into Cloudflare Dashboard > D1 > arduino-db > Console');
}

main().catch(console.error);
