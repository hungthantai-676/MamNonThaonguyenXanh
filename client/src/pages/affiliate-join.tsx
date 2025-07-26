import { useState, useEffect } from "react";
import { useLocation, useRouter } from "wouter";
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
  const [navigate] = useRouter();
  const [referralId, setReferralId] = useState<string>("");
  const [sponsor, setSponsor] = useState<any>(null);

  const form = useForm<AffiliateJoinFormData>({
    resolver: zodResolver(affiliateJoinSchema),
    defaultValues: {
      name: "",
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
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/members"] });
      toast({
        title: "Đăng ký thành công! 🎉",
        description: "Bạn đã trở thành thành viên affiliate. Chuyển đến trang thành viên...",
      });
      // Redirect to affiliate page after successful registration
      setTimeout(() => {
        navigate("/affiliate");
      }, 2000);
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
          <Button variant="outline" onClick={() => navigate("/affiliate")}>
            Đã có tài khoản? Xem trang affiliate
          </Button>
        </div>
      </div>
    </div>
  );
}