// FAQ Cache - Instant answers cho câu hỏi thường gặp
// Chú thích: Trả lời ngay không cần gọi AI, tiết kiệm tokens và tăng tốc

export interface FAQEntry {
    keywords: string[];
    answer: string;
    category: 'syntax' | 'hardware' | 'debug' | 'concept';
}

// Bộ FAQ curated - các câu hỏi phổ biến nhất
export const FAQ_CACHE: FAQEntry[] = [
    // ============ SYNTAX ============
    {
        keywords: ['pinmode', 'cú pháp pinmode', 'sử dụng pinmode'],
        category: 'syntax',
        answer: `**pinMode(pin, mode)** - Cấu hình chân digital

\`\`\`cpp
// Trong setup()
pinMode(13, OUTPUT);    // Chân 13 là output (điều khiển LED, relay...)
pinMode(2, INPUT);      // Chân 2 là input (đọc nút bấm, cảm biến...)
pinMode(3, INPUT_PULLUP); // Input với điện trở kéo lên nội (không cần R ngoài)
\`\`\`

💡 **Lưu ý**: Phải gọi trong \`setup()\` trước khi dùng \`digitalWrite()\` hoặc \`digitalRead()\``
    },
    {
        keywords: ['digitalwrite', 'bật led', 'tắt led', 'high low'],
        category: 'syntax',
        answer: `**digitalWrite(pin, value)** - Xuất tín hiệu digital

\`\`\`cpp
digitalWrite(13, HIGH);  // Xuất 5V (LED sáng)
digitalWrite(13, LOW);   // Xuất 0V (LED tắt)
\`\`\`

💡 **Lưu ý**: Chân phải được set \`pinMode(pin, OUTPUT)\` trong setup() trước!`
    },
    {
        keywords: ['analogread', 'đọc analog', 'cảm biến analog', 'biến trở'],
        category: 'syntax',
        answer: `**analogRead(pin)** - Đọc giá trị analog (ADC)

\`\`\`cpp
int value = analogRead(A0);  // Đọc chân A0, trả về 0-1023

// Chuyển sang Volt:
float voltage = value * 5.0 / 1023.0;
\`\`\`

📊 **Uno**: 10-bit ADC (0-1023) | **ESP32**: 12-bit ADC (0-4095)`
    },
    {
        keywords: ['delay', 'millis', 'chờ', 'tạm dừng', 'non-blocking'],
        category: 'syntax',
        answer: `**delay() vs millis()** - Quản lý thời gian

\`\`\`cpp
// delay() - Blocking (chương trình dừng hoàn toàn)
delay(1000);  // Chờ 1 giây

// millis() - Non-blocking (khuyến khích dùng)
unsigned long prev = 0;
if (millis() - prev >= 1000) {
    prev = millis();
    // Code chạy mỗi 1 giây
}
\`\`\`

💡 **Tip**: Dùng \`millis()\` khi cần làm nhiều việc song song!`
    },

    // ============ LED NHẤP NHÁY ============
    {
        keywords: ['led nhấp nháy', 'blink', 'led chớp', 'nhấp nháy đèn'],
        category: 'concept',
        answer: `**LED Nhấp nháy (Blink)** - Bài đầu tiên Arduino!

\`\`\`cpp
void setup() {
    pinMode(13, OUTPUT);  // Chân 13 có LED onboard
}

void loop() {
    digitalWrite(13, HIGH);  // Bật LED
    delay(1000);             // Chờ 1 giây
    digitalWrite(13, LOW);   // Tắt LED
    delay(1000);             // Chờ 1 giây
}
// loop() lặp lại → LED nhấp nháy!
\`\`\`

💡 Đổi \`delay(500)\` để LED chớp nhanh hơn!`
    },

    // ============ HARDWARE ============
    {
        keywords: ['servo', 'động cơ servo', 'servo motor', 'góc servo'],
        category: 'hardware',
        answer: `**Servo Motor** - Điều khiển góc quay (0-180°)

\`\`\`cpp
#include <Servo.h>

Servo myServo;

void setup() {
    myServo.attach(9);  // Chân signal servo nối vào D9
}

void loop() {
    myServo.write(0);    // Quay về 0°
    delay(1000);
    myServo.write(90);   // Quay đến 90°
    delay(1000);
    myServo.write(180);  // Quay đến 180°
    delay(1000);
}
\`\`\`

🔌 **Nối dây**: Đỏ → 5V, Nâu/Đen → GND, Cam → Chân PWM (9,10,11)`
    },
    {
        keywords: ['hc-sr04', 'siêu âm', 'đo khoảng cách', 'ultrasonic'],
        category: 'hardware',
        answer: `**HC-SR04** - Cảm biến siêu âm đo khoảng cách

\`\`\`cpp
#define TRIG 9
#define ECHO 10

void setup() {
    pinMode(TRIG, OUTPUT);
    pinMode(ECHO, INPUT);
    Serial.begin(9600);
}

void loop() {
    digitalWrite(TRIG, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG, LOW);
    
    long duration = pulseIn(ECHO, HIGH);
    float distance = duration * 0.034 / 2;  // cm
    
    Serial.print("Distance: ");
    Serial.println(distance);
    delay(100);
}
\`\`\`

📏 **Công thức**: d = (t × 0.034) / 2 cm`
    },
    {
        keywords: ['dht11', 'dht22', 'nhiệt độ độ ẩm', 'cảm biến nhiệt'],
        category: 'hardware',
        answer: `**DHT11/DHT22** - Cảm biến nhiệt độ & độ ẩm

\`\`\`cpp
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11  // Hoặc DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
    Serial.begin(9600);
    dht.begin();
}

void loop() {
    float h = dht.readHumidity();
    float t = dht.readTemperature();  // Độ C
    
    Serial.print("Nhiệt độ: ");
    Serial.print(t);
    Serial.print("°C, Độ ẩm: ");
    Serial.print(h);
    Serial.println("%");
    
    delay(2000);  // DHT cần 2s giữa các lần đọc
}
\`\`\`

📌 **Lưu ý**: Cài thư viện DHT sensor library (Adafruit)`
    },

    // ============ DEBUG ============
    {
        keywords: ['led không sáng', 'led ko sáng', 'led tắt', 'không hoạt động'],
        category: 'debug',
        answer: `**LED không sáng?** Kiểm tra theo thứ tự:

1. ✅ Đã gọi \`pinMode(pin, OUTPUT)\` trong setup() chưa?
2. ✅ Nối đúng chiều LED? (Chân dài = Anode → qua R → chân Arduino)
3. ✅ Có điện trở 220Ω-1kΩ nối tiếp chưa? (Thiếu R → LED cháy)
4. ✅ Kiểm tra code: \`digitalWrite(pin, HIGH)\` đúng chân?
5. ✅ LED còn sống? Thử LED khác

\`\`\`cpp
// Code chuẩn:
void setup() {
    pinMode(13, OUTPUT);  // QUAN TRỌNG!
}
void loop() {
    digitalWrite(13, HIGH);
    delay(1000);
    digitalWrite(13, LOW);
    delay(1000);
}
\`\`\``
    },
    {
        keywords: ['lỗi compile', 'expected', 'not declared', 'error'],
        category: 'debug',
        answer: `**Lỗi compile thường gặp:**

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| \`expected ';'\` | Thiếu dấu ; | Thêm ; cuối lệnh |
| \`not declared in this scope\` | Sai tên hàm/biến | Kiểm tra chính tả (Arduino phân biệt HOA/thường) |
| \`expected ')'\` | Thiếu ngoặc đóng | Kiểm tra cặp ngoặc |
| \`redefinition of\` | Khai báo trùng | Xóa dòng trùng lặp |

💡 **Tip**: Click vào dòng lỗi trong IDE để nhảy đến vị trí cần sửa!`
    },

    // ============ ESP32 ============
    {
        keywords: ['esp32', 'wifi esp32', 'kết nối wifi'],
        category: 'hardware',
        answer: `**ESP32 - Kết nối WiFi cơ bản**

\`\`\`cpp
#include <WiFi.h>

const char* ssid = "TEN_WIFI";
const char* password = "MAT_KHAU";

void setup() {
    Serial.begin(115200);
    
    WiFi.begin(ssid, password);
    Serial.print("Đang kết nối WiFi");
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println("\\nĐã kết nối!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
}

void loop() {
    // Code chính
}
\`\`\`

⚡ **ESP32 vs Uno**: Logic 3.3V (không phải 5V), có WiFi+Bluetooth built-in`
    },
    {
        keywords: ['esp32 pwm', 'ledcwrite', 'pwm esp32'],
        category: 'syntax',
        answer: `**ESP32 PWM** - Dùng ledcWrite() thay analogWrite()

\`\`\`cpp
const int ledPin = 2;
const int freq = 5000;
const int channel = 0;
const int resolution = 8;  // 8-bit: 0-255

void setup() {
    ledcSetup(channel, freq, resolution);
    ledcAttachPin(ledPin, channel);
}

void loop() {
    // Fade LED
    for (int duty = 0; duty <= 255; duty++) {
        ledcWrite(channel, duty);
        delay(10);
    }
}
\`\`\`

💡 **Lưu ý**: ESP32 không có \`analogWrite()\`, phải dùng LEDC API!`
    }
];

// Tìm FAQ match với câu hỏi
export function findFAQMatch(question: string): FAQEntry | null {
    const q = question.toLowerCase().trim();

    for (const faq of FAQ_CACHE) {
        for (const keyword of faq.keywords) {
            if (q.includes(keyword.toLowerCase())) {
                return faq;
            }
        }
    }

    return null;
}

// Đếm FAQ theo category
export function getFAQStats() {
    const stats: Record<string, number> = {};
    for (const faq of FAQ_CACHE) {
        stats[faq.category] = (stats[faq.category] || 0) + 1;
    }
    return stats;
}
