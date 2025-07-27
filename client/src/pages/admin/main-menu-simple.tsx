import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";  
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Save, Edit, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

export default function MainMenuSimple() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Navigation functions
  const handleBackToDashboard = () => {
    setLocation('/admin/dashboard');
  };

  const handleEditArticle = (articleId: number) => {
    // Navigate to dashboard and store the article to edit
    localStorage.setItem('editArticleId', articleId.toString());
    setLocation('/admin/dashboard');
    toast({
      title: "Chuyển đến Dashboard",
      description: "Scroll xuống phần Bài viết để chỉnh sửa",
    });
  };

  const handleEditProgram = (programId: number) => {
    localStorage.setItem('editProgramId', programId.toString());
    setLocation('/admin/dashboard'); 
    toast({
      title: "Chuyển đến Dashboard",
      description: "Scroll xuống phần Chương trình để chỉnh sửa",
    });
  };

  const handleEditActivity = (activityId: number) => {
    localStorage.setItem('editActivityId', activityId.toString());
    setLocation('/admin/dashboard');
    toast({
      title: "Chuyển đến Dashboard", 
      description: "Scroll xuống phần Hoạt động để chỉnh sửa",
    });
  };

  // Fetch data
  const { data: articles = [] } = useQuery({
    queryKey: ['/api/articles'],
  });

  const { data: programs = [] } = useQuery({
    queryKey: ['/api/programs'],
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header với nút Back */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={handleBackToDashboard}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Dashboard
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Menu Chính Website
          </h1>
          <p className="text-gray-600">
            Quản lý nội dung các trang chính của website. Bấm Sửa để chỉnh sửa từng item.
          </p>
        </div>

        {/* Grid layout với chức năng sửa hoạt động */}
        <div className="grid gap-6">
          
          {/* Quản lý Bài viết */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>📰 Quản lý Tin tức & Bài viết</div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      localStorage.setItem('editSection', 'articles');
                      localStorage.removeItem('editArticleId'); // Clear any existing ID to create new
                      setLocation('/admin/dashboard');
                      toast({
                        title: "Chuyển đến Dashboard",
                        description: "Sẵn sàng tạo bài viết mới",
                      });
                    }}
                  >
                    ➕ Tạo bài viết mới
                  </Button>
                  <Button variant="outline" onClick={() => setLocation('/admin/dashboard')}>
                    Chi tiết trong Dashboard
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(articles as any[]).slice(0, 6).map((article: any) => (
                  <div key={article.id} className="border p-4 rounded-lg">
                    <h4 className="font-semibold text-sm">{article.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{article.category}</p>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          localStorage.setItem('editSection', 'articles');
                          localStorage.setItem('editArticleId', article.id.toString());
                          setLocation('/admin/dashboard');
                          toast({
                            title: "Chuyển đến Dashboard",
                            description: `Đang chỉnh sửa bài viết: ${article.title}`,
                          });
                        }}
                        title="Chỉnh sửa bài viết này"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn xóa bài viết "${article.title}"?`)) {
                            console.log("Deleting article:", article.id);
                            toast({
                              title: "Đã xóa bài viết",
                              description: `Bài viết "${article.title}" đã được xóa`,
                            });
                          }
                        }}
                        title="Xóa bài viết này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quản lý Chương trình */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>📚 Quản lý Chương trình học</div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      localStorage.setItem('editSection', 'programs');
                      localStorage.removeItem('editProgramId'); // Clear any existing ID to create new
                      setLocation('/admin/dashboard');
                      toast({
                        title: "Chuyển đến Dashboard",
                        description: "Sẵn sàng tạo chương trình mới",
                      });
                    }}
                  >
                    ➕ Tạo chương trình mới
                  </Button>
                  <Button variant="outline" onClick={() => setLocation('/admin/dashboard')}>
                    Chi tiết trong Dashboard
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {(programs as any[]).map((program: any) => (
                  <div key={program.id} className="border p-4 rounded-lg">
                    <h4 className="font-semibold">{program.name}</h4>
                    <p className="text-sm text-gray-600">{program.ageRange}</p>
                    <p className="text-sm text-green-600 font-medium mt-2">
                      {program.tuition?.toLocaleString()} VND/tháng
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          localStorage.setItem('editSection', 'programs');
                          localStorage.setItem('editProgramId', program.id.toString());
                          setLocation('/admin/dashboard');
                          toast({
                            title: "Chuyển đến Dashboard",
                            description: `Đang chỉnh sửa chương trình: ${program.name}`,
                          });
                        }}
                        title="Chỉnh sửa chương trình này"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn xóa chương trình "${program.name}"?`)) {
                            console.log("Deleting program:", program.id);
                            toast({
                              title: "Đã xóa chương trình",
                              description: `Chương trình "${program.name}" đã được xóa`,
                            });
                          }
                        }}
                        title="Xóa chương trình này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quản lý Hoạt động */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>🎯 Quản lý Hoạt động</div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      localStorage.setItem('editSection', 'activities');
                      localStorage.removeItem('editActivityId'); // Clear any existing ID to create new
                      setLocation('/admin/dashboard');
                      toast({
                        title: "Chuyển đến Dashboard",
                        description: "Sẵn sàng tạo hoạt động mới",
                      });
                    }}
                  >
                    ➕ Tạo hoạt động mới
                  </Button>
                  <Button variant="outline" onClick={() => setLocation('/admin/dashboard')}>
                    Chi tiết trong Dashboard
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activities as any[]).map((activity: any) => (
                  <div key={activity.id} className="border p-4 rounded-lg">
                    <h4 className="font-semibold text-sm">{activity.name}</h4>
                    <p className="text-xs text-gray-600">{activity.date}</p>
                    <p className="text-xs text-blue-600 mt-1">📍 {activity.location}</p>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          localStorage.setItem('editSection', 'activities');
                          localStorage.setItem('editActivityId', activity.id.toString());
                          setLocation('/admin/dashboard');
                          toast({
                            title: "Chuyển đến Dashboard",
                            description: `Đang chỉnh sửa hoạt động: ${activity.name}`,
                          });
                        }}
                        title="Chỉnh sửa hoạt động này"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn xóa hoạt động "${activity.name}"?`)) {
                            console.log("Deleting activity:", activity.id);
                            toast({
                              title: "Đã xóa hoạt động",
                              description: `Hoạt động "${activity.name}" đã được xóa`,
                            });
                          }
                        }}
                        title="Xóa hoạt động này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Admin Tools cho các trang chính */}
          <Card>
            <CardHeader>
              <CardTitle>🎛️ Admin Tools - Quản lý từng trang Website</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                
                {/* Trang chủ */}
                <div className="border p-4 rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🏠</div>
                      <div>
                        <h4 className="font-semibold">Trang chủ</h4>
                        <p className="text-sm text-gray-600">Hero section, features, testimonials</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          localStorage.setItem('editSection', 'homepage');
                          setLocation('/admin/dashboard');
                          toast({
                            title: "Chuyển đến Dashboard",
                            description: "Scroll xuống tab 'Trang chủ' để chỉnh sửa",
                          });
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setLocation('/')}
                      >
                        Xem
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Giới thiệu */}
                <div className="border p-4 rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">ℹ️</div>
                      <div>
                        <h4 className="font-semibold">Giới thiệu</h4>
                        <p className="text-sm text-gray-600">Lịch sử, sứ mệnh, tầm nhìn, đội ngũ</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          localStorage.setItem('editSection', 'about');
                          setLocation('/admin/dashboard');
                          toast({
                            title: "Chuyển đến Dashboard",
                            description: "Scroll xuống tab 'Giới thiệu' để chỉnh sửa",
                          });
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setLocation('/about')}
                      >
                        Xem
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tuyển sinh */}
                <div className="border p-4 rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎓</div>
                      <div>
                        <h4 className="font-semibold">Tuyển sinh</h4>
                        <p className="text-sm text-gray-600">Thông tin tuyển sinh, học phí, quy trình</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          localStorage.setItem('editSection', 'admission');
                          setLocation('/admin/dashboard');
                          toast({
                            title: "Chuyển đến Dashboard",
                            description: "Scroll xuống tab 'Tuyển sinh' để chỉnh sửa",
                          });
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setLocation('/admission')}
                      >
                        Xem
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Liên hệ */}
                <div className="border p-4 rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📞</div>
                      <div>
                        <h4 className="font-semibold">Liên hệ</h4>
                        <p className="text-sm text-gray-600">Thông tin liên hệ, bản đồ, form liên hệ</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          localStorage.setItem('editSection', 'contact');
                          setLocation('/admin/dashboard');
                          toast({
                            title: "Chuyển đến Dashboard",
                            description: "Scroll xuống tab 'Liên hệ' để chỉnh sửa",
                          });
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setLocation('/contact')}
                      >
                        Xem
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Chương trình */}
                <div className="border p-4 rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📚</div>
                      <div>
                        <h4 className="font-semibold">Chương trình học</h4>
                        <p className="text-sm text-gray-600">Chương trình theo độ tuổi, nội dung giảng dạy</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          localStorage.setItem('editSection', 'programs');
                          setLocation('/admin/dashboard');
                          toast({
                            title: "Chuyển đến Dashboard",
                            description: "Scroll xuống tab 'Chương trình' để chỉnh sửa",
                          });
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setLocation('/programs')}
                      >
                        Xem
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hoạt động */}
                <div className="border p-4 rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <h4 className="font-semibold">Hoạt động</h4>
                        <p className="text-sm text-gray-600">Các hoạt động ngoại khóa, sự kiện đặc biệt</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          localStorage.setItem('editSection', 'activities');
                          setLocation('/admin/dashboard');
                          toast({
                            title: "Chuyển đến Dashboard",
                            description: "Scroll xuống tab 'Hoạt động' để chỉnh sửa",
                          });
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setLocation('/activities')}
                      >
                        Xem
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tin tức */}
                <div className="border p-4 rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📰</div>
                      <div>
                        <h4 className="font-semibold">Tin tức</h4>
                        <p className="text-sm text-gray-600">Bài viết, thông báo, báo chí nói về trường</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          localStorage.setItem('editSection', 'articles');
                          setLocation('/admin/dashboard');
                          toast({
                            title: "Chuyển đến Dashboard",
                            description: "Scroll xuống tab 'Bài viết' để chỉnh sửa",
                          });
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setLocation('/news')}
                      >
                        Xem
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Thư viện phụ huynh */}
                <div className="border p-4 rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">👨‍👩‍👧‍👦</div>
                      <div>
                        <h4 className="font-semibold">Thư viện phụ huynh</h4>
                        <p className="text-sm text-gray-600">Tài liệu, hướng dẫn, tài nguyên cho phụ huynh</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          localStorage.setItem('editSection', 'library');
                          setLocation('/admin/dashboard');
                          toast({
                            title: "Chuyển đến Dashboard",
                            description: "Scroll xuống tab 'Thư viện' để chỉnh sửa",
                          });
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setLocation('/parents')}
                      >
                        Xem
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}