const { execSync } = require('child_process');

// Expected weeks based on files in curriculum/
const expectedWeeks = [
    'week-00', 'week-01', 'week-02', 'week-03', 'week-04',
    'week-05', 'week-06', 'week-07', 'week-08', 'week-09',
    'week-10', 'week-11', 'week-12'
];

try {
    console.log('🔍 Verifying ALL weeks in REMOTE database...');
    const cmd = `npx wrangler d1 execute arduino-db --remote --command "SELECT id, title FROM weeks ORDER BY id" --json`;

    // Run command
    const output = execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });

    const json = JSON.parse(output);
    const results = json[0]?.results || [];

    let allFound = true;

    expectedWeeks.forEach(weekId => {
        const found = results.find(r => r.id === weekId);
        if (found) {
            console.log(`✅ ${weekId}: ${found.title}`);
        } else {
            console.error(`❌ ${weekId}: NOT FOUND`);
            allFound = false;
        }
    });

    if (allFound) {
        console.log('\n✨ All weeks verified successfully!');
    } else {
        console.error('\n⚠️ Some weeks are missing!');
        process.exit(1);
    }

} catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
}
