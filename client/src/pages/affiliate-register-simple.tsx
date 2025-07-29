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
    password: "",
    confirmPassword: "",
    memberType: "parent"
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    username: ""
  });

  console.log('🟢 SIMPLE REGISTER COMPONENT LOADED - USERNAME FIELD GUARANTEED');

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('🟢 Submitting registration:', data);
      const response = await apiRequest("POST", "/api/affiliate/register", data);
      return response.json();
    },
    onSuccess: async (data) => {
      console.log('🟢 Registration success:', data);
      toast({
        title: "Đăng ký thành công!",
        description: "Đang tự động đăng nhập...",
      });
      
      // Auto-login after successful registration
      try {
        const loginResponse = await apiRequest("POST", "/api/affiliate/login", {
          username: formData.username,
          password: formData.password
        });
        const loginData = await loginResponse.json();
        
        if (loginData.success) {
          // Store user data in localStorage with timestamp
          localStorage.setItem('affiliate-token', loginData.token || "logged-in");
          localStorage.setItem('affiliate-user', JSON.stringify(loginData.user));
          localStorage.setItem("affiliate-login-time", Date.now().toString());
          
          toast({
            title: "Đăng nhập thành công!",
            description: "Chuyển đến trang thành viên...",
          });
          
          // Redirect to member page
          setTimeout(() => {
            setLocation("/affiliate/member");
          }, 1000);
        } else {
          setShowSuccess(true);
        }
      } catch (loginError) {
        console.error('Auto-login failed:', loginError);
        setShowSuccess(true);
      }
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
      console.log('🟢 Calling endpoint:', "/api/affiliate/login");
      try {
        const response = await apiRequest("POST", "/api/affiliate/login", data);
        console.log('🟢 Response received:', response.status);
        return response.json();
      } catch (error) {
        console.error('🔴 API call failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🟢 Login success:', data);
      toast({
        title: "Đăng nhập thành công!",
        description: "Đang chuyển vào trang thành viên...",
      });
      
      // Store login info in localStorage with timestamp
      localStorage.setItem("affiliate-token", data.token || "logged-in");
      localStorage.setItem("affiliate-user", JSON.stringify(data.user));
      localStorage.setItem("affiliate-login-time", Date.now().toString());
      
      // Redirect to member page
      setTimeout(() => {
        setLocation("/affiliate/member");
      }, 1500);
    },
    onError: (error) => {
      console.error('🔴 Login error:', error);
      
      // Check if it's a 404 error
      if (error.message.includes('404')) {
        toast({
          title: "Lỗi 404 - Không tìm thấy endpoint",
          description: "Đang kiểm tra lại kết nối server...",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi đăng nhập",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🟢 Form submitted with username:', formData.username);
    
    // Basic validation
    if (!formData.name || !formData.username || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
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

    if (formData.password.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate(formData);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate when form is submitted, not on each keystroke
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu",
        variant: "destructive",
      });
      return;
    }

    // Additional validation - only check if password is too short on submit
    if (loginData.password.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate(loginData);
  };

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: typeof forgotPasswordData) => {
      const response = await apiRequest("POST", "/api/affiliate/forgot-password", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Đã gửi email!",
        description: "Vui lòng kiểm tra email để lấy lại mật khẩu",
      });
      setShowForgotPassword(false);
      setShowLogin(true);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordData.email && !forgotPasswordData.username) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập email hoặc tên đăng nhập",
        variant: "destructive",
      });
      return;
    }
    forgotPasswordMutation.mutate(forgotPasswordData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg bg-white">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">🔑 Quên mật khẩu</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">📧 Email đăng ký</label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={forgotPasswordData.email}
                  onChange={(e) => setForgotPasswordData(prev => ({...prev, email: e.target.value}))}
                  className="bg-white border-2 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">🔐 Hoặc tên đăng nhập</label>
                <Input
                  placeholder="Nhập tên đăng nhập"
                  value={forgotPasswordData.username}
                  onChange={(e) => setForgotPasswordData(prev => ({...prev, username: e.target.value}))}
                  className="bg-white border-2 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? "Đang gửi..." : "📤 Gửi email lấy lại mật khẩu"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg"
                onClick={() => setShowForgotPassword(false)}
              >
                ← Quay lại đăng nhập
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg bg-white">
          <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">🎉 Đăng ký thành công!</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-6 bg-white">
            <p className="text-gray-600 mb-4">
              Tài khoản affiliate của bạn đã được tạo thành công.
            </p>
            <p className="font-bold mb-4 text-gray-800">Tên đăng nhập: {formData.username}</p>
            <div className="animate-pulse text-blue-600 mb-4">
              Đang chuyển vào trang thành viên...
            </div>
            <Button 
              onClick={() => setLocation("/affiliate/member")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              🚀 Vào trang thành viên ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg bg-white">
        <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">
            {showLogin ? "🔑 Đăng nhập" : "📝 Đăng ký"} Affiliate
          </CardTitle>
          <div className="flex space-x-2 mt-4">
            <Button
              variant={!showLogin ? "default" : "outline"}
              onClick={() => setShowLogin(false)}
              className={`flex-1 ${!showLogin ? 'bg-white text-green-600 border-2 border-white' : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-green-600'}`}
            >
              Đăng ký
            </Button>
            <Button
              variant={showLogin ? "default" : "outline"}
              onClick={() => setShowLogin(true)}
              className={`flex-1 ${showLogin ? 'bg-white text-blue-600 border-2 border-white' : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600'}`}
            >
              Đăng nhập
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          {!showLogin ? (
            // Registration Form
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">👤 Họ và tên *</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Nhập họ và tên"
                  className="bg-white border-2 border-gray-200 text-black placeholder-gray-500 focus:border-green-500"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">🔐 Tên đăng nhập *</label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Ví dụ: nguyenvana123"
                  className="bg-white border-2 border-gray-200 text-black placeholder-gray-500 focus:border-green-500"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">📧 Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                  className="bg-white border-2 border-gray-200 text-black placeholder-gray-500 focus:border-green-500"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">📱 Số điện thoại *</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="0123456789"
                  className="bg-white border-2 border-gray-200 text-black placeholder-gray-500 focus:border-green-500"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">🔒 Mật khẩu *</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                  className="bg-white border-2 border-gray-200 text-black placeholder-gray-500 focus:border-green-500"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">🔒 Xác nhận mật khẩu *</label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="bg-white border-2 border-gray-200 text-black placeholder-gray-500 focus:border-green-500"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">👥 Loại thành viên *</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all">
                    <input
                      type="radio"
                      value="parent"
                      checked={formData.memberType === "parent"}
                      onChange={(e) => handleChange("memberType", e.target.value)}
                      className="w-5 h-5 text-green-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">👨‍👩‍👧‍👦 Phụ huynh</div>
                      <div className="text-sm text-gray-600">Đại sứ thương hiệu</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                    <input
                      type="radio"
                      value="teacher"
                      checked={formData.memberType === "teacher"}
                      onChange={(e) => handleChange("memberType", e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">👩‍🏫 Giáo viên</div>
                      <div className="text-sm text-gray-600">Chăm sóc phụ huynh</div>
                    </div>
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Đang đăng ký..." : "🎯 ĐĂNG KÝ NGAY"}
              </Button>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">🔐 Tên đăng nhập *</label>
                <Input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Nhập tên đăng nhập"
                  className="bg-white border-2 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">🔒 Mật khẩu *</label>
                <Input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Nhập mật khẩu"
                  className="bg-white border-2 border-gray-200 text-black placeholder-gray-500 focus:border-blue-500"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Đang đăng nhập..." : "🚀 ĐĂNG NHẬP"}
              </Button>
              
              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                  onClick={() => setShowForgotPassword(true)}
                >
                  🔑 Quên mật khẩu?
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}