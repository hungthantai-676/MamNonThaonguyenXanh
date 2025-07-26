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

  // Quay lại dashboard
  const handleBackToDashboard = () => {
    setLocation('/admin/dashboard');
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
            Quản lý nội dung các trang chính của website
          </p>
        </div>

        {/* Grid layout thay vì tabs phức tạp */}
        <div className="grid gap-6">
          
          {/* Quản lý Bài viết */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>📰 Quản lý Tin tức & Bài viết</div>
                <Button variant="outline" onClick={() => setLocation('/admin/dashboard')}>
                  Chi tiết trong Dashboard
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(articles as any[]).slice(0, 6).map((article: any) => (
                  <div key={article.id} className="border p-4 rounded-lg">
                    <h4 className="font-semibold text-sm">{article.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{article.category}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive">
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
                <Button variant="outline" onClick={() => setLocation('/admin/dashboard')}>
                  Chi tiết trong Dashboard
                </Button>
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
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive">
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
                <Button variant="outline" onClick={() => setLocation('/admin/dashboard')}>
                  Chi tiết trong Dashboard
                </Button>
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
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>⚡ Truy cập nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => setLocation('/admin/dashboard')}
                >
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="text-sm">Trang chủ</div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => setLocation('/admin/dashboard')}
                >
                  <div className="text-2xl mb-2">ℹ️</div>
                  <div className="text-sm">Giới thiệu</div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => setLocation('/admin/dashboard')}
                >
                  <div className="text-2xl mb-2">🎓</div>
                  <div className="text-sm">Tuyển sinh</div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => setLocation('/admin/dashboard')}
                >
                  <div className="text-2xl mb-2">📞</div>
                  <div className="text-sm">Liên hệ</div>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}