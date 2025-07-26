// Simple Chatbot for Mầm Non Thảo Nguyên Xanh

class SimpleChatbot {
    constructor() {
        this.isOpen = false;
        this.responses = this.initResponses();
        this.init();
    }

    init() {
        this.bindEvents();
        this.addWelcomeMessage();
    }

    bindEvents() {
        const toggleBtn = document.getElementById('chatbot-toggle');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const chatbot = document.getElementById('chatbot');
        const toggleBtn = document.getElementById('chatbot-toggle');
        
        if (chatbot && toggleBtn) {
            chatbot.style.display = 'flex';
            toggleBtn.style.display = 'none';
            this.isOpen = true;
        }
    }

    close() {
        const chatbot = document.getElementById('chatbot');
        const toggleBtn = document.getElementById('chatbot-toggle');
        
        if (chatbot && toggleBtn) {
            chatbot.style.display = 'none';
            toggleBtn.style.display = 'flex';
            this.isOpen = false;
        }
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (message) {
            this.addMessage(message, 'user');
            input.value = '';

            // Simulate typing delay
            setTimeout(() => {
                const response = this.getResponse(message);
                this.addMessage(response, 'bot');
            }, 500);
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('Xin chào! Tôi là trợ lý ảo của Mầm Non Thảo Nguyên Xanh. Tôi có thể giúp bạn tìm hiểu về trường và chương trình học. Bạn cần hỗ trợ gì?', 'bot');
        }, 1000);
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Tìm phản hồi phù hợp
        for (const [keywords, response] of Object.entries(this.responses)) {
            const keywordList = keywords.split('|');
            if (keywordList.some(keyword => lowerMessage.includes(keyword))) {
                return Array.isArray(response) ? 
                    response[Math.floor(Math.random() * response.length)] : 
                    response;
            }
        }

