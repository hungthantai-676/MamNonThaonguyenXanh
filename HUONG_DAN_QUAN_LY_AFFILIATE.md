# 🎯 HƯỚNG DẪN QUẢN LÝ HỆ THỐNG AFFILIATE

## 📋 Tổng quan hệ thống

### 🌟 Tính năng chính đã hoàn thành:
- ✅ **Đăng ký/Đăng nhập thành viên** với phân quyền bảo mật
- ✅ **2 loại thành viên**: Giáo viên (TCH001-999) và Phụ huynh (PAR001-999)
- ✅ **Dashboard quản lý** với thống kê và báo cáo chi tiết
- ✅ **Hệ thống ví điện tử** với QR code và Web3 wallet
- ✅ **Tracking khách hàng** với 3 trạng thái màu (vàng-xanh-xanh dương)
- ✅ **Tính toán hoa hồng tự động** (2M VND/giới thiệu + 10M VND mỗi 5 người)
- ✅ **Cây phả hệ genealogy** hiển thị mạng lưới giới thiệu
- ✅ **Admin panel quản lý** với 8 module chuyên biệt

---

## 🎯 CÁCH SỬ DỤNG HIỆU QUẢ CHO QUẢN LÝ

### 1. **📊 Theo dõi hiệu suất**

#### Truy cập Admin Affiliate:
```
URL: /admin/affiliate
Username: admin
Password: admin123
```

#### Modules quan trọng nhất:
- **📈 Tổng quan**: Xem số liệu tổng thể
- **🎯 Conversions**: Theo dõi khách hàng tiềm năng
- **👥 Thành viên**: Quản lý affiliate agents
- **💰 Thanh toán**: Xử lý hoa hồng và rút tiền

### 2. **🎯 Quản lý khách hàng conversion**

#### Hệ thống 3 màu:
- 🟡 **VÀNG (Pending)**: Khách hàng mới, chưa xác nhận
- 🟢 **XANH (Confirmed)**: Đã xác nhận đăng ký, chờ thanh toán
- 🔵 **XANH DƯƠNG (Paid)**: Đã thanh toán, hoàn tất

#### Quy trình xử lý:
1. **Tiếp nhận lead** → Tạo bản ghi với trạng thái VÀNG
2. **Xác nhận đăng ký** → Chuyển sang XANH (có hoa hồng)
3. **Thu học phí** → Chuyển sang XANH DƯƠNG (thanh toán hoa hồng)

### 3. **💰 Quản lý hoa hồng**

#### Cơ chế tính hoa hồng:
- **Giáo viên**: 2,000,000 VNĐ/khách + 10,000,000 VNĐ mỗi 5 khách
- **Phụ huynh**: 2,000 điểm/khách + 10,000 điểm mỗi 5 khách

#### Thanh toán hoa hồng:
1. Vào **Module Thanh toán**
2. Xem danh sách **"Chờ thanh toán"**
3. Click **"Thanh toán"** → Chuyển từ XANH → XANH DƯƠNG
4. Hệ thống tự động cập nhật ví thành viên

### 4. **👥 Quản lý thành viên**

#### Thông tin quan trọng theo dõi:
- **Mã thành viên** (TCH001, PAR001...)
- **Số lượng giới thiệu** (Total Referrals)
- **Tổng hoa hồng** (Total Commission)
- **Trạng thái ví** (Wallet Balance)
- **Mức độ hoạt động** (Activity Level)

#### Hành động quản lý:
- **Ẩn/Hiện thông tin** thành viên
- **Xem chi tiết** cây phả hệ
- **Kiểm tra lịch sử** giao dịch
- **Cập nhật thông tin** liên hệ

### 5. **📊 Báo cáo và thống kê**

#### Các chỉ số quan trọng:
- **Conversion Rate**: Tỷ lệ chuyển đổi khách hàng
- **Top Performers**: Những agent hoạt động tốt nhất
- **Revenue Generated**: Doanh thu được tạo ra
- **Commission Paid**: Tổng hoa hồng đã trả

---

## 🔧 VẤN ĐỀ ĐÃ KHẮC PHỤC

