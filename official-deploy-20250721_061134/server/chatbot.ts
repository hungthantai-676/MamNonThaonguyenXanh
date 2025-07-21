interface ChatbotKnowledge {
  tuitionFees: {
    [key: string]: string;
  };
  programs: {
    [key: string]: string;
  };
  admissions: {
    [key: string]: string;
  };
  contact: {
    [key: string]: string;
  };
  activities: {
    [key: string]: string;
  };
  general: {
    [key: string]: string;
  };
}

const knowledgeBase: ChatbotKnowledge = {
  tuitionFees: {
    "học phí": "Học phí các lớp tại Mầm Non Thảo Nguyên Xanh:\n\n• Nhóm trẻ (18-24 tháng): 4,000,000 VNĐ/tháng\n• Lớp Mẫu giáo nhỏ (2-3 tuổi): 4,000,000 VNĐ/tháng\n• Lớp Mẫu giáo lớn (4-5 tuổi): 4,000,000 VNĐ/tháng\n• Lớp Chồi (5-6 tuổi): 4,000,000 VNĐ/tháng\n\nHọc phí đã bao gồm:\n✓ Ăn uống 3 bữa/ngày\n✓ Học liệu và đồ dùng học tập\n✓ Hoạt động ngoại khóa\n✓ Khám sức khỏe định kỳ",
    "phí": "Học phí các lớp tại Mầm Non Thảo Nguyên Xanh:\n\n• Nhóm trẻ (18-24 tháng): 4,000,000 VNĐ/tháng\n• Lớp Mẫu giáo nhỏ (2-3 tuổi): 4,000,000 VNĐ/tháng\n• Lớp Mẫu giáo lớn (4-5 tuổi): 4,000,000 VNĐ/tháng\n• Lớp Chồi (5-6 tuổi): 4,000,000 VNĐ/tháng\n\nHọc phí đã bao gồm:\n✓ Ăn uống 3 bữa/ngày\n✓ Học liệu và đồ dùng học tập\n✓ Hoạt động ngoại khóa\n✓ Khám sức khỏe định kỳ",
    "tiền học": "Học phí thống nhất cho tất cả các lớp là 4,000,000 VNĐ/tháng. Học phí bao gồm đầy đủ các dịch vụ: ăn uống, học liệu, hoạt động ngoại khóa và chăm sóc sức khỏe.",
  },
  programs: {
    "chương trình": "Chương trình học tại Mầm Non Thảo Nguyên Xanh:\n\n🌱 **Nhóm trẻ (18-24 tháng)**\n• Phát triển vận động cơ bản\n• Khám phá giác quan\n• Học nói và giao tiếp đơn giản\n\n🌿 **Lớp Mẫu giáo nhỏ (2-3 tuổi)**\n• Phát triển ngôn ngữ\n• Kỹ năng sống cơ bản\n• Hoạt động vui chơi sáng tạo\n\n🌳 **Lớp Mẫu giáo lớn (4-5 tuổi)**\n• Chuẩn bị kiến thức tiền tiểu học\n• Phát triển tư duy logic\n• Hoạt động nhóm và kỹ năng xã hội\n\n🌲 **Lớp Chồi (5-6 tuổi)**\n• Làm quen với chữ và số\n• Phát triển khả năng tư duy\n• Chuẩn bị cho bậc tiểu học",
    "học": "Chương trình học được thiết kế theo từng độ tuổi, tập trung vào phát triển toàn diện trẻ em qua các hoạt động vui chơi, học tập và rèn luyện kỹ năng sống.",
    "lớp": "Chúng tôi có 4 lớp học theo từng độ tuổi: Nhóm trẻ (18-24 tháng), Mẫu giáo nhỏ (2-3 tuổi), Mẫu giáo lớn (4-5 tuổi) và Lớp Chồi (5-6 tuổi).",
  },
  admissions: {
    "tuyển sinh": "Tuyển sinh năm học 2024-2025:\n\n📅 **Thời gian:**\n• Đăng ký: Từ 1/3/2024 đến 31/7/2024\n• Nhập học: Tháng 8/2024\n\n📋 **Thủ tục:**\n1. Nộp hồ sơ đăng ký\n2. Khám sức khỏe tại bệnh viện\n3. Phỏng vấn phụ huynh và trẻ\n4. Thông báo kết quả\n5. Hoàn thiện thủ tục nhập học\n\n📄 **Hồ sơ cần thiết:**\n• Đơn xin nhập học\n• Giấy khai sinh (bản sao)\n• Giấy chứng nhận tiêm chủng\n• Giấy khám sức khỏe\n• 4 ảnh 3x4 của trẻ\n• Sổ hộ khẩu (bản sao)",
    "nhập học": "Thủ tục nhập học gồm 5 bước: Nộp hồ sơ → Khám sức khỏe → Phỏng vấn → Thông báo kết quả → Hoàn thiện thủ tục. Liên hệ 0856318686 để được hướng dẫn chi tiết.",
    "đăng ký": "Đăng ký tuyển sinh từ 1/3/2024 đến 31/7/2024. Bạn có thể đăng ký trực tiếp tại trường hoặc gọi hotline 0856318686 để được hỗ trợ.",
  },
  contact: {
    "liên hệ": "Thông tin liên hệ Mầm Non Thảo Nguyên Xanh:\n\n📍 **Địa chỉ:** Toà nhà Thảo Nguyên Xanh, đường Lý Thái Tổ, tổ 4, phường Phù Vân, tỉnh Ninh Bình\n\n📞 **Hotline:** 0856318686\n\n📧 **Email:** mamnonthaonguyenxanh@gmail.com\n\n🕒 **Giờ làm việc:**\n• Thứ 2 - Thứ 6: 7:00 - 17:00\n• Thứ 7: 8:00 - 12:00\n• Chủ nhật: Nghỉ",
    "địa chỉ": "Địa chỉ: Toà nhà Thảo Nguyên Xanh, đường Lý Thái Tổ, tổ 4, phường Phù Vân, tỉnh Ninh Bình",
    "điện thoại": "Hotline: 0856318686 (có thể gọi trong giờ hành chính)",
    "email": "Email: mamnonthaonguyenxanh@gmail.com",
    "giờ làm việc": "Thứ 2-6: 7:00-17:00, Thứ 7: 8:00-12:00, Chủ nhật: Nghỉ",
  },
  activities: {
    "hoạt động": "Hoạt động tại Mầm Non Thảo Nguyên Xanh:\n\n🎭 **Hoạt động thường xuyên:**\n• Ngày hội Trung Thu\n• Lễ hội Tết Nguyên Đán\n• Ngày hội Thiếu nhi 1/6\n• Ngày hội Thể thao\n• Sinh nhật tập thể hàng tháng\n\n🎨 **Hoạt động học tập:**\n• Múa hát, kể chuyện\n• Vẽ tranh, làm đồ chơi\n• Trò chơi vận động\n• Học tiếng Anh qua bài hát\n• Khám phá thiên nhiên\n\n🏃 **Hoạt động ngoại khóa:**\n• Tham quan bảo tàng\n• Picnic cuối tuần\n• Học bơi (mùa hè)\n• Trại hè",
    "ngoại khóa": "Hoạt động ngoại khóa đa dạng: tham quan, picnic, học bơi, trại hè và các lễ hội trong năm như Trung Thu, Tết, Thiếu nhi.",
    "lễ hội": "Các lễ hội trong năm: Ngày hội Trung Thu, Lễ hội Tết Nguyên Đán, Ngày hội Thiếu nhi 1/6, Ngày hội Thể thao và sinh nhật tập thể hàng tháng.",
  },
  general: {
    "giới thiệu": "Mầm Non Thảo Nguyên Xanh là ngôi trường mầm non uy tín tại Ninh Bình, cam kết mang đến môi trường giáo dục chất lượng cao với phương châm \"Giáo dục bằng trái tim\". Chúng tôi tập trung phát triển toàn diện trẻ em qua các hoạt động học tập, vui chơi và rèn luyện kỹ năng sống.",
    "về chúng tôi": "Mầm Non Thảo Nguyên Xanh - Nơi nuôi dưỡng tương lai với tình yêu thương và sự chuyên nghiệp. Đội ngũ giáo viên tận tâm, cơ sở vật chất hiện đại, chương trình học phù hợp với từng độ tuổi.",
    "tầm nhìn": "Tầm nhìn: Trở thành ngôi trường mầm non hàng đầu tại Ninh Bình, góp phần xây dựng thế hệ trẻ em Việt Nam phát triển toàn diện, có nhân cách và năng lực trong tương lai.",
    "sứ mệnh": "Sứ mệnh: Cung cấp môi trường giáo dục chất lượng, an toàn và yêu thương, giúp trẻ em phát triển toàn diện về thể chất, trí tuệ, cảm xúc và xã hội.",
  },
};

