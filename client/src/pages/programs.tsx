import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ProgramCard from "@/components/program-card";
import type { Program } from "@shared/schema";

export default function Programs() {
  const { data: programs, isLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-green/10 to-secondary-blue/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-4xl md:text-5xl text-dark-gray mb-4">
            Chương trình học
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chương trình giáo dục tích hợp phù hợp với từng độ tuổi, phát triển toàn diện cho trẻ
          </p>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Các lớp học</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Từ nhà trẻ đến lớp chuẩn bị vào cấp 1, chúng tôi có chương trình phù hợp cho mọi độ tuổi
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-light-gray rounded-xl p-8">
                  <Skeleton className="w-16 h-16 rounded-full mb-6" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs?.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Educational Methods */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Phương pháp giáo dục</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi áp dụng các phương pháp giáo dục tiên tiến được chứng minh hiệu quả
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                method: "Montessori",
                description: "Phương pháp giáo dục tôn trọng nhịp độ phát triển tự nhiên của trẻ",
                benefits: [
                  "Phát triển tính độc lập",
                  "Tôn trọng sự tự nhiên",
                  "Học tập chủ động",
                  "Phát triển toàn diện"
                ],
                icon: "fas fa-child"
              },
              {
                method: "Glenn Doman",
                description: "Phương pháp kích thích não bộ và phát triển tiềm năng trí tuệ",
                benefits: [
                  "Phát triển não bộ sớm",
                  "Tăng cường trí nhớ",
                  "Kích thích tư duy",
                  "Phát triển ngôn ngữ"
                ],
                icon: "fas fa-brain"
              },
              {
                method: "STEAM",
                description: "Giáo dục tích hợp Khoa học, Công nghệ, Kỹ thuật, Nghệ thuật, Toán học",
                benefits: [
                  "Tư duy logic",
                  "Sáng tạo nghệ thuật",
                  "Kỹ năng giải quyết vấn đề",
                  "Học tập trải nghiệm"
                ],
                icon: "fas fa-cog"
              }
            ].map((method, index) => (
              <div key={index} className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mb-6">
                  <i className={`${method.icon} text-primary-green text-2xl`}></i>
                </div>
                <h3 className="font-semibold text-xl text-dark-gray mb-4">{method.method}</h3>
                <p className="text-gray-600 mb-6">{method.description}</p>
                <div className="space-y-2">
                  {method.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-check text-primary-green mr-2"></i>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Thời khóa biểu</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lịch học hằng ngày được thiết kế cân bằng giữa học tập, vui chơi và nghỉ ngơi
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-light-gray rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-xl text-dark-gray mb-6">Buổi sáng</h3>
                  <div className="space-y-4">
                    {[
                      { time: "7:00 - 8:00", activity: "Đón trẻ, chào hỏi" },
                      { time: "8:00 - 8:30", activity: "Ăn sáng, vệ sinh cá nhân" },
                      { time: "8:30 - 9:30", activity: "Hoạt động giáo dục chính" },
                      { time: "9:30 - 10:00", activity: "Ăn phụ, nghỉ giải lao" },
                      { time: "10:00 - 11:00", activity: "Hoạt động ngoài trời" },
                      { time: "11:00 - 11:30", activity: "Chuẩn bị ăn trưa" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-20 text-sm font-medium text-primary-green">
                          {item.time}
                        </div>
                        <div className="flex-1 text-gray-700">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-xl text-dark-gray mb-6">Buổi chiều</h3>
                  <div className="space-y-4">
                    {[
                      { time: "11:30 - 12:30", activity: "Ăn trưa, vệ sinh" },
                      { time: "12:30 - 14:30", activity: "Nghỉ trưa" },
                      { time: "14:30 - 15:00", activity: "Thức dậy, vệ sinh" },
                      { time: "15:00 - 15:30", activity: "Ăn phụ chiều" },
                      { time: "15:30 - 16:30", activity: "Hoạt động tự chọn" },
                      { time: "16:30 - 17:00", activity: "Chuẩn bị về nhà" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-20 text-sm font-medium text-secondary-blue">
                          {item.time}
                        </div>
                        <div className="flex-1 text-gray-700">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Methods */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Phương pháp đánh giá</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi đánh giá sự phát triển của trẻ một cách toàn diện và khoa học
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Quan sát hàng ngày",
                description: "Theo dõi sự phát triển của trẻ qua các hoạt động",
                icon: "fas fa-eye"
              },
              {
                title: "Hồ sơ phát triển",
                description: "Ghi chép chi tiết quá trình học tập của từng em",
                icon: "fas fa-folder"
              },
              {
                title: "Tương tác với phụ huynh",
                description: "Thường xuyên trao đổi với gia đình về tiến bộ",
                icon: "fas fa-comments"
              },
              {
                title: "Đánh giá định kỳ",
                description: "Báo cáo tiến bộ theo từng giai đoạn",
                icon: "fas fa-chart-line"
              }
            ].map((method, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${method.icon} text-primary-green text-xl`}></i>
                </div>
                <h3 className="font-semibold text-lg text-dark-gray mb-3">{method.title}</h3>
                <p className="text-gray-600">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
