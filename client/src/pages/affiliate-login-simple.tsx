import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Eye, EyeOff, UserPlus, RotateCcw } from "lucide-react";
import { Link } from "wouter";

export default function AffiliateLoginSimple() {
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotData, setForgotData] = useState({
    email: "",
    username: ""
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: typeof loginData) => {
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
      localStorage.setItem("affiliate-user", JSON.stringify(data.user || data.member));
      localStorage.setItem("affiliate-login-time", Date.now().toString());
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/affiliate-dashboard";
      }, 1500);
    },
    onError: (error: any) => {
      console.error('🔴 Login error:', error);
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Tên đăng nhập hoặc mật khẩu không đúng",
        variant: "destructive",
      });
    }
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: typeof forgotData) => {
      const response = await apiRequest("POST", "/api/affiliate/reset-password", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Đặt lại mật khẩu thành công!",
        description: `Mật khẩu tạm thời: ${data.tempPassword}`,
      });
      setShowForgotPassword(false);
      setLoginData({ ...loginData, password: data.tempPassword });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi đặt lại mật khẩu",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(loginData);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotData.email && !forgotData.username) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập email hoặc tên đăng nhập",
        variant: "destructive",
      });
      return;
    }
    forgotPasswordMutation.mutate(forgotData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          
          {!showForgotPassword ? (
            // LOGIN FORM
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-6">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <LogIn className="w-6 h-6" />
                  Đăng nhập Affiliate
                </CardTitle>
                <p className="text-green-100 text-sm">Truy cập hệ thống kiếm thưởng</p>
              </CardHeader>
              
              <CardContent className="p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tên đăng nhập</label>
                    <Input
                      type="text"
                      placeholder="Nhập tên đăng nhập"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      className="w-full"
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mật khẩu</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full pr-12"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Quên mật khẩu?
                  </button>

                  <div className="text-center pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Chưa có tài khoản?</p>
                    <Link href="/affiliate-register">
                      <Button variant="outline" className="w-full">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Đăng ký mới
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // FORGOT PASSWORD FORM
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-6">
                <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Đặt lại mật khẩu
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={forgotData.email}
                      onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tên đăng nhập</label>
                    <Input
                      type="text"
                      placeholder="username"
                      value={forgotData.username}
                      onChange={(e) => setForgotData({ ...forgotData, username: e.target.value })}
                      className="w-full"
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    Nhập email hoặc tên đăng nhập để nhận mật khẩu tạm thời
                  </p>

                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Hủy
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? "Đang xử lý..." : "Đặt lại"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}