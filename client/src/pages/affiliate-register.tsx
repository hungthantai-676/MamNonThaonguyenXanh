import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, QrCode, Wallet, Users, Gift } from "lucide-react";

const affiliateRegisterSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  memberType: z.enum(["teacher", "parent"], { required_error: "Vui lòng chọn vai trò" }),
  categoryName: z.string().min(1, "Vui lòng chọn danh mục"),
  sponsorId: z.string().optional()
});

type AffiliateRegisterForm = z.infer<typeof affiliateRegisterSchema>;

interface RegistrationResult {
  memberId: string;
  username: string;
  name: string;
  referralLink: string;
  qrCode: string;
  walletAddress: string;
}

export default function AffiliateRegister() {
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null);
  const { toast } = useToast();

  const form = useForm<AffiliateRegisterForm>({
    resolver: zodResolver(affiliateRegisterSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      memberType: undefined,
      categoryName: "",
      sponsorId: ""
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: AffiliateRegisterForm) => {
      const response = await apiRequest("POST", "/api/affiliate/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setRegistrationResult(data.member);
        toast({
          title: "Đăng ký thành công!",
          description: "Chúc mừng bạn đã trở thành thành viên affiliate",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive",
      });
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép!",
      description: "Link đã được sao chép vào clipboard",
    });
  };

  const onSubmit = (data: AffiliateRegisterForm) => {
    registerMutation.mutate(data);
  };

  if (registrationResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-primary-green to-green-600 text-white text-center py-8">
                <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
                  <Gift className="w-8 h-8" />
                  Đăng ký thành công!
                </CardTitle>
                <p className="mt-2 text-green-100">Chúc mừng bạn đã trở thành thành viên chương trình affiliate</p>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Account Info */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary-green" />
                        Thông tin tài khoản
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Mã thành viên:</label>
                          <p className="font-bold text-lg text-primary-green">{registrationResult.memberId}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Tên đăng nhập:</label>
                          <p className="font-semibold">{registrationResult.username}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Mật khẩu mặc định:</label>
                          <p className="font-mono bg-yellow-100 px-2 py-1 rounded text-yellow-800">123456</p>
                          <p className="text-xs text-red-600 mt-1">⚠️ Vui lòng đổi mật khẩu sau khi đăng nhập</p>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Info */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-blue-600" />
                        Ví điện tử cá nhân
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Địa chỉ ví:</label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="bg-white px-2 py-1 rounded text-xs font-mono flex-1 break-all">
                              {registrationResult.walletAddress}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(registrationResult.walletAddress)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code & Referral Link */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <h3 className="font-semibold text-lg mb-4 flex items-center justify-center gap-2">
                        <QrCode className="w-5 h-5 text-primary-green" />
                        QR Code của bạn
                      </h3>
                      {registrationResult.qrCode && (
                        <div className="space-y-4">
                          <img 
                            src={registrationResult.qrCode} 
                            alt="QR Code" 
                            className="mx-auto w-48 h-48 border rounded-lg"
                          />
                          <Button
                            variant="outline"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = registrationResult.qrCode;
                              link.download = `QR-${registrationResult.memberId}.png`;
                              link.click();
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Tải QR Code
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Referral Link */}
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">Link giới thiệu</h3>
                      <div className="flex items-center gap-2">
                        <Input
                          value={registrationResult.referralLink}
                          readOnly
                          className="bg-white font-mono text-sm"
                        />
                        <Button
                          onClick={() => copyToClipboard(registrationResult.referralLink)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 text-yellow-800">🎯 Bước tiếp theo</h3>
                  <ul className="space-y-2 text-yellow-700">
                    <li>✅ Lưu thông tin tài khoản một cách an toàn</li>
                    <li>🔑 Đăng nhập và đổi mật khẩu mới</li>
                    <li>📱 Chia sẻ QR Code hoặc link giới thiệu</li>
                    <li>💰 Bắt đầu kiếm thưởng từ việc giới thiệu học sinh</li>
                  </ul>
                </div>

                <div className="mt-6 text-center">
                  <Button 
                    size="lg"
                    onClick={() => window.location.href = '/affiliate-login'}
                    className="bg-primary-green hover:bg-green-600"
                  >
                    Đăng nhập ngay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-primary-green to-green-600 text-white text-center py-8">
              <CardTitle className="text-3xl font-bold">🎯 Đăng Ký Chương Trình Affiliate</CardTitle>
              <p className="mt-2 text-green-100">Kiếm thưởng từ việc giới thiệu học sinh</p>
            </CardHeader>
            
            <CardContent className="p-8">
              {/* Reward Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">2M VND</div>
                  <div className="text-sm text-blue-800">Thưởng mỗi học sinh (Giáo viên)</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">2,000 điểm</div>
                  <div className="text-sm text-purple-800">Thưởng mỗi học sinh (Phụ huynh)</div>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập họ và tên" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số điện thoại" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập email (không bắt buộc)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="memberType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vai trò *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vai trò của bạn" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="teacher">Giáo viên / Nhân viên</SelectItem>
                            <SelectItem value="parent">Phụ huynh</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Chăm sóc phụ huynh">Chăm sóc phụ huynh</SelectItem>
                            <SelectItem value="Đại sứ thương hiệu">Đại sứ thương hiệu</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sponsorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã người giới thiệu</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập mã người giới thiệu (nếu có)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary-green hover:bg-green-600 py-3 text-lg"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký ngay"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}