        // Phản hồi mặc định
        return this.responses.default[Math.floor(Math.random() * this.responses.default.length)];
    }

    initResponses() {
        return {
            'xin chào|chào|hello|hi': [
                'Xin chào! Rất vui được hỗ trợ bạn. Bạn muốn tìm hiểu gì về trường chúng tôi?',
                'Chào bạn! Tôi có thể giúp bạn tìm hiểu về chương trình học, học phí, hoặc thủ tục đăng ký.',
                'Hello! Chào mừng bạn đến với Mầm Non Thảo Nguyên Xanh. Tôi có thể hỗ trợ gì cho bạn?'
            ],

            'học phí|chi phí|giá|phí|tiền': [
                'Học phí của trường là 4.000.000 VNĐ/tháng cho tất cả các lớp. Học phí đã bao gồm ăn trưa, ăn xế và các hoạt động ngoại khóa.',
                'Mức học phí hiện tại là 4.000.000 đồng/tháng. Đây là mức phí cạnh tranh với chất lượng giáo dục cao.',
                'Chi phí học tập là 4 triệu đồng mỗi tháng, bao gồm đầy đủ các dịch vụ chăm sóc và giáo dục cho bé.'
            ],

            'chương trình|học gì|dạy gì|môn học': [
                'Chúng tôi có 3 chương trình chính: Lớp Chồi (2-3 tuổi), Lớp Mẫu Giáo Nhỏ (3-4 tuổi), và Lớp Mẫu Giáo Lớn (4-5 tuổi). Mỗi chương trình được thiết kế phù hợp với độ tuổi.',
                'Trường áp dụng phương pháp giáo dục hiện đại, tập trung phát triển toàn diện: thể chất, trí tuệ, cảm xúc và kỹ năng xã hội.',
                'Chương trình học bao gồm: toán tư duy, đọc viết, tiếng Anh, vẽ, nhạc, thể dục và các hoạt động vui chơi sáng tạo.'
            ],

            'đăng ký|tuyển sinh|nhập học|ghi danh': [
                'Để đăng ký, bạn có thể điền form trực tuyến trên website hoặc đến trường trực tiếp. Chúng tôi sẽ tư vấn chi tiết về thủ tục và hồ sơ cần thiết.',
                'Quy trình đăng ký rất đơn giản: điền form → nộp hồ sơ → phỏng vấn tìm hiểu bé → nhập học. Chúng tôi nhận học sinh quanh năm.',
                'Bạn có thể đăng ký ngay tại trang Tuyển Sinh trên website hoặc gọi điện 0912 345 678 để được hỗ trợ.'
            ],

            'giờ học|thời gian|mở cửa': [
                'Giờ học của trường: Thứ 2 - Thứ 6: 7:00 - 17:00, Thứ 7: 7:00 - 11:00. Chủ nhật nghỉ.',
                'Trường mở cửa từ 7h sáng đến 5h chiều các ngày trong tuần, thứ 7 học đến 11h.',
                'Lịch học linh hoạt: ca sáng (7:00-11:00), ca chiều (13:00-17:00), hoặc cả ngày (7:00-17:00).'
            ],

            'địa chỉ|ở đâu|đường': [
                'Địa chỉ: 123 Đường Hoa Sữa, Phường Linh Tây, TP. Thủ Đức, TP.HCM. Gần các tuyến xe buýt chính, thuận tiện đi lại.',
                'Trường tọa lạc tại Thủ Đức, giao thông thuận lợi, môi trường an toàn và yên tĩnh phù hợp cho trẻ học tập.',
                'Chúng tôi ở Phường Linh Tây, Thủ Đức. Khu vực xanh, sạch, an toàn với sân chơi rộng rãi.'
            ],

            'liên hệ|số điện thoại|phone|gọi': [
                'Số điện thoại: 0912 345 678 (Giờ hành chính). Email: info@mamnonthaonguyenxanh.com',
                'Bạn có thể gọi 0912 345 678 để được tư vấn trực tiếp, hoặc nhắn tin qua Facebook fanpage.',
                'Liên hệ: 0912 345 678 hoặc ghé thăm trường trong giờ hành chính để tham quan và tư vấn.'
            ],

            'giáo viên|cô giáo|thầy': [
                'Đội ngũ giáo viên đều có bằng cấp chuyên ngành, kinh nghiệm nhiều năm và tâm huyết với nghề. Tất cả đều được đào tạo về tâm lý trẻ em.',
                'Các cô giáo tận tâm, yêu trẻ, thường xuyên cập nhật phương pháp giáo dục mới để mang lại hiệu quả tốt nhất.',
                'Giáo viên được tuyển chọn kỹ lưỡng, có trình độ chuyên môn cao và tinh thần trách nhiệm với từng em nhỏ.'
            ],

            'cơ sở vật chất|phòng học|sân chơi': [
                'Trường có cơ sở vật chất hiện đại: phòng học máy lạnh, sân chơi an toàn, phòng ăn, phòng y tế, khu vệ sinh sạch sẽ.',
                'Không gian học tập rộng rãi, thoáng mát với các thiết bị giáo dục tiên tiến, đảm bảo an toàn tuyệt đối cho trẻ.',
                'Sân chơi ngoài trời với cỏ nhân tạo, các thiết bị vui chơi an toàn, khu vực học tập trong nhà hiện đại.'
            ],

            'ăn uống|bữa ăn|dinh dưỡng': [
                'Thực đơn đa dạng, cân bằng dinh dưỡng theo từng độ tuổi. Thực phẩm tươi sạch, được kiểm soát nguồn gốc.',
                'Có 3 bữa: sáng, trưa, xế. Menu do chuyên gia dinh dưỡng thiết kế, phù hợp với sự phát triển của trẻ.',
                'Bếp ăn đạt chuẩn vệ sinh an toàn thực phẩm, thực đơn xoay 4 tuần với các món ăn bổ dưỡng.'
            ],

            'an toàn|bảo mật|camera': [
                'Hệ thống camera giám sát 24/7, thẻ từ ra vào, bảo vệ chuyên nghiệp. Phụ huynh có thể theo dõi con qua app.',
                'An ninh được đảm bảo tuyệt đối với hệ thống khóa điện tử, camera, và quy trình đón trả trẻ nghiêm ngặt.',
                'Trường ưu tiên an toàn hàng đầu: cổng khóa tự động, nhân viên bảo vệ, camera giám sát toàn bộ khuôn viên.'
            ],

            'hoạt động|ngoại khóa|sự kiện': [
                'Có nhiều hoạt động thú vị: ngày hội trung thu, dã ngoại, biểu diễn văn nghệ, học nấu ăn, trồng cây...',
                'Các hoạt động ngoại khóa phong phú giúp trẻ phát triển toàn diện: thể thao, âm nhạc, hội họa, kể chuyện.',
                'Thường xuyên tổ chức các sự kiện giáo dục ý nghĩa để trẻ học hỏi và vui chơi trong môi trường tích cực.'
            ],

            'có tốt không|chất lượng|đánh giá': [
                'Trường được nhiều phụ huynh tin tưởng với đội ngũ chuyên nghiệp, chương trình hiện đại và môi trường an toàn.',
                'Chúng tôi tự hào về chất lượng giáo dục với phương pháp tiên tiến, giúp trẻ phát triển toàn diện và tự tin.',
                'Với 100% phụ huynh hài lòng, trường luôn cải tiến để mang đến dịch vụ giáo dục tốt nhất cho trẻ.'
            ],

            'default': [
                'Cảm ơn bạn đã quan tâm! Tôi có thể tư vấn về học phí, chương trình học, đăng ký, địa chỉ trường. Bạn muốn hỏi gì cụ thể?',
                'Xin lỗi, tôi chưa hiểu rõ câu hỏi. Bạn có thể hỏi về: học phí, chương trình học, thủ tục đăng ký, giờ học, địa chỉ...',
                'Để được hỗ trợ tốt nhất, bạn có thể gọi 0912 345 678 hoặc hỏi tôi về các thông tin cơ bản của trường.',
                'Tôi có thể giúp bạn tìm hiểu về trường. Hãy hỏi tôi về học phí, chương trình, đăng ký, hoặc bất cứ điều gì bạn quan tâm!'
            ]
        };
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new SimpleChatbot();
});

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
    .message {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .chatbot-container {
        animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);