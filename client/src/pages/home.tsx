import Hero from "@/components/hero";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import SocialMediaSection from "@/components/social-media-section";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Article, Program, Activity } from "@shared/schema";

export default function Home() {
  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: programs, isLoading: programsLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  return (
    <div>
      <Hero />
      <Features />
      
      {/* About Section */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-bold text-4xl text-dark-gray mb-6">Về chúng tôi</h2>
              <p className="text-lg text-gray-700 mb-6">
                Mầm Non Thảo Nguyên Xanh được thành lập với sứ mệnh mang đến cho trẻ em môi trường học tập 
                an toàn, thân thiện và phát triển toàn diện. Chúng tôi tin rằng mỗi đứa trẻ đều có tiềm năng 
                riêng và cần được nuôi dưỡng bằng tình yêu thương.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-check-circle text-primary-green text-xl mt-1"></i>
                  <div>
                    <h4 className="font-semibold text-dark-gray">Sứ mệnh</h4>
                    <p className="text-gray-600">Giáo dục trẻ em bằng trái tim, phát triển toàn diện nhân cách</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <i className="fas fa-check-circle text-primary-green text-xl mt-1"></i>
                  <div>
                    <h4 className="font-semibold text-dark-gray">Tầm nhìn</h4>
                    <p className="text-gray-600">Trở thành ngôi trường mầm non hàng đầu trong khu vực</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <i className="fas fa-check-circle text-primary-green text-xl mt-1"></i>
                  <div>
                    <h4 className="font-semibold text-dark-gray">Giá trị cốt lõi</h4>
                    <p className="text-gray-600">Yêu thương - Tôn trọng - Sáng tạo - Phát triển</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/about">
                  <Button className="bg-primary-green hover:bg-primary-green/90 text-white">
                    Tìm hiểu thêm
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/attached_assets/image_1753704643377.png" 
                alt="Lớp học" 
                className="rounded-lg shadow-md object-cover w-full h-48"
              />
              <img 
                src="/attached_assets/image_1753704749817.png" 
                alt="Hoạt động học tập" 
                className="rounded-lg shadow-md object-cover w-full h-48"
              />
              <img 
                src="/attached_assets/image_1753705454643.png" 
                alt="Giáo viên và học sinh" 
                className="rounded-lg shadow-md object-cover w-full h-48"
              />
              <img 
                src="/attached_assets/image_1753705646404.png" 
                alt="Sân chơi" 
                className="rounded-lg shadow-md object-cover w-full h-48"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Chương trình học</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chương trình giáo dục tích hợp phù hợp với từng độ tuổi
            </p>
          </div>

          {programsLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
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
            <div className="grid md:grid-cols-3 gap-8">
              {programs?.map((program) => (
                <Card key={program.id} className="bg-light-gray rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mb-6">
                      <i className={`${program.icon} text-primary-green text-2xl`}></i>
                    </div>
                    <h3 className="font-semibold text-xl text-dark-gray mb-4">{program.name}</h3>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <div className="space-y-2">
                      {program.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-check text-primary-green mr-2"></i>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/programs">
              <Button className="bg-primary-green hover:bg-primary-green/90 text-white">
                Xem tất cả chương trình
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Hoạt động & Sự kiện</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những hoạt động đa dạng giúp trẻ phát triển toàn diện
            </p>
          </div>

          {activitiesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities?.map((activity) => (
                <Card key={activity.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={activity.imageUrl || "https://images.unsplash.com/photo-1560785496-3c9d27877182"} 
                    alt={activity.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl text-dark-gray mb-2">{activity.name}</h3>
                    <p className="text-gray-600 mb-4">{activity.description}</p>
                    <span className="text-sm text-primary-green font-medium">{activity.frequency}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/activities">
              <Button className="bg-primary-green hover:bg-primary-green/90 text-white">
                Xem thêm hoạt động
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Tin tức mới nhất</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cập nhật những thông tin mới nhất về hoạt động của trường
            </p>
          </div>

          {articlesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-light-gray rounded-xl overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6">
                    <Skeleton className="h-4 w-1/3 mb-3" />
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles?.slice(0, 3).map((article) => (
                <Card key={article.id} className="bg-light-gray rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={article.imageUrl || "https://images.unsplash.com/photo-1497486751825-1233686d5d80"} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <i className="fas fa-calendar-alt mr-2"></i>
                      <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN') : 'Mới đăng'}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-dark-gray mb-3">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {article.excerpt}
                    </p>
                    <Link href={`/news/${article.id}`} className="text-primary-green font-medium hover:text-primary-green/80">
                      Đọc thêm <i className="fas fa-arrow-right ml-1"></i>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/news">
              <Button className="bg-primary-green hover:bg-primary-green/90 text-white">
                Xem tất cả tin tức
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
      <SocialMediaSection />
    </div>
  );
}
