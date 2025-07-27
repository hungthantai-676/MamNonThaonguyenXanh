import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { QrCode, Wallet, TreePine, Users, DollarSign, Gift, Star, Crown, Shield, UserCheck, Phone, Mail, Calendar, Eye, EyeOff, Lock, Unlock } from "lucide-react";

// Schema for registration form
const registrationSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
  memberType: z.enum(["teacher", "parent"], {
    required_error: "Vui lòng chọn loại thành viên",
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function AffiliateFixed() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [memberCode, setMemberCode] = useState("");
  const [hiddenMembers, setHiddenMembers] = useState<Set<number>>(new Set());

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("affiliate-token");
    setIsAuthenticated(!!token);
  }, []);

  // Registration form
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      memberType: "parent",
    },
  });

  // Fetch affiliate members (only if authenticated)
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["/api/affiliate/members"],
    enabled: isAuthenticated,
  });

  // Registration mutation with proper error handling
  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const response = await apiRequest("POST", "/api/affiliate/register", data);
      return response;
    },
    onSuccess: (data) => {
      // Store auth token
      localStorage.setItem("affiliate-token", data.token || "authenticated");
      setIsAuthenticated(true);
      
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/members"] });
      toast({
        title: "Đăng ký thành công! 🎉",
        description: "Bạn đã trở thành thành viên affiliate. Chào mừng bạn!",
      });
      
      // Reset form
      form.reset();
      setActiveTab("members");
    },
    onError: (error: any) => {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  // Login with member code
  const loginMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/affiliate/login", { memberCode: code });
      return response;
    },
    onSuccess: () => {
      localStorage.setItem("affiliate-token", memberCode);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/members"] });
      toast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn quay lại hệ thống affiliate.",
      });
      setMemberCode("");
    },
    onError: (error: any) => {
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Mã thành viên không hợp lệ.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    registerMutation.mutate(data);
  };

  const handleLogin = () => {
    if (memberCode.trim()) {
      loginMutation.mutate(memberCode.trim());
    }
  };

  const toggleMemberVisibility = (memberId: number) => {
    setHiddenMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const logout = () => {
    localStorage.removeItem("affiliate-token");
    setIsAuthenticated(false);
    setHiddenMembers(new Set());
    toast({
      title: "Đã đăng xuất",
      description: "Bạn đã đăng xuất khỏi hệ thống affiliate.",
    });
  };

  // Authentication guard
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">🌟 Hệ Thống Affiliate Mầm Non Thảo Nguyên Xanh</h1>
            <p className="text-gray-600">
              Tham gia hệ thống affiliate để nhận hoa hồng và xây dựng mạng lưới
            </p>
          </div>

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register">Đăng ký mới</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Đăng nhập thành viên</CardTitle>
                  <CardDescription>
                    Nhập mã thành viên của bạn để truy cập hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="memberCode">Mã thành viên</Label>
                    <Input
                      id="memberCode"
                      placeholder="Nhập mã thành viên (VD: TCH001, PAR001)"
                      value={memberCode}
                      onChange={(e) => setMemberCode(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                  <Button 
                    onClick={handleLogin}
                    disabled={!memberCode.trim() || loginMutation.isPending}
                    className="w-full"
                  >
                    {loginMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Đang đăng nhập...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Đăng nhập
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Registration Tab */}
            <TabsContent value="register">
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

                      <Button 
                        type="submit" 
                        disabled={registerMutation.isPending}
                        className="w-full"
                      >
                        {registerMutation.isPending ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Đang đăng ký...
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Đăng ký ngay
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Main dashboard for authenticated users
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Affiliate</h1>
          <p className="text-gray-600">Quản lý mạng lưới affiliate của bạn</p>
        </div>
        <Button onClick={logout} variant="outline">
          <Unlock className="w-4 h-4 mr-2" />
          Đăng xuất
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="members">Thành viên</TabsTrigger>
          <TabsTrigger value="genealogy">Phả hệ</TabsTrigger>
          <TabsTrigger value="wallet">Ví cá nhân</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng thành viên</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Trong hệ thống</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng hoa hồng</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 VNĐ</div>
                <p className="text-xs text-muted-foreground">Chưa có giao dịch</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cấp độ</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Mới</div>
                <p className="text-xs text-muted-foreground">Bắt đầu hành trình</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Danh sách thành viên</CardTitle>
                  <CardDescription>
                    Quản lý thông tin các thành viên trong hệ thống
                  </CardDescription>
                </div>
                <Button onClick={() => setHiddenMembers(new Set())} variant="outline" size="sm">
                  Hiện tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {membersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members?.map((member: any) => (
                    <Card 
                      key={member.id} 
                      className={`transition-all duration-300 ${
                        hiddenMembers.has(member.id) ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {member.memberType === "teacher" ? (
                              <Shield className="w-5 h-5 text-green-600" />
                            ) : (
                              <Crown className="w-5 h-5 text-purple-600" />
                            )}
                            <Badge variant={member.memberType === "teacher" ? "default" : "secondary"}>
                              {member.memberType === "teacher" ? "Giáo viên" : "Phụ huynh"}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMemberVisibility(member.id)}
                          >
                            {hiddenMembers.has(member.id) ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.code}</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{new Date(member.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between text-sm">
                            <span>Giới thiệu:</span>
                            <span className="font-medium">{member.totalReferrals || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Hoa hồng:</span>
                            <span className="font-medium text-green-600">
                              {member.totalCommission?.toLocaleString() || 0} VNĐ
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Genealogy Tab */}
        <TabsContent value="genealogy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="w-5 h-5" />
                Cây phả hệ affiliate
              </CardTitle>
              <CardDescription>
                Xem cấu trúc mạng lưới giới thiệu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <TreePine className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Cây phả hệ</h3>
                  <p className="text-gray-500">Cây phả hệ sẽ hiển thị khi có thành viên được giới thiệu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Ví cá nhân
              </CardTitle>
              <CardDescription>
                Quản lý số dư và giao dịch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ví của bạn</h3>
                <p className="text-3xl font-bold text-green-600 mb-2">0 VNĐ</p>
                <p className="text-gray-500">Chưa có giao dịch nào</p>
                <Button className="mt-4" disabled>
                  <QrCode className="w-4 h-4 mr-2" />
                  Tạo mã QR
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}