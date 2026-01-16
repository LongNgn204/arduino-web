const { execSync } = require('child_process');

const weeks = [
    { id: 'week-01', course_id: 'course-01', week_number: 1, topic_id: 'topic-01', title: 'Hello World & GPIO', overview: 'Làm quen với Arduino IDE.', is_published: 1 },
    { id: 'week-02', course_id: 'course-01', week_number: 2, topic_id: 'topic-01', title: 'Digital I/O & Logic', overview: 'Nút nhấn, Pull-up.', is_published: 1 },
    { id: 'week-03', course_id: 'course-01', week_number: 3, topic_id: 'topic-01', title: 'Analog & PWM', overview: 'ADC, Biến trở.', is_published: 1 },
    { id: 'week-04', course_id: 'course-01', week_number: 4, topic_id: 'topic-01', title: 'Hiển thị cơ bản', overview: 'LED 7 đoạn, LCD.', is_published: 1 },
    { id: 'week-05', course_id: 'course-01', week_number: 5, topic_id: 'topic-02', title: 'Cảm biến Môi trường', overview: 'DHT11, LDR.', is_published: 1 },
    { id: 'week-06', course_id: 'course-01', week_number: 6, topic_id: 'topic-02', title: 'Động cơ & Actuators', overview: 'Servo, Relay.', is_published: 1 },
    { id: 'week-07', course_id: 'course-01', week_number: 7, topic_id: 'topic-03', title: 'Giao tiếp Serial', overview: 'UART.', is_published: 1 },
    { id: 'week-08', course_id: 'course-01', week_number: 8, topic_id: 'topic-03', title: 'I2C & SPI', overview: 'OLED, RTC.', is_published: 1 },
    { id: 'week-09', course_id: 'course-01', week_number: 9, topic_id: 'topic-04', title: 'WiFi & Web Server', overview: 'Station vs AP.', is_published: 1 },
    { id: 'week-10', course_id: 'course-01', week_number: 10, topic_id: 'topic-04', title: 'MQTT Protocol', overview: 'Pub/Sub.', is_published: 1 },
    { id: 'week-11', course_id: 'course-01', week_number: 11, topic_id: 'topic-04', title: 'IoT Dashboard', overview: 'Blynk.', is_published: 1 },
    { id: 'week-12', course_id: 'course-01', week_number: 12, topic_id: 'topic-05', title: 'Capstone Project', overview: 'Project Final.', is_published: 1 }
];

console.log('Seeding Weeks...');
for (const w of weeks) {
    const cmd = `npx wrangler d1 execute arduino-db --local --command "INSERT OR REPLACE INTO weeks (id, course_id, week_number, topic_id, title, overview, is_published) VALUES ('${w.id}', '${w.course_id}', ${w.week_number}, '${w.topic_id}', '${w.title}', '${w.overview}', ${w.is_published})"`;
    try {
        execSync(cmd, { stdio: 'inherit' });
        console.log(`Initialized ${w.id}`);
    } catch (e) {
        console.error(`Failed ${w.id}`);
        // don't exit, check next
    }
}
