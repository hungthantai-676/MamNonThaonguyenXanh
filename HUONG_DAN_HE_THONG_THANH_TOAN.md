# Hướng Dẫn Hệ Thống Thanh Toán Affiliate - Mầm Non Thảo Nguyên Xanh

## Tổng Quan Hệ Thống Thanh Toán

### Quy Trình Thanh Toán Mới (3 Giai Đoạn)
1. **Pending (Vàng)**: Thành viên đã có khách hàng đăng ký, chờ admin xác nhận thanh toán
2. **Confirmed (Xanh Lá)**: Admin đã xác nhận, tiền được cộng vào ví thành viên  
3. **Paid (Xanh Dương)**: Admin đã thanh toán thực tế cho thành viên, tiền bị trừ khỏi ví

### Mức Thưởng Chi Tiết
- **Giáo viên**: 2,000,000 VNĐ/học sinh + 10,000,000 VNĐ bonus mỗi 5 học sinh
- **Phụ huynh**: 2,000 điểm/học sinh + 10,000 điểm bonus mỗi 5 học sinh

## Hướng Dẫn Sử Dụng Admin Panel

### 1. Truy Cập Quản Lý Thanh Toán
- Vào **Admin** → **Affiliate** → Tab **💰 Thanh toán**
- URL: `admin_affiliate.php?action=payments`

### 2. Chức Năng Chính

#### a) Thống Kê Tổng Quan
```
📊 Thống kê nhanh:
- Chờ xác nhận: XXX,XXX VNĐ (X giao dịch)
- Đã xác nhận: XXX,XXX VNĐ (X giao dịch)  
- Đã thanh toán: XXX,XXX VNĐ (X giao dịch)
```

#### b) Bộ Lọc Thông Minh
- **Trạng thái**: Pending/Confirmed/Paid
- **Vai trò**: Giáo viên/Phụ huynh
- **Tìm kiếm**: Theo tên thành viên hoặc học sinh

#### c) Nút Xử Lý Nhanh
- **Xác nhận tất cả**: Chuyển tất cả pending → confirmed
- **Xuất báo cáo**: Download file Excel chi tiết

### 3. Quy Trình Xử Lý Từng Giao Dịch

#### Bước 1: Xác Nhận Thanh Toán (Pending → Confirmed)
```
1. Tìm giao dịch có trạng thái "Chờ thanh toán" (màu vàng)
2. Nhấn nút "✅ Xác nhận"
3. Hệ thống tự động:
   - Cộng tiền vào ví thành viên
   - Ghi log transaction
   - Thay đổi trạng thái thành "Đã xác nhận"
```

#### Bước 2: Thanh Toán Thực Tế (Confirmed → Paid)
```
1. Thực hiện chuyển khoản/thanh toán thực tế cho thành viên
2. Nhấn nút "💰 Đã thanh toán"
3. Hệ thống tự động:
   - Trừ tiền khỏi ví thành viên
   - Ghi log transaction
   - Thay đổi trạng thái thành "Đã thanh toán"
```

#### Bước 3: Xem Chi Tiết
```
Nhấn nút "👁️ Chi tiết" để xem:
- Thông tin thành viên đầy đủ
- Thông tin học sinh
- Lịch sử thanh toán
- Số dư ví hiện tại
```

### 4. Các Tính Năng Nâng Cao

#### a) Xử Lý Hàng Loạt
- **Xác nhận tất cả**: Xử lý nhiều giao dịch pending cùng lúc
- **Xuất báo cáo**: File Excel với tất cả dữ liệu thanh toán

#### b) Tìm Kiếm & Lọc
- Lọc theo trạng thái thanh toán
- Lọc theo vai trò (giáo viên/phụ huynh)
- Tìm kiếm theo tên

#### c) Theo Dõi Tài Chính
- Tổng tiền chờ xác nhận
- Tổng tiền đã xác nhận (nợ phải trả)
- Tổng tiền đã thanh toán

## Cấu Trúc Database Mới

### Bảng `referrals` (Cập nhật)
```sql
- payment_status: ENUM('pending', 'confirmed', 'paid')
- payment_confirmed_at: TIMESTAMP
- payment_completed_at: TIMESTAMP
- student_age: INT (thêm mới)
- notes: TEXT (thêm mới)
```

### Bảng `affiliate_transactions` (Mới)
```sql
- id: INT AUTO_INCREMENT PRIMARY KEY
- member_id: VARCHAR(20) - ID thành viên
- type: ENUM('credit', 'debit') - Loại giao dịch
- amount: DECIMAL(15,0) - Số tiền
- description: TEXT - Mô tả
- referral_id: INT - Liên kết đến referral
- created_at: TIMESTAMP
```

## API Endpoints Mới

### 1. Xác Nhận Thanh Toán
```
POST: ajax/affiliate_actions.php?action=confirm_payment
Data: referral_id
Response: {success: true/false, message: "..."}
```

### 2. Đánh Dấu Đã Thanh Toán
```
POST: ajax/affiliate_actions.php?action=mark_as_paid  
Data: referral_id
Response: {success: true/false, message: "..."}
```

### 3. Xác Nhận Tất Cả
```
POST: ajax/affiliate_actions.php?action=confirm_all_payments
Response: {success: true, count: X, message: "..."}
```

### 4. Lấy Chi Tiết Thanh Toán
```
GET: ajax/affiliate_actions.php?action=get_payment_details&referral_id=X
Response: {success: true, html: "..."}
```

## Workflow Hoàn Chỉnh

### Cho Admin
1. **Giám sát**: Kiểm tra tab thanh toán thường xuyên
2. **Xác nhận**: Xác nhận các giao dịch pending hợp lệ
3. **Thanh toán**: Thực hiện chuyển khoản và đánh dấu đã thanh toán
4. **Báo cáo**: Xuất báo cáo định kỳ cho kế toán

### Cho Thành Viên  
1. **Giới thiệu**: Thành viên giới thiệu học sinh mới
2. **Chờ xác nhận**: Trạng thái pending, chờ admin xử lý
3. **Nhận tiền ảo**: Admin xác nhận, tiền vào ví
4. **Nhận tiền thật**: Admin thanh toán thực tế

## Bảo Mật & Kiểm Soát

### Logs Tự Động
- Mọi thay đổi được ghi log vào `affiliate_transactions`
- Timestamp chính xác cho mỗi bước
- Truy vết đầy đủ lịch sử giao dịch

### Kiểm Soát Quyền
- Chỉ admin mới được xác nhận/thanh toán
- Thành viên chỉ xem được ví của mình
- Session timeout tự động

### Backup & Recovery
- Database backup tự động
- File backup: `WEBSITE-BACKUP-PAYMENT-SYSTEM-20250726_034632.tar.gz`
- Khôi phục nhanh khi cần thiết

## Troubleshooting

### Lỗi Thường Gặp
1. **Không tìm thấy referral_id**: Kiểm tra URL và database
2. **Cộng tiền thất bại**: Kiểm tra ràng buộc database
3. **Session timeout**: Đăng nhập lại admin

### Khắc Phục Nhanh
1. **Reset trạng thái**: Sửa trực tiếp trong database nếu cần
2. **Thêm transaction thủ công**: Dùng SQL insert
3. **Rollback giao dịch**: Backup database có sẵn

---

**Lưu ý**: Hệ thống này đảm bảo minh bạch, chính xác và dễ kiểm soát cho việc quản lý thanh toán affiliate của trường mầm non.