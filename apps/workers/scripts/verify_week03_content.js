const { execSync } = require('child_process');

try {
    const cmd = `npx wrangler d1 execute arduino-db --remote --command "SELECT substr(content, 1, 100) as snippet FROM lessons WHERE id = 'l-03-01'" --json`;
    console.log('Reading Week 3 content snippet...');
    const output = execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });

    const json = JSON.parse(output);
    const results = json[0]?.results || [];

    if (results.length > 0) {
        console.log('Snippet:', results[0].snippet);
    } else {
        console.log('Lesson l-03-01 not found');
    }
} catch (e) {
    console.error('Error:', e.message);
}
