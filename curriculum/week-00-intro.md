# Tuần 0: Nhập môn Điện tử & Linh kiện

## Giới thiệu
Chào mừng bạn đến với khóa học "Lập trình hệ thống nhúng & IoT". Trước khi bắt đầu viết code cho Arduino, chúng ta cần hiểu về "ngôn ngữ" của phần cứng: **Điện tử cơ bản**.

Trong tuần này, bạn sẽ làm quen với các khái niệm cốt lõi như Điện áp, Dòng điện, Điện trở và thực hành lắp mạch đầu tiên trên Breadboard.

## Mục tiêu học tập
- [ ] Hiểu định luật Ohm và mối quan hệ V-I-R.
- [ ] Nhận biết các linh kiện: Điện trở, LED, Tụ điện, Transistor.
- [ ] Đọc giá trị điện trở bằng vạch màu.
- [ ] Sử dụng Breadboard để lắp mạch.

## Nội dung bài giảng

### Bài 1: Ba đại lượng cơ bản và Định luật Ohm
Điện cũng giống như nước chảy trong ống:
- **Hiệu điện thế (Voltage - V)**: Áp lực nước (đẩy nước đi). Đơn vị: Volt (V).
- **Dòng điện (Current - I)**: Lưu lượng nước chảy. Đơn vị: Ampe (A).
- **Điện trở (Resistance - R)**: Sự cản trở dòng nước (ống nhỏ hay to). Đơn vị: Ohm (Ω).

**Công thức thần thánh:**
$$ V = I \times R $$

> **Ví dụ:** Bạn có nguồn 5V và muốn thắp sáng 1 đèn LED (cần 2V, 20mA). Bạn cần dùng điện trở bao nhiêu để đèn không cháy?
> $$ V_{R} = 5V - 2V = 3V $$
> $$ R = \frac{V_R}{I} = \frac{3V}{0.02A} = 150 \Omega $$

### Bài 2: Linh kiện điện tử quanh ta
1. **Điện trở (Resistor)**:
   - Hình dáng: Có các vạch màu.
   - Tác dụng: Hạn chế dòng điện.
   - Cách đọc màu: Đen(0), Nâu(1), Đỏ(2), Cam(3), Vàng(4)... "Sáng sớm chiều tối..."

2. **LED (Light Emitting Diode)**:
   - Diode phát quang.
   - **Quan trọng**: Chỉ dẫn điện 1 chiều. Chân Dài (+), Chân Ngắn (-).
   - Đừng cắm ngược, và luôn cần điện trở hạn dòng!

3. **Breadboard (Bo mạch thử nghiệm)**:
   - Giúp nối dây không cần hàn.
   - Hàng dọc (cạnh 2 bên): Nối liền nhau (dùng cho Nguồn).
   - Hàng ngang (ở giữa): Nối liền 5 lỗ (dùng để cắm linh kiện).

## Bài tập thực hành (Lab)
**Lab 0: Hello World của Phần cứng**
- **Nhiệm vụ**: Làm sáng 1 đèn LED bằng pin 9V hoặc Arduino 5V.
- **Yêu cầu**: Tính toán điện trở phù hợp.
- **Simulator**: [Mở Wokwi Lab 0](https://wokwi.com/projects/new/arduino-uno)
