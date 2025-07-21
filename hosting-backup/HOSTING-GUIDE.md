# Hướng dẫn triển khai Website Mầm Non Thảo Nguyên Xanh

## 1. Upload files
- Upload tất cả files trong thư mục này lên hosting
- Đảm bảo file start.js ở thư mục root

## 2. Cài đặt dependencies
```bash
npm install
```

## 3. Thiết lập biến môi trường
Tạo file .env với nội dung:
```
DATABASE_URL=your_postgres_connection_string
NODE_ENV=production
```

## 4. Chạy website
```bash
npm start
```

## 5. Domain pointing
- Point domain A record to server IP
- Or use CNAME if hosting supports it

## Lưu ý
- Cần PostgreSQL database
- Node.js version 18+ required
- Port mặc định: 3000