export class ChatbotService {
  static generateResponse(userMessage: string): string {
    const normalizedMessage = userMessage.toLowerCase().trim();
    
    // Search through knowledge base
    for (const [category, items] of Object.entries(knowledgeBase)) {
      for (const [keyword, response] of Object.entries(items)) {
        if (normalizedMessage.includes(keyword)) {
          return response;
        }
      }
    }

    // Handle greetings
    if (normalizedMessage.includes("xin chào") || normalizedMessage.includes("chào") || normalizedMessage.includes("hello")) {
      return "Xin chào! Tôi là trợ lý AI của Mầm Non Thảo Nguyên Xanh. Tôi có thể giúp bạn tư vấn về:\n\n• Học phí và chương trình học\n• Thủ tục tuyển sinh\n• Thông tin liên hệ\n• Hoạt động của trường\n\nBạn muốn biết thông tin gì ạ?";
    }

    // Handle thanks
    if (normalizedMessage.includes("cảm ơn") || normalizedMessage.includes("cám ơn") || normalizedMessage.includes("thanks")) {
      return "Rất vui được hỗ trợ bạn! Nếu có thêm câu hỏi nào khác về Mầm Non Thảo Nguyên Xanh, đừng ngần ngại hỏi tôi nhé. Bạn cũng có thể liên hệ trực tiếp qua hotline: 0856318686 🌟";
    }

    // Handle specific questions about age groups
    if (normalizedMessage.includes("tuổi") || normalizedMessage.includes("độ tuổi")) {
      return "Mầm Non Thảo Nguyên Xanh nhận trẻ từ 18 tháng đến 6 tuổi:\n\n• **Nhóm trẻ:** 18-24 tháng\n• **Mẫu giáo nhỏ:** 2-3 tuổi\n• **Mẫu giáo lớn:** 4-5 tuổi\n• **Lớp Chồi:** 5-6 tuổi\n\nMỗi lớp có chương trình học phù hợp với sự phát triển của trẻ ở từng độ tuổi. Bạn muốn biết thêm về chương trình học của lớp nào không?";
    }

    // Handle questions about teachers
    if (normalizedMessage.includes("giáo viên") || normalizedMessage.includes("cô giáo")) {
      return "Đội ngũ giáo viên tại Mầm Non Thảo Nguyên Xanh:\n\n✅ **Trình độ chuyên môn cao**\n• Tốt nghiệp các trường Sư phạm uy tín\n• Có chứng chỉ dạy học mầm non\n• Thường xuyên tham gia các khóa đào tạo\n\n✅ **Tận tâm với nghề**\n• Yêu thương và hiểu biết tâm lý trẻ em\n• Kinh nghiệm giảng dạy nhiều năm\n• Luôn sáng tạo trong phương pháp dạy học\n\nTỉ lệ giáo viên/trẻ em được duy trì hợp lý để đảm bảo chất lượng chăm sóc tốt nhất.";
    }

    // Handle questions about facilities
    if (normalizedMessage.includes("cơ sở") || normalizedMessage.includes("phòng học") || normalizedMessage.includes("trang thiết bị")) {
      return "Cơ sở vật chất tại Mầm Non Thảo Nguyên Xanh:\n\n🏢 **Toà nhà hiện đại**\n• Thiết kế an toàn, thân thiện với trẻ em\n• Hệ thống thông gió tự nhiên\n• Ánh sáng đầy đủ, không gian thoáng mát\n\n🎪 **Khu vui chơi**\n• Sân chơi ngoài trời an toàn\n• Đồ chơi phù hợp với từng độ tuổi\n• Khu vườn xanh cho trẻ khám phá\n\n🍽️ **Phòng ăn và bếp**\n• Bếp đạt tiêu chuẩn vệ sinh an toàn thực phẩm\n• Thực đơn dinh dưỡng, đa dạng\n• Phòng ăn sạch sẽ, thoáng mát";
    }

    // Handle questions about meals
    if (normalizedMessage.includes("ăn uống") || normalizedMessage.includes("bữa ăn") || normalizedMessage.includes("thực đơn")) {
      return "Chế độ ăn uống tại Mầm Non Thảo Nguyên Xanh:\n\n🍽️ **3 bữa ăn/ngày:**\n• Bữa sáng: 8:00 - 8:30\n• Bữa trưa: 11:30 - 12:00\n• Bữa phụ: 15:00 - 15:30\n\n🥗 **Thực đơn dinh dưỡng:**\n• Được chuyên gia dinh dưỡng tư vấn\n• Đa dạng, cân bằng các nhóm chất\n• Ưu tiên thực phẩm tươi sống, sạch\n• Thay đổi hàng tuần, không lặp lại\n\n✅ **Đảm bảo an toàn:**\n• Nguồn gốc thực phẩm rõ ràng\n• Bếp đạt tiêu chuẩn vệ sinh\n• Phù hợp với trẻ em từng độ tuổi";
    }

    // Default response
    return "Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi tôi về:\n\n• 💰 Học phí các lớp\n• 📚 Chương trình học\n• 📝 Thủ tục tuyển sinh\n• 📞 Thông tin liên hệ\n• 🎭 Hoạt động của trường\n• 👩‍🏫 Đội ngũ giáo viên\n• 🏢 Cơ sở vật chất\n• 🍽️ Chế độ ăn uống\n\nHoặc bạn có thể liên hệ trực tiếp qua hotline: 0856318686 để được tư vấn chi tiết hơn!";
  }

  static getQuickReplies(): string[] {
    return [
      "Học phí các lớp như thế nào?",
      "Thủ tục tuyển sinh năm học 2024-2025",
      "Chương trình học có gì đặc biệt?",
      "Thông tin liên hệ trường",
      "Hoạt động ngoại khóa",
      "Cơ sở vật chất của trường",
      "Chế độ ăn uống cho trẻ",
      "Đội ngũ giáo viên như thế nào?",
    ];
  }
}