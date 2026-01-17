// Library Page - Thư viện kiến thức
// Nội dung thực chất hỗ trợ sinh viên: Phương pháp học, Nâng cao GPA, Hỗ trợ tâm lý

import { useState } from 'react';
import {
    BookOpen,
    Lightbulb,
    FileText,
    Heart,
    Search,
    ChevronRight,
    Star,
    Clock,
    BookMarked,
    GraduationCap,
    Target,
    Brain,
    Sparkles,
    Coffee,
    Smile,
    TrendingUp,
    Users,
    CheckCircle
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import ReactMarkdown from 'react-markdown';

// Danh mục thư viện
const LIBRARY_CATEGORIES = [
    { id: 'all', label: 'Tất cả', icon: BookOpen },
    { id: 'study', label: 'Học tập hiệu quả', icon: GraduationCap },
    { id: 'gpa', label: 'Nâng cao GPA', icon: TrendingUp },
    { id: 'mental', label: 'Sức khỏe tinh thần', icon: Heart },
    { id: 'tips', label: 'Tips & Tricks', icon: Lightbulb },
];

// Nội dung thực chất cho sinh viên
const LIBRARY_ITEMS = [
    // ==================== PHƯƠNG PHÁP HỌC TẬP ====================
    {
        id: 1,
        title: 'Phương pháp Active Recall - Bí quyết nhớ lâu gấp 3 lần',
        category: 'study',
        icon: Brain,
        color: 'teal',
        content: `
## Active Recall là gì?

Active Recall (Nhớ chủ động) là kỹ thuật học tập buộc não bạn **chủ động gợi nhớ thông tin** thay vì đọc lại thụ động. Nghiên cứu của ĐH Washington cho thấy phương pháp này giúp ghi nhớ **lâu hơn 50-70%** so với đọc lại.

## Cách áp dụng cho môn Lập trình nhúng:

### 1. Flashcard tự tạo
- Mặt trước: "GPIO là gì?"
- Mặt sau: "General Purpose Input/Output - chân đa năng có thể cấu hình làm đầu vào hoặc đầu ra"

### 2. Tự giải thích (Feynman Technique)
Sau mỗi bài học, **đóng sách lại** và giải thích bằng lời như đang dạy người khác. Nếu bí ở đâu = bạn chưa hiểu ở đó.

### 3. Practice Testing
Trước khi xem đáp án Lab, tự code **đoán** logic trước. Sai không sao - não sẽ nhớ đáp án đúng rõ hơn.

## Lộ trình 1 tuần:
| Ngày | Hoạt động |
|------|-----------|
| 1 | Học bài mới + tạo 10 flashcard |
| 2 | Ôn flashcard + tự giải thích |
| 3 | Làm quiz không xem tài liệu |
| 4 | Review flashcard sai |
| 5-7 | Lặp lại với bài mới |

> 💡 **Tip**: Dùng app Anki để lên lịch ôn tập tự động theo đường cong quên lãng.
        `,
        readTime: '5 phút',
        featured: true,
    },
    {
        id: 2,
        title: 'Spaced Repetition - Học ít mà nhớ nhiều',
        category: 'study',
        icon: Clock,
        color: 'blue',
        content: `
## Đường cong quên lãng của Ebbinghaus

Sau 24h, bạn quên **70%** những gì đã học. Sau 1 tuần, còn lại **~20%**. Nhưng nếu ôn đúng thời điểm, tỷ lệ nhớ tăng lên **90%+**.

## Lịch ôn tập tối ưu:

\`\`\`
Ngày 1: Học bài mới
Ngày 2: Ôn lại (5 phút)
Ngày 7: Ôn lại (3 phút)
Ngày 14: Ôn lại (2 phút)
Ngày 30: Ôn lại (1 phút)
\`\`\`

## Áp dụng cho Arduino:

### Tuần 1: GPIO & LED
- Ngày 1: Học lý thuyết + Lab
- Ngày 2: Tự viết lại code LED Blink không nhìn
- Ngày 7: Quiz nhanh 5 câu về GPIO

### Tuần 2-4: Lặp lại pattern
- Mỗi tuần mới, dành 10 phút ôn tuần trước

## Công thức vàng:
> **Ôn tập ngắt quãng > Học marathon cấp tốc**

Học 30 phút x 4 ngày hiệu quả hơn học 2 tiếng x 1 ngày trước kỳ thi.
        `,
        readTime: '4 phút',
        featured: false,
    },
    {
        id: 3,
        title: 'Pomodoro cho Coder - Tập trung tối đa, không kiệt sức',
        category: 'study',
        icon: Coffee,
        color: 'orange',
        content: `
## Tại sao coder dễ burn-out?

Lập trình đòi hỏi tập trung cao độ. Làm liên tục 3-4 tiếng khiến não mệt mỏi, dẫn đến:
- Bug nhiều hơn
- Mất động lực
- Cảm giác "học mãi không vào"

## Kỹ thuật Pomodoro cải tiến cho Coder:

### Chu kỳ chuẩn:
\`\`\`
🍅 25 phút code tập trung (KHÔNG làm gì khác)
☕ 5 phút nghỉ (đứng dậy, uống nước)
🔁 Lặp 4 lần
🌴 Nghỉ dài 15-30 phút
\`\`\`

### Điều chỉnh cho Lab Arduino:
- **Lab ngắn (< 30 phút)**: 1 Pomodoro
- **Lab dài (> 1 tiếng)**: Chia thành 2-3 phần nhỏ

### Trong 5 phút nghỉ, KHÔNG:
❌ Lướt TikTok/Facebook (não vẫn làm việc)
❌ Kiểm tra email

### Nên:
✅ Đứng dậy, nhìn ra cửa sổ (nghỉ mắt)
✅ Uống nước, vươn vai
✅ Đi lại vài bước

## Công cụ miễn phí:
- [Pomofocus.io](https://pomofocus.io) - Timer web đẹp
- Forest App - "Trồng cây" khi tập trung

> 🎯 **Mục tiêu**: 8-10 Pomodoro/ngày = 4-5 tiếng học chất lượng cao
        `,
        readTime: '4 phút',
        featured: true,
    },

    // ==================== NÂNG CAO GPA ====================
    {
        id: 4,
        title: '5 Bước đạt điểm A môn Lập trình nhúng',
        category: 'gpa',
        icon: TrendingUp,
        color: 'green',
        content: `
## Cấu trúc điểm môn học (tham khảo):

| Thành phần | Tỷ lệ | Chiến lược |
|------------|-------|------------|
| Chuyên cần | 10% | Đi học đủ + tương tác |
| Lab | 30% | Nộp đúng hạn, code sạch |
| Giữa kỳ | 20% | Ôn Active Recall |
| Cuối kỳ | 40% | Làm đề cũ + Lab lại |

## 5 Bước cụ thể:

### Bước 1: "Eat the Frog" - Làm Lab sớm
Nộp Lab trong **48h đầu** sau khi được giao. Não còn nhớ bài giảng, code nhanh hơn.

### Bước 2: Tạo "Cheat Sheet" cá nhân
Mỗi tuần, tóm tắt **1 trang A4** những công thức, hàm quan trọng. Cuối kỳ bạn có 12 trang ôn tập.

### Bước 3: Debug = Học
Mỗi lần code lỗi, **ghi lại** lỗi đó và cách sửa. Đây là kho kiến thức quý giá nhất.

### Bước 4: Hỏi đúng cách
Thay vì "Em không hiểu", hãy hỏi:
> "Em đã thử X, kết quả là Y, em nghĩ vấn đề ở Z. Thầy/cô có thể gợi ý thêm không?"

### Bước 5: Làm đề cũ như thi thật
- Đặt timer
- Không mở tài liệu
- Chấm điểm thật

## Formula điểm A:
> **Chăm chỉ đều đặn + Phương pháp đúng = Điểm cao chắc chắn**
        `,
        readTime: '5 phút',
        featured: true,
    },
    {
        id: 5,
        title: 'Cách viết báo cáo Lab điểm cao',
        category: 'gpa',
        icon: FileText,
        color: 'purple',
        content: `
## Cấu trúc báo cáo chuẩn:

### 1. Mục tiêu (5%)
Viết ngắn gọn, rõ ràng mục tiêu của Lab.
> ✅ "Hiểu cách sử dụng PWM để điều khiển độ sáng LED"
> ❌ "Làm bài Lab tuần 4"

### 2. Cơ sở lý thuyết (15%)
- Giải thích ngắn gọn khái niệm chính
- Có hình vẽ/sơ đồ minh họa
- Trích dẫn nguồn (nếu có)

### 3. Thiết kế & Code (40%)
\`\`\`cpp
// Ghi chú RÕ RÀNG từng phần code
// Giải thích TẠI SAO, không chỉ CÁI GÌ

void setup() {
  pinMode(LED_PIN, OUTPUT); // Cấu hình chân 9 làm output
}

void loop() {
  // Dùng PWM để tăng dần độ sáng LED
  for(int i = 0; i <= 255; i++) {
    analogWrite(LED_PIN, i);
    delay(10);
  }
}
\`\`\`

### 4. Kết quả (25%)
- Ảnh/video mạch thực tế hoặc mô phỏng
- Mô tả kết quả đạt được
- So sánh với mục tiêu

### 5. Nhận xét & Mở rộng (15%)
- Khó khăn gặp phải và cách giải quyết
- Ý tưởng cải tiến/mở rộng

## Checklist trước khi nộp:
- [ ] Đã chạy code thành công
- [ ] Comment code đầy đủ
- [ ] Có hình ảnh minh họa
- [ ] Đúng format yêu cầu
- [ ] Check lỗi chính tả
        `,
        readTime: '6 phút',
        featured: false,
    },

    // ==================== SỨC KHỎE TINH THẦN ====================
    {
        id: 6,
        title: 'Vượt qua "Imposter Syndrome" - Bạn xứng đáng ở đây',
        category: 'mental',
        icon: Heart,
        color: 'pink',
        content: `
## Imposter Syndrome là gì?

Cảm giác "mình không xứng đáng", "mình lọt vào đây do may mắn", "sớm muộn mọi người sẽ biết mình kém". **70% sinh viên** từng trải qua cảm giác này.

## Dấu hiệu nhận biết:
- Sợ bị "bóc phốt" khi thuyết trình
- Nghĩ thành công là do may mắn
- Đánh giá thấp khả năng của mình
- So sánh mình với người giỏi nhất

## Sự thật:
> **Người giỏi THẬT thường có Imposter Syndrome. Người không giỏi thì không.**

Điều này gọi là hiệu ứng Dunning-Kruger.

## Cách vượt qua:

### 1. Ghi lại thành tựu
Mỗi tuần, viết ra 3 điều bạn đã làm được (dù nhỏ):
- "Đã hoàn thành Lab 3 đúng hạn"
- "Đã hiểu được PWM"
- "Đã giúp bạn debug code"

### 2. Thay đổi cách nói
| ❌ "Mình không biết gì" | ✅ "Mình đang học" |
|--------------------------|---------------------|
| "Mình ngu quá" | "Bài này khó, cần thêm thời gian" |
| "May mắn thôi" | "Mình đã cố gắng và có kết quả" |

### 3. Nói chuyện với người khác
Bạn sẽ ngạc nhiên khi biết rất nhiều bạn cùng lớp cũng có cảm giác tương tự.

## Lời nhắn:
> 🌟 **Bạn được chọn vào trường này vì bạn xứng đáng. Hãy tin vào bản thân.**
        `,
        readTime: '5 phút',
        featured: true,
    },
    {
        id: 7,
        title: 'Quản lý stress mùa thi - Bình tĩnh để đạt điểm cao',
        category: 'mental',
        icon: Smile,
        color: 'yellow',
        content: `
## Stress ảnh hưởng đến học tập như thế nào?

Khi stress, não tiết cortisol, làm:
- Giảm khả năng ghi nhớ **40%**
- Khó tập trung
- Quyết định kém
- Mất ngủ → stress thêm → vòng xoáy tiêu cực

## Kỹ thuật giảm stress nhanh:

### 1. Hít thở 4-7-8 (Calming Breath)
\`\`\`
Hít vào: 4 giây
Giữ: 7 giây
Thở ra: 8 giây
Lặp 4 lần
\`\`\`
**Hiệu quả trong 1-2 phút**, làm chậm nhịp tim, giảm cortisol.

### 2. Grounding 5-4-3-2-1
Khi lo lắng quá, hãy tìm:
- **5** thứ bạn NHÌN thấy
- **4** thứ bạn CHẠM được
- **3** thứ bạn NGHE thấy
- **2** thứ bạn NGỬI thấy
- **1** thứ bạn NẾM được

### 3. "Brain Dump" trước khi học
Viết ra giấy TẤT CẢ những gì bạn đang lo (5 phút). Não sẽ "trống" hơn để tiếp thu kiến thức.

## Lịch trình mùa thi lành mạnh:

| Thời gian | Hoạt động |
|-----------|-----------|
| 6:00-7:00 | Thức dậy, ăn sáng, KHÔNG học |
| 7:00-12:00 | Học (4-5 Pomodoro) |
| 12:00-13:30 | Ăn trưa, nghỉ ngơi |
| 13:30-17:30 | Học (4 Pomodoro) |
| 17:30-19:00 | Thể dục/đi dạo |
| 19:00-21:00 | Ôn nhẹ hoặc giải trí |
| 22:00 | NGỦ (quan trọng!) |

> ⚠️ **Thức đêm học bù = Hiệu quả giảm 60%. Ngủ đủ giấc là CHIẾN LƯỢC.**
        `,
        readTime: '6 phút',
        featured: false,
    },
    {
        id: 8,
        title: 'Xây dựng thói quen tích cực - Thay đổi từ gốc',
        category: 'mental',
        icon: Sparkles,
        color: 'indigo',
        content: `
## Tại sao thói quen quan trọng?

**40% hành động hàng ngày** là thói quen, không cần suy nghĩ. Nếu thói quen tốt → tự động thành công.

## 4 bước tạo thói quen (James Clear - Atomic Habits):

### 1. Gợi ý (Cue) - Làm nó DỄ THẤY
- Đặt sách Arduino trên bàn học
- Đặt app học trên màn hình chính điện thoại
- Dán note "Đã ôn bài chưa?" lên gương

### 2. Khao khát (Craving) - Làm nó HẤP DẪN
- Ghép với thứ bạn thích: "Học xong 1 Pomodoro = 10 phút nghe nhạc"
- Học cùng bạn bè (accountability partner)

### 3. Phản hồi (Response) - Làm nó DỄ LÀM
- Bắt đầu nhỏ: "Chỉ mở sách 5 phút"
- Chuẩn bị sẵn: Máy tính đã mở IDE, đúng bài

### 4. Phần thưởng (Reward) - Làm nó THỎA MÃN
- Đánh dấu ✅ vào lịch mỗi ngày học
- Tự thưởng sau 7 ngày liên tục

## Thói quen sinh viên top:

### Buổi sáng (5 phút)
- Viết 3 mục tiêu ngày hôm nay
- 1 điều biết ơn

### Buổi tối (5 phút)
- Review: Hôm nay học được gì?
- Chuẩn bị cho ngày mai

## Công thức:
> **Không phải bạn vươn cao đến mục tiêu. Bạn rơi xuống mức thói quen của bạn.**

Xây thói quen tốt = Thành công tự động.
        `,
        readTime: '5 phút',
        featured: false,
    },

    // ==================== TIPS & TRICKS ====================
    {
        id: 9,
        title: '10 mẹo Debug code Arduino như chuyên gia',
        category: 'tips',
        icon: Lightbulb,
        color: 'amber',
        content: `
## Nguyên tắc vàng:
> **90% bug là do những thứ đơn giản nhất.**

## 10 Mẹo Debug:

### 1. Kiểm tra nguồn điện ĐẦU TIÊN
- USB cắm chưa?
- Board có đèn LED sáng không?
- Có pin/adapter không?

### 2. Serial.print() là bạn thân nhất
\`\`\`cpp
Serial.println("Đang chạy đến đây...");
Serial.print("Giá trị x = ");
Serial.println(x);
\`\`\`

### 3. Chia nhỏ code
Code dài 50 dòng lỗi? Cắt còn 10 dòng. Chạy được? Thêm dần.

### 4. Kiểm tra chân cắm
- Đúng chân chưa? (D3 ≠ A3)
- Dây có đứt không?
- Breadboard có lỗi không?

### 5. Đọc lỗi TRONG SERIAL MONITOR
Đừng bỏ qua thông báo lỗi. Copy paste vào Google nếu không hiểu.

### 6. Comment out và bật lại
\`\`\`cpp
// Tạm tắt phần này để test
// digitalWrite(LED, HIGH);
\`\`\`

### 7. Delay giúp quan sát
\`\`\`cpp
delay(2000); // Dừng 2 giây để xem
\`\`\`

### 8. Kiểm tra logic đơn giản
\`\`\`cpp
if(sensor > 500) // Có chắc là > không? Hay phải < ?
\`\`\`

### 9. Restart Arduino IDE
Đôi khi IDE bị lỗi. Tắt mở lại giải quyết 10% vấn đề.

### 10. Hỏi ChatGPT/AI
Paste code + mô tả lỗi. AI giúp tìm nhanh hơn.

## Mindset:
> **Bug không phải kẻ thù. Debug là quá trình học.**
        `,
        readTime: '5 phút',
        featured: false,
    },
    {
        id: 10,
        title: 'Công cụ miễn phí cho sinh viên IT',
        category: 'tips',
        icon: Users,
        color: 'cyan',
        content: `
## GitHub Student Developer Pack
👉 [education.github.com/pack](https://education.github.com/pack)

Đăng ký bằng email .edu, nhận **miễn phí**:
- GitHub Pro
- JetBrains IDE (IntelliJ, PyCharm...)
- Namecheap domain 1 năm
- DigitalOcean $100 credit
- Notion Plus
- Và 100+ công cụ khác

## Học online miễn phí:

| Nền tảng | Nội dung |
|----------|----------|
| Coursera | Audit miễn phí (không cần chứng chỉ) |
| edX | Học miễn phí, trả tiền nếu cần cert |
| freeCodeCamp | Lập trình web hoàn toàn free |
| Khan Academy | Toán, Lý, Hoá cơ bản |

## Công cụ học tập:

### Ghi chú
- **Notion** - All-in-one workspace
- **Obsidian** - Ghi chú liên kết

### Flashcard
- **Anki** - Spaced repetition miễn phí
- **Quizlet** - Flashcard online

### Focus
- **Forest** - Trồng cây khi tập trung
- **Pomofocus.io** - Timer Pomodoro web

### AI hỗ trợ
- **ChatGPT** - Giải đáp thắc mắc
- **Claude** - Phân tích code dài
- **Perplexity** - Tìm kiếm + AI

## Mẹo: Đăng ký email edu
Nhiều trường cho email @edu.vn. Dùng email này để:
- Xin Student Pack
- Giảm giá Spotify, Apple Music
- Microsoft 365 Free
        `,
        readTime: '4 phút',
        featured: true,
    },
];

// Component hiển thị nội dung chi tiết
function ContentViewer({ item, onClose }: { item: typeof LIBRARY_ITEMS[0]; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className={`p-6 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{item.title}</h2>
                                <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {item.readTime}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="prose prose-teal max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-800 prose-code:text-teal-600 prose-code:bg-teal-50 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-table:text-sm prose-th:bg-gray-100 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2 prose-td:border-t">
                        <ReactMarkdown>{item.content}</ReactMarkdown>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Đã đọc xong? Áp dụng ngay hôm nay!
                    </div>
                    <Button onClick={onClose} className="bg-teal-500 hover:bg-teal-600">
                        Đóng
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Component Card cho mỗi item
function LibraryCard({ item, onClick }: { item: typeof LIBRARY_ITEMS[0]; onClick: () => void }) {
    return (
        <Card
            className="group p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 bg-white relative overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            {item.featured && (
                <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Nổi bật
                    </div>
                </div>
            )}

            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-${item.color}-50 text-${item.color}-600 border border-${item.color}-100 shrink-0`}>
                    <item.icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                        {item.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.readTime}
                        </span>
                        <Badge variant="outline" className="text-xs">
                            {LIBRARY_CATEGORIES.find(c => c.id === item.category)?.label}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <span className="text-teal-600 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Đọc ngay
                    <ChevronRight className="w-4 h-4" />
                </span>
            </div>
        </Card>
    );
}

export default function LibraryPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<typeof LIBRARY_ITEMS[0] | null>(null);

    const filteredItems = LIBRARY_ITEMS.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredItems = LIBRARY_ITEMS.filter(item => item.featured);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 text-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                            <BookMarked className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">Thư Viện Kiến Thức</h1>
                            <p className="text-teal-100 mt-1">Phương pháp học tập & Hỗ trợ tâm lý cho sinh viên</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-400 shadow-xl focus:ring-4 focus:ring-white/30 outline-none"
                            />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-8 flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-teal-200" />
                            <span><strong>{LIBRARY_ITEMS.length}</strong> bài viết chất lượng</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-teal-200" />
                            <span>Dành riêng cho sinh viên</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-teal-200" />
                            <span>Hỗ trợ toàn diện</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {LIBRARY_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${selectedCategory === cat.id
                                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Featured Section */}
                {selectedCategory === 'all' && !searchQuery && (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-teal-500" />
                            Bài viết nổi bật
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredItems.map(item => (
                                <LibraryCard
                                    key={item.id}
                                    item={item}
                                    onClick={() => setSelectedItem(item)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* All Items */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-teal-500" />
                        {selectedCategory === 'all' ? 'Tất cả bài viết' : LIBRARY_CATEGORIES.find(c => c.id === selectedCategory)?.label}
                        <span className="text-sm font-normal text-gray-400 ml-2">({filteredItems.length} bài)</span>
                    </h2>

                    {filteredItems.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map(item => (
                                <LibraryCard
                                    key={item.id}
                                    item={item}
                                    onClick={() => setSelectedItem(item)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
                            <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
                        </div>
                    )}
                </div>

                {/* Motivation Section */}
                <div className="mt-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Bạn không đơn độc trên hành trình này</h2>
                    <p className="text-purple-100 mb-6 max-w-xl mx-auto">
                        Mỗi sinh viên đều có những khó khăn riêng. Hãy nhớ rằng việc tìm kiếm sự giúp đỡ là dấu hiệu của sức mạnh, không phải yếu đuối.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button className="bg-white text-purple-600 hover:bg-purple-50 font-bold px-6">
                            <Heart className="w-4 h-4 mr-2" />
                            Đường dây hỗ trợ: 1800-599-920
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Viewer Modal */}
            {selectedItem && (
                <ContentViewer
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}
