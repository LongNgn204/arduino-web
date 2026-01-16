// Arduino Knowledge Base - Curated facts for RAG grounding
// Chú thích: Static knowledge embedded in code để AI có context chính xác

// Định nghĩa kiến thức Arduino cốt lõi để inject vào system prompt
export const ARDUINO_KNOWLEDGE_BASE = {
    // Các hàm Arduino phổ biến và cú pháp chính xác
    functions: {
        'pinMode': {
            syntax: 'pinMode(pin, mode)',
            params: ['pin: số chân (0-13 digital, A0-A5 analog)', 'mode: INPUT, OUTPUT, INPUT_PULLUP'],
            example: 'pinMode(13, OUTPUT);',
            notes: 'Phải gọi trong setup() trước khi dùng digital I/O'
        },
        'digitalWrite': {
            syntax: 'digitalWrite(pin, value)',
            params: ['pin: số chân digital', 'value: HIGH (5V) hoặc LOW (0V)'],
            example: 'digitalWrite(13, HIGH);',
            notes: 'Chân phải được set OUTPUT bằng pinMode() trước'
        },
        'digitalRead': {
            syntax: 'digitalRead(pin)',
            params: ['pin: số chân digital'],
            returns: 'HIGH hoặc LOW',
            example: 'int state = digitalRead(2);',
            notes: 'Dùng INPUT_PULLUP nếu không có điện trở ngoài'
        },
        'analogRead': {
            syntax: 'analogRead(pin)',
            params: ['pin: A0-A5 (analog pins)'],
            returns: '0-1023 (10-bit ADC, tương ứng 0-5V)',
            example: 'int value = analogRead(A0);',
            notes: 'Chuyển đổi: voltage = value * 5.0 / 1023'
        },
        'analogWrite': {
            syntax: 'analogWrite(pin, value)',
            params: ['pin: chân PWM (3,5,6,9,10,11)', 'value: 0-255'],
            example: 'analogWrite(9, 128); // 50% duty cycle',
            notes: 'Không phải analog thực, là PWM 490Hz/980Hz'
        },
        'delay': {
            syntax: 'delay(ms)',
            params: ['ms: thời gian tạm dừng (milliseconds)'],
            example: 'delay(1000); // Chờ 1 giây',
            notes: 'Blocking - chương trình dừng hoàn toàn, không dùng trong ISR'
        },
        'millis': {
            syntax: 'millis()',
            returns: 'Số milliseconds từ khi Arduino bật (unsigned long)',
            example: 'unsigned long time = millis();',
            notes: 'Overflow sau ~50 ngày, dùng thay delay() cho non-blocking'
        },
        'Serial.begin': {
            syntax: 'Serial.begin(baudrate)',
            params: ['baudrate: 9600, 115200...'],
            example: 'Serial.begin(9600);',
            notes: 'Gọi trong setup(), match baudrate với Serial Monitor'
        },
        'Serial.print': {
            syntax: 'Serial.print(data) / Serial.println(data)',
            params: ['data: số, chuỗi, biến'],
            example: 'Serial.println("Hello");',
            notes: 'println() tự động xuống dòng, print() thì không'
        }
    },

    // Công thức quan trọng
    formulas: {
        'ohm': {
            name: 'Định luật Ohm',
            formula: 'V = I × R',
            latex: '$V = I \\times R$',
            units: 'V (Volt), I (Ampere), R (Ohm Ω)',
            example: 'Tính R cho LED: R = (5V - 2V) / 0.02A = 150Ω'
        },
        'power': {
            name: 'Công suất',
            formula: 'P = V × I = I² × R = V² / R',
            latex: '$P = V \\times I = I^2 \\times R = \\frac{V^2}{R}$',
            units: 'P (Watt)'
        },
        'voltage_divider': {
            name: 'Mạch chia áp',
            formula: 'Vout = Vin × (R2 / (R1 + R2))',
            latex: '$V_{out} = V_{in} \\times \\frac{R_2}{R_1 + R_2}$',
            example: 'Dùng cho cảm biến 3.3V với Arduino 5V'
        },
        'adc_voltage': {
            name: 'Chuyển đổi ADC sang Voltage',
            formula: 'Voltage = (ADC_value × Vref) / 1023',
            latex: '$V = \\frac{ADC \\times V_{ref}}{1023}$',
            example: 'ADC = 512 → V = 512 × 5 / 1023 ≈ 2.5V'
        },
        'hcsr04_distance': {
            name: 'Khoảng cách HC-SR04',
            formula: 'Distance (cm) = (duration × 0.034) / 2',
            latex: '$d = \\frac{t \\times v_{sound}}{2} = \\frac{t \\times 0.034}{2}$',
            notes: 'duration từ pulseIn(), chia 2 vì sóng đi-về'
        }
    },

    // Phần cứng thông dụng
    hardware: {
        'arduino_uno': {
            name: 'Arduino Uno R3',
            chip: 'ATmega328P',
            voltage: '5V',
            digital_pins: '14 (D0-D13), 6 chân PWM',
            analog_pins: '6 (A0-A5)',
            flash: '32KB (0.5KB bootloader)',
            sram: '2KB',
            eeprom: '1KB',
            clock: '16MHz'
        },
        'led': {
            name: 'LED (Light Emitting Diode)',
            forward_voltage: '1.8-3.3V (tùy màu)',
            typical_current: '20mA',
            connection: 'Anode (+) qua điện trở → chân Arduino, Cathode (-) → GND',
            resistor_formula: 'R = (Vcc - Vled) / I'
        },
        'button': {
            name: 'Push Button',
            connection: 'Một chân → chân digital, chân kia → GND',
            code: 'pinMode(pin, INPUT_PULLUP); digitalRead(pin)',
            debounce: 'Dùng delay(50) hoặc millis() để chống dội'
        },
        'servo': {
            name: 'Servo Motor',
            library: '#include <Servo.h>',
            pwm_range: '1ms (0°) - 2ms (180°)',
            code: 'Servo s; s.attach(9); s.write(90);'
        },
        'hcsr04': {
            name: 'HC-SR04 Ultrasonic Sensor',
            pins: 'VCC(5V), GND, TRIG, ECHO',
            range: '2cm - 400cm',
            code: 'pulseIn(echoPin, HIGH)'
        }
    },

    // Common mistakes và cách sửa
    common_mistakes: [
        {
            mistake: 'Thiếu pinMode() trong setup()',
            symptom: 'LED không sáng, button không hoạt động',
            fix: 'Thêm pinMode(pin, OUTPUT/INPUT) trong setup()'
        },
        {
            mistake: 'Dùng == thay vì = trong gán',
            symptom: 'Biến không được cập nhật',
            fix: 'Dùng = để gán, == để so sánh'
        },
        {
            mistake: 'Thiếu dấu chấm phẩy ;',
            symptom: 'Lỗi compile unexpected token',
            fix: 'Thêm ; cuối mỗi lệnh'
        },
        {
            mistake: 'Sai tên hàm (pinmode thay vì pinMode)',
            symptom: 'Lỗi not declared in this scope',
            fix: 'Arduino phân biệt hoa/thường, kiểm tra cú pháp'
        },
        {
            mistake: 'delay() trong interrupt',
            symptom: 'Chương trình treo hoặc không ổn định',
            fix: 'Không dùng delay() trong ISR, dùng flag thay thế'
        },
        {
            mistake: 'Dùng String nhiều làm tràn RAM',
            symptom: 'Chương trình chạy chậm rồi crash',
            fix: 'Dùng char[] hoặc F() macro cho chuỗi tĩnh'
        }
    ]
};

