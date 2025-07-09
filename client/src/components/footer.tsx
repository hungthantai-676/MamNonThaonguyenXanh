import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dark-gray text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                <img 
                  src="/images/logo.png" 
                  alt="Mầm Non Thảo Nguyên Xanh Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-xl">Mầm Non Thảo Nguyên Xanh</h3>
                <p className="text-sm text-gray-400">Giáo dục bằng trái tim</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Nơi nuôi dưỡng tâm hồn, phát triển tư duy và xây dựng tương lai cho trẻ em.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Giới thiệu</Link></li>
              <li><Link href="/programs" className="text-gray-400 hover:text-white transition-colors">Chương trình học</Link></li>
              <li><Link href="/activities" className="text-gray-400 hover:text-white transition-colors">Hoạt động</Link></li>
              <li><Link href="/admission" className="text-gray-400 hover:text-white transition-colors">Tuyển sinh</Link></li>
              <li><Link href="/news" className="text-gray-400 hover:text-white transition-colors">Tin tức</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Dịch vụ</h4>
            <ul className="space-y-2">
              <li><Link href="/parents" className="text-gray-400 hover:text-white transition-colors">Thư viện phụ huynh</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tư vấn giáo dục</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chăm sóc toàn diện</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hoạt động ngoại khóa</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dinh dưỡng</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt text-primary-green mt-1"></i>
                <p className="text-gray-400 text-sm">Toà nhà Thảo Nguyên Xanh, đường Lý Thái Tổ, tổ 4, phường Phù Vân, tỉnh Ninh Bình</p>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone text-primary-green"></i>
                <p className="text-gray-400">0856318686</p>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-primary-green"></i>
                <p className="text-gray-400">mamnonthaonguyenxanh@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 Mầm Non Thảo Nguyên Xanh. Tất cả quyền được bảo lưu.
            </p>
            <div className="text-xs text-gray-500 mt-2 md:mt-0">
              <Link href="/admin/login" className="hover:text-primary-green transition-colors">
                Quản trị website (admin/admin123)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
