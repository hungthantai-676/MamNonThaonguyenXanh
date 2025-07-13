# 📧 HƯỚNG DẪN CHI TIẾT THIẾT LẬP EMAIL TỰ ĐỘNG

## 🎯 Mục đích: Nhận email tự động khi phụ huynh đăng ký dịch vụ

---

## 🔐 BƯỚC 1: BẬT 2-STEP VERIFICATION

### 1.1 Truy cập Gmail Security
- Mở trình duyệt, đăng nhập Gmail: **mamnonthaonguyenxanh@gmail.com**
- Truy cập: **https://myaccount.google.com/security**
- Hoặc: Gmail → Ảnh đại diện → "Manage your Google Account" → "Security"

### 1.2 Tìm và bật 2-Step Verification
- Cuộn xuống tìm mục "2-Step Verification"
- Nhấn vào "2-Step Verification"
- Nhấn "Get Started" (Bắt đầu)
- Làm theo hướng dẫn để xác thực số điện thoại

---

## 🔑 BƯỚC 2: TẠO APP PASSWORD

### 2.1 Tìm App passwords
- Sau khi bật 2-Step Verification xong
- Quay lại trang Security: **https://myaccount.google.com/security**
- Tìm mục "App passwords" (Mật khẩu ứng dụng)
- Nhấn vào "App passwords"

### 2.2 Tạo mật khẩu mới
- Nhấn "Generate" hoặc "Tạo mật khẩu mới"
- Chọn app: **Mail**
- Chọn device: **Computer**
- Nhấn "Generate"
- Sao chép mật khẩu 16 ký tự (dạng: **abcd efgh ijkl mnop**)

---

## 🔧 BƯỚC 3: CẤU HÌNH REPLIT SECRETS

### 3.1 Vào Replit Secrets
- Trong project Replit này
- Nhấn tab "Secrets" (biểu tượng chìa khóa 🔑)
- Hoặc nhấn vào "Tools" → "Secrets"

### 3.2 Thêm 2 secrets sau:

**Secret 1:**
- Key: `EMAIL_USER`
- Value: `mamnonthaonguyenxanh@gmail.com`
- Nhấn "Add secret"

**Secret 2:**
- Key: `EMAIL_APP_PASSWORD`
- Value: `[mật khẩu 16 ký tự vừa tạo]`
- Nhấn "Add secret"

---

## 🧪 BƯỚC 4: TEST HỆ THỐNG

### 4.1 Test trong Admin Dashboard
- Vào Admin Dashboard → tab "Đăng ký DV"
- Nhấn nút "📧 Test Email"
- Nếu thành công sẽ hiện thông báo "Email test đã được gửi"

### 4.2 Kiểm tra email
- Mở Gmail: **mamnonthaonguyenxanh@gmail.com**
- Tìm email với tiêu đề: "🧪 Email Test Thành Công!"
- Nếu có email này = đã thành công

---

## ✅ SAU KHI THIẾT LẬP XONG

### Tự động nhận email khi:
- Phụ huynh đăng ký dịch vụ tư vấn
- Email sẽ chứa đầy đủ thông tin:
  - Tên, số điện thoại, email phụ huynh
  - Loại dịch vụ đăng ký
  - Thời gian mong muốn
  - Ghi chú chi tiết

### Format email nhận được:
```
Tiêu đề: 🔔 Đăng ký dịch vụ mới: Tư vấn tâm lý

Nội dung:
- Phụ huynh: Nguyễn Thị Hoa
- Số điện thoại: 0987654321
- Email: nguyenhoa@gmail.com
- Dịch vụ: Tư vấn tâm lý
- Thời gian: 14:00 - 15:00
- Ghi chú: Con tôi 4 tuổi, hay khóc, không chịu đi học...
```

---

## 🆘 NẾU GẶP LỖI

### Lỗi "2-Step Verification chưa bật"
- Phải bật 2-Step Verification trước
- Không thể tạo App Password khi chưa bật

### Lỗi "App passwords không tìm thấy"
- Đảm bảo đã bật 2-Step Verification
- Đợi 5-10 phút rồi thử lại

### Lỗi "Authentication failed"
- Kiểm tra lại EMAIL_APP_PASSWORD
- Đảm bảo sao chép đúng 16 ký tự
- Không sử dụng mật khẩu Gmail thường

### Lỗi "Test email failed"
- Kiểm tra cả 2 secrets: EMAIL_USER và EMAIL_APP_PASSWORD
- Restart project (Stop → Run)
- Thử lại nút "📧 Test Email"

---

## 🎉 HOÀN THÀNH!

Sau khi thiết lập xong, hệ thống sẽ:
- ✅ Tự động gửi email khi có đăng ký dịch vụ
- ✅ Email được gửi ngay lập tức
- ✅ Chứa đầy đủ thông tin để liên hệ phụ huynh
- ✅ Giúp giáo viên phản hồi nhanh chóng

**Lưu ý:** Mật khẩu ứng dụng này chỉ dùng cho website, không ảnh hưởng đến mật khẩu Gmail chính của bạn.