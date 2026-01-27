const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CURRICULUM_DIR = path.join(__dirname, '../../../curriculum');
const FILE_NAME = 'week-03-button-keypad.md';
const DB_NAME = 'arduino-db';

const esc = (str) => (!str ? '' : str.replace(/'/g, "''"));

try {
    const filePath = path.join(CURRICULUM_DIR, FILE_NAME);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract Title
    const lines = content.split('\n');
    let title = lines[0].replace(/^#\s*/, '').trim();

    const weekId = 'week-03';
    const lessonId = 'l-03-01';

    console.log(`Syncing ${weekId} (${title})...`);

    const sql = `
        BEGIN TRANSACTION;
        UPDATE weeks SET title = '${esc(title)}' WHERE id = '${weekId}';
        INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, board_support, is_published)
        VALUES ('${lessonId}', '${weekId}', 1, '${esc(title)}', '${esc(content)}', 'both', 1);
        COMMIT;
    `;

    const sqlPath = path.join(__dirname, 'temp_week03.sql');
    fs.writeFileSync(sqlPath, sql);

    const workersDir = path.join(__dirname, '..');
    const cmd = `npx wrangler d1 execute ${DB_NAME} --remote --file="scripts/temp_week03.sql"`;

    console.log('Running wrangler...');
    execSync(cmd, { stdio: 'inherit', cwd: workersDir });
    console.log('✅ Week 3 Synced!');

} catch (e) {
    console.error('❌ Error:', e.message);
}
