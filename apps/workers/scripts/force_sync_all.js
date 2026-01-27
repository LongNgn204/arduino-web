const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CURRICULUM_DIR = path.join(__dirname, '../../../curriculum');
const DB_NAME = 'arduino-db';

const esc = (str) => (!str ? '' : str.replace(/'/g, "''"));

function syncWeek(file) {
    const match = file.match(/^week-(\d+)-(.+)\.md$/);
    if (!match) return;

    const weekNum = parseInt(match[1], 10);
    const weekId = `week-${weekNum.toString().padStart(2, '0')}`;
    const lessonId = `l-${weekNum.toString().padStart(2, '0')}-01`;
    const filePath = path.join(CURRICULUM_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let title = lines[0].replace(/^#\s*/, '').trim();

    console.log(`Processing ${weekId}: ${title}`);

    const sql = `
        -- Syncing ${weekId}
        UPDATE weeks SET title = '${esc(title)}' WHERE id = '${weekId}';
        INSERT OR REPLACE INTO lessons (id, week_id, order_index, title, content, board_support, is_published)
        VALUES ('${lessonId}', '${weekId}', 1, '${esc(title)}', '${esc(content)}', 'both', 1);
    `;

    const sqlFile = path.join(__dirname, `temp_${weekId}.sql`);
    fs.writeFileSync(sqlFile, sql);

    try {
        // Pipe 'y' to auto-approve
        const cmd = `echo y | npx wrangler d1 execute ${DB_NAME} --remote --file="scripts/temp_${weekId}.sql"`;
        execSync(cmd, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
        console.log(`✅ ${weekId} SUCCESS`);
    } catch (e) {
        console.error(`❌ ${weekId} FAILED`);
    } finally {
        if (fs.existsSync(sqlFile)) fs.unlinkSync(sqlFile);
    }
}

const files = fs.readdirSync(CURRICULUM_DIR).filter(f => f.endsWith('.md'));
files.forEach(syncWeek);
