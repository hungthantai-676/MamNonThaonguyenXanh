import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Note: Table component not available, using div structure instead
import { Users, DollarSign, TrendingUp, Calendar, Eye, UserCheck, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AffiliateAdmin() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Authentication check
  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token");
    const loginTime = localStorage.getItem("admin-login-time");
    const now = Date.now();
    const EIGHT_HOURS = 8 * 60 * 60 * 1000;

    if (!adminToken || !loginTime || now - parseInt(loginTime) > EIGHT_HOURS) {
      toast({
        title: "Phiên đăng nhập hết hạn",
        description: "Vui lòng đăng nhập lại",
        variant: "destructive",
      });
      setLocation("/admin/login");
      return;
    }

    // Extend session on activity
    const extendSession = () => {
      localStorage.setItem("admin-login-time", Date.now().toString());
    };

    window.addEventListener("click", extendSession);
    window.addEventListener("keypress", extendSession);

    return () => {
      window.removeEventListener("click", extendSession);
      window.removeEventListener("keypress", extendSession);
    };
  }, [setLocation, toast]);

  // Fetch affiliate data
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["/api/affiliate/members"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/affiliate/stats"],
  });

  const logout = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("admin-login-time");
    setLocation("/admin/login");
  };

  const backToDashboard = () => {
    setLocation("/admin/dashboard");
  };

  // Mock stats if API doesn't return data
  const affiliateStats = stats || {
    totalMembers: members?.length || 0,
    activeMembers: members?.filter((m: any) => m.isActive)?.length || 0,
    totalReferrals: members?.reduce((sum: number, m: any) => sum + (m.totalReferrals || 0), 0) || 0,
    totalCommissions: 0,
    pendingPayments: 0,
    thisMonthSignups: 0
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏆 Admin Affiliate Dashboard</h1>
            <p className="text-gray-600">Quản lý toàn bộ hệ thống affiliate và hoa hồng</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={backToDashboard}>
              ⬅️ Quay lại Dashboard
            </Button>
            <Button variant="outline" onClick={() => window.open("/affiliate", "_blank")}>
              👥 Xem trang Affiliate
            </Button>
            <Button variant="destructive" onClick={logout}>
              🚪 Đăng xuất
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng thành viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliateStats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                {affiliateStats.activeMembers} đang hoạt động
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng giới thiệu</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliateStats.totalReferrals}</div>
              <p className="text-xs text-muted-foreground">
                Tất cả giới thiệu thành công
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoa hồng đã trả</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliateStats.totalCommissions.toLocaleString()} VND</div>
              <p className="text-xs text-muted-foreground">
                Đã thanh toán toàn bộ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đăng ký tháng này</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliateStats.thisMonthSignups}</div>
              <p className="text-xs text-muted-foreground">
                Thành viên mới tháng này
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">📊 Tổng quan</TabsTrigger>
            <TabsTrigger value="members">👥 Thành viên</TabsTrigger>
            <TabsTrigger value="referrals">🔗 Giới thiệu</TabsTrigger>
            <TabsTrigger value="payments">💰 Thanh toán</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Cài đặt</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📈 Biểu đồ tăng trưởng</CardTitle>
                  <CardDescription>Thống kê tăng trưởng thành viên và doanh thu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-600">Biểu đồ sẽ hiển thị ở đây</p>
                    <p className="text-sm mt-2">Tích hợp với Google Analytics để xem thống kê chi tiết</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Hoạt động gần đây</CardTitle>
                  <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm">Thành viên mới đăng ký</p>
                        <p className="text-xs text-gray-500">2 phút trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm">Thanh toán hoa hồng thành công</p>
                        <p className="text-xs text-gray-500">1 giờ trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm">Giới thiệu khách hàng mới</p>
                        <p className="text-xs text-gray-500">3 giờ trước</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>👥 Danh sách thành viên Affiliate</CardTitle>
                <CardDescription>Quản lý tất cả thành viên trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                {membersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2">Đang tải dữ liệu...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* Table Header */}
                      <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 font-medium text-sm">
                        <div>Tên</div>
                        <div>Email</div>
                        <div>Loại</div>
                        <div>Mã thành viên</div>
                        <div>Tổng giới thiệu</div>
                        <div>Trạng thái</div>
                        <div>Thao tác</div>
                      </div>
                      
                      {/* Table Body */}
                      {members && members.length > 0 ? members.map((member: any) => (
                        <div key={member.id} className="grid grid-cols-7 gap-4 p-4 border-b hover:bg-gray-50">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm">{member.email}</div>
                          <div>
                            <Badge variant={member.memberType === 'teacher' ? 'default' : 'secondary'}>
                              {member.memberType === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}
                            </Badge>
                          </div>
                          <div className="font-mono text-sm">{member.memberId}</div>
                          <div>{member.totalReferrals || 0}</div>
                          <div>
                            {member.isActive ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Hoạt động
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Tạm dừng
                              </Badge>
                            )}
                          </div>
                          <div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                ✏️
                              </Button>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8">
                          <div className="text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Chưa có thành viên nào</p>
                            <p className="text-sm">Thành viên sẽ hiển thị ở đây khi có người đăng ký</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>🔗 Quản lý giới thiệu</CardTitle>
                <CardDescription>Theo dõi và xác nhận các giới thiệu khách hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔗</div>
                  <p className="text-gray-600">Chức năng quản lý giới thiệu</p>
                  <p className="text-sm mt-2">Xem chi tiết giới thiệu và xác nhận hoa hồng</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>💰 Quản lý thanh toán</CardTitle>
                <CardDescription>Xử lý thanh toán hoa hồng và quản lý ví</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💰</div>
                  <p className="text-gray-600">Hệ thống thanh toán tự động</p>
                  <p className="text-sm mt-2">Thanh toán qua ví điện tử và blockchain</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Cài đặt hệ thống</CardTitle>
                <CardDescription>Cấu hình hoa hồng và quy định affiliate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="teacherCommission">💰 Hoa hồng giáo viên (VND)</Label>
                    <Input
                      id="teacherCommission"
                      defaultValue="2000000"
                      placeholder="Nhập số tiền hoa hồng cho giáo viên..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="parentPoints">🎁 Điểm thưởng phụ huynh</Label>
                    <Input
                      id="parentPoints"
                      defaultValue="2000"
                      placeholder="Nhập số điểm thưởng cho phụ huynh..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="bonusThreshold">🏆 Ngưỡng thưởng (số giới thiệu)</Label>
                    <Input
                      id="bonusThreshold"
                      defaultValue="5"
                      placeholder="Nhập số giới thiệu để nhận thưởng..."
                    />
                  </div>

                  <Button className="w-full">
                    💾 Lưu cài đặt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}