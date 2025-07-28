import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AffiliateRegisterSimple() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    memberType: "parent"
  });
  const [showSuccess, setShowSuccess] = useState(false);

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
        description: "Tài khoản affiliate đã được tạo",
      });
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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-green-600">Đăng ký thành công!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tài khoản affiliate đã được tạo thành công.</p>
            <p className="mt-2 font-bold">Tên đăng nhập: {formData.username}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🔥 AFFILIATE REGISTER - USERNAME FIELD TEST 🔥</CardTitle>
          <div className="bg-red-500 text-white p-2 rounded font-bold">
            COMPONENT LOADED SUCCESSFULLY - USERNAME FIELD BELOW
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Họ và tên *</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nhập họ và tên"
                className="w-full"
                required
              />
            </div>

            {/* USERNAME FIELD - SUPER VISIBLE */}
            <div className="bg-red-100 border-4 border-red-500 p-6 rounded-lg">
              <label className="block text-2xl font-bold text-red-800 mb-3">
                🚨 TÊN ĐĂNG NHẬP (BẮT BUỘC) 🚨
              </label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Ví dụ: nguyenvana123"
                className="w-full border-4 border-red-600 focus:border-red-800 h-16 text-xl font-bold bg-white"
                required
              />
              <div className="bg-red-200 p-4 mt-3 rounded border-2 border-red-600">
                <p className="text-red-800 font-bold">
                  ⚠️ Tên đăng nhập hiện tại: {formData.username || "(chưa nhập)"}
                </p>
                <p className="text-red-700 text-sm mt-1">
                  Chỉ được dùng chữ cái, số và dấu gạch dưới (_). Tối thiểu 3 ký tự.
                </p>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                className="w-full"
                required
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="0123456789"
                className="w-full"
                required
              />
            </div>

            {/* Member Type */}
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
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Đang đăng ký..." : "ĐĂNG KÝ NGAY"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}