### ✅ **Vấn đề 1: Nút đăng ký không hoạt động**
- **Nguyên nhân**: Thiếu authentication và validation
- **Giải pháp**: Đã thêm form validation và error handling đầy đủ
- **Kết quả**: Đăng ký hoạt động bình thường với toast notification

### ✅ **Vấn đề 2: Xem thông tin thành viên khi chưa đăng nhập**
- **Nguyên nhân**: Thiếu authentication guard
- **Giải pháp**: Đã thêm hệ thống đăng nhập bắt buộc
- **Kết quả**: Phải đăng nhập mới xem được thông tin

### ✅ **Vấn đề 3: Thẻ thành viên biến mất khi click mắt**
- **Nguyên nhân**: Bug trong state management
- **Giải pháp**: Đã sử dụng Set() để quản lý hidden state
- **Kết quả**: Thẻ chỉ ẩn/hiện, không bị xóa

### ✅ **Vấn đề 4: Nút lưu hình ảnh không hoạt động**
- **Nguyên nhân**: Thiếu API endpoint và mutation
- **Giải pháp**: Đã thêm saveImageMutation với proper error handling
- **Kết quả**: Upload và lưu hình ảnh hoạt động đầy đủ

---

## 🎯 CHIẾN LƯỢC SỬ DỤNG HIỆU QUẢ

### 1. **Tuần đầu tiên - Thiết lập cơ bản**
- [ ] Tạo 5-10 thành viên test (giáo viên + phụ huynh)
- [ ] Import danh sách phụ huynh hiện tại vào hệ thống
- [ ] Test quy trình từ đăng ký → conversion → thanh toán
- [ ] Tập huấn cho nhân viên cách sử dụng admin panel

### 2. **Tuần thứ hai - Triển khai thực tế**
- [ ] Announce chương trình affiliate cho phụ huynh hiện tại
- [ ] Thiết lập QR code cho từng giáo viên/nhân viên
- [ ] Tạo material marketing (poster, flyer với QR code)
- [ ] Bắt đầu tracking khách hàng mới

### 3. **Hàng tuần - Vận hành**
- [ ] **Thứ 2**: Review các conversion mới trong tuần
- [ ] **Thứ 4**: Cập nhật trạng thái từ VÀNG → XANH cho confirmations
- [ ] **Thứ 6**: Thanh toán hoa hồng (XANH → XANH DƯƠNG)
- [ ] **Chủ nhật**: Tổng kết và báo cáo tuần

### 4. **Hàng tháng - Tối ưu**
- [ ] Phân tích top performers
- [ ] Điều chỉnh chiến lược marketing
- [ ] Trao thưởng đặc biệt cho agents xuất sắc
- [ ] Cập nhật và cải thiện quy trình

---

## 📞 TÍNH NĂNG CONTACT & SUPPORT

### Automatic Support:
- **AI Chatbot**: Tư vấn 24/7 cho khách hàng potentials
- **Auto-tracking**: Tự động ghi nhận source từ QR code
- **Real-time notifications**: Báo admin ngay khi có conversion mới

### Manual Management:
- **Admin Dashboard**: /admin/affiliate (full control)
- **Member Portal**: /affiliate (self-service cho agents)
- **Quick Access**: Links trong header/footer website

---

## 🎯 KẾT QUẢ MONG ĐỢI

### Tháng 1:
- 20-30 affiliate members đăng ký
- 5-10 conversion mới/tuần
- 20-40 triệu VNĐ doanh thu từ affiliate

### Tháng 2-3:
- 50+ affiliate members
- 15-25 conversion mới/tuần  
- 60-100 triệu VNĐ doanh thu
- Mạng lưới 2-3 cấp độ

### Tháng 4-6:
- 100+ affiliate members
- 25-40 conversion mới/tuần
- 100-200 triệu VNĐ doanh thu
- Hệ thống tự vận hành

---

## 🔗 LINKS QUAN TRỌNG

- **Trang chính**: `/affiliate`
- **Admin portal**: `/admin/affiliate` 
- **Đăng ký mới**: `/affiliate/join`
- **Hosting package**: `MAMNON-HOSTING-PACKAGE.tar.gz`

---

**📧 Liên hệ hỗ trợ**: mamnonthaonguyenxanh@gmail.com
**🕐 Cập nhật**: 27/07/2025