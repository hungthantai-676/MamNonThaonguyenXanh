import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
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

export default function AffiliateJoin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location] = useLocation();
  // Navigation will be handled by redirect or back button
  const [referralId, setReferralId] = useState<string>("");
  const [sponsor, setSponsor] = useState<any>(null);
  const [registeredMember, setRegisteredMember] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // DEBUG: Log component render
  console.log('AffiliateJoin component rendered with username field');

  const form = useForm<AffiliateJoinFormData>({
    resolver: zodResolver(affiliateJoinSchema),
    defaultValues: {
      name: "",
      username: "", // CRITICAL: Username field default
      email: "",
      phone: "",
      memberType: "parent",
      sponsorId: "",
    },
  });

  // DEBUG: Log form state
  console.log('Form values:', form.getValues());

  // Extract referral ID from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralId(ref);
      form.setValue('sponsorId', ref);
    }
  }, [location, form]);

  // Get sponsor information
  const { data: sponsorData } = useQuery({
    queryKey: ["/api/affiliate/member", referralId],
    enabled: !!referralId,
  });

  useEffect(() => {
    if (sponsorData) {
      setSponsor(sponsorData);
    }
  }, [sponsorData]);

  const registerMutation = useMutation({
    mutationFn: async (data: AffiliateJoinFormData) => {
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
    registerMutation.mutate(data);
  };

  if (showSuccess && registeredMember) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <CardTitle className="text-2xl text-green-700">Đăng ký thành công!</CardTitle>
              <CardDescription className="text-green-600">
                Bạn đã trở thành thành viên affiliate. Lưu lại thông tin này để đăng nhập sau!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Member Login Info */}
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
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Mã thành viên (ID hệ thống)</Label>
                    <Input 
                      value={registeredMember.memberId} 
                      readOnly
                      className="font-mono text-xs bg-gray-50 border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Mã định danh duy nhất trong hệ thống</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Họ tên</Label>
                    <Input value={registeredMember.name} readOnly className="bg-gray-50" />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Loại thành viên</Label>
                    <Badge className={registeredMember.memberType === "teacher" ? "bg-green-500" : "bg-purple-500"}>
                      {registeredMember.memberType === "teacher" ? "Chăm sóc phụ huynh" : "Đại sứ thương hiệu"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* QR Code Info */}
              <div className="bg-blue-50 p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">📱 QR Code và Link giới thiệu</h3>
                <p className="text-sm text-gray-600 mb-3">
                  QR Code và link giới thiệu đã được tạo tự động. Bạn có thể xem chúng sau khi đăng nhập.
                </p>
                <div className="text-xs space-y-1">
                  <p>• <strong>QR Code</strong>: Tự động tạo và chứa link giới thiệu của bạn</p>
                  <p>• <strong>Link giới thiệu</strong>: Gửi cho F2, F3 để họ đăng ký dưới bạn</p>
                  <p>• <strong>Hoa hồng</strong>: Nhận token cho mỗi người bạn giới thiệu thành công</p>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-3">
                <h3 className="font-semibold">🎯 Bước tiếp theo:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    onClick={() => {
                      localStorage.setItem("affiliate-token", registeredMember.username);
                      window.location.href = "/affiliate/member";
                    }}
                    className="w-full"
                  >
                    👤 Xem QR Code & Link của tôi
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = "/affiliate"}
                    className="w-full"
                  >
                    🏠 Đến trang Affiliate
                  </Button>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">
                  ⚠️ <strong>Quan trọng</strong>: Hãy lưu lại tên đăng nhập ở trên. 
                  Bạn sẽ cần tên này để đăng nhập và quản lý affiliate sau này!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🌟 Tham gia Affiliate Mầm Non Thảo Nguyên Xanh</h1>
          <p className="text-gray-600">
            Tham gia hệ thống affiliate để nhận token, xây dựng mạng lưới và kiếm hoa hồng
          </p>
        </div>

        {sponsor && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <UserPlus className="w-5 h-5" />
                Bạn được giới thiệu bởi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{sponsor.name}</p>
                  <p className="text-sm text-gray-600">{sponsor.email}</p>
                  <Badge className={sponsor.memberType === "teacher" ? "bg-green-500" : "bg-purple-500"}>
                    {sponsor.memberType === "teacher" ? <Shield className="w-3 h-3 mr-1" /> : <Crown className="w-3 h-3 mr-1" />}
                    {sponsor.categoryName}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Cấp {sponsor.level}</p>
                  <p className="text-sm text-gray-500">{sponsor.totalReferrals} giới thiệu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Đăng ký thành viên</CardTitle>
            <CardDescription>
              Điền thông tin của bạn để tham gia hệ thống affiliate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                {/* USERNAME FIELD - CRITICAL FIELD - MUST BE VISIBLE */}
                <div className="bg-red-100 p-6 border-4 border-red-500 rounded-lg">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-red-700">⚠️ TRƯỜNG BẮT BUỘC ⚠️</h3>
                    <p className="text-red-600 font-semibold">Tên đăng nhập để truy cập hệ thống</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-800 font-bold text-xl block text-center">
                          🔴 TÊN ĐĂNG NHẬP (USERNAME)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ví dụ: nguyenvana123, tranvietanh, lethiminh" 
                            className="border-4 border-red-600 focus:border-red-800 bg-white text-lg p-4 text-center font-bold"
                            style={{ minHeight: '60px', fontSize: '18px' }}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-700 font-bold text-center" />
                        <div className="bg-yellow-100 p-3 rounded border-2 border-yellow-400 mt-2">
                          <p className="text-sm text-red-800 font-bold text-center">
                            🚨 QUY TẮC: Chỉ được dùng chữ cái (a-z), số (0-9) và dấu gạch dưới (_)
                          </p>
                          <p className="text-sm text-red-800 font-bold text-center">
                            📝 VÍ DỤ HỢP LỆ: user123, nguyen_van_a, teacher2024
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>



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
                                <div className="text-sm text-gray-500">Dành cho phụ huynh và người quan tâm</div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {referralId && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="text-sm font-medium text-blue-700">Mã giới thiệu</Label>
                    <div className="text-sm text-blue-800 font-mono mt-1">{referralId}</div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Gift className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-green-700">Token miễn phí</div>
                    <div className="text-sm text-gray-600">Nhận 100 TNG token khi đăng ký</div>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-blue-700">Mạng lưới</div>
                    <div className="text-sm text-gray-600">Xây dựng đội nhóm và kiếm hoa hồng</div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Đăng ký ngay
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => window.location.href = "/affiliate"}>
            Đã có tài khoản? Xem trang affiliate
          </Button>
        </div>
      </div>
    </div>
  );
}