// Generate knowledge context string for system prompt
export function generateKnowledgeContext(_topic?: string): string {
    let context = '## KIẾN THỨC ARDUINO (verified)\n\n';

    // Chú thích: Type-safe access to functions object
    const funcs = ARDUINO_KNOWLEDGE_BASE.functions as Record<string, { syntax: string; notes?: string }>;

    // Add top functions
    context += '### Các hàm cơ bản:\n';
    const topFuncs = ['pinMode', 'digitalWrite', 'digitalRead', 'analogRead', 'analogWrite', 'delay'];
    for (const func of topFuncs) {
        const f = funcs[func];
        if (f) {
            context += `- **${func}**: \`${f.syntax}\` - ${f.notes || ''}\n`;
        }
    }

    // Add key formulas
    context += '\n### Công thức quan trọng:\n';
    for (const [key, formula] of Object.entries(ARDUINO_KNOWLEDGE_BASE.formulas)) {
        context += `- **${formula.name}**: ${formula.latex || formula.formula}\n`;
    }

    // Add common mistakes
    context += '\n### Lỗi thường gặp:\n';
    for (const err of ARDUINO_KNOWLEDGE_BASE.common_mistakes.slice(0, 4)) {
        context += `- ${err.mistake} → ${err.fix}\n`;
    }

    return context;
}

// Search knowledge by keywords (simple in-memory search)
export function searchKnowledge(query: string): string[] {
    const results: string[] = [];
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/);

    // Chú thích: Type-safe casting for objects
    const funcs = ARDUINO_KNOWLEDGE_BASE.functions as Record<string, { syntax: string; example?: string; notes?: string }>;

    // Search functions
    for (const [name, func] of Object.entries(funcs)) {
        if (keywords.some(kw => name.toLowerCase().includes(kw) || func.syntax.toLowerCase().includes(kw))) {
            results.push(`**${name}**: \`${func.syntax}\`\n${func.example || ''}\n${func.notes || ''}`);
        }
    }

    // Search formulas
    for (const [key, formula] of Object.entries(ARDUINO_KNOWLEDGE_BASE.formulas)) {
        const f = formula as { name: string; formula: string; latex?: string; example?: string };
        if (keywords.some(kw => f.name.toLowerCase().includes(kw) || key.includes(kw))) {
            results.push(`**${f.name}**: ${f.latex || f.formula}\n${f.example || ''}`);
        }
    }

    // Search hardware
    for (const [key, hw] of Object.entries(ARDUINO_KNOWLEDGE_BASE.hardware)) {
        if (keywords.some(kw => hw.name.toLowerCase().includes(kw) || key.includes(kw))) {
            results.push(`**${hw.name}**: ${JSON.stringify(hw, null, 2)}`);
        }
    }

    return results.slice(0, 3); // Return top 3 matches
}
