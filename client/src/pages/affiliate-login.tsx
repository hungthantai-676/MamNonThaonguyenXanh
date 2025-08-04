import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";

const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu")
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginResult {
  memberId: string;
  username: string;
  name: string;
  memberType: string;
  categoryName: string;
  referralLink: string;
  qrCode: string;
  walletAddress: string;
  tokenBalance: string;
  totalReferrals: number;
  level: number;
}

export default function AffiliateLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginResult, setLoginResult] = useState<LoginResult | null>(null);
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/affiliate/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success || data.user) {
        // Handle both old and new response formats
        const member = data.member || data.user;
        setLoginResult(member);
        
        // Store login info for session persistence
        localStorage.setItem("affiliate-token", data.token || "affiliate-token-" + Date.now());
        localStorage.setItem("affiliate-user", JSON.stringify(member));
        
        toast({
          title: "Đăng nhập thành công!",
          description: `Chào mừng ${member.name || member.fullName}`,
        });
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          window.location.href = `/affiliate-dashboard?member=${member.memberId || member.id}`;
        }, 1500);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Tên đăng nhập hoặc mật khẩu không đúng",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-primary-green to-green-600 text-white text-center py-8">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                <LogIn className="w-6 h-6" />
                Đăng nhập Affiliate
              </CardTitle>
              <p className="mt-2 text-green-100">Truy cập dashboard kiếm thưởng</p>
            </CardHeader>
            
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nhập tên đăng nhập" 
                            {...field}
                            autoComplete="username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Nhập mật khẩu" 
                              {...field}
                              autoComplete="current-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary-green hover:bg-green-600 py-3"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>
              </Form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">Chưa có tài khoản?</p>
                <Link href="/affiliate-register">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary-green text-primary-green hover:bg-green-50"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Đăng ký ngay
                  </Button>
                </Link>
              </div>

              {/* Help Text */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Lưu ý</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Mật khẩu mặc định khi đăng ký là <code className="bg-blue-100 px-1 rounded">123456</code></li>
                  <li>• Vui lòng đổi mật khẩu sau lần đăng nhập đầu tiên</li>
                  <li>• Liên hệ Zalo 0856318686 nếu cần hỗ trợ</li>
                </ul>
              </div>

              {/* Rewards Info */}
              <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">🎁 Thưởng giới thiệu</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">2M VND</div>
                    <div className="text-xs text-gray-600">Giáo viên</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">2,000 điểm</div>
                    <div className="text-xs text-gray-600">Phụ huynh</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}