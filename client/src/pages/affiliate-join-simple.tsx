import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  name: z.string().min(1, "Tên không được trống"),
  username: z.string().min(3, "Username phải ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  memberType: z.enum(["teacher", "parent"]),
});

type FormData = z.infer<typeof schema>;

export default function AffiliateJoinSimple() {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);

  console.log('🟢 AffiliateJoinSimple component rendered - USERNAME FIELD INCLUDED');

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      memberType: "parent",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      console.log('🟢 Registering with data:', data);
      const response = await apiRequest("POST", "/api/affiliate/register", data);
      return response.json();
    },
    onSuccess: () => {
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

  const onSubmit = (data: FormData) => {
    console.log('🟢 Form submitted with username:', data.username);
    registerMutation.mutate(data);
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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Đăng ký thành viên affiliate - SIMPLE VERSION</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <Input
                {...form.register("name")}
                placeholder="Nhập họ và tên"
                className="w-full"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* USERNAME FIELD - HIGHLIGHTED */}
            <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded">
              <label className="block text-lg font-bold text-red-600 mb-2">
                🔥 TÊN ĐĂNG NHẬP (BẮT BUỘC) 🔥
              </label>
              <Input
                {...form.register("username")}
                placeholder="Ví dụ: nguyenvana123"
                className="w-full border-2 border-red-400 h-12 text-lg font-medium"
              />
              {form.formState.errors.username && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.username.message}</p>
              )}
              <p className="text-red-700 font-bold mt-2 text-sm">
                ⚠️ Chỉ được dùng chữ cái, số và dấu gạch dưới (_)
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                {...form.register("email")}
                type="email"
                placeholder="email@example.com"
                className="w-full"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <Input
                {...form.register("phone")}
                placeholder="0123456789"
                className="w-full"
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>

            {/* Member Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Loại thành viên</label>
              <select {...form.register("memberType")} className="w-full p-2 border rounded">
                <option value="parent">Phụ huynh</option>
                <option value="teacher">Giáo viên</option>
              </select>
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