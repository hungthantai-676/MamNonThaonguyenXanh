import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Article, Program, Activity } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [siteSettings, setSiteSettings] = useState({
    phone: "0856318686",
    email: "mamnonthaonguyenxanh@gmail.com",
    address: "Toà nhà Thảo Nguyên Xanh, đường Lý Thái Tổ, tổ 4, phường Phù Vân, tỉnh Ninh Bình",
    mapUrl: "https://maps.google.com/maps?q=Lý+Thái+Tổ,+Phù+Vân,+Ninh+Bình,+Vietnam&output=embed"
  });

  const { data: articles } = useQuery<Article[]>({ queryKey: ["/api/articles"] });
  const { data: programs } = useQuery<Program[]>({ queryKey: ["/api/programs"] });
  const { data: activities } = useQuery<Activity[]>({ queryKey: ["/api/activities"] });

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: typeof siteSettings) => {
      const response = await apiRequest("PUT", "/api/admin/settings", settings);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin website đã được cập nhật",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật thông tin",
        variant: "destructive",
      });
    }
  });

  const createArticleMutation = useMutation({
    mutationFn: async (article: { title: string; content: string; category: string }) => {
      const response = await apiRequest("POST", "/api/articles", article);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Tạo bài viết thành công",
        description: "Bài viết mới đã được thêm vào website",
      });
    }
  });

  const updateProgramMutation = useMutation({
    mutationFn: async ({ id, tuition }: { id: number; tuition: number }) => {
      const response = await apiRequest("PUT", `/api/programs/${id}`, { tuition });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: "Cập nhật học phí thành công",
        description: "Học phí đã được cập nhật",
      });
    }
  });

  const logout = () => {
    localStorage.removeItem("admin-token");
    setLocation("/admin/login");
  };

  const handleSettingsUpdate = () => {
    updateSettingsMutation.mutate(siteSettings);
  };

  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    category: "news"
  });

  const handleCreateArticle = () => {
    if (newArticle.title && newArticle.content) {
      createArticleMutation.mutate(newArticle);
      setNewArticle({ title: "", content: "", category: "news" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dark-gray">Quản trị website</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Chào mừng quản trị viên</span>
            <Button variant="outline" onClick={logout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Cài đặt chung</TabsTrigger>
            <TabsTrigger value="articles">Bài viết</TabsTrigger>
            <TabsTrigger value="programs">Chương trình</TabsTrigger>
            <TabsTrigger value="activities">Hoạt động</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
                <CardDescription>Cập nhật thông tin liên hệ của trường</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={siteSettings.phone}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={siteSettings.email}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Textarea
                    id="address"
                    value={siteSettings.address}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="mapUrl">Google Maps URL</Label>
                  <Input
                    id="mapUrl"
                    value={siteSettings.mapUrl}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, mapUrl: e.target.value }))}
                    placeholder="https://maps.google.com/maps?q=..."
                  />
                </div>
                <Button onClick={handleSettingsUpdate} disabled={updateSettingsMutation.isPending}>
                  {updateSettingsMutation.isPending ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tạo bài viết mới</CardTitle>
                  <CardDescription>Thêm tin tức và thông báo mới</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input
                      id="title"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Nội dung</Label>
                    <Textarea
                      id="content"
                      value={newArticle.content}
                      onChange={(e) => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Danh mục</Label>
                    <select
                      id="category"
                      value={newArticle.category}
                      onChange={(e) => setNewArticle(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="news">Tin tức</option>
                      <option value="announcement">Thông báo</option>
                      <option value="event">Sự kiện</option>
                    </select>
                  </div>
                  <Button onClick={handleCreateArticle} disabled={createArticleMutation.isPending}>
                    {createArticleMutation.isPending ? "Đang tạo..." : "Tạo bài viết"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danh sách bài viết ({articles?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {articles?.map((article) => (
                      <div key={article.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{article.title}</h3>
                        <p className="text-sm text-gray-600">{article.category}</p>
                        <p className="text-sm mt-2">{article.content.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý chương trình học</CardTitle>
                <CardDescription>Cập nhật thông tin và học phí các chương trình</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programs?.map((program) => (
                    <div key={program.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{program.name}</h3>
                          <p className="text-sm text-gray-600">{program.description}</p>
                          <p className="text-sm">Độ tuổi: {program.ageRange}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-green">
                            {program.tuition.toLocaleString('vi-VN')} VNĐ/tháng
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động trường học</CardTitle>
                <CardDescription>Quản lý các hoạt động và sự kiện</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities?.map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{activity.name}</h3>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-sm mt-2">Ngày: {new Date(activity.date).toLocaleDateString('vi-VN')}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}