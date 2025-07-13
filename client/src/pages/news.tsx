import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsCard from "@/components/news-card";
import type { Article, MediaCover } from "@shared/schema";

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: categoryArticles, isLoading: categoryLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles/category", selectedCategory],
    enabled: selectedCategory !== "all",
  });

  const { data: mediaCovers, isLoading: isLoadingMediaCovers } = useQuery<MediaCover[]>({
    queryKey: ["/api/media-covers"],
  });

  const displayArticles = selectedCategory === "all" ? articles : categoryArticles;
  const loading = selectedCategory === "all" ? isLoading : categoryLoading;

  const categories = [
    { id: "all", name: "Tất cả", count: articles?.length || 0 },
    { id: "events", name: "Sự kiện", count: 0 },
    { id: "education", name: "Giáo dục", count: 0 },
    { id: "announcement", name: "Thông báo", count: 0 },
    { id: "activity", name: "Hoạt động", count: 0 }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-green/10 to-secondary-blue/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-4xl md:text-5xl text-dark-gray mb-4">
            Tin tức & Truyền thông
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về hoạt động và sự kiện của trường
          </p>
        </div>
      </section>

      {/* Featured Article */}
      {!loading && displayArticles && displayArticles.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-bold text-4xl text-dark-gray mb-4">Tin nổi bật</h2>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <img 
                    src={displayArticles[0].imageUrl || "https://images.unsplash.com/photo-1497486751825-1233686d5d80"} 
                    alt={displayArticles[0].title}
                    className="w-full h-96 object-cover rounded-xl shadow-lg"
                  />
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <i className="fas fa-calendar-alt mr-2"></i>
                    <span>{new Date(displayArticles[0].publishedAt).toLocaleDateString('vi-VN')}</span>
                    <span className="mx-4">•</span>
                    <span className="bg-primary-green/10 text-primary-green px-2 py-1 rounded-full">
                      {displayArticles[0].category}
                    </span>
                  </div>
                  <h2 className="font-bold text-3xl text-dark-gray mb-4">
                    {displayArticles[0].title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {displayArticles[0].excerpt}
                  </p>
                  <Link href={`/news/${displayArticles[0].id}`}>
                    <Button 
                      className="bg-primary-green hover:bg-primary-green/90 text-white"
                      onClick={() => console.log('Clicked read full article for ID:', displayArticles[0].id)}
                    >
                      Đọc bài viết đầy đủ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Categories and Articles */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-12">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-primary-green data-[state=active]:text-white"
                >
                  {category.name}
                  {category.count > 0 && (
                    <span className="ml-2 bg-primary-green/20 text-primary-green px-2 py-1 rounded-full text-xs">
                      {category.count}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory}>
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden">
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
                  {displayArticles?.slice(1).map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {!loading && displayArticles && displayArticles.length > 6 && (
            <div className="text-center mt-12">
              <Button 
                className="bg-primary-green hover:bg-primary-green/90 text-white"
                onClick={() => {
                  console.log('Clicked "Xem thêm bài viết"');
                  alert('Button clicked - should show more articles');
                }}
              >
                Xem thêm bài viết
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">
              Đăng ký nhận tin tức
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Nhận những thông tin mới nhất về hoạt động của trường qua email
            </p>
            
            <div className="bg-light-gray rounded-xl p-8">
              <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="Nhập địa chỉ email của bạn"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-primary-green"
                />
                <Button 
                  className="bg-primary-green hover:bg-primary-green/90 text-white px-8"
                  onClick={() => {
                    console.log('Clicked "Đăng ký"');
                    alert('Newsletter signup clicked');
                  }}
                >
                  Đăng ký
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Chúng tôi cam kết không spam và bảo mật thông tin của bạn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Feed */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Theo dõi chúng tôi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cập nhật hoạt động hàng ngày qua các kênh mạng xã hội
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                platform: "Facebook",
                handle: "@MamNonThaoNguyenXanh",
                followers: "2.5K",
                icon: "fab fa-facebook-f",
                color: "bg-blue-600",
                preview: "Lễ kỷ niệm 20-11 vừa qua đã diễn ra thành công tốt đẹp với sự tham gia của..."
              },
              {
                platform: "YouTube",
                handle: "Mầm Non Thảo Nguyên Xanh",
                followers: "1.2K",
                icon: "fab fa-youtube",
                color: "bg-red-600",
                preview: "Video hoạt động STEAM - Khám phá khoa học cùng các bé lớp Mẫu giáo..."
              },
              {
                platform: "Instagram",
                handle: "@mamnonthaonguyenxanh",
                followers: "1.8K",
                icon: "fab fa-instagram",
                color: "bg-pink-600",
                preview: "Những khoảnh khắc đáng yêu trong giờ ăn của các bé. Thực đơn hôm nay có..."
              }
            ].map((social, index) => (
              <div key={index} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${social.color} rounded-full flex items-center justify-center mr-4`}>
                    <i className={`${social.icon} text-white text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-gray">{social.platform}</h3>
                    <p className="text-sm text-gray-500">{social.handle}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{social.preview}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {social.followers} người theo dõi
                  </span>
                  <Button variant="outline" size="sm" className="border-primary-green text-primary-green hover:bg-primary-green hover:text-white">
                    Theo dõi
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Báo chí nói về chúng tôi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những bài viết về trường trên các phương tiện truyền thông
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoadingMediaCovers ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-light-gray rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              mediaCovers?.map((coverage) => (
                <div key={coverage.id} className="bg-light-gray rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-primary-green">{coverage.outlet}</span>
                    <span className="text-xs bg-primary-green/10 text-primary-green px-2 py-1 rounded-full">
                      {coverage.type}
                    </span>
                  </div>
                  <h3 className="font-medium text-dark-gray mb-3">{coverage.title}</h3>
                  <p className="text-sm text-gray-500">{coverage.date}</p>
                  {coverage.url && (
                    <a 
                      href={coverage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-green hover:underline text-sm mt-2 block"
                    >
                      Xem bài viết →
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
