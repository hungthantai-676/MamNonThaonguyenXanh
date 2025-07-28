import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AffiliateTest() {
  const { toast } = useToast();
  const [regData, setRegData] = useState({
    name: "Test User",
    username: "testuser" + Date.now(),
    email: "testuser" + Date.now() + "@example.com",
    phone: "0123456789",
    memberType: "parent"
  });
  const [loginCode, setLoginCode] = useState("");

  // Test registration
  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/affiliate/register", data);
      return response;
    },
    onSuccess: (data) => {
      console.log("Registration success:", data);
      toast({
        title: "Đăng ký thành công!",
        description: `Tên đăng nhập: ${data.username || data.loginInfo?.username}`,
      });
      setLoginCode(data.username || data.loginInfo?.username || data.memberId || "");
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast({
        title: "Đăng ký thất bại",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Test login
  const loginMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/affiliate/login", { memberCode: code });
      return response;
    },
    onSuccess: (data) => {
      console.log("Login success:", data);
      toast({
        title: "Đăng nhập thành công!",
        description: `Chào mừng ${data.member?.name}`,
      });
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast({
        title: "Đăng nhập thất bại",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Affiliate System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registration Test */}
          <Card>
            <CardHeader>
              <CardTitle>Test Registration</CardTitle>
              <CardDescription>Test affiliate member registration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Tên</Label>
                <Input
                  id="name"
                  value={regData.name}
                  onChange={(e) => setRegData({...regData, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  value={regData.username}
                  onChange={(e) => setRegData({...regData, username: e.target.value})}
                  placeholder="Chỉ chữ, số và dấu gạch dưới"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={regData.email}
                  onChange={(e) => setRegData({...regData, email: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={regData.phone}
                  onChange={(e) => setRegData({...regData, phone: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Loại thành viên</Label>
                <select
                  id="type"
                  value={regData.memberType}
                  onChange={(e) => setRegData({...regData, memberType: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="parent">Phụ huynh</option>
                  <option value="teacher">Giáo viên</option>
                </select>
              </div>
              
              <Button 
                onClick={() => registerMutation.mutate(regData)}
                disabled={registerMutation.isPending}
                className="w-full"
              >
                {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </CardContent>
          </Card>

          {/* Login Test */}
          <Card>
            <CardHeader>
              <CardTitle>Test Login</CardTitle>
              <CardDescription>Test affiliate member login</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="loginCode">Mã thành viên</Label>
                <Input
                  id="loginCode"
                  value={loginCode}
                  onChange={(e) => setLoginCode(e.target.value)}
                  placeholder="Nhập mã thành viên để đăng nhập"
                />
              </div>
              
              <Button 
                onClick={() => loginMutation.mutate(loginCode)}
                disabled={loginMutation.isPending || !loginCode}
                className="w-full"
              >
                {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Member Code Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 Thông tin về Mã thành viên</CardTitle>
            <CardDescription>Cách thức tạo và sử dụng mã thành viên affiliate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🔑 Mã thành viên được tạo như thế nào?</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Tự động tạo</strong>: Khi đăng ký thành công, hệ thống tự động tạo mã UUID duy nhất</li>
                <li>• <strong>Ví dụ</strong>: c9bfc215-8a0a-43ae-9317-2fdf383aca31</li>
                <li>• <strong>Bảo mật</strong>: Mỗi mã chỉ thuộc về 1 thành viên và không thể trùng lặp</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📱 QR Code và Link giới thiệu</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>QR Code</strong>: Tự động tạo khi đăng ký, chứa link giới thiệu</li>
                <li>• <strong>Link F2/F3</strong>: /affiliate/join?ref=[MÃ_THÀNH_VIÊN]</li>
                <li>• <strong>Sử dụng</strong>: Gửi QR hoặc link cho người khác để họ đăng ký dưới bạn</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => setRegData({...regData, email: "user" + Date.now() + "@example.com"})}
                variant="outline"
              >
                🔄 Tạo Email Mới
              </Button>
              
              <Button 
                onClick={() => window.open("/affiliate", "_blank")}
                variant="outline"
              >
                🌐 Mở Trang Affiliate
              </Button>
              
              <Button 
                onClick={() => window.open("/admin/affiliate", "_blank")}
                variant="outline"
              >
                👑 Admin Affiliate
              </Button>
              
              <Button 
                onClick={() => window.open("/affiliate/member", "_blank")}
                variant="outline"
              >
                👤 Xem QR & Link Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}