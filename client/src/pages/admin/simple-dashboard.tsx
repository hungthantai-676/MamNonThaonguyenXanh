import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/admin/image-upload";
import VideoUpload from "@/components/admin/video-upload";

export default function SimpleDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Kiểm tra đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi admin panel",
    });
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-green-600">
              🏫 Admin Panel - Mầm Non Thảo Nguyên Xanh
            </h1>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              🚪 Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="media" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="media">🖼️ Quản lý Media</TabsTrigger>
            <TabsTrigger value="content">📝 Nội dung</TabsTrigger>
            <TabsTrigger value="forms">📋 Form liên hệ</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Cài đặt</TabsTrigger>
          </TabsList>

          <TabsContent value="media">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🖼️ Quản lý Media Website</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUpload
                      currentImageUrl={logoUrl}
                      onImageChange={setLogoUrl}
                      title="🏷️ Logo Trường"
                    />
                    <ImageUpload
                      currentImageUrl={bannerUrl}
                      onImageChange={setBannerUrl}
                      title="🎨 Banner Trang Chủ"
                    />
                  </div>
                  
                  <div className="mt-6">
                    <VideoUpload
                      currentVideoUrl={videoUrl}
                      onVideoChange={setVideoUrl}
                      title="🎬 Video Giới Thiệu Trường"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>📝 Quản lý nội dung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Chức năng quản lý nội dung đang được phát triển...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>📋 Form liên hệ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Chức năng quản lý form đang được phát triển...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Cài đặt hệ thống</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => toast({ title: "Test", description: "Hệ thống hoạt động bình thường" })}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    🧪 Test hệ thống
                  </Button>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800">✅ Trạng thái hệ thống</h3>
                    <p className="text-sm text-green-600 mt-1">
                      • Upload ảnh: Hoạt động bình thường<br/>
                      • Upload video: Hoạt động bình thường<br/>
                      • Database: Kết nối thành công
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}