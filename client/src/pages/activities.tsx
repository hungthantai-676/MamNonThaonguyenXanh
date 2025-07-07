import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ActivityCard from "@/components/activity-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Activity } from "@shared/schema";

export default function Activities() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-green/10 to-secondary-blue/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-4xl md:text-5xl text-dark-gray mb-4">
            Hoạt động & Sự kiện
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những hoạt động đa dạng và phong phú giúp trẻ phát triển toàn diện về thể chất, trí tuệ và cảm xúc
          </p>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Các hoạt động chính</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Từ hoạt động học tập đến vui chơi giải trí, chúng tôi tổ chức đa dạng các hoạt động phù hợp
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Monthly Calendar */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Lịch sự kiện hàng tháng</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Theo dõi các sự kiện và hoạt động đặc biệt trong tháng
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-7 gap-4 mb-8">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
                <div key={day} className="text-center font-semibold text-dark-gray py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 35 }, (_, i) => {
                const date = i + 1;
                const hasEvent = [5, 12, 18, 25].includes(date);
                return (
                  <div
                    key={i}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg border-2 text-sm
                      ${hasEvent 
                        ? 'bg-primary-green text-white border-primary-green' 
                        : 'border-gray-200 hover:border-primary-green/50'
                      }
                      ${date > 31 ? 'opacity-30' : ''}
                    `}
                  >
                    {date <= 31 ? date : date - 31}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg text-dark-gray mb-4">Sự kiện tháng này</h3>
                <div className="space-y-3">
                  {[
                    { date: '05/12', event: 'Ngày hội thể thao', time: '8:00 - 11:00' },
                    { date: '12/12', event: 'Lễ kỷ niệm thành lập trường', time: '9:00 - 16:00' },
                    { date: '18/12', event: 'Hội thi tài năng nhí', time: '14:00 - 16:00' },
                    { date: '25/12', event: 'Lễ Giáng sinh', time: '9:00 - 11:00' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-light-gray rounded-lg">
                      <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {item.date.split('/')[0]}
                      </div>
                      <div>
                        <div className="font-medium text-dark-gray">{item.event}</div>
                        <div className="text-sm text-gray-600">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-dark-gray mb-4">Hoạt động hàng tuần</h3>
                <div className="space-y-3">
                  {[
                    { day: 'Thứ 2', activity: 'Học tiếng Anh', time: '9:00 - 10:00' },
                    { day: 'Thứ 4', activity: 'Hoạt động STEAM', time: '10:00 - 11:00' },
                    { day: 'Thứ 6', activity: 'Âm nhạc và múa', time: '15:00 - 16:00' },
                    { day: 'Chủ nhật', activity: 'Dã ngoại gia đình', time: '8:00 - 12:00' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-light-gray rounded-lg">
                      <div className="w-12 h-12 bg-secondary-blue rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {item.day.split(' ')[1]}
                      </div>
                      <div>
                        <div className="font-medium text-dark-gray">{item.activity}</div>
                        <div className="text-sm text-gray-600">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Hình ảnh hoạt động</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những khoảnh khắc đáng nhớ trong các hoạt động của trường
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1560785496-3c9d27877182",
              "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
              "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
              "https://images.unsplash.com/photo-1580582932707-520aed937b7b",
              "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9",
              "https://images.unsplash.com/photo-1544717297-fa95b6ee9643"
            ].map((image, index) => (
              <div key={index} className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all">
                <img 
                  src={image} 
                  alt={`Hoạt động ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-primary-green hover:bg-primary-green/90 text-white">
              Xem thêm hình ảnh
            </Button>
          </div>
        </div>
      </section>

      {/* Video Highlights */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Video tổng hợp</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những video ghi lại các hoạt động nổi bật của trường
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Lễ hội Trung thu 2024",
                duration: "5:30",
                thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96"
              },
              {
                title: "Ngày hội thể thao",
                duration: "3:45",
                thumbnail: "https://images.unsplash.com/photo-1560785496-3c9d27877182"
              },
              {
                title: "Hoạt động STEAM",
                duration: "4:20",
                thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
              }
            ].map((video, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <i className="fas fa-play text-primary-green text-xl ml-1"></i>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-dark-gray">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-green to-secondary-blue">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-4xl text-white mb-4">
            Tham gia cùng chúng tôi
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Hãy để con bạn trải nghiệm những hoạt động thú vị và bổ ích tại trường chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admission">
              <Button size="lg" className="bg-white text-primary-green hover:bg-white/90">
                Đăng ký tuyển sinh
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Liên hệ tư vấn
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
