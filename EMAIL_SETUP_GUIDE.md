# 📧 Hướng dẫn thiết lập Email tự động cho hệ thống thông báo

## 🎯 Mục tiêu
Thiết lập email tự động để nhận thông báo khi phụ huynh đăng ký dịch vụ tư vấn

## 🔧 Cách thiết lập Gmail App Password

### Bước 1: Kích hoạt 2-Step Verification
1. Truy cập: https://myaccount.google.com/security
2. Đăng nhập bằng tài khoản `mamnonthaonguyenxanh@gmail.com`
3. Tìm phần "2-Step Verification" và kích hoạt

### Bước 2: Tạo App Password
1. Sau khi kích hoạt 2-Step Verification, quay lại trang Security
2. Tìm "App passwords" (Mật khẩu ứng dụng)
3. Nhấn "Generate" để tạo mật khẩu mới
4. Chọn "Mail" và "Computer"
5. Nhấn "Generate" và sao chép mật khẩu được tạo (dạng: xxxx xxxx xxxx xxxx)

### Bước 3: Cấu hình trên Replit
1. Vào Replit project của bạn
2. Nhấn vào tab "Secrets" (biểu tượng chìa khóa)
3. Thêm 2 secrets sau:
   - `EMAIL_USER`: `mamnonthaonguyenxanh@gmail.com`
   - `EMAIL_APP_PASSWORD`: `mật khẩu app vừa tạo`

### Bước 4: Test hệ thống
1. Vào Admin Dashboard → tab "Đăng ký DV"
2. Nhấn nút "📧 Test Email"
3. Kiểm tra email `mamnonthaonguyenxanh@gmail.com`

## 📋 Định dạng email sẽ được gửi

```
Tiêu đề: 🔔 Đăng ký dịch vụ mới: [Tên dịch vụ]

Nội dung:
- Tên phụ huynh: [Tên]
- Số điện thoại: [SĐT]
- Email: [Email]
- Dịch vụ: [Loại dịch vụ]
- Thời gian mong muốn: [Thời gian]
- Thời gian đăng ký: [Ngày giờ]
- Ghi chú: [Nội dung ghi chú]
```

## 🔄 Hệ thống hoạt động như thế nào?

1. **Phụ huynh đăng ký dịch vụ** → Trên website
2. **Hệ thống gửi email tự động** → Về Gmail của trường
3. **Giáo viên nhận thông báo** → Liên hệ phụ huynh trong 24h
4. **Cập nhật trạng thái** → Trong admin dashboard

## 🧪 Test nhanh
- Trang "Phụ huynh" có nút "🧪 Test Tư vấn tâm lý" và "🧪 Test Tư vấn dinh dưỡng"
- Admin Dashboard có nút "📧 Test Email"
- Mỗi test sẽ gửi email thật về Gmail của trường

## ⚡ Lợi ích
- ✅ Không cần đăng ký dịch vụ bên ngoài
- ✅ Sử dụng Gmail hiện tại của trường
- ✅ Thông báo tức thì khi có đăng ký
- ✅ Email được thiết kế đẹp, dễ đọc
- ✅ Bao gồm tất cả thông tin cần thiết

## 🔐 Bảo mật
- App Password chỉ dành cho ứng dụng này
- Có thể thu hồi bất cứ lúc nào
- Không ảnh hưởng đến mật khẩu Gmail chính