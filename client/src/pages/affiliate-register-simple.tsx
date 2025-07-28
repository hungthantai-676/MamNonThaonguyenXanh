import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AffiliateRegisterSimple() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    memberType: "parent"
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  console.log('🟢 SIMPLE REGISTER COMPONENT LOADED - USERNAME FIELD GUARANTEED');

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('🟢 Submitting registration:', data);
      const response = await apiRequest("POST", "/api/affiliate/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('🟢 Registration success:', data);
      setShowSuccess(true);
      toast({
        title: "Đăng ký thành công!",
        description: "Đang chuyển vào trang thành viên...",
      });
      
      // Auto redirect to member page after 2 seconds
      setTimeout(() => {
        setLocation("/affiliate/member");
      }, 2000);
    },
    onError: (error) => {
      console.error('🔴 Registration error:', error);
      toast({
        title: "Lỗi đăng ký",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: typeof loginData) => {
      console.log('🟢 Login attempt:', data.username);
      const response = await apiRequest("POST", "/api/affiliate/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('🟢 Login success:', data);
      toast({
        title: "Đăng nhập thành công!",
        description: "Đang chuyển vào trang thành viên...",
      });
      
      // Store login info in localStorage
      localStorage.setItem("affiliate-token", data.token || "logged-in");
      localStorage.setItem("affiliate-user", JSON.stringify(data.user));
      
      // Redirect to member page
      setTimeout(() => {
        setLocation("/affiliate/member");
      }, 1500);
    },
    onError: (error) => {
      console.error('🔴 Login error:', error);
      toast({
        title: "Lỗi đăng nhập",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🟢 Form submitted with username:', formData.username);
    
    // Basic validation
    if (!formData.name || !formData.username || !formData.email || !formData.phone) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    if (formData.username.length < 3) {
      toast({
        title: "Lỗi",
        description: "Tên đăng nhập phải có ít nhất 3 ký tự",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate(formData);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate(loginData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">🎉 Đăng ký thành công!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Tài khoản affiliate của bạn đã được tạo thành công.
            </p>
            <p className="font-bold mb-4">Tên đăng nhập: {formData.username}</p>
            <div className="animate-pulse text-blue-600 mb-4">
              Đang chuyển vào trang thành viên...
            </div>
            <Button 
              onClick={() => setLocation("/affiliate/member")}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Vào trang thành viên ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">
            {showLogin ? "🔑 Đăng nhập" : "📝 Đăng ký"} Affiliate
          </CardTitle>
          <div className="flex space-x-2 mt-4">
            <Button
              variant={!showLogin ? "default" : "outline"}
              onClick={() => setShowLogin(false)}
              className="flex-1"
            >
              Đăng ký
            </Button>
            <Button
              variant={showLogin ? "default" : "outline"}
              onClick={() => setShowLogin(true)}
              className="flex-1"
            >
              Đăng nhập
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!showLogin ? (
            // Registration Form
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Họ và tên *</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tên đăng nhập *</label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Ví dụ: nguyenvana123"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="0123456789"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Loại thành viên *</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="parent"
                      checked={formData.memberType === "parent"}
                      onChange={(e) => handleChange("memberType", e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>Phụ huynh - Đại sứ thương hiệu</span>
                  </label>
                  <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="teacher"
                      checked={formData.memberType === "teacher"}
                      onChange={(e) => handleChange("memberType", e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>Giáo viên - Chăm sóc phụ huynh</span>
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Đang đăng ký..." : "ĐĂNG KÝ NGAY"}
              </Button>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tên đăng nhập *</label>
                <Input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mật khẩu *</label>
                <Input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}