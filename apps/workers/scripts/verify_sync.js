const { execSync } = require('child_process');

try {
    const args = process.argv.slice(2);
    const isRemote = args.includes('--remote');
    const envFlag = isRemote ? '--remote' : '--local';

    console.log(`Checking ${isRemote ? 'REMOTE' : 'LOCAL'} database...`);

    const cmd = `npx wrangler d1 execute arduino-db ${envFlag} --command "SELECT id, title FROM weeks WHERE id = 'week-04'" --json`;
    console.log('Running:', cmd);
    const output = execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
    try {
        const json = JSON.parse(output);
        const results = json[0]?.results || [];
        if (results.length > 0) {
            console.log('Week 4 Title:', results[0].title);
        } else {
            console.log('Week 4 not found');
        }
    } catch (parseError) {
        console.error('Failed to parse JSON:', output);
    }
} catch (e) {
    console.error('Error:', e.message);
}
