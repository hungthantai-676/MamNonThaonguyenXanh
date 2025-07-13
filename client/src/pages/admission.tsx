import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import AdmissionForm from "@/components/admission-form";
import type { Program, AdmissionStep } from "@shared/schema";

export default function Admission() {
  const { data: programs, isLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });
  
  const { data: admissionSteps, isLoading: isLoadingSteps } = useQuery<AdmissionStep[]>({
    queryKey: ["/api/admission-steps"],
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-green/10 to-secondary-blue/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-4xl md:text-5xl text-dark-gray mb-4">
            Tuyển sinh
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Đăng ký ngay để con bạn có cơ hội học tập tại môi trường giáo dục tốt nhất
          </p>
        </div>
      </section>

      {/* Admission Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-bold text-3xl text-dark-gray mb-8">Thông tin tuyển sinh</h2>
              
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-light-gray rounded-xl p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <div className="grid md:grid-cols-2 gap-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {programs?.map((program) => (
                    <Card key={program.id} className="bg-light-gray rounded-xl shadow-md">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-xl text-dark-gray mb-4">{program.name}</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Độ tuổi:</span>
                            <span className="font-medium text-dark-gray ml-2">{program.ageRange}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Chỉ tiêu:</span>
                            <span className="font-medium text-dark-gray ml-2">{program.capacity} học sinh</span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-gray-600">Học phí:</span>
                            <span className="font-medium text-dark-gray ml-2">
                              {program.tuition.toLocaleString('vi-VN')} VNĐ/tháng
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Benefits Section */}
              <div className="mt-8 bg-light-gray rounded-xl p-6">
                <h3 className="font-semibold text-xl text-dark-gray mb-4">Chính sách ưu đãi</h3>
                <div className="space-y-3">
                  {[
                    "Miễn phí tháng đầu tiên cho học sinh đăng ký sớm",
                    "Giảm 10% học phí cho anh chị em ruột",
                    "Tặng bộ đồng phục và dụng cụ học tập",
                    "Miễn phí tham gia các hoạt động ngoại khóa",
                    "Ưu đãi đặc biệt cho con em cán bộ, giáo viên"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <i className="fas fa-star text-accent-yellow mr-3 mt-1"></i>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements Section */}
              <div className="mt-8 bg-white rounded-xl p-6 border-2 border-primary-green/20">
                <h3 className="font-semibold text-xl text-dark-gray mb-4">Hồ sơ cần thiết</h3>
                <div className="space-y-3">
                  {[
                    "Đơn xin nhập học (theo mẫu của trường)",
                    "Bản sao giấy khai sinh của trẻ",
                    "Bản sao CMND/CCCD của bố mẹ",
                    "02 ảnh 3x4 của trẻ",
                    "Sổ khám sức khỏe định kỳ",
                    "Bản sao sổ tiêm chủng đầy đủ"
                  ].map((requirement, index) => (
                    <div key={index} className="flex items-start">
                      <i className="fas fa-check text-primary-green mr-3 mt-1"></i>
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <AdmissionForm />
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Quy trình tuyển sinh</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quy trình đăng ký đơn giản và minh bạch
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {isLoadingSteps ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <div className="relative mb-6">
                      <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mx-auto mb-3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {admissionSteps?.map((step, index) => (
                  <div key={step.id} className="text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 shadow-lg">
                        <img 
                          src={step.iconUrl} 
                          alt={step.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-yellow rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {step.stepNumber.toString().padStart(2, '0')}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg text-dark-gray mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact for Consultation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Tư vấn trực tuyến</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Đội ngũ tư vấn viên sẵn sàng hỗ trợ bạn 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Cô Nguyễn Thị Hoa",
                role: "Trưởng phòng Tuyển sinh",
                phone: "0901 234 567",
                email: "tuyensinh@mamnonthaonguyenxanh.com",
                avatar: "NH",
                available: "8:00 - 17:00 (T2-T6)"
              },
              {
                name: "Cô Trần Thị Mai",
                role: "Tư vấn viên",
                phone: "0901 234 568",
                email: "tuvan1@mamnonthaonguyenxanh.com",
                avatar: "TM",
                available: "8:00 - 17:00 (T2-T7)"
              },
              {
                name: "Cô Lê Thị Lan",
                role: "Tư vấn viên",
                phone: "0901 234 569",
                email: "tuvan2@mamnonthaonguyenxanh.com",
                avatar: "LL",
                available: "14:00 - 20:00 (T2-CN)"
              }
            ].map((consultant, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">{consultant.avatar}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-dark-gray mb-1">{consultant.name}</h3>
                  <p className="text-gray-600 mb-4">{consultant.role}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <i className="fas fa-phone text-primary-green mr-2"></i>
                      {consultant.phone}
                    </div>
                    <div className="flex items-center justify-center">
                      <i className="fas fa-envelope text-primary-green mr-2"></i>
                      {consultant.email}
                    </div>
                    <div className="flex items-center justify-center">
                      <i className="fas fa-clock text-primary-green mr-2"></i>
                      {consultant.available}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                <i className="fab fa-facebook-messenger mr-2"></i>
                Chat Messenger
              </button>
              <button className="bg-blue-400 hover:bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                <i className="fab fa-zalo mr-2"></i>
                Chat Zalo
              </button>
              <button className="bg-primary-green hover:bg-primary-green/90 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                <i className="fas fa-phone mr-2"></i>
                Gọi Hotline
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-20 bg-gradient-to-r from-primary-green to-secondary-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-4xl mb-8">Lịch tuyển sinh năm học 2024-2025</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                phase: "Đợt 1",
                period: "01/03 - 31/05",
                description: "Tuyển sinh chính thức",
                highlight: true
              },
              {
                phase: "Đợt 2", 
                period: "01/06 - 31/07",
                description: "Tuyển sinh bổ sung",
                highlight: false
              },
              {
                phase: "Đợt 3",
                period: "01/08 - 15/08", 
                description: "Tuyển sinh khuyết",
                highlight: false
              },
              {
                phase: "Khai giảng",
                period: "05/09/2024",
                description: "Lễ khai giảng năm học mới",
                highlight: true
              }
            ].map((phase, index) => (
              <div 
                key={index} 
                className={`
                  p-6 rounded-xl
                  ${phase.highlight 
                    ? 'bg-white/20 border-2 border-white/50' 
                    : 'bg-white/10'
                  }
                `}
              >
                <div className="text-accent-yellow font-bold text-lg mb-2">{phase.phase}</div>
                <div className="text-2xl font-bold mb-2">{phase.period}</div>
                <div className="text-white/90">{phase.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
