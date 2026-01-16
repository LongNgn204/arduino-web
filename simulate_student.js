// Native fetch is available in Node.js 18+
// const fetch = require('node-fetch'); 

const API_BASE = 'http://localhost:8787';
const USER_ID = 'student-001'; // Default student from seed

// Function to mark a lesson as complete
async function completeLesson(lessonId) {
    try {
        const res = await fetch(`${API_BASE}/api/progress/mark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Mock cookie/auth if needed, or rely on worker dev ignoring auth or using simple auth
                'Cookie': 'auth_token=mock_token'
            },
            body: JSON.stringify({
                lessonId: lessonId,
                status: 'completed'
            })
        });
        if (res.ok) console.log(`[PASS] Completed Lesson: ${lessonId}`);
        else console.log(`[FAIL] Lesson ${lessonId}: ${res.statusText}`);
    } catch (e) {
        console.log(`[ERR] Lesson ${lessonId}: ${e.message}`);
    }
}

// Function to submit a quiz with passing score
async function passQuiz(quizId) {
    try {
        const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                answers: {
                    // Mock all correct answers logic would be complex, 
                    // so we might need a "force pass" endpoint or smart guessing.
                    // For now, let's assume the backend calculates score.
                    // If we can't easily mock answers, we might just insert into DB directly if we were inside the worker.
                    // But as a client script, we'll try a generic submission.
                    "q-01": "0", "q-02": "0"
                }
            })
        });
        // Note: Real quiz passing requires correct answers. 
        // Since we can't easily guess, this might fail unless we cheat or use a backdoor.
        console.log(`[INFO] Quiz ${quizId} submitted (Result pending logic)`);
    } catch (e) {
        console.log(`[ERR] Quiz ${quizId}: ${e.message}`);
    }
}

async function simulate() {
    console.log("🚀 Starting Student Simulation (Weeks 0-12)...");

    // Simulate Weeks 0-12
    for (let w = 0; w <= 12; w++) {
        const w_str = w.toString().padStart(2, '0');
        console.log(`\n--- Simulating Week ${w} ---`);

        // Complete Lessons (Assuming standard IDs like lesson-01-01, lesson-01-02)
        // We guess IDs based on seed logic
        const lessonCount = 2; // Average
        for (let l = 1; l <= lessonCount; l++) {
            const l_str = l.toString().padStart(2, '0');
            const lessonId = `lesson-${w_str}-${l_str}`;
            await completeLesson(lessonId);
        }
    }

    console.log("\n✅ Simulation Complete. Please check Dashboard for progress.");
}

simulate();
