-- ==========================================
-- WEEK OVERVIEWS UPDATE
-- Generated: 2026-01-16
-- Run: npx wrangler d1 execute arduino-db --remote --file=src/db/seed_week_overviews.sql
-- ==========================================

-- WEEK 1
UPDATE weeks SET overview = 'Chào mừng bạn đến với tuần đầu tiên của khóa học! Trong tuần này, chúng ta sẽ làm quen với Arduino Uno - "bộ não" của hàng triệu dự án IoT trên toàn cầu. Bạn sẽ học cách thiết lập môi trường lập trình, hiểu về cấu trúc chân GPIO (General Purpose Input/Output) và viết chương trình đầu tiên để điều khiển đèn LED. Đây là nền tảng quan trọng nhất để bạn bước vào thế giới lập trình nhúng.' WHERE id = 'week-01';

-- WEEK 2
UPDATE weeks SET overview = 'Sau khi đã làm quen với việc bật/tắt LED đơn, tuần này chúng ta sẽ nâng cấp độ khó với LED 7 đoạn (7-Segment Display). Bạn sẽ học tư duy thiết kế hệ thống theo phương pháp Top-Down và Bottom-Up, hiểu về kỹ thuật Multiplexing (quét led) để tiết kiệm chân vi điều khiển, và sử dụng IC ghi dịch 74HC595 để mở rộng số lượng đầu ra.' WHERE id = 'week-02';

-- WEEK 3
UPDATE weeks SET overview = 'Hệ thống nhúng không chỉ có "xuất" tín hiệu mà còn phải biết "đọc" tín hiệu từ người dùng. Tuần này tập trung vào xử lý đầu vào (Input) thông qua Nút nhấn và Bàn phím ma trận (Keypad 4x4). Bạn sẽ nắm vững khái niệm điện trở treo (Pull-up/Pull-down), hiện tượng dội phím (bouncing) và cách xử lý nó bằng phần mềm (Debounce) hoặc phần cứng.' WHERE id = 'week-03';

-- WEEK 4
UPDATE weeks SET overview = 'Thế giới thực không chỉ có 0 và 1 (Digital), mà còn có vô vàn giá trị liên tục (Analog). Tuần này bạn sẽ khám phá bộ chuyển đổi tương tự sang số (ADC) để đọc cảm biến biến trở, và kỹ thuật PWM (Pulse Width Modulation) để giả lập tín hiệu Analog xuất ra (điều khiển độ sáng LED, tốc độ động cơ). Đây là chìa khóa để làm việc với các cảm biến thực tế.' WHERE id = 'week-04';

-- WEEK 5
UPDATE weeks SET overview = 'Đã đến lúc tổng hợp kiến thức! Tuần 5 là tuần thực hành tích hợp, nơi bạn sẽ kết hợp cả Input (nút nhấn, biến trở) và Output (LED, còi) vào một hệ thống hoàn chỉnh. Chúng ta sẽ học cách viết code sạch (clean code), tổ chức chương trình theo mô hình máy trạng thái (State Machine) đơn giản và kỹ thuật lập trình không chặn (non-blocking) để hệ thống phản hồi mượt mà.' WHERE id = 'week-05';

-- WEEK 6
UPDATE weeks SET overview = 'Biến Arduino thành "giác quan" và "cơ bắp"! Tuần này giới thiệu các loại cảm biến môi trường phổ biến như cảm biến nhiệt độ, độ ẩm (DHT11), khoảng cách (HC-SR04) và cảm biến chuyển động (PIR). Đồng thời, bạn sẽ học cách điều khiển động cơ Servo và Động cơ DC thông qua mạch cầu H, mở đường cho các dự án robot sau này.' WHERE id = 'week-06';

-- WEEK 7
UPDATE weeks SET overview = 'Làm sao để Arduino "nói chuyện" với máy tính hoặc các module khác? Câu trả lời là Giao tiếp Nối tiếp (Serial Communication). Bạn sẽ đi sâu vào chuẩn UART, hiểu về Baudrate, và học cách gửi/nhận dữ liệu phức tạp giữa Arduino và máy tính. Kỹ năng này cực kỳ quan trọng để debug và giám sát hoạt động của hệ thống từ xa.' WHERE id = 'week-07';

-- WEEK 8
UPDATE weeks SET overview = 'Khi số lượng cảm biến tăng lên, chúng ta cần giao thức giao tiếp hiệu quả hơn. Tuần này giới thiệu giao thức I2C (Inter-Integrated Circuit) - chuẩn giao tiếp 2 dây cực kỳ phổ biến. Bạn sẽ thực hành kết nối màn hình LCD 16x2 qua I2C để hiển thị thông tin trực quan thay vì chỉ dùng Serial Monitor, giúp dự án của bạn chuyên nghiệp hơn hẳn.' WHERE id = 'week-08';

-- WEEK 9
UPDATE weeks SET overview = 'Đôi khi hệ thống cần phản ứng "ngay lập tức" với sự kiện khẩn cấp mà không thể chờ code chạy hết vòng lặp. Đó là lúc bạn cần đến NGẮT (Interrupts). Tuần này sẽ dạy bạn cách sử dụng ngắt phần cứng (Hardware Interrupts) và ngắt định thời (Timer Interrupts) để xử lý đa nhiệm hiệu quả và chính xác đến từng micro giây.' WHERE id = 'week-09';

-- WEEK 10
UPDATE weeks SET overview = 'Làm sao để Arduino nhớ được cài đặt của người dùng ngay cả khi mất điện? Chúng ta sẽ tìm hiểu về bộ nhớ EEPROM tích hợp sẵn. Ngoài ra, bạn cũng sẽ học các kỹ thuật tối ưu năng lượng (Power Saving), đưa Arduino vào chế độ ngủ (Sleep Mode) để tiết kiệm pin cho các ứng dụng chạy bằng năng lượng mặt trời hoặc pin dự phòng.' WHERE id = 'week-10';

-- WEEK 11
UPDATE weeks SET overview = 'Bước chân vào thế giới IoT (Internet of Things)! Tuần này bạn sẽ làm quen với module WiFi (ESP8266/ESP32) hoặc Ethernet shield. Chúng ta sẽ học cách kết nối Arduino với mạng Internet, gửi dữ liệu cảm biến lên Cloud (như ThingSpeak hoặc Firebase) và điều khiển thiết bị từ xa qua trình duyệt web đơn giản.' WHERE id = 'week-11';

-- WEEK 12
UPDATE weeks SET overview = 'Chúc mừng bạn đã đi đến chặng cuối! Tuần 12 dành cho Dự án Cuối khóa (Capstone Project). Bạn sẽ tự tay thiết kế và xây dựng một hệ thống nhúng hoàn chỉnh từ A-Z, áp dụng tất cả kiến thức đã học: từ đọc cảm biến, xử lý dữ liệu, hiển thị LCD đến kết nối không dây. Đây là cơ hội để bạn khẳng định kỹ năng của mình.' WHERE id = 'week-12';
