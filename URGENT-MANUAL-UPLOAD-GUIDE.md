# 🚨 HƯỚNG DẪN UPLOAD MANUAL ĐỂ FIX LỖI 404

## 🔍 VẤN ĐỀ
Website báo lỗi 404 vì hosting package chưa được upload lên server thực.

## 📦 GIẢI PHÁP NGAY LẬP TỨC

### File cần upload: `SIMPLE-TEST-PACKAGE.tar.gz`

Tôi đã tạo 1 file HTML đơn giản để test login function trước:

**Nội dung package:**
- `index.html` - Trang test login đơn giản với JavaScript
- `.htaccess` - File routing cho Apache server

### BƯỚC 1: DOWNLOAD FILE
Tải file `SIMPLE-TEST-PACKAGE.tar.gz` từ Replit

### BƯỚC 2: UPLOAD LÊN HOSTING

1. **Đăng nhập hosting panel** mamnonthaonguyenxanh.com
2. **Mở File Manager**
3. **Navigate to domain root** (thường là `public_html` hoặc `www`)
4. **Xóa hết files cũ** trong thư mục root (backup trước nếu cần)
5. **Upload** file `SIMPLE-TEST-PACKAGE.tar.gz`
6. **Extract** file ngay trên hosting panel
7. **Set permissions**:
   - Files: 644
   - Folders: 755

### BƯỚC 3: TEST NGAY

Truy cập: `https://mamnonthaonguyenxanh.com`

**Expected result:**
- Trang login màu xanh với form đăng nhập
- Tự động điền sẵn: `testfinal / 123456`
- Bấm "Đăng nhập" → hiển thị thông báo thành công

### BƯỚC 4: TEST LOGIN

Form sẽ test 2 cách:
1. **Backend API** - Nếu có backend Replit
2. **Demo fallback** - Nếu không có backend

**Demo accounts:**
- testfinal / 123456
- demo / demo123  
- admin / admin123

## 🎯 KẾT QUẢ EXPECTED

Sau upload thành công:
- ✅ Website load được (không 404)
- ✅ Form login hiển thị đúng
- ✅ Login với demo accounts thành công
- ✅ Hiển thị thông tin user (tên, số dư, hoa hồng)

## 🔧 NẾU VẪN LỖI

1. **Kiểm tra file structure:**
```
public_html/
├── index.html
└── .htaccess
```

2. **Test URL trực tiếp**: `https://mamnonthaonguyenxanh.com/index.html`

3. **Clear browser cache**: Ctrl+F5 hoặc Incognito mode

---
🚨 **ACTION REQUIRED**: Upload file `SIMPLE-TEST-PACKAGE.tar.gz` để fix lỗi 404
📋 **Goal**: Get basic login form working trước khi integrate full React app