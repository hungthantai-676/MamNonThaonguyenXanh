import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Article, Program, Activity } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: articles } = useQuery<Article[]>({ queryKey: ["/api/articles"] });
  const { data: programs } = useQuery<Program[]>({ queryKey: ["/api/programs"] });
  const { data: activities } = useQuery<Activity[]>({ queryKey: ["/api/activities"] });

  // Form states
  const [contactInfo, setContactInfo] = useState({
    phone: "0856318686",
    email: "mamnonthaonguyenxanh@gmail.com",
    address: "Toà nhà Thảo Nguyên Xanh, đường Lý Thái Tổ, tổ 4, phường Phù Vân, tỉnh Ninh Bình",
    mapUrl: "https://maps.google.com/maps?q=Lý+Thái+Tổ,+Phù+Vân,+Ninh+Bình,+Vietnam&output=embed"
  });

  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    category: "news",
    imageUrl: ""
  });

  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Edit states
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Mutations
  const createArticleMutation = useMutation({
    mutationFn: async (article: typeof newArticle) => {
      const response = await apiRequest("POST", "/api/articles", article);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Tạo bài viết thành công",
        description: "Bài viết mới đã được thêm vào website",
      });
      setNewArticle({ title: "", content: "", category: "news", imageUrl: "" });
    }
  });

  const updateArticleMutation = useMutation({
    mutationFn: async (article: Article) => {
      const response = await apiRequest("PUT", `/api/articles/${article.id}`, article);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Cập nhật bài viết thành công",
        description: "Bài viết đã được cập nhật",
      });
      setEditingArticle(null);
    }
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/articles/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Xóa bài viết thành công",
        description: "Bài viết đã được xóa khỏi website",
      });
    }
  });

  const updateProgramMutation = useMutation({
    mutationFn: async (program: Program) => {
      const response = await apiRequest("PUT", `/api/programs/${program.id}`, program);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: "Cập nhật chương trình thành công",
        description: "Chương trình đã được cập nhật",
      });
      setEditingProgram(null);
    }
  });

  const updateActivityMutation = useMutation({
    mutationFn: async (activity: Activity) => {
      const response = await apiRequest("PUT", `/api/activities/${activity.id}`, activity);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Cập nhật hoạt động thành công",
        description: "Hoạt động đã được cập nhật",
      });
      setEditingActivity(null);
    }
  });

  const logout = () => {
    localStorage.removeItem("admin-token");
    setLocation("/admin/login");
  };

  const handleCreateArticle = () => {
    if (newArticle.title && newArticle.content) {
      createArticleMutation.mutate(newArticle);
    }
  };

  const saveContactInfo = () => {
    toast({
      title: "Lưu thông tin thành công",
      description: "Thông tin liên hệ đã được cập nhật",
    });
  };

  const handleImageUpload = (type: 'logo' | 'banner' | 'article') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'logo') setLogoUrl(result);
        else if (type === 'banner') setBannerUrl(result);
        else if (type === 'article') setNewArticle(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setVideoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dark-gray">🏫 Quản trị Mầm Non Thảo Nguyên Xanh</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Xin chào Admin</span>
            <Button variant="outline" onClick={logout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="contact" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="contact">📞 Liên hệ</TabsTrigger>
            <TabsTrigger value="media">🖼️ Ảnh/Video</TabsTrigger>
            <TabsTrigger value="articles">📰 Bài viết</TabsTrigger>
            <TabsTrigger value="programs">📚 Chương trình</TabsTrigger>
            <TabsTrigger value="activities">🎯 Hoạt động</TabsTrigger>
          </TabsList>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>📞 Thông tin liên hệ</CardTitle>
                <CardDescription>Cập nhật thông tin liên hệ của trường</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">📱 Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="0123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">✉️ Email</Label>
                    <Input
                      id="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">📍 Địa chỉ</Label>
                  <Textarea
                    id="address"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    placeholder="Nhập địa chỉ trường..."
                  />
                </div>
                <div>
                  <Label htmlFor="mapUrl">🗺️ Google Maps URL</Label>
                  <Input
                    id="mapUrl"
                    value={contactInfo.mapUrl}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, mapUrl: e.target.value }))}
                    placeholder="https://maps.google.com/maps?q=..."
                  />
                </div>
                <Button onClick={saveContactInfo} className="w-full">
                  💾 Lưu thông tin liên hệ
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🖼️ Quản lý ảnh và video</CardTitle>
                  <CardDescription>Upload ảnh logo, banner và video giới thiệu</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label>🏷️ Logo trường</Label>
                      <div className="mt-2 space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload('logo')}
                          className="cursor-pointer"
                        />
                        {logoUrl && (
                          <div className="border rounded-lg p-2">
                            <img src={logoUrl} alt="Logo" className="max-w-full h-20 object-contain" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>🎨 Banner trang chủ</Label>
                      <div className="mt-2 space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload('banner')}
                          className="cursor-pointer"
                        />
                        {bannerUrl && (
                          <div className="border rounded-lg p-2">
                            <img src={bannerUrl} alt="Banner" className="max-w-full h-20 object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>🎬 Video giới thiệu</Label>
                    <div className="mt-2 space-y-2">
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="cursor-pointer"
                      />
                      {videoUrl && (
                        <div className="border rounded-lg p-2">
                          <video controls className="max-w-full h-32">
                            <source src={videoUrl} type="video/mp4" />
                            Trình duyệt không hỗ trợ video.
                          </video>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>📝 Tạo bài viết mới</CardTitle>
                  <CardDescription>Thêm tin tức và thông báo mới</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">📰 Tiêu đề</Label>
                    <Input
                      id="title"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Nhập tiêu đề bài viết..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">📂 Danh mục</Label>
                    <select
                      id="category"
                      value={newArticle.category}
                      onChange={(e) => setNewArticle(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="news">📰 Tin tức</option>
                      <option value="announcement">📢 Thông báo</option>
                      <option value="event">🎉 Sự kiện</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="articleImage">🖼️ Ảnh bài viết</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload('article')}
                      className="cursor-pointer"
                    />
                    {newArticle.imageUrl && (
                      <div className="mt-2 border rounded-lg p-2">
                        <img src={newArticle.imageUrl} alt="Article" className="max-w-full h-32 object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="content">📝 Nội dung</Label>
                    <Textarea
                      id="content"
                      value={newArticle.content}
                      onChange={(e) => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                      placeholder="Nhập nội dung bài viết..."
                    />
                  </div>
                  <Button onClick={handleCreateArticle} disabled={createArticleMutation.isPending} className="w-full">
                    {createArticleMutation.isPending ? "Đang tạo..." : "✨ Tạo bài viết"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📋 Danh sách bài viết ({articles?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {articles?.map((article) => (
                      <div key={article.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{article.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {article.category === 'news' ? '📰' : article.category === 'announcement' ? '📢' : '🎉'} {article.category}
                            </p>
                            <p className="text-sm mt-2 text-gray-700">{article.content.substring(0, 100)}...</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <div className="text-xs text-gray-500">
                              {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingArticle(article)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                ✏️ Sửa
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteArticleMutation.mutate(article.id)}
                                className="text-red-600 hover:text-red-800"
                                disabled={deleteArticleMutation.isPending}
                              >
                                🗑️ Xóa
                              </Button>
                            </div>
                          </div>
                        </div>
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
                <CardTitle>📚 Chương trình học</CardTitle>
                <CardDescription>Quản lý các chương trình và học phí</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programs?.map((program) => (
                    <div key={program.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{program.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                          <p className="text-sm mt-2">
                            <span className="font-medium">Độ tuổi:</span> {program.ageRange} | 
                            <span className="font-medium"> Sỉ số:</span> {program.capacity} học sinh
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary-green">
                            {program.tuition.toLocaleString('vi-VN')} VNĐ/tháng
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Cập nhật: {new Date(program.updatedAt).toLocaleDateString('vi-VN')}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingProgram(program)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️ Sửa
                            </Button>
                          </div>
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
                <CardTitle>🎯 Hoạt động trường học</CardTitle>
                <CardDescription>Quản lý các hoạt động và sự kiện</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities?.map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{activity.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-sm mt-2">
                            <span className="font-medium">📅 Ngày:</span> {new Date(activity.date).toLocaleDateString('vi-VN')}
                          </p>
                          {activity.location && (
                            <p className="text-sm">
                              <span className="font-medium">📍 Địa điểm:</span> {activity.location}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          {activity.imageUrl && (
                            <div>
                              <img src={activity.imageUrl} alt={activity.name} className="w-16 h-16 object-cover rounded" />
                            </div>
                          )}
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingActivity(activity)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️ Sửa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Article Modal */}
      <Dialog open={!!editingArticle} onOpenChange={() => setEditingArticle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>✏️ Chỉnh sửa bài viết</DialogTitle>
          </DialogHeader>
          {editingArticle && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">📰 Tiêu đề</Label>
                <Input
                  id="edit-title"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </div>
              <div>
                <Label htmlFor="edit-category">📂 Danh mục</Label>
                <select
                  id="edit-category"
                  value={editingArticle.category}
                  onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="news">📰 Tin tức</option>
                  <option value="announcement">📢 Thông báo</option>
                  <option value="event">🎉 Sự kiện</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-image">🖼️ Ảnh bài viết</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const result = e.target?.result as string;
                        setEditingArticle({ ...editingArticle, imageUrl: result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="cursor-pointer"
                />
                {editingArticle.imageUrl && (
                  <div className="mt-2 border rounded-lg p-2">
                    <img src={editingArticle.imageUrl} alt="Article" className="max-w-full h-32 object-cover" />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="edit-content">📝 Nội dung</Label>
                <Textarea
                  id="edit-content"
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  rows={6}
                  placeholder="Nhập nội dung bài viết..."
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => updateArticleMutation.mutate(editingArticle)}
                  disabled={updateArticleMutation.isPending}
                  className="flex-1"
                >
                  {updateArticleMutation.isPending ? "Đang cập nhật..." : "💾 Cập nhật bài viết"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingArticle(null)}
                  className="flex-1"
                >
                  ❌ Hủy
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Program Modal */}
      <Dialog open={!!editingProgram} onOpenChange={() => setEditingProgram(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>✏️ Chỉnh sửa chương trình</DialogTitle>
          </DialogHeader>
          {editingProgram && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-program-name">📚 Tên chương trình</Label>
                <Input
                  id="edit-program-name"
                  value={editingProgram.name}
                  onChange={(e) => setEditingProgram({ ...editingProgram, name: e.target.value })}
                  placeholder="Nhập tên chương trình..."
                />
              </div>
              <div>
                <Label htmlFor="edit-program-description">📝 Mô tả</Label>
                <Textarea
                  id="edit-program-description"
                  value={editingProgram.description}
                  onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                  rows={4}
                  placeholder="Nhập mô tả chương trình..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-program-age">👶 Độ tuổi</Label>
                  <Input
                    id="edit-program-age"
                    value={editingProgram.ageRange}
                    onChange={(e) => setEditingProgram({ ...editingProgram, ageRange: e.target.value })}
                    placeholder="VD: 2-3 tuổi"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-program-capacity">👥 Sỉ số</Label>
                  <Input
                    type="number"
                    id="edit-program-capacity"
                    value={editingProgram.capacity}
                    onChange={(e) => setEditingProgram({ ...editingProgram, capacity: parseInt(e.target.value) || 0 })}
                    placeholder="Số học sinh"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-program-tuition">💰 Học phí (VNĐ)</Label>
                <Input
                  type="number"
                  id="edit-program-tuition"
                  value={editingProgram.tuition}
                  onChange={(e) => setEditingProgram({ ...editingProgram, tuition: parseInt(e.target.value) || 0 })}
                  placeholder="Học phí hàng tháng"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => updateProgramMutation.mutate(editingProgram)}
                  disabled={updateProgramMutation.isPending}
                  className="flex-1"
                >
                  {updateProgramMutation.isPending ? "Đang cập nhật..." : "💾 Cập nhật chương trình"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingProgram(null)}
                  className="flex-1"
                >
                  ❌ Hủy
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Activity Modal */}
      <Dialog open={!!editingActivity} onOpenChange={() => setEditingActivity(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>✏️ Chỉnh sửa hoạt động</DialogTitle>
          </DialogHeader>
          {editingActivity && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-activity-name">🎯 Tên hoạt động</Label>
                <Input
                  id="edit-activity-name"
                  value={editingActivity.name}
                  onChange={(e) => setEditingActivity({ ...editingActivity, name: e.target.value })}
                  placeholder="Nhập tên hoạt động..."
                />
              </div>
              <div>
                <Label htmlFor="edit-activity-description">📝 Mô tả</Label>
                <Textarea
                  id="edit-activity-description"
                  value={editingActivity.description}
                  onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                  rows={4}
                  placeholder="Nhập mô tả hoạt động..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-activity-date">📅 Ngày</Label>
                  <Input
                    type="date"
                    id="edit-activity-date"
                    value={editingActivity.date ? new Date(editingActivity.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, date: new Date(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-activity-location">📍 Địa điểm</Label>
                  <Input
                    id="edit-activity-location"
                    value={editingActivity.location || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })}
                    placeholder="Nhập địa điểm..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-activity-frequency">🔄 Tần suất</Label>
                <Input
                  id="edit-activity-frequency"
                  value={editingActivity.frequency}
                  onChange={(e) => setEditingActivity({ ...editingActivity, frequency: e.target.value })}
                  placeholder="VD: Hàng tuần, Hàng tháng..."
                />
              </div>
              <div>
                <Label htmlFor="edit-activity-image">🖼️ Ảnh hoạt động</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const result = e.target?.result as string;
                        setEditingActivity({ ...editingActivity, imageUrl: result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="cursor-pointer"
                />
                {editingActivity.imageUrl && (
                  <div className="mt-2 border rounded-lg p-2">
                    <img src={editingActivity.imageUrl} alt="Activity" className="max-w-full h-32 object-cover" />
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => updateActivityMutation.mutate(editingActivity)}
                  disabled={updateActivityMutation.isPending}
                  className="flex-1"
                >
                  {updateActivityMutation.isPending ? "Đang cập nhật..." : "💾 Cập nhật hoạt động"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingActivity(null)}
                  className="flex-1"
                >
                  ❌ Hủy
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}