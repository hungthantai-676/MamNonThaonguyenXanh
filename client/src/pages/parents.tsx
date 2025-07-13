import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertServiceRegistration } from "@shared/schema";

export default function Parents() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    serviceName: "",
    preferredTime: "",
    notes: ""
  });

  const services = [
    {
      name: "Tư vấn tâm lý",
      description: "Hỗ trợ giải quyết các vấn đề tâm lý và hành vi của trẻ",
      icon: "fas fa-heart",
      color: "primary-green",
      time: "8:00 - 17:00"
    },
    {
      name: "Tư vấn dinh dưỡng",
      description: "Hỗ trợ lập kế hoạch dinh dưỡng phù hợp cho từng trẻ",
      icon: "fas fa-apple-alt",
      color: "secondary-blue",
      time: "8:00 - 17:00"
    },
    {
      name: "Lớp phụ huynh",
      description: "Tham gia các lớp học và hoạt động cùng con",
      icon: "fas fa-users",
      color: "accent-yellow",
      time: "8:00 - 17:00"
    },
    {
      name: "Tư vấn học tập",
      description: "Hướng dẫn hỗ trợ học tập tại nhà",
      icon: "fas fa-graduation-cap",
      color: "primary-green",
      time: "8:00 - 17:00"
    }
  ];

  const registrationMutation = useMutation({
    mutationFn: async (data: InsertServiceRegistration) => {
      return await apiRequest("POST", "/api/service-registrations", data);
    },
    onSuccess: () => {
      toast({
        title: "Đăng ký thành công!",
        description: "Cô giáo sẽ liên hệ với bạn trong thời gian sớm nhất.",
      });
      setIsDialogOpen(false);
      setFormData({
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        serviceName: "",
        preferredTime: "",
        notes: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setFormData(prev => ({ ...prev, serviceName: service }));
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registrationMutation.mutate(formData);
  };

  const resources = [
    {
      title: "Dinh dưỡng cho trẻ mầm non",
      description: "Hướng dẫn chế độ dinh dưỡng cân bằng cho trẻ từ 6 tháng đến 6 tuổi",
      icon: "fas fa-apple-alt",
      color: "primary-green",
      downloadUrl: "#"
    },
    {
      title: "Phát triển kỹ năng ngôn ngữ",
      description: "Các hoạt động giúp trẻ phát triển khả năng ngôn ngữ tại nhà",
      icon: "fas fa-comments",
      color: "secondary-blue",
      downloadUrl: "#"
    },
    {
      title: "Kỹ năng sống cơ bản",
      description: "Hướng dẫn dạy trẻ các kỹ năng tự lập trong sinh hoạt hàng ngày",
      icon: "fas fa-hands-helping",
      color: "accent-yellow",
      downloadUrl: "#"
    },
    {
      title: "Thực đơn tuần",
      description: "Thực đơn chi tiết cho từng tuần học, cập nhật hàng tháng",
      icon: "fas fa-calendar-week",
      color: "primary-green",
      downloadUrl: "#"
    },
    {
      title: "Kế hoạch học tập tháng",
      description: "Chi tiết các hoạt động học tập và kỹ năng sẽ phát triển",
      icon: "fas fa-tasks",
      color: "secondary-blue",
      downloadUrl: "#"
    },
    {
      title: "Hướng dẫn hoạt động tại nhà",
      description: "Các trò chơi và hoạt động phù hợp để làm tại nhà",
      icon: "fas fa-home",
      color: "accent-yellow",
      downloadUrl: "#"
    }
  ];

  const faqData = [
    {
      question: "Trẻ bao nhiêu tuổi có thể vào học tại trường?",
      answer: "Trường nhận trẻ từ 6 tháng tuổi đến 6 tuổi. Chúng tôi có các lớp phù hợp cho từng độ tuổi: Nhà trẻ (6-24 tháng), Mẫu giáo (2-4 tuổi), và Lớp lớn (4-6 tuổi)."
    },
    {
      question: "Thực đơn của trường có phù hợp với trẻ dị ứng thực phẩm không?",
      answer: "Có, chúng tôi có thể điều chỉnh thực đơn phù hợp với tình trạng dị ứng của từng em. Phụ huynh vui lòng thông báo chi tiết về tình trạng dị ứng khi đăng ký."
    },
    {
      question: "Trường có xe đưa đón không?",
      answer: "Hiện tại trường chưa có dịch vụ xe đưa đón. Phụ huynh có thể đưa đón trực tiếp hoặc ủy quyền cho người thân đã được đăng ký."
    },
    {
      question: "Học phí được thanh toán như thế nào?",
      answer: "Học phí có thể thanh toán theo tháng hoặc theo quý. Chúng tôi chấp nhận thanh toán bằng tiền mặt, chuyển khoản ngân hàng hoặc thẻ ATM."
    },
    {
      question: "Trường có hoạt động ngoại khóa gì?",
      answer: "Trường tổ chức nhiều hoạt động ngoại khóa như: học tiếng Anh, âm nhạc, múa, thể thao, STEAM, và các chuyến dã ngoại theo mùa."
    },
    {
      question: "Tỷ lệ giáo viên/học sinh là bao nhiêu?",
      answer: "Tỷ lệ giáo viên/học sinh của chúng tôi là 1:8 cho lớp nhà trẻ, 1:12 cho lớp mẫu giáo, và 1:15 cho lớp lớn, đảm bảo chăm sóc tốt nhất cho từng em."
    },
    {
      question: "Khi nào có thể đăng ký tham quan trường?",
      answer: "Phụ huynh có thể đăng ký tham quan trường vào các ngày trong tuần từ 8:00-11:00 và 14:00-16:00. Vui lòng liên hệ trước để được sắp xếp."
    },
    {
      question: "Trường có chương trình hỗ trợ cho trẻ chậm phát triển không?",
      answer: "Có, chúng tôi có đội ngũ chuyên gia tâm lý và giáo dục đặc biệt để hỗ trợ các em có nhu cầu học tập đặc biệt."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-green/10 to-secondary-blue/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-4xl md:text-5xl text-dark-gray mb-4">
            Thư viện phụ huynh
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tài nguyên hữu ích để hỗ trợ phụ huynh trong việc chăm sóc và giáo dục con em
          </p>
        </div>
      </section>

      {/* Service Support Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Dịch vụ hỗ trợ phụ huynh</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Các dịch vụ đặc biệt để hỗ trợ phụ huynh trong hành trình nuôi dạy con
            </p>
          </div>

          {/* Test Section */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">🧪 Test nhanh hệ thống</h3>
            <p className="text-blue-800 text-sm mb-4">
              Nhấn để tạo đăng ký dịch vụ mẫu và xem thông báo được gửi ngay lập tức
            </p>
            <div className="space-x-2">
              <Button 
                onClick={() => {
                  const testData = {
                    parentName: "Nguyễn Thị Hoa",
                    parentPhone: "0987654321",
                    parentEmail: "nguyenhoa@gmail.com",
                    serviceName: "Tư vấn tâm lý",
                    preferredTime: "14:00 - 15:00",
                    notes: "Con tôi 4 tuổi, gần đây hay khóc và không chịu đi học. Mong được tư vấn cách xử lý tình huống này."
                  };
                  registrationMutation.mutate(testData);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={registrationMutation.isPending}
              >
                🧪 Test Tư vấn tâm lý
              </Button>
              <Button 
                onClick={() => {
                  const testData = {
                    parentName: "Trần Văn Minh",
                    parentPhone: "0912345678",
                    parentEmail: "tranminh@gmail.com",
                    serviceName: "Tư vấn dinh dưỡng",
                    preferredTime: "9:00 - 10:00",
                    notes: "Con tôi 5 tuổi, ăn rất kém và hay ốm. Muốn được tư vấn chế độ dinh dưỡng phù hợp."
                  };
                  registrationMutation.mutate(testData);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={registrationMutation.isPending}
              >
                🧪 Test Tư vấn dinh dưỡng
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleServiceSelect(service.name)}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-${service.color}/10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <i className={`${service.icon} text-${service.color} text-2xl`}></i>
                  </div>
                  <h3 className="font-semibold text-xl text-dark-gray mb-3">{service.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <i className="fas fa-clock mr-1"></i>
                    {service.time}
                  </div>
                  <Button className={`w-full bg-${service.color} hover:bg-${service.color}/90 text-white`}>
                    Đăng ký
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Service Registration Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Đăng ký dịch vụ: {selectedService}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="parentName">Họ tên phụ huynh *</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                    placeholder="Nhập họ tên"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="parentPhone">Số điện thoại *</Label>
                  <Input
                    id="parentPhone"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="parentEmail">Email (tùy chọn)</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                    placeholder="Nhập email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="preferredTime">Thời gian mong muốn</Label>
                  <Select value={formData.preferredTime} onValueChange={(value) => setFormData(prev => ({ ...prev, preferredTime: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8:00 - 9:00">8:00 - 9:00</SelectItem>
                      <SelectItem value="9:00 - 10:00">9:00 - 10:00</SelectItem>
                      <SelectItem value="10:00 - 11:00">10:00 - 11:00</SelectItem>
                      <SelectItem value="14:00 - 15:00">14:00 - 15:00</SelectItem>
                      <SelectItem value="15:00 - 16:00">15:00 - 16:00</SelectItem>
                      <SelectItem value="16:00 - 17:00">16:00 - 17:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Mô tả tình huống hoặc yêu cầu cụ thể..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" className="bg-primary-green hover:bg-primary-green/90" disabled={registrationMutation.isPending}>
                    {registrationMutation.isPending ? "Đang gửi..." : "Đăng ký"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Counseling Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Góc tư vấn</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lời khuyên chuyên môn từ đội ngũ giáo viên và chuyên gia tâm lý
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Dinh dưỡng cho trẻ mầm non",
                excerpt: "Chế độ dinh dưỡng cân bằng giúp trẻ phát triển toàn diện...",
                author: "BS. Nguyễn Thị Hoa",
                date: "15/11/2024",
                image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
                category: "Sức khỏe"
              },
              {
                title: "Phát triển kỹ năng xã hội",
                excerpt: "Cách giúp trẻ giao tiếp và tương tác tốt với bạn bè...",
                author: "ThS. Lê Văn Minh",
                date: "12/11/2024",
                image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
                category: "Tâm lý"
              },
              {
                title: "Xây dựng thói quen tốt",
                excerpt: "Hướng dẫn tạo lập thói quen sinh hoạt tích cực cho trẻ...",
                author: "Cô Trần Thị Mai",
                date: "10/11/2024",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
                category: "Giáo dục"
              },
              {
                title: "Kích thích sự sáng tạo",
                excerpt: "Các hoạt động nghệ thuật giúp phát triển tư duy sáng tạo...",
                author: "Cô Phạm Thị Lan",
                date: "08/11/2024",
                image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
                category: "Sáng tạo"
              },
              {
                title: "Đọc sách cùng con",
                excerpt: "Tầm quan trọng của việc đọc sách và cách tạo hứng thú...",
                author: "Cô Vũ Thị Hương",
                date: "05/11/2024",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                category: "Giáo dục"
              },
              {
                title: "Quản lý cảm xúc ở trẻ",
                excerpt: "Giúp trẻ hiểu và điều khiển cảm xúc một cách tích cực...",
                author: "ThS. Hoàng Thị Nga",
                date: "03/11/2024",
                image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b",
                category: "Tâm lý"
              }
            ].map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium px-2 py-1 bg-primary-green/10 text-primary-green rounded-full">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-500">{article.date}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-dark-gray mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.author}</span>
                    <Button variant="ghost" size="sm" className="text-primary-green">
                      Đọc thêm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-primary-green hover:bg-primary-green/90 text-white">
              Xem tất cả bài viết
            </Button>
          </div>
        </div>
      </section>

      {/* Download Resources */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Tài liệu tải về</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Các tài liệu hướng dẫn và thông tin hữu ích cho phụ huynh
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-${resource.color}/10 rounded-full flex items-center justify-center mb-6`}>
                    <i className={`${resource.icon} text-${resource.color} text-2xl`}></i>
                  </div>
                  <h3 className="font-semibold text-xl text-dark-gray mb-3">{resource.title}</h3>
                  <p className="text-gray-600 mb-6">{resource.description}</p>
                  <Button className={`w-full bg-${resource.color} hover:bg-${resource.color}/90 text-white`}>
                    <i className="fas fa-download mr-2"></i>
                    Tải xuống
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Câu hỏi thường gặp</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Giải đáp những thắc mắc phổ biến của phụ huynh
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-light-gray rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-dark-gray hover:text-primary-green">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Không tìm thấy câu trả lời bạn cần?</p>
            <Link href="/contact">
              <Button className="bg-primary-green hover:bg-primary-green/90 text-white">
                Liên hệ tư vấn
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Parent Support Services */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Dịch vụ hỗ trợ phụ huynh</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Các dịch vụ đặc biệt để hỗ trợ phụ huynh trong hành trình nuôi dạy con
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Tư vấn tâm lý",
                description: "Hỗ trợ giải quyết các vấn đề tâm lý của trẻ",
                icon: "fas fa-heart",
                schedule: "Thứ 3, 5 - 14:00-16:00"
              },
              {
                title: "Tư vấn dinh dưỡng",
                description: "Lập kế hoạch dinh dưỡng phù hợp cho từng trẻ",
                icon: "fas fa-apple-alt",
                schedule: "Thứ 2, 4 - 15:00-17:00"
              },
              {
                title: "Lớp phụ huynh",
                description: "Học cách nuôi dạy con hiệu quả",
                icon: "fas fa-users",
                schedule: "Thứ 7 - 9:00-11:00"
              },
              {
                title: "Tư vấn học tập",
                description: "Hướng dẫn hỗ trợ con học tập tại nhà",
                icon: "fas fa-book",
                schedule: "Thứ 6 - 16:00-17:00"
              }
            ].map((service, index) => (
              <Card key={index} className="bg-white text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${service.icon} text-primary-green text-2xl`}></i>
                  </div>
                  <h3 className="font-semibold text-lg text-dark-gray mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-sm text-gray-500 mb-4">{service.schedule}</div>
                  <Button variant="outline" className="border-primary-green text-primary-green hover:bg-primary-green hover:text-white">
                    Đăng ký
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
