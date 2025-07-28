import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Gift, Users, Star, Crown, Shield, UserPlus, QrCode } from "lucide-react";

const affiliateJoinSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự").regex(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
  memberType: z.enum(["teacher", "parent"]),
  sponsorId: z.string().optional(),
});

type AffiliateJoinFormData = z.infer<typeof affiliateJoinSchema>;

export default function AffiliateJoinNew() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location] = useLocation();
  const [referralId, setReferralId] = useState<string>("");
  const [sponsor, setSponsor] = useState<any>(null);
  const [registeredMember, setRegisteredMember] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  console.log('🔴 AffiliateJoinNew component loaded with username field');

  const form = useForm<AffiliateJoinFormData>({
    resolver: zodResolver(affiliateJoinSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      memberType: "parent",
      sponsorId: "",
    },
  });

  // Extract referral ID from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralId(ref);
      form.setValue('sponsorId', ref);
    }
  }, [location, form]);

  const registerMutation = useMutation({
    mutationFn: async (data: AffiliateJoinFormData) => {
      console.log('🔴 Submitting registration with username:', data.username);
      const response = await apiRequest("POST", "/api/affiliate/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/members"] });
      setRegisteredMember(data);
      setShowSuccess(true);
      toast({
        title: "Đăng ký thành công! 🎉",
        description: "Bạn đã trở thành thành viên affiliate. Lưu lại thông tin đăng nhập!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Có lỗi xảy ra khi đăng ký",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AffiliateJoinFormData) => {
    console.log('🔴 Form submitted with data:', data);
    registerMutation.mutate(data);
  };

  if (showSuccess && registeredMember) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <CardTitle className="text-green-700">🎉 Đăng ký thành công!</CardTitle>
              <CardDescription>
                Chúc mừng! Bạn đã trở thành thành viên affiliate của Mầm Non Thảo Nguyên Xanh
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Login Info */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Thông tin đăng nhập của bạn
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tên đăng nhập</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={registeredMember.username} 
                        readOnly
                        className="font-mono text-sm bg-yellow-50 border-yellow-200"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(registeredMember.username);
                          toast({ title: "Đã sao chép tên đăng nhập!" });
                        }}
                      >
                        Sao chép
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">⚠️ Quan trọng: Sử dụng tên này để đăng nhập</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🌟 Affiliate</h1>
          <p className="text-lg text-gray-600">
            Tham gia hệ thống affiliate và nhận hoa hồng khi giới thiệu học sinh mới
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Đăng ký thành viên mới</CardTitle>
            <CardDescription>
              Điền thông tin của bạn để tham gia hệ thống affiliate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên của bạn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* USERNAME FIELD - SIMPLE BUT VISIBLE */}
                <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-800 font-bold text-lg">
                          Tên đăng nhập *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nhập tên đăng nhập (ví dụ: nguyenvana123)" 
                            className="border-2 border-blue-400 focus:border-blue-600 h-12 text-base font-medium"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-blue-700 mt-1">
                          Chỉ được dùng chữ cái, số và dấu gạch dưới (_)
                        </p>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="0123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Member Type Field */}
                <FormField
                  control={form.control}
                  name="memberType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại thành viên</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-green-50">
                            <RadioGroupItem value="teacher" id="teacher" />
                            <Label htmlFor="teacher" className="flex items-center gap-2 cursor-pointer">
                              <Shield className="w-4 h-4 text-green-600" />
                              <div>
                                <div className="font-medium">Chăm sóc phụ huynh</div>
                                <div className="text-sm text-gray-500">Dành cho giáo viên và nhân viên</div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-purple-50">
                            <RadioGroupItem value="parent" id="parent" />
                            <Label htmlFor="parent" className="flex items-center gap-2 cursor-pointer">
                              <Crown className="w-4 h-4 text-purple-600" />
                              <div>
                                <div className="font-medium">Đại sứ thương hiệu</div>
                                <div className="text-sm text-gray-500">Dành cho phụ huynh và người giới thiệu</div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-lg"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Đang xử lý..." : "🎯 Đăng ký ngay"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}