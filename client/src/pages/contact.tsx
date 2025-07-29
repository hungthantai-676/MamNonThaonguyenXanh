import ContactForm from "@/components/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Contact() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-green/10 to-secondary-blue/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-4xl md:text-5xl text-dark-gray mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc
          </p>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="font-bold text-3xl text-dark-gray mb-8">Thông tin liên hệ</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-primary-green text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray mb-1">Địa chỉ</h3>
                    <p className="text-gray-600">Toà nhà Thảo Nguyên Xanh, đường Lý Thái Tổ, tổ 4, phường Phù Vân, tỉnh Ninh Bình</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-phone text-secondary-blue text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray mb-1">Điện thoại</h3>
                    <p className="text-gray-600">Hotline: 0856318686</p>
                    <p className="text-gray-600">Tuyển sinh: 0856318686</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-yellow/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-accent-yellow text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray mb-1">Email</h3>
                    <p className="text-gray-600">mamnonthaonguyenxanh@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-clock text-primary-green text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray mb-1">Giờ hoạt động</h3>
                    <p className="text-gray-600">Thứ 2 - Thứ 6: 7:00 - 17:00</p>
                    <p className="text-gray-600">Thứ 7: 8:00 - 12:00</p>
                    <p className="text-gray-600">Chủ nhật: Nghỉ</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-dark-gray mb-4">Theo dõi chúng tôi</h3>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/mamnonthaonguyenxanh" target="_blank" className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white transition-colors">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://zalo.me/0856318686" target="_blank" className="w-12 h-12 bg-blue-400 hover:bg-blue-500 rounded-lg flex items-center justify-center text-white transition-colors">
                    <span className="font-bold text-sm">Zalo</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center justify-center text-white transition-colors">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-white transition-colors">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="mt-8 bg-gradient-to-r from-primary-green/10 to-secondary-blue/10 rounded-xl p-6">
                <h3 className="font-semibold text-dark-gray mb-4">Liên hệ nhanh</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="bg-primary-green hover:bg-primary-green/90 text-white"
                    onClick={() => window.open('https://zalo.me/0856318686', '_blank')}
                  >
                    <i className="fab fa-zalo mr-2"></i>
                    Chat Zalo
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-primary-green text-primary-green hover:bg-primary-green hover:text-white"
                    onClick={() => window.open('tel:0856318686', '_self')}
                  >
                    <i className="fas fa-phone mr-2"></i>
                    Gọi ngay
                  </Button>
                </div>
              </div>

              {/* Affiliate System */}
              <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-green-500/10 rounded-xl p-6">
                <h3 className="font-semibold text-dark-gray mb-4">🌟 Hệ thống Affiliate</h3>
                <p className="text-gray-600 mb-4">
                  Tham gia hệ thống affiliate để nhận token, xây dựng mạng lưới và giao dịch trên DEX
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <Link href="/affiliate">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white">
                      <i className="fas fa-coins mr-2"></i>
                      Tham gia Affiliate
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-gift text-purple-500"></i>
                    <span>Nhận 1,000 TNG token khi đăng ký</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Vị trí trường học</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tìm đường đến trường một cách dễ dàng
            </p>
          </div>

          {/* Google Maps */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-96 relative">
              <iframe
                src="https://maps.google.com/maps?q=Lý+Thái+Tổ,+Phù+Vân,+Ninh+Bình,+Vietnam&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vị trí Mầm Non Thảo Nguyên Xanh"
              ></iframe>
              
              {/* Overlay with directions */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold text-dark-gray mb-2">Cách di chuyển</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <i className="fas fa-bus text-primary-green mr-2"></i>
                    <span>Xe buýt: Tuyến liên tỉnh</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-motorcycle text-primary-green mr-2"></i>
                    <span>Grab/Be từ trung tâm: 10-15 phút</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-car text-primary-green mr-2"></i>
                    <span>Có bãi đậu xe miễn phí</span>
                  </div>
                </div>
              </div>

              {/* Quick Direction Link */}
              <div className="absolute bottom-4 right-4">
                <a
                  href="https://maps.app.goo.gl/wJHJx4pxpZ1FmmoG9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-green hover:bg-primary-green/90 text-white px-4 py-2 rounded-lg shadow-md transition-colors flex items-center"
                >
                  <i className="fas fa-directions mr-2"></i>
                  Chỉ đường
                </a>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="max-w-2xl mx-auto mt-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-school text-white"></i>
                  </div>
                  <h3 className="font-semibold text-xl text-dark-gray">Mầm Non Thảo Nguyên Xanh</h3>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p><i className="fas fa-map-marker-alt text-primary-green mr-2"></i>Toà nhà Thảo Nguyên Xanh, đường Lý Thái Tổ, tổ 4, phường Phù Vân, tỉnh Ninh Bình</p>
                  <p><i className="fas fa-phone text-primary-green mr-2"></i>0856318686</p>
                  <p><i className="fas fa-envelope text-primary-green mr-2"></i>mamnonthaonguyenxanh@gmail.com</p>
                  <p><i className="fas fa-graduation-cap text-primary-green mr-2"></i>Lớp Nhà trẻ, Mẫu giáo, Lớp lớn</p>
                </div>
                <Button 
                  className="w-full mt-4 bg-primary-green hover:bg-primary-green/90 text-white"
                  onClick={() => window.open('https://maps.app.goo.gl/wJHJx4pxpZ1FmmoG9', '_blank')}
                >
                  <i className="fas fa-directions mr-2"></i>
                  Xem đường đi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Quick Help */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Câu hỏi thường gặp</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những câu hỏi được hỏi nhiều nhất
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                question: "Giờ đón trả như thế nào?",
                answer: "Đón từ 7:00-8:30, trả từ 16:30-17:00",
                icon: "fas fa-clock"
              },
              {
                question: "Học phí bao nhiêu?",
                answer: "Từ 2.5-3.5 triệu/tháng tùy lớp",
                icon: "fas fa-money-bill"
              },
              {
                question: "Có xe đưa đón không?",
                answer: "Hiện tại chưa có dịch vụ này",
                icon: "fas fa-bus"
              },
              {
                question: "Thực đơn như thế nào?",
                answer: "Thực đơn đa dạng, cập nhật hàng tuần",
                icon: "fas fa-utensils"
              },
              {
                question: "Khi nào nhập học?",
                answer: "Nhận trẻ quanh năm, tùy chỗ trống",
                icon: "fas fa-calendar"
              },
              {
                question: "Có tham quan được không?",
                answer: "Có, đăng ký trước với văn phòng",
                icon: "fas fa-eye"
              }
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${faq.icon} text-primary-green text-xl`}></i>
                  </div>
                  <h3 className="font-semibold text-lg text-dark-gray mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Cần hỗ trợ thêm?</p>
            <Button className="bg-primary-green hover:bg-primary-green/90 text-white">
              Xem tất cả FAQ
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-4xl text-dark-gray mb-4">Liên hệ khẩn cấp</h2>
          <p className="text-xl text-gray-600 mb-8">
            Trong trường hợp khẩn cấp, vui lòng liên hệ ngay
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-red-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-phone text-white text-2xl"></i>
                </div>
                <h3 className="font-semibold text-lg text-dark-gray mb-2">Hotline 24/7</h3>
                <p className="text-2xl font-bold text-red-500 mb-2">0901 234 567</p>
                <p className="text-gray-600">Luôn sẵn sàng hỗ trợ</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-ambulance text-white text-2xl"></i>
                </div>
                <h3 className="font-semibold text-lg text-dark-gray mb-2">Y tế khẩn cấp</h3>
                <p className="text-2xl font-bold text-orange-500 mb-2">115</p>
                <p className="text-gray-600">Cấp cứu y tế</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shield-alt text-white text-2xl"></i>
                </div>
                <h3 className="font-semibold text-lg text-dark-gray mb-2">An ninh</h3>
                <p className="text-2xl font-bold text-blue-500 mb-2">113</p>
                <p className="text-gray-600">Công an</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
