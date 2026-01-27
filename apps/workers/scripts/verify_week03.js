const { execSync } = require('child_process');

try {
    const cmd = `npx wrangler d1 execute arduino-db --remote --command "SELECT title FROM weeks WHERE id = 'week-03'" --json`;
    console.log('Running check for Week 3...');
    const output = execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });

    const json = JSON.parse(output);
    const results = json[0]?.results || [];

    if (results.length > 0) {
        console.log('DB Title:', results[0].title);
    } else {
        console.log('Week 3 not found in DB');
    }
} catch (e) {
    console.error('Error:', e.message);